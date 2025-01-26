import type { PayloadRequest } from 'payload'
import { TenantUser } from '../types/tenant'

type FieldHook = (args: { req: PayloadRequest; value?: unknown }) => Promise<unknown>

export const populateTenant: FieldHook = async ({ req, value = null }) => {
  // If there is a logged-in user, and the tenant field has a value
  if (req.user && value) {
    try {
      // Find the tenant in the user's tenants array
      const tenant = (req.user as TenantUser | undefined)?.tenants?.find(({ tenant }) => {
        const tenantId = typeof tenant === 'string' ? tenant : tenant.id
        return tenantId === value
      })?.tenant

      // If found, return the tenant data
      if (tenant) {
        return {
          relationTo: 'tenants',
          value: typeof tenant === 'string' ? tenant : tenant.id,
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  return value
}
