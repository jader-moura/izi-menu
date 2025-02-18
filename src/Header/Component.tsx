import { HeaderClient } from './Component.client'
// import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header, Store } from '@/payload-types'

interface HeaderProps {
  store: Store
  slug: string
}

export async function Header({ store, slug }: HeaderProps) {
  return <HeaderClient store={store} slug={slug} />
}
