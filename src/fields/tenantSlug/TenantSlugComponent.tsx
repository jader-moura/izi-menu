import React from 'react'

import { TenantSlugComponentClient } from './TenantSlugComponent.client'
import { Tenant } from '@/payload-types'

interface TenantSlugComponentProps {
  user?: {
    tenant?: string
  }
}

export const TenantSlugComponent: React.FC<TenantSlugComponentProps> = async (props) => {
  const userTenant: Tenant | undefined = props?.user?.tenant as Tenant | undefined

  if (!userTenant) return <div>Invalid Tenant</div>

  return <TenantSlugComponentClient tenant={userTenant} />
}
