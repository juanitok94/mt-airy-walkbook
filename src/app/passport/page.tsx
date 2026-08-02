// /src/app/passport/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import shopsData from '@/data/shops.json'
import { getStamps, type StampRecord } from '@/lib/stamps'

const shops = shopsData as any[]

const coreStops = shops
  .filter(s => s.passportType === 'core')
  .sort((a, b) => a.passportStop - b.passportStop)

const totalCoreStops = coreStops.length

const northStops = coreStops.filter(s => s.zone === 'north')
const southStops = coreStops.filter(s => s.zone === 'south')

export default function PassportPage() {
  const [stamps, setStamps] = useState<StampRecord>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setStamps(getStamps())
    setMounted(true)
  }, [])

  // Re-sync when tab regains focus (user may have stamped on another tab)
  useEffect(() => {
    const sync = () => setStamps(getStamps())
    window.addEventListener('focus', sync)
    return () => window.removeEventListener('focus', sync)
  }, [])

  const coreStamped = coreStops.filter(s => stamps[s.id]).length
  const progress = Math.round((coreStamped / totalCoreStops) * 100)

  return (
    <main className="min-h-screen bg-[var(--color-parchment)] text-[var(--color-ink)]">

      {/* HEADER */}
      <div className="bg-[var(--color-espresso)] px-6 py-8 text-center border-b-4 border-[var(--color-gold)]">
        <Link
          href="/"
          className="font-mono text-[10px] tracking-widest text-[var(--color-gold)] opacity-60
                     hover:opacity-100 transition-opacity uppercase"
        >
          ← Mount Airy Walkbook
        </Link>
        <h1 className="font-serif text-3xl font-black text-[var(--color-parchment)] mt-3">
          Your Passport
        </h1>
        <p className="text-[var(--color-parchment)] text-sm italic mt-1 opacity-70">
          {coreStamped === 0 && 'No stamps yet. Time to walk.'}
          {coreStamped > 0 && coreStamped < totalCoreStops &&
            `${coreStamped} of ${totalCoreStops} stamps collected`}
          {coreStamped === totalCoreStops && 'All stamps collected. True Local.'}
        </p>
      </div>

      {/* PROGRESS BAR */}
      <div className="max-w-lg mx-auto px-6 pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] tracking-widest text-[var(--color-rust)] uppercase">
            Progress
          </span>
          <span className="font-mono text-xs text-[var(--color-rust)] font-bold">
            {coreStamped}/{totalCoreStops}
          </span>
        </div>
        <div className="w-full h-3 bg-[var(--color-parchment)] rounded-full overflow-hidden border border-[var(--color-rust)]/20">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: mounted ? `${progress}%` : '0%',
              backgroundColor: coreStamped === totalCoreStops ? 'var(--color-gold)' : 'var(--color-rust)',
            }}
          />
        </div>
      </div>

      {/* STAMP GRID */}
      <div className="max-w-lg mx-auto px-6 py-6">

        {/* North section */}
        <div className="flex items-center gap-3 mb-4">
          <p className="font-mono text-[10px] tracking-widest text-[var(--color-rust)] opacity-60 uppercase whitespace-nowrap">
            Mayberry Core
          </p>
          <div className="flex-1 border-t border-dashed border-[var(--color-rust)] opacity-30" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {northStops.map(shop => (
            <StampCard
              key={shop.id}
              shop={shop}
              stamped={!!stamps[shop.id]}
              stampDate={stamps[shop.id]}
              mounted={mounted}
            />
          ))}
        </div>

        {/* I-240 divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[var(--color-gold)] opacity-40" />
          <span className="font-mono text-[10px] text-[var(--color-gold)] tracking-widest px-2">
            The Covered Bridge
          </span>
          <div className="flex-1 h-px bg-[var(--color-gold)] opacity-40" />
        </div>

        {/* South section */}
        <div className="flex items-center gap-3 mb-4">
          <p className="font-mono text-[10px] tracking-widest text-[var(--color-rust)] opacity-60 uppercase whitespace-nowrap">
            The Second Life
          </p>
          <div className="flex-1 border-t border-dashed border-[var(--color-rust)] opacity-30" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {southStops.map(shop => (
            <StampCard
              key={shop.id}
              shop={shop}
              stamped={!!stamps[shop.id]}
              stampDate={stamps[shop.id]}
              mounted={mounted}
            />
          ))}
        </div>
      </div>

      {/* COMPOSTELA — full-completion message */}
      {coreStamped === totalCoreStops && (
        <div className="max-w-lg mx-auto px-6 pb-8">
          <div className="p-6 bg-[var(--color-espresso)] border-2 border-[var(--color-gold)] rounded-sm text-center">
            <p className="text-3xl mb-2">⭐</p>
            <p className="font-serif text-xl font-bold text-[var(--color-gold)]">
              True Local
            </p>
            <p className="font-serif italic text-sm text-[var(--color-parchment)] mt-2 leading-relaxed">
              You walked all of Main Street. South to north.
              Past the barbershop and the brewery and the mill-turned-hotel,
              up through the granite neighborhood, to the porch on North Main.
              This walk is yours now.
            </p>
            <p className="font-mono text-[10px] text-[var(--color-gold)] opacity-50 mt-4 tracking-widest">
              #MtAiryWalkbook · #TrueLocal
            </p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="bg-[var(--color-espresso)] px-6 py-8 text-center border-t-2 border-[var(--color-gold)]">
        <Link
          href="/"
          className="font-mono text-xs text-[var(--color-gold)] opacity-60
                     hover:opacity-100 transition-opacity tracking-widest uppercase"
        >
          ← Back Home
        </Link>
        <p className="font-serif italic text-[var(--color-parchment)] text-sm opacity-50 mt-4 leading-relaxed">
          Stamps are saved on this device.
          <br />
          No account needed. No data leaves your phone.
        </p>
      </div>

    </main>
  )
}


