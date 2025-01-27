import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { tenantAccess } from '@/access/tenantAccess'
import { tenantField } from '@/fields/tenant'
import { readAccess } from '@/access/readAccess'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    admin: () => true,
    create: tenantAccess,
    delete: tenantAccess,
    read: readAccess,
    update: tenantAccess,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'tenant'],
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
