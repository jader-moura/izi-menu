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
      // Super admin can read all tenants
      if (user?.role === 'super-admin') return true

      // For regular users during login
      if (!user) {
        return true // Allow unauthenticated read for login
      }

      // For authenticated regular users
      if (user?.tenant) {
        return {
          id: {
            equals: user.tenant,
          },
        }
      }

      return false
    },
    update: ({ req: { user } }) => {
      // Super admin can create any user
      if (user?.role === 'super-admin') return true

      // Regular users cannot create users
      return false
    },
  },
  admin: {
    useAsTitle: 'name',
    hidden: ({ user }) => user?.role !== 'super-admin',
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
    // {
    //   name: 'public',
    //   type: 'checkbox',
    //   defaultValue: false,
    // },
  ],
  timestamps: true,
}
