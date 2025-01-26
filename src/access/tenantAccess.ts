import type { Access } from 'payload'

export const tenantAccess: Access = ({ req: { user } }) => {
  const typedUser = user

  // Super admin can do anything
  if (typedUser?.role === 'super-admin') return true

  console.log('typedUser: ', typedUser)

  // Regular users are restricted to their tenant
  const userTenant = typedUser?.tenant?.value
  if (userTenant) {
    return {
      'tenant.value': {
        equals: userTenant,
      },
    }
  }

  return false
}
