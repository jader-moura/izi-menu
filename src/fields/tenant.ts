import { autofillTenant } from '@/hooks/autofillTenant'
import type { Field } from 'payload'

export const tenantField: Field = {
  name: 'tenant',
  type: 'relationship',
  relationTo: 'tenants',
  required: true,
  admin: {
    position: 'sidebar',
    condition: (data, siblingData, { user }) => {
      return user?.role === 'super-admin'
    },
  },
  hooks: {
    beforeValidate: [autofillTenant],
  },
}
