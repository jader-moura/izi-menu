import type { CollectionConfig } from 'payload'
import { tenantAccess } from '@/access/tenantAccess'
import { tenantField } from '@/fields/tenant'
import { AditionalOptions } from './AditionalOptions'

export const ProductVariants: CollectionConfig = {
  slug: 'productVariants',
  access: {
    admin: () => true,
    create: tenantAccess,
    delete: tenantAccess,
    read: tenantAccess,
    update: tenantAccess,
  },
  admin: {
    useAsTitle: 'title',
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
      type: 'tabs',
      tabs: [
        {
          label: 'Product Configurator',

          fields: [
            {
              name: 'quantitySelectable',
              type: 'number',
              label: 'Quantity Selectable',
              admin: {
                description: 'The user can select this quantity of this variant',
              },
            },
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Aditional Options',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'atLeastChoose',

                  type: 'number',
                  admin: {
                    description: 'The user must choose at least this number of options',
                    width: '50%',
                  },
                },
                {
                  name: 'atMostChoose',
                  type: 'number',
                  admin: {
                    description: 'The user can choose at most this number of options',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'options',
              type: 'blocks',
              blocks: [AditionalOptions],
            },
          ],
        },
      ],
    },
  ],
}
