import { TenantUser } from '../types/tenant'

export const getTenantAccessIDs = (user: TenantUser | null): string[] => {
  if (!user) return []

  if (!user?.tenants?.length) return []

  return user.tenants
    .map(({ tenant }) => {
      if (!tenant) return null
      return typeof tenant === 'string' ? tenant : tenant.id
    })
    .filter(Boolean) as string[]
}
