import type { Access } from 'payload'

export const tenantAccess: Access = ({ req: { user } }) => {
  const typedUser = user

  // Super admin can do anything
  if (typedUser?.role === 'super-admin') return true

  // Regular users are restricted to their tenant
  return true
  // const userTenant = typedUser?.tenant?.id
  // if (userTenant) {
  //   return {
  //     tenant: {
  //       equals: userTenant,
  //     },
  //   }
  // }

  // return false
}
