import { IziHeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'

export async function IziHeader() {
  const headerData: Header = await getCachedGlobal('header', 1)()

  return <IziHeaderClient data={headerData} />
}
