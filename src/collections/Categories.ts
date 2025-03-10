import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { tenantAccess } from '@/access/tenantAccess'
import { tenantField } from '@/fields/tenant'

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
    group: 'Products',
  },
  fields: [
    tenantField,
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
  ],
}
