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
  const { alt, src, loading: loadingFromProps, priority: priorityFromProps } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    <div className="w-16 h-16 relative rounded-full overflow-hidden">
      <Image
        alt={alt || 'Store Logo'}
        fill
        loading={loading}
        fetchPriority={priority}
        className="object-cover"
        src={src || '/izi/logo.png'}
      />
    </div>
  )
}
