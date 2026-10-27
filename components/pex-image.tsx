'use client'

import Image from 'next/image'
import { useState, type CSSProperties } from 'react'
import type { PictureSpec } from '@/lib/images'

export type PexImageProps = {
  picture: PictureSpec
  /** Overrides the picture's own alt text when a tighter caption exists. */
  alt?: string
  className?: string
  sizes?: string
  fill?: boolean
  priority?: boolean
  quality?: number
  style?: CSSProperties
}

/**
 * Loader that asks the Pexels CDN for the width the layout needs, routed
 * through the framework optimiser in production builds.
 */
export const pexelsLoader = ({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}): string => {
  if (!src.startsWith('https://images.pexels.com')) return src
  const q = quality ?? 75
  if (process.env.NODE_ENV === 'production') {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`
  }
  const url = new URL(src)
  url.searchParams.set('auto', 'compress')
  url.searchParams.set('cs', 'tinysrgb')
  url.searchParams.set('w', String(width))
  url.searchParams.set('q', String(q))
  return url.toString()
}

/**
 * The site image component. Every picture on Nehemiah Build goes through this
 * (so through next/image, never a bare tag). It points at Pexels first and falls
 * back to the same-origin copy in /public/images when the CDN cannot be reached,
 * which keeps the layout intact on restricted networks. The intrinsic size of the
 * fallback is known up front, so swapping one for the other moves no pixel.
 */
export function PexImage({
  picture,
  alt,
  className,
  sizes,
  fill = false,
  priority = false,
  quality,
  style,
}: PexImageProps) {
  const [usedFallback, setUsedFallback] = useState(false)

  const local = picture.fallback
  const localWidth = picture.fallbackMeta?.width ?? picture.width
  const localHeight = picture.fallbackMeta?.height ?? picture.height

  const useRemote = Boolean(picture.remote) && !usedFallback

  const resolvedAlt = alt ?? picture.alt
  const resolvedSizes =
    sizes ?? (fill ? '100vw' : '(min-width: 1024px) 960px, (min-width: 640px) 600px, 100vw')

  if (useRemote) {
    return (
      <Image
        src={picture.remote as string}
        alt={resolvedAlt}
        loader={pexelsLoader}
        {...(fill ? { fill: true } : { width: picture.width, height: picture.height })}
        sizes={resolvedSizes}
        className={className}
        style={style}
        priority={priority}
        quality={quality}
        onError={() => setUsedFallback(true)}
      />
    )
  }

  return (
    <Image
      src={local}
      alt={resolvedAlt}
      {...(fill ? { fill: true } : { width: localWidth, height: localHeight })}
      sizes={fill ? resolvedSizes : undefined}
      className={className}
      style={style}
      priority={priority}
      quality={quality}
      unoptimized
    />
  )
}
