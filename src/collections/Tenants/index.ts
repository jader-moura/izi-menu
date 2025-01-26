import { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
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
      if (user?.role === 'super-admin') return true

      // Users can only read users in their tenant
      if (user?.tenant) {
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
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value, data = {} }) => {
            if (!value && data?.name) {
              // Generate slug from name + timestamp + random number
              const timestamp = Date.now()
              const random = Math.floor(Math.random() * 10000)
              return `${data.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}-${random}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'public',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}
