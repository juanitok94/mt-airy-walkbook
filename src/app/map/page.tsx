// /src/app/map/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import shopsData from '@/data/shops.json'
import layersData from '@/data/layers.json'
import { getStamps, type StampRecord } from '@/lib/stamps'
import { isRentalHours, type ShopHours, type WeekdayHours } from '@/types/shop'

const shops = shopsData as any[]
const layers = layersData as any[]

// ── Geo helpers ──
// All shops share roughly the same latitude (Haywood Rd runs east↔west).
// We project longitude → horizontal position on a 0-100 scale.
const allLons = shops.map(s => s.coordinates[0])
const minLon = Math.min(...allLons)
const maxLon = Math.max(...allLons)
const lonSpan = maxLon - minLon || 1

function lonToPercent(lon: number, flip: boolean): number {
  // Default: East (less negative) = left, West (more negative) = right
  // Flipped: West = left, East = right
  const pct = ((lon - minLon) / lonSpan) * 100
  return flip ? 100 - pct : pct
}

// I-240 approximate longitude (between stop 4 and stop 5)
const I240_LON = -82.5857

// Sort core stops for the route line
const coreStops = shops
  .filter(s => s.passportType === 'core')
  .sort((a, b) => a.passportStop - b.passportStop)

const bonusStops = shops.filter(s => s.passportType === 'bonus')

