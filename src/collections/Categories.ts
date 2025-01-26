import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { tenantAccess } from '@/access/tenantAccess'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    admin: () => true,
    create: tenantAccess,
    delete: tenantAccess,
    read: tenantAccess,
    update: tenantAccess,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'tenant'],
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
  ],
}
