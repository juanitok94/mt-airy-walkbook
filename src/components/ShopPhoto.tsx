// /src/components/ShopPhoto.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

type ShopPhotoProps = {
  photos: string[]
  alt: string
}

const AUTO_ADVANCE_MS = 5000
const TOUCH_RESUME_MS = 4000
const SWIPE_THRESHOLD_PX = 30
const DOT_LIMIT = 8

function PlaceholderIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-espresso)"
      strokeWidth="1.5"
      opacity={0.35}
    >
      <path d="M4 8h3l2-2h6l2 2h3v11H4V8z" strokeLinejoin="round" />
      <circle cx="12" cy="13.5" r="3.2" />
    </svg>
  )
}

function Placeholder() {
  return (
    <div
      className="relative w-full h-48 overflow-hidden"
      style={{ backgroundColor: 'var(--color-stone)' }}
    >
      <div className="w-full h-48 flex flex-col items-center justify-center gap-2">
        <PlaceholderIcon />
        <span
          className="font-mono text-[9px] tracking-widest uppercase opacity-40"
          style={{ color: 'var(--color-espresso)' }}
        >
          Photo coming soon
        </span>
      </div>
    </div>
  )
}

export default function ShopPhoto({ photos, alt }: ShopPhotoProps) {
  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState<boolean[]>(() => photos.map(() => false))
  const [paused, setPaused] = useState(false)

  const touchStartX = useRef<number | null>(null)
  const justSwiped = useRef(false)
  const touchResumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // New shop (different photos array) — reset rotation and error state
  useEffect(() => {
    setIndex(0)
    setFailed(photos.map(() => false))
  }, [photos])

  useEffect(() => {
    return () => {
      if (touchResumeTimer.current) clearTimeout(touchResumeTimer.current)
    }
  }, [])

  // Slides that haven't 404'd. If every photo fails, this collapses to
  // 0 and we fall back to the same placeholder as an empty array.
  const available = photos
    .map((file, i) => ({ file, i }))
    .filter(({ i }) => !failed[i])
  const count = available.length

  // Keep index in range as slides drop out from load failures
  useEffect(() => {
    if (count > 0 && index >= count) setIndex(0)
  }, [count, index])

  useEffect(() => {
    if (count < 2 || paused) return
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % count)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [count, paused])

  if (count === 0) {
    return <Placeholder />
  }

  const current = available[Math.min(index, count - 1)]
  const showControls = count > 1

  function goTo(next: number) {
    setIndex(((next % count) + count) % count)
  }

  function handleImgError(originalIndex: number) {
    setFailed(prev => {
      if (prev[originalIndex]) return prev
      const next = [...prev]
      next[originalIndex] = true
      return next
    })
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    setPaused(true)
    if (touchResumeTimer.current) clearTimeout(touchResumeTimer.current)
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const startX = touchStartX.current
    touchStartX.current = null
    if (startX !== null) {
      const deltaX = e.changedTouches[0].clientX - startX
      if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
        justSwiped.current = true
        goTo(index + (deltaX < 0 ? 1 : -1))
      }
    }
    touchResumeTimer.current = setTimeout(() => setPaused(false), TOUCH_RESUME_MS)
  }

  function handleClick() {
    if (justSwiped.current) {
      justSwiped.current = false
      return
    }
    goTo(index + 1)
  }

  return (
    <div
      className="relative w-full h-48 overflow-hidden select-none"
      style={{ backgroundColor: 'var(--color-stone)' }}
      onMouseEnter={showControls ? () => setPaused(true) : undefined}
      onMouseLeave={showControls ? () => setPaused(false) : undefined}
      onTouchStart={showControls ? handleTouchStart : undefined}
      onTouchEnd={showControls ? handleTouchEnd : undefined}
      onClick={showControls ? handleClick : undefined}
    >
      <img
        key={current.i}
        src={`/images/shops/${current.file}`}
        alt={alt}
        loading="lazy"
        className="w-full h-48 object-cover"
        onError={() => handleImgError(current.i)}
      />

      {showControls && (
        count <= DOT_LIMIT ? (
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-stone) 55%, transparent)' }}
          >
            {available.map((p, i) => (
              <button
                key={p.i}
                type="button"
                aria-label={`Photo ${i + 1} of ${count}`}
                onClick={(e) => {
                  e.stopPropagation()
                  goTo(i)
                }}
                className="w-1.5 h-1.5 rounded-full transition-opacity"
                style={{
                  backgroundColor: 'var(--color-espresso)',
                  opacity: i === index ? 0.9 : 0.4,
                }}
              />
            ))}
          </div>
        ) : (
          <div
            className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full font-mono text-[9px] tracking-widest"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-espresso) 55%, transparent)',
              color: 'var(--color-stone)',
            }}
          >
            {index + 1} / {count}
          </div>
        )
      )}
    </div>
  )
}
