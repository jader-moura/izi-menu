// import { isSuperAdmin } from '@/access/isSuperAdmin'
import { tenantAccess } from '@/access/tenantAccess'
import { formatSlug } from '@/fields/slug/formatSlug'
import { CollectionConfig, PayloadRequest } from 'payload'
import { v4 as uuidv4 } from 'uuid'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
    hidden: ({ user }) => user?.role !== 'super-admin',
  },
  access: {
    admin: () => true,
    create: ({ req: { user } }) => user?.role === 'super-admin',
    delete: ({ req: { user } }) => user?.role === 'super-admin',
    read: tenantAccess,
    update: tenantAccess,
  },
  endpoints: [
    {
      path: '/new',
      method: 'post',
      handler: async (req: PayloadRequest) => {
        if (
          req?.credentials !== 'same-origin' ||
          req?.origin !== process.env.NEXT_PUBLIC_SERVER_URL
        ) {
          return Response.json({ error: 'Invalid origin' }, { status: 403 })
        }
        const data = req.json ? await req.json() : {}

        if (!data?.email || !data?.password) {
          return Response.json({ error: 'Invalid data' }, { status: 400 })
        }

        try {
          await req.payload.create({
            collection: 'users',
            overrideAccess: true,
            data,
          })

          return Response.json(
            {
              message: 'User created successfully',
            },
            { status: 200 },
          )
        } catch (error) {
          console.error(error)
          return Response.json({ error: 'Failed to create user' }, { status: 500 })
        }
      },
    },
  ],
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      options: ['super-admin', 'user'],
      saveToJWT: true,
      hasMany: false,
      access: {
        create: ({ req: { user } }) => user?.role === 'super-admin',
        update: ({ req: { user } }) => user?.role === 'super-admin',
      },
      hooks: {
        beforeChange: [
          async ({ req, value, operation }) => {
            if (operation === 'create') {
              // Get total users count
              const users = await req.payload.find({
                collection: 'users',
                limit: 0,
              })

              const isFirstUser = users.totalDocs === 0
              const isSuperAdmin = value === 'super-admin'

              // If this is the first user being created, force super-admin role
              if (isFirstUser) {
                return 'super-admin'
              }

              // If this is not the first user, prevent super-admin role
              if (isSuperAdmin) {
                throw new Error('Only the first user can be a super-admin')
              }

              return value
            }
          },
        ],
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: false,
      saveToJWT: true,
      // hidden: true,
      unique: true,
      access: {
        update: ({ req: { user } }) => user?.role === 'super-admin',
      },
      // admin: {
      //   condition: (data) => !data.role?.includes('super-admin'),
      // },
      hooks: {
        beforeValidate: [
          async (args) => {
            const { req, operation, data } = args

            // If user is super-admin, don't assign tenant
            if (data?.role === 'super-admin') {
              return null
            }

            // For regular users during create
            if (operation === 'create') {
              const users = await req.payload.find({
                collection: 'users',
                limit: 0,
              })

              const isFirstUser = users.totalDocs === 0

              if (isFirstUser) {
                const tenant = await req.payload.create({
                  collection: 'tenants',
                  data: {
                    name: 'Main Admin',
                    slug: 'main-admin',
                  },
                })

                return tenant.id
              }

              const tenantKey = uuidv4()
              const tenant = await req.payload.create({
                collection: 'tenants',
                data: {
                  name: tenantKey,
                  slug: formatSlug(tenantKey.slice(0, 5)),
                },
              })

              return tenant.id
            }

            // For existing users, keep their current tenant
            return args.value
          },
        ],
      },
    },
  ],
  timestamps: true,
}
