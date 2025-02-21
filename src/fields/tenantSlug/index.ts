import type { UIField } from 'payload'

export const tenantSlug: UIField = {
  name: 'tenantSlug',
  type: 'ui',
  admin: {
    components: {
      Field: '@/fields/tenantSlug/TenantSlugComponent#TenantSlugComponent',
    },
    position: 'sidebar',
  },
}
