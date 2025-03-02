import { Block } from 'payload'

export const AditionalOptions: Block = {
  slug: 'aditional-options',
  interfaceName: 'Aditional Options',
  labels: {
    singular: 'Aditional Option',
    plural: 'Aditional Options',
  },
  fields: [
    {
      name: 'aditional',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'price',
          type: 'number',
        },
      ],
    },
  ],
}
