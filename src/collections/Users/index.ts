import { isSuperAdmin } from '@/access/isSuperAdmin'
import { formatSlug } from '@/fields/slug/formatSlug'
import { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  access: {
    admin: () => true,
    create: ({ req: { user } }) => {
      // Super admin can create any user
      if (user?.role === 'super-admin') return true

      // Regular users cannot create users
      return false
    },
    delete: ({ req: { user } }) => {
      // Super admin can delete any user
      if (user?.role === 'super-admin') return true

      // Regular users cannot delete users
      return false
    },
    read: ({ req: { user } }) => {
      // Super admin can read all users
      if (user?.role === 'super-admin') {
        return true
      } else if (user?.tenant) {
        console.log('user: ', user)
        return {
          tenant: {
            equals: user.tenant,
          },
        }
      }

      return false
    },
    update: ({ req: { user } }) => {
      if (!user) return false

      // Super admin can update any user
      if (user.role === 'super-admin') return true

      // Regular users can only update themselves
      return {
        id: {
          equals: user.id,
        },
      }
    },
  },
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
          async ({ req, value }) => {
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
      admin: {
        condition: (data) => !data.role?.includes('super-admin'),
      },
      hooks: {
        beforeValidate: [
          async (args) => {
            const { req, operation } = args
            // If user is super-admin, remove tenant
            if (operation === 'create') {
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
          },
        ],
      },
    },
  ],
  timestamps: true,
}
