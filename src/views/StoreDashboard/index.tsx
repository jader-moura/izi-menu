import type { AdminViewProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

export const StoreDashboard: React.FC<AdminViewProps> = (args) => {
  const { initPageResult, params, searchParams } = args

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
      collectionSlug="my-store"
      documentSubViewType="default"
    >
      <Gutter>
        <h1>Edit Store</h1>
      </Gutter>

      <p>Store content</p>
    </DefaultTemplate>
  )
}
