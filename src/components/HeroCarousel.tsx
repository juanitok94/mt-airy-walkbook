// /src/components/HeroCarousel.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type HeroImage = {
  src: string
  alt: string
}

type HeroCarouselProps = {
  images: HeroImage[]
}

// Same timing/visual language as src/components/ShopPhoto.tsx, kept as
// a separate component rather than shared logic because this carousel
// has no placeholder-fallback or per-image-failure state to manage —
// all images here are known-committed assets, not user-photographed
// shop uploads that may be missing on disk.
const AUTO_ADVANCE_MS = 5000
const TOUCH_RESUME_MS = 4000

export default function HeroCarousel({ images }: HeroCarouselProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchResumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showControls = images.length > 1

  useEffect(() => {
    if (!showControls || paused) return
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [showControls, paused, images.length])

  useEffect(() => {
    return () => {
      if (touchResumeTimer.current) clearTimeout(touchResumeTimer.current)
    }
  }, [])

  function handleTouchStart() {
    setPaused(true)
    if (touchResumeTimer.current) clearTimeout(touchResumeTimer.current)
  }

  function handleTouchEnd() {
    touchResumeTimer.current = setTimeout(() => setPaused(false), TOUCH_RESUME_MS)
  }

  const current = images[index]

  return (
    <div className="mt-6 max-w-sm mx-auto rounded-sm overflow-hidden">
      <div
        className="relative w-full h-56"
        onMouseEnter={showControls ? () => setPaused(true) : undefined}
        onMouseLeave={showControls ? () => setPaused(false) : undefined}
        onTouchStart={showControls ? handleTouchStart : undefined}
        onTouchEnd={showControls ? handleTouchEnd : undefined}
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          sizes="384px"
          className="object-cover opacity-80"
          priority={index === 0}
        />

        {showControls && (
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-stone) 55%, transparent)' }}
          >
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                aria-label={`Photo ${i + 1} of ${images.length}`}
                onClick={() => setIndex(i)}
                className="w-1.5 h-1.5 rounded-full transition-opacity"
                style={{
                  backgroundColor: 'var(--color-espresso)',
                  opacity: i === index ? 0.9 : 0.4,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