export default function MapPage() {
  const [stamps, setStamps] = useState<StampRecord>({})
  const [mounted, setMounted] = useState(false)
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set(['coffee']))
  const [selectedStop, setSelectedStop] = useState<string | null>(null)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setStamps(getStamps())
    setMounted(true)
  }, [])

  useEffect(() => {
    const sync = () => setStamps(getStamps())
    window.addEventListener('focus', sync)
    return () => window.removeEventListener('focus', sync)
  }, [])

  function toggleLayer(layerId: string) {
    setActiveLayers(prev => {
      const next = new Set(prev)
      if (next.has(layerId)) {
        next.delete(layerId)
      } else {
        next.add(layerId)
      }
      return next
    })
  }

  // Filter visible shops: always show passport stops, plus active layers
  const visibleShops = useMemo(() => {
    return shops.filter(s => {
      if (s.passportType === 'core' || s.passportType === 'bonus') return true
      return s.layers.some((l: string) => activeLayers.has(l))
    })
  }, [activeLayers])

  const selectedShop = selectedStop ? shops.find(s => s.id === selectedStop) : null

  const coreStamped = coreStops.filter(s => stamps[s.id]).length

  return (
    <main className="min-h-screen bg-[#f5edd8] text-[#1a1208]">

      {/* HEADER */}
      <div className="bg-[#3b1f0a] px-6 py-6 text-center border-b-4 border-[#c8973a]">
        <Link
          href="/"
          className="font-mono text-[10px] tracking-widest text-[#c8973a] opacity-60
                     hover:opacity-100 transition-opacity uppercase"
        >
          ← N Main Street Ledger
        </Link>
        <h1 className="font-serif text-3xl font-black text-[#f5edd8] mt-2">
          The Map
        </h1>
        <p className="text-[#e8d9b8] text-sm italic mt-1 opacity-70">
          10 stops. One road. Walk it.
        </p>
      </div>

      {/* LAYER FILTERS */}
      <div className="max-w-2xl mx-auto px-4 pt-5">
        <p className="text-center font-mono text-[10px] tracking-widest text-[#6b3f1e] opacity-50 uppercase mb-3">
          Tap to filter
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {layers.map(layer => {
            const active = activeLayers.has(layer.id)
            return (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono
                  transition-all border
                  ${active
                    ? 'text-white border-transparent'
                    : 'bg-transparent border-[#6b3f1e]/20 text-[#6b3f1e] opacity-50 hover:opacity-80'
                  }
                  ${layer.id === 'coffee' ? 'ring-1 ring-[#c8973a]/30' : ''}
                `}
                style={active ? { backgroundColor: layer.color } : {}}
              >
                <span>{layer.icon}</span>
                <span>{layer.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* MAP CONTAINER */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="relative bg-white/40 border border-[#6b3f1e]/15 rounded-sm p-4 overflow-hidden">

          {/* Direction labels + flip toggle */}
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[9px] tracking-widest text-[#6b3f1e] opacity-40 uppercase">
              {flipped ? '← West' : '← East'}
            </span>
            <button
              onClick={() => setFlipped(f => !f)}
              className="font-mono text-[9px] tracking-widest text-[#6b3f1e] opacity-50
                         hover:opacity-80 transition-opacity px-2 py-1 border border-[#6b3f1e]/20
                         rounded-sm bg-white/50 hover:bg-white/80"
            >
              ⇄ Flip
            </button>
            <span className="font-mono text-[9px] tracking-widest text-[#6b3f1e] opacity-40 uppercase">
              {flipped ? 'East →' : 'West →'}
            </span>
          </div>

          {/* The road */}
          <div className="relative h-[340px]">

            {/* Road line */}
            <div
              className="absolute left-0 right-0 h-[3px] bg-[#6b3f1e]/20 rounded-full"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            />

            {/* I-240 crossing */}
            <div
              className="absolute top-0 bottom-0 w-px transition-all duration-500"
              style={{ left: `${lonToPercent(I240_LON, flipped)}%` }}
            >
              <div className="absolute inset-0 bg-[#b84c1a] opacity-30" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="font-mono text-[8px] text-[#b84c1a] tracking-widest bg-[#f5edd8]/80 px-1.5 py-0.5 rounded-sm">
                  The Covered Bridge
                </span>
              </div>
            </div>

            {/* Secondary street labels */}
            <div
              className="absolute font-mono text-[8px] tracking-widest text-[#6b3f1e] opacity-30 uppercase"
              style={{ top: '24px', left: `${lonToPercent(-82.576, flipped)}%`, transform: 'translateX(-50%)' }}
            >
              Riverview Dr
            </div>
            <div
              className="absolute font-mono text-[8px] tracking-widest text-[#6b3f1e] opacity-30 uppercase"
              style={{ top: '24px', left: `${lonToPercent(-82.598, flipped)}%`, transform: 'translateX(-50%)' }}
            >
              Patton Ave
            </div>

            {/* Zone labels */}
            {(() => {
              const i240pct = lonToPercent(I240_LON, flipped)
              const northCenter = flipped
                ? i240pct + (100 - i240pct) / 2
                : i240pct / 2
              const southCenter = flipped
                ? i240pct / 2
                : i240pct + (100 - i240pct) / 2
              return (
                <>
                  <div
                    className="absolute font-mono text-[8px] tracking-widest text-[#6b3f1e] opacity-30 uppercase transition-all duration-500"
                    style={{ top: '8px', left: `${northCenter}%`, transform: 'translateX(-50%)' }}
                  >
                    North Main
                  </div>
                  <div
                    className="absolute font-mono text-[8px] tracking-widest text-[#6b3f1e] opacity-30 uppercase transition-all duration-500"
                    style={{ top: '8px', left: `${southCenter}%`, transform: 'translateX(-50%)' }}
                  >
                    South Main
                  </div>
                </>
              )
            })()}

            {/* Non-passport layer dots (background) */}
            {visibleShops
              .filter(s => !s.passportType)
              .map(shop => {
                const x = lonToPercent(shop.coordinates[0], flipped)
                const layerColor = layers.find(l => l.id === shop.layers[0])?.color || '#999'
                // Stagger vertically so dots don't pile up
                const hash = shop.id.charCodeAt(0) + shop.id.charCodeAt(1)
                const yOffset = (hash % 7) * 18 - 63 // spread above/below road
                return (
                  <button
                    key={shop.id}
                    onClick={() => setSelectedStop(selectedStop === shop.id ? null : shop.id)}
                    className={`
                      absolute w-3 h-3 rounded-full transition-all duration-200
                      hover:scale-150 hover:z-20
                      ${selectedStop === shop.id ? 'scale-150 z-20 ring-2 ring-white' : 'opacity-50 hover:opacity-90'}
                    `}
                    style={{
                      left: `${x}%`,
                      top: `calc(50% + ${yOffset}px)`,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: layerColor,
                    }}
                    title={shop.name}
                  />
                )
              })}

            {/* Bonus stops (slightly larger, diamond shape via rotation) */}
            {bonusStops.map(shop => {
              const x = lonToPercent(shop.coordinates[0], flipped)
              const stamped = !!stamps[shop.id]
              const hash = shop.id.charCodeAt(2) + shop.id.charCodeAt(3)
              const yOffset = (hash % 5) * 14 - 28
              return (
                <button
                  key={shop.id}
                  onClick={() => setSelectedStop(selectedStop === shop.id ? null : shop.id)}
                  className={`
                    absolute w-4 h-4 rounded-sm transition-all duration-200
                    hover:scale-150 hover:z-20 rotate-45
                    ${selectedStop === shop.id ? 'scale-150 z-20 ring-2 ring-white' : ''}
                    ${stamped ? 'opacity-100' : 'opacity-60 hover:opacity-90'}
                  `}
                  style={{
                    left: `${x}%`,
                    top: `calc(50% + ${yOffset}px)`,
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    backgroundColor: shop.selloColor,
                  }}
                  title={shop.name}
                />
              )
            })}

            {/* Core passport stops (largest, numbered) */}
            {coreStops.map(shop => {
              const x = lonToPercent(shop.coordinates[0], flipped) + (shop.passportStop === 10 ? 1.5 : 0)
              const stamped = !!stamps[shop.id]
              // Alternate above/below road for readability
              const above = shop.passportStop % 2 === 1
              const yOffset = above ? -40 : 40
              return (
                <button
                  key={shop.id}
                  onClick={() => setSelectedStop(selectedStop === shop.id ? null : shop.id)}
                  className="absolute flex flex-col items-center transition-all duration-200 hover:z-20 group"
                  style={{
                    left: `${x}%`,
                    top: `calc(50% + ${yOffset}px)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {/* Connector line to road */}
                  <div
                    className="absolute w-px bg-[#6b3f1e]/15"
                    style={{
                      height: `${Math.abs(yOffset) - 14}px`,
                      top: above ? '100%' : 'auto',
                      bottom: above ? 'auto' : '100%',
                    }}
                  />

                  {/* Marker circle */}
                  <div
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center
                      text-xs font-mono font-bold transition-all duration-300
                      group-hover:scale-110
                      ${selectedStop === shop.id ? 'scale-110 ring-2 ring-[#c8973a]' : ''}
                      ${stamped ? 'text-white shadow-sm' : 'text-white/70'}
                    `}
                    style={{
                      backgroundColor: stamped ? shop.selloColor : `${shop.selloColor}88`,
                    }}
                  >
                    {stamped ? '✓' : shop.passportStop}
                  </div>

                  {/* Name label */}
                  <p className={`
                    text-center font-mono text-[9px] text-[#1a1208] mt-1 leading-tight w-16 break-words
                    ${stamped ? 'text-[#3b1f0a]' : 'text-[#6b3f1e] opacity-60'}
                  `}>
                    {shop.name}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-dashed border-[#6b3f1e]/15">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-[#6b3f1e] flex items-center justify-center">
                <span className="text-white text-[7px] font-mono">1</span>
              </div>
              <span className="font-mono text-[9px] text-[#6b3f1e] opacity-60">Core stop</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#6b3f1e] rotate-45" />
              <span className="font-mono text-[9px] text-[#6b3f1e] opacity-60">Bonus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#6b3f1e] opacity-50" />
              <span className="font-mono text-[9px] text-[#6b3f1e] opacity-60">Other</span>
            </div>
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      {selectedStop && selectedShop && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setSelectedStop(null)}
        />
      )}

      {/* BOTTOM SHEET */}
      {selectedStop && selectedShop && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#f5edd8] rounded-t-2xl shadow-[0_-4px_24px_rgba(59,31,10,0.15)] max-w-2xl mx-auto"
            style={{
              borderTopColor: selectedShop.selloColor,
              borderTopWidth: '4px',
              borderTopStyle: 'solid',
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#6b3f1e]/20" />
            </div>

            <div className="px-6 pb-8 pt-2">
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-mono text-[10px] tracking-widest text-[#6b3f1e] opacity-50 uppercase mb-1">
                    {selectedShop.layers?.[0]}
                  </p>
                  <h2 className="font-serif text-2xl font-bold text-[#1a1208] leading-tight">
                    {selectedShop.name}
                  </h2>
                  <p className="font-mono text-xs text-[#6b3f1e] opacity-60 mt-1">
                    {selectedShop.address}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStop(null)}
                  className="w-8 h-8 rounded-full bg-[#6b3f1e]/10 flex items-center
                             justify-center font-mono text-sm text-[#6b3f1e]
                             hover:bg-[#6b3f1e]/20 transition-colors flex-shrink-0 mt-1"
                >
                  ×
                </button>
              </div>

              {/* Today's hours / check-in-out */}
              {(() => {
                const hours = selectedShop.hours as ShopHours | undefined
                if (!hours) return null

                if (isRentalHours(hours)) {
                  return (
                    <p className="font-mono text-sm mt-3">
                      <span className="text-[#c8973a] font-bold">→ Check-In: </span>
                      <span className="text-[#1a1208]">{hours.checkIn}</span>
                      <span className="text-[#6b3f1e] opacity-50"> · </span>
                      <span className="text-[#c8973a] font-bold">Check-Out: </span>
                      <span className="text-[#1a1208]">{hours.checkOut}</span>
                    </p>
                  )
                }

                const todayKey = (['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()]) as keyof WeekdayHours
                const todayHours = hours[todayKey]
                const isClosed = todayHours?.toLowerCase() === 'closed'
                return todayHours ? (
                  <p className="font-mono text-sm mt-3">
                    <span className="text-[#c8973a] font-bold">→ Today: </span>
                    <span className={isClosed ? 'text-[#b84c1a]' : 'text-[#1a1208]'}>
                      {todayHours}
                    </span>
                  </p>
                ) : null
              })()}

              {/* Layer pills */}
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedShop.layers?.map((layerId: string) => {
                  const layer = layers.find(l => l.id === layerId)
                  return layer ? (
                    <span
                      key={layerId}
                      className="text-[10px] font-mono px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: layer.color }}
                    >
                      {layer.icon} {layer.label}
                    </span>
                  ) : null
                })}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-4">
                {selectedShop.passportType === 'core' && (
                  <Link
                    href={`/stop/${selectedShop.id}`}
                    className="flex-1 py-3 bg-[#6b3f1e] text-[#f5edd8] text-center
                               font-mono text-xs tracking-widest uppercase rounded-sm
                               hover:bg-[#3b1f0a] transition-colors"
                  >
                    Visit Stop →
                  </Link>
                )}
                {selectedShop.instagram && (
                  <a
                    href={`https://instagram.com/${selectedShop.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 border border-[#6b3f1e]/30 text-[#6b3f1e]
                               text-center font-mono text-xs tracking-widest uppercase
                               rounded-sm hover:bg-[#6b3f1e]/10 transition-colors"
                  >
                    Instagram ↗
                  </a>
                )}
                {selectedShop.placeId && (
                  <a
                    href={`https://www.google.com/maps/place/?q=place_id:${selectedShop.placeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 border border-[#6b3f1e]/30 text-[#6b3f1e]
                               text-center font-mono text-xs tracking-widest uppercase
                               rounded-sm hover:bg-[#6b3f1e]/10 transition-colors"
                  >
                    Directions ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROUTE LIST (compact, below map) */}
      <div className="max-w-2xl mx-auto px-4 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="font-serif text-lg font-bold text-[#3b1f0a]">
            The Route
          </h2>
          <div className="flex-1 border-t border-dashed border-[#6b3f1e] opacity-20" />
          <span className="font-mono text-[10px] text-[#6b3f1e] opacity-50">
            {coreStamped}/10
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {coreStops.map((shop, i) => {
            const stamped = !!stamps[shop.id]
            const showDivider = i === 4 // After stop 4, before stop 5
            return (
              <div key={shop.id}>
                {showDivider && (
                  <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-[#b84c1a] opacity-30" />
                    <span className="font-mono text-[9px] text-[#b84c1a] tracking-widest">The Covered Bridge</span>
                    <div className="flex-1 h-px bg-[#b84c1a] opacity-30" />
                  </div>
                )}
                <Link
                  href={`/stop/${shop.id}`}
                  className="flex items-center gap-2.5 p-2.5 bg-white/40 border border-[#6b3f1e]/10
                             rounded-sm hover:bg-white/70 transition-all group"
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center
                               text-white text-[10px] font-mono font-bold flex-shrink-0"
                    style={{ backgroundColor: stamped ? shop.selloColor : `${shop.selloColor}66` }}
                  >
                    {stamped ? '✓' : shop.passportStop}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-serif text-sm truncate ${stamped ? 'font-bold text-[#3b1f0a]' : 'text-[#6b3f1e]'}`}>
                      {shop.name}
                    </p>
                  </div>
                  <span className="font-mono text-[9px] text-[#6b3f1e] opacity-30 flex-shrink-0">
                    {shop.address.split(' ').slice(0, 2).join(' ')}
                  </span>
                  <span className="text-[#6b3f1e] opacity-20 group-hover:opacity-50 transition-all text-sm">
                    →
                  </span>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* PASSPORT CTA */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <Link
          href="/passport"
          className="block w-full py-4 bg-[#6b3f1e] text-[#f5edd8] text-center
                     font-mono text-sm tracking-widest uppercase rounded-sm
                     shadow-[3px_3px_0_#3b1f0a] hover:translate-x-[-1px]
                     hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#3b1f0a]
                     transition-all"
        >
          View Your Passport
        </Link>
      </div>

      {/* FOOTER */}
      <div className="bg-[#3b1f0a] px-6 py-6 text-center border-t-2 border-[#c8973a]">
        <Link
          href="/"
          className="font-mono text-xs text-[#c8973a] opacity-60
                     hover:opacity-100 transition-opacity tracking-widest uppercase"
        >
          ← Back Home
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          60% { transform: translateY(-4px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.35s ease-out;
        }
      `}} />

    </main>
  )
}