/* ─── Stamp Card Component ─── */

function StampCard({
  shop,
  stamped,
  stampDate,
  mounted,
}: {
  shop: any
  stamped: boolean
  stampDate?: string
  mounted: boolean
}) {
  const formattedDate = stampDate
    ? new Date(stampDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <Link
      href={`/stop/${shop.id}`}
      className={`
        relative flex flex-col items-center justify-center p-4 rounded-sm
        border text-center transition-all min-h-[140px] group
        ${stamped
          ? 'bg-white/80 border-[var(--color-rust)]/30 shadow-sm'
          : 'bg-white/30 border-dashed border-[var(--color-rust)]/20 hover:bg-white/50'
        }
      `}
    >
      {/* Stop number */}
      <span className="absolute top-2 left-2 font-mono text-[10px] text-[var(--color-rust)] opacity-40">
        #{shop.passportStop}
      </span>

      {/* Sello / stamp circle */}
      <div
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-500 mb-2
          ${stamped
            ? 'scale-100 opacity-100'
            : 'scale-75 opacity-20'
          }
        `}
        style={{
          backgroundColor: stamped ? shop.selloColor : 'var(--color-stone)',
          border: stamped ? `2px solid ${shop.selloColor}` : '2px dashed color-mix(in srgb, var(--color-rust) 25%, transparent)',
        }}
      >
        {stamped ? (
          <span className="text-white text-lg">✓</span>
        ) : (
          <span className="text-[var(--color-rust)] opacity-30 text-lg">?</span>
        )}
      </div>

      {/* Shop name */}
      <p className={`
        font-serif text-xs font-bold leading-tight
        ${stamped ? 'text-[var(--color-espresso)]' : 'text-[var(--color-rust)] opacity-50'}
      `}>
        {shop.name}
      </p>

      {/* Date or prompt */}
      <p className="font-mono text-[9px] mt-1 text-[var(--color-rust)] opacity-50">
        {stamped ? formattedDate : 'Tap to visit →'}
      </p>
    </Link>
  )
}
