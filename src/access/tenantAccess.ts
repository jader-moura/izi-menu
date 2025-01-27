import type { Access, User } from 'payload'

export const tenantAccess: Access = ({ req: { user } }) => {
  const typedUser: User | null = user

  // Super admin can do anything
  if (typedUser?.role === 'super-admin') return true

  // Regular users are restricted to their tenant
  const userTenant = typedUser?.tenant?.id
  if (userTenant) {
    return {
      tenant: {
        equals: userTenant,
      },
    }
  }

  return false
}
