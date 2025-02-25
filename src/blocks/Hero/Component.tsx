import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/blocks/Hero/HighImpact'
import { LowImpactHero } from '@/blocks/Hero/LowImpact'
import { MediumImpactHero } from '@/blocks/Hero/MediumImpact'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
}

export const HeroBlock: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
