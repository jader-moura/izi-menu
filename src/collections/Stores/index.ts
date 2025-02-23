import { tenantAccess } from '@/access/tenantAccess'
import { tenantSlug } from '@/fields/tenantSlug'
import { CollectionConfig } from 'payload'

export const Stores: CollectionConfig = {
  slug: 'stores',
  admin: {
    useAsTitle: 'name',
    // hidden: ({ user }) => user?.role !== 'super-admin',
  },
  // hooks: {
  //   beforeRead: [ (args) => {
  //     const { req : { url, user: { role } }, doc: { id }} = args;

  //     if (url === "/admin/collections/stores" && role === "user") {
  //      return redirect(`/admin/collections/stores/${id}`)
  //     }
  //   }]
  // },
  access: {
    admin: () => true,
    create: ({ req: { user } }) => user?.role === 'super-admin',
    delete: ({ req: { user } }) => user?.role === 'super-admin',
    read: tenantAccess,
    update: tenantAccess,
  },
  fields: [
    tenantSlug,
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      saveToJWT: true,
      unique: true,
      hidden: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'whatsapp',
      type: 'number',
    },
    {
      type: 'group',
      name: 'address',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'country',
              type: 'select',
              defaultValue: 'BR',
              options: [{ label: 'Brasil', value: 'BR' }],
              admin: {
                width: '50%',
              },
              required: true,
            },
            {
              name: 'postalCode',
              type: 'text',
              // required: true
              admin: {
                width: '50%',
              },
            },
            {
              name: 'state',
              type: 'select',
              // required: true,
              options: [
                { value: 'AC', label: 'Acre' },
                { value: 'AL', label: 'Alagoas' },
                { value: 'AP', label: 'Amapá' },
                { value: 'AM', label: 'Amazonas' },
                { value: 'BA', label: 'Bahia' },
                { value: 'CE', label: 'Ceará' },
                { value: 'DF', label: 'Distrito Federal' },
                { value: 'ES', label: 'Espírito Santo' },
                { value: 'GO', label: 'Goías' },
                { value: 'MA', label: 'Maranhão' },
                { value: 'MT', label: 'Mato Grosso' },
                { value: 'MS', label: 'Mato Grosso do Sul' },
                { value: 'MG', label: 'Minas Gerais' },
                { value: 'PA', label: 'Pará' },
                { value: 'PB', label: 'Paraíba' },
                { value: 'PR', label: 'Paraná' },
                { value: 'PE', label: 'Pernambuco' },
                { value: 'PI', label: 'Piauí' },
                { value: 'RJ', label: 'Rio de Janeiro' },
                { value: 'RN', label: 'Rio Grande do Norte' },
                { value: 'RS', label: 'Rio Grande do Sul' },
                { value: 'RO', label: 'Rondônia' },
                { value: 'RR', label: 'Roraíma' },
                { value: 'SC', label: 'Santa Catarina' },
                { value: 'SP', label: 'São Paulo' },
                { value: 'SE', label: 'Sergipe' },
                { value: 'TO', label: 'Tocantins' },
              ],
              admin: {
                width: '50%',
              },
            },
            {
              name: 'neighborhood',
              type: 'text',
              // required: true
              admin: {
                width: '50%',
              },
            },
            {
              name: 'street',
              type: 'text',
              // required: true
              admin: {
                width: '50%',
              },
            },
            {
              name: 'complement',
              type: 'text',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'number',
              type: 'text',
              admin: {
                width: '50%',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'openingHours',
      fields: [
        {
          name: 'sunday',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'isClosed',
                  type: 'checkbox',
                  admin: {
                    width: '100%',
                  },
                },
                {
                  name: 'open',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm:ss a',
                    },
                    condition: (_, { isClosed } = {}) => !isClosed,
                    width: '50%',
                  },
                },
                {
                  name: 'close',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm:ss a',
                    },
                    condition: (_, { isClosed } = {}) => !isClosed,
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'monday',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'isClosed',
                  type: 'checkbox',
                  admin: {
                    width: '100%',
                  },
                },
                {
                  name: 'open',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm:ss a',
                    },
                    condition: (_, { isClosed } = {}) => !isClosed,
                    width: '50%',
                  },
                },
                {
                  name: 'close',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm:ss a',
                    },
                    condition: (_, { isClosed } = {}) => !isClosed,
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'tuesday',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'isClosed',
                  type: 'checkbox',
                  admin: {
                    width: '100%',
                  },
                },
                {
                  name: 'open',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm:ss a',
                    },
                    condition: (_, { isClosed } = {}) => !isClosed,
                    width: '50%',
                  },
                },
                {
                  name: 'close',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm:ss a',
                    },
                    condition: (_, { isClosed } = {}) => !isClosed,
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'wednesday',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'isClosed',
                  type: 'checkbox',
                  admin: {
                    width: '100%',
                  },
                },
                {
                  name: 'open',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm:ss a',
                    },
                    condition: (_, { isClosed } = {}) => !isClosed,
                    width: '50%',
                  },
                },
                {
                  name: 'close',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm:ss a',
                    },
                    condition: (_, { isClosed } = {}) => !isClosed,
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'thursday',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'isClosed',
                  type: 'checkbox',
                  admin: {
                    width: '100%',
                  },
                },
                {
                  name: 'open',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm:ss a',
                    },
                    condition: (_, { isClosed } = {}) => !isClosed,
                    width: '50%',
                  },
                },
                {
                  name: 'close',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm:ss a',
                    },
                    condition: (_, { isClosed } = {}) => !isClosed,
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'friday',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'isClosed',
                  type: 'checkbox',
                  admin: {
                    width: '100%',
                  },
                },
                {
                  name: 'open',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm:ss a',
                    },
                    condition: (_, { isClosed } = {}) => !isClosed,
                    width: '50%',
                  },
                },
                {
                  name: 'close',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm:ss a',
                    },
                    condition: (_, { isClosed } = {}) => !isClosed,
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'saturday',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'isClosed',
                  type: 'checkbox',
                  admin: {
                    width: '100%',
                  },
                },
                {
                  name: 'open',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm:ss a',
                    },
                    condition: (_, { isClosed } = {}) => !isClosed,
                    width: '50%',
                  },
                },
                {
                  name: 'close',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'timeOnly',
                      displayFormat: 'h:mm:ss a',
                    },
                    condition: (_, { isClosed } = {}) => !isClosed,
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'delivery',
      fields: [
        {
          type: 'number',
          name: 'deliveryPrice',
        },
        {
          type: 'number',
          name: 'deliveryTime',
          admin: {
            description: 'Delivery time in minutes',
          },
        },
        {
          type: 'number',
          name: 'minimumValue',
        },
      ],
    },
  ],
  timestamps: true,
}
