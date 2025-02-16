// import { isSuperAdmin } from '@/access/isSuperAdmin'
import { tenantAccess } from '@/access/tenantAccess'
import { CollectionConfig, PayloadRequest } from 'payload'

export const Stores: CollectionConfig = {
  slug: 'stores',
  admin: {
    useAsTitle: 'name',
    hidden: ({ user }) => user?.role !== 'super-admin',
  },
  access: {
    admin: () => true,
    create: ({ req: { user } }) => user?.role === 'super-admin',
    delete: ({ req: { user } }) => user?.role === 'super-admin',
    read: tenantAccess,
    update: tenantAccess,
  },
  fields: [
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      saveToJWT: true,
      unique: true
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
      name: "whatsapp",
      type: "number"
    },
    {
      type: "group",
      name: "address",
      fields: [
        {
          name: "country",
          type: "select",
          defaultValue: "BR",
          options: [{ label: "Brasil", value: "BR"}]
        },
        {
          name: "postalCode",
          type: "text",
          // required: true
        },
        {
          name: "state",
          type: "select",
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
          ]
        },
        {
          name: "neighborhood",
          type: "text",
          // required: true
        },
        {
          name: "street",
          type: "text",
          // required: true
        },
        {
          name: "complement",
          type: "text",
        },
        {
          name: "number",
          type: "text",
        }
      ]
    }
   
  ],
  timestamps: true,
}
