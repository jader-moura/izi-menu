import { autofillTenant } from '@/hooks/autofillTenant'
import type { Field } from 'payload'

export const tenantField: Field = {
  name: 'tenant',
  type: 'relationship',
  relationTo: 'tenants',
  required: true,
  admin: {
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [autofillTenant],
  },
}
