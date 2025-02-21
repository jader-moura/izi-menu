'use client'
import React, { useCallback, useState } from 'react'

import { Button, TextInput, FieldLabel, toast } from '@payloadcms/ui'

import './index.scss'
import { Tenant } from '@/payload-types'
import { formatSlug } from '@/utilities/formatSlug'

interface TenantSlugComponentClientProps {
  tenant?: Tenant
}
export const TenantSlugComponentClient: React.FC<TenantSlugComponentClientProps> = ({ tenant }) => {
  const [locked, setLocked] = useState(false)
  const [fieldValue, setFieldValue] = useState(tenant?.slug || '')

  const handleLock = useCallback(
    async (e: React.MouseEvent<Element>) => {
      e.preventDefault()
      if (locked) {
        setLocked(false)
      } else {
        const response = await fetch('/api/update-slug', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug: fieldValue, tenant }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          toast.error(errorData.error || 'An error occurred')
          return
        } else {
          toast.success('Slug updated successfully')
          setLocked(true)
        }
      }
    },
    [locked, fieldValue, tenant],
  )

  return (
    <div className="tenant-slug-field-component">
      <h2>Store Slug</h2>
      <span className="description">The slug that will appear in your project url</span>
      <FieldLabel label="Current Slug" />
      <div className="tenant-slug-input-wrapper">
        <TextInput
          value={fieldValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setFieldValue(formatSlug(event.target.value))
          }
          readOnly={Boolean(locked)}
          path="tenantSlug"
        />
        <Button onClick={handleLock} className="tenant-slug-lock-button">
          {locked ? 'Change' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
