import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

interface Props {
  alt?: string
  src?: string
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { alt, src, loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'



  return (
    /* eslint-disable @next/next/no-img-element */
    <div className='w-48 h-9 relative'>
    <Image
      alt={alt || "Store Logo"}
      fill
      loading={loading}
      fetchPriority={priority}
      // decoding="async"
      className='object-contain'
      // className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      src={src || "/izi/logo.png"}
      />
      </div>
  )
}
