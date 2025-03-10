import { Block } from 'payload'

export const FlavourOptions: Block = {
  slug: 'flavour-options',
  interfaceName: 'Flavour Options',
  labels: {
    singular: 'Flavour Option',
    plural: 'Flavour Options',
  },
  fields: [
    {
      name: 'flavour',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
      ],
    },
  ],
}
