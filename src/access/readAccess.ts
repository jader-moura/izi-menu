import type { Access, Where, User } from 'payload'

import { parseCookies } from 'payload'
import { tenantAccess } from './tenantAccess'

export const readAccess: Access = (args) => {
  const {
    req: { user },
  }: { req: { user: User | null } } = args
  const req = args.req
  const cookies = parseCookies(req.headers)
  const hasTenantAccess = tenantAccess(args)
  const userTenant = user?.tenant?.id
  const selectedTenant = cookies.get('payload-tenant')

  // If no manually selected tenant,
  // but it is a super admin, give access to all
  if (hasTenantAccess) {
    return true
  }

  const publicPageConstraint: Where = {
    'tenant.public': {
      equals: true,
    },
  }

  // If it's a super admin or has access to the selected tenant
  if (selectedTenant && (hasTenantAccess || userTenant === selectedTenant)) {
    // filter access by selected tenant
    return {
      or: [
        publicPageConstraint,
        {
          tenant: {
            equals: selectedTenant,
          },
        },
      ],
    }
  }

  // Allow access to public pages
  return publicPageConstraint
}
