import type { CollectionConfig } from 'payload'

import { revalidateDelete, revalidateProduct } from './hooks/revalidateProduct'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { slugField } from '@/fields/slug'
import { tenantField } from '@/fields/tenant'
import { tenantAccess } from '@/access/tenantAccess'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    admin: () => true,
    create: tenantAccess,
    delete: tenantAccess,
    read: tenantAccess,
    update: tenantAccess,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    group: 'Products',
  },
  fields: [
    tenantField,

    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              type: 'collapsible',
              label: 'Content',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Price Settings',
              fields: [
                {
                  type: 'checkbox',
                  name: 'priceSetByFlavours',
                  label: 'Price set by flavours',
                },
                {
                  type: 'row',
                  admin: {
                    condition: (_, { priceSetByFlavours } = {}) => !priceSetByFlavours,
                  },
                  fields: [
                    {
                      name: 'price',
                      type: 'number',
                      required: true,
                    },
                    {
                      name: 'salePrice',
                      type: 'number',
                    },
                  ],
                },
                {
                  name: 'productFlavours',
                  type: 'relationship',
                  relationTo: 'productFlavours',
                  admin: {
                    condition: (_, { priceSetByFlavours } = {}) => priceSetByFlavours,
                  },
                },
              ],
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    ...slugField(),
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    {
      name: 'productVariant',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'productVariants',
    },
  ],
  hooks: {
    afterChange: [revalidateProduct],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
