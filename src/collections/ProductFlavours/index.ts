import type { CollectionConfig } from 'payload'
import { tenantAccess } from '@/access/tenantAccess'
import { tenantField } from '@/fields/tenant'
import { FlavourOptions } from './FlavourOptions'

export const ProductFlavours: CollectionConfig = {
  slug: 'productFlavours',
  access: {
    admin: () => true,
    create: tenantAccess,
    delete: tenantAccess,
    read: tenantAccess,
    update: tenantAccess,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Products',
  },
  fields: [
    tenantField,
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'atMostChoose',
      type: 'number',
      admin: {
        description: 'The user can choose at most this number of flavour options',
        width: '50%',
      },
    },
    {
      name: 'options',
      type: 'blocks',
      blocks: [FlavourOptions],
    },
  ],
}
