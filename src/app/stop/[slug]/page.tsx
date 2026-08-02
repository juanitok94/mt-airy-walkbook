// /src/app/stop/[slug]/page.tsx
'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import shopsData from '@/data/shops.json'
import triviaData from '@/data/trivia.json'
import { getStamps, addStamp, isStamped as checkStamped, type StampRecord } from '@/lib/stamps'
import ShopPhoto from '@/components/ShopPhoto'

const shops = shopsData as any[]
const trivia = triviaData as any[]

const coreStops = shops
  .filter(s => s.passportType === 'core')
  .sort((a, b) => a.passportStop - b.passportStop)

export default function StopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  const shop = shops.find(s => s.id === slug)
  const shopTrivia = trivia.find(t => t.shopId === slug)

  const [stamps, setStamps] = useState<StampRecord>({})
  const [stamped, setStamped] = useState(false)
  const [justStamped, setJustStamped] = useState(false)
  const [showTrivia, setShowTrivia] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showFullStory, setShowFullStory] = useState(false)

  useEffect(() => {
    const s = getStamps()
    setStamps(s)
    setStamped(!!s[slug])
    setMounted(true)
  }, [slug])

  if (!shop) {
    return (
      <main className="min-h-screen bg-[#f5edd8] flex items-center justify-center">
        <div className="text-center px-6">
          <p className="font-serif text-2xl text-[#3b1f0a] mb-4">Stop not found</p>
          <Link
            href="/passport"
            className="font-mono text-sm text-[#6b3f1e] underline underline-offset-4"
          >
            ← Back to Passport
          </Link>
        </div>
      </main>
    )
  }

  const isCore = shop.passportType === 'core'

  // Prev / Next navigation for core stops
  const coreIndex = coreStops.findIndex(s => s.id === slug)
  const prevStop = coreIndex > 0 ? coreStops[coreIndex - 1] : null
  const nextStop = coreIndex < coreStops.length - 1 ? coreStops[coreIndex + 1] : null
  // Is this the section crossing? (going from Mayberry Core → The Second Life)
  const crossingI240 = prevStop?.zone === 'north' && shop.zone === 'south'

  function handleStamp() {
    if (stamped) return
    const updated = addStamp(slug)
    setStamps(updated)
    setStamped(true)
    setJustStamped(true)
  }

  // Hours formatting
  const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const dayLabels: Record<string, string> = {
    mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
    fri: 'Fri', sat: 'Sat', sun: 'Sun',
  }

  const storyBody: string = shop.story.body ?? ''
  const storyPreview = storyBody.slice(0, 120)
  const storyNeedsExpand = storyBody.length > 120

  return (
    <main className="min-h-screen bg-[#f5edd8] text-[#1a1208]">

      {/* HEADER — colored by sello */}
      <div
        className="px-6 py-14 text-center border-b-4"
        style={{
          backgroundColor: shop.selloColor,
          borderBottomColor: '#c8973a',
        }}
      >
        <Link
          href="/passport"
          className="font-mono text-[10px] tracking-widest text-white/60
                     hover:text-white/90 transition-opacity uppercase"
        >
          ← Passport
        </Link>

        {isCore && (
          <p className="font-mono text-[10px] tracking-widest text-white/50 uppercase mt-3">
            Stop {shop.passportStop} of 10 · {shop.zone === 'north' ? 'Mayberry Core' : 'The Second Life'}
          </p>
        )}

        {isCore && (
          <p className="font-serif text-6xl font-black text-white/20 leading-none mt-2">
            {shop.passportStop}
          </p>
        )}

        <h1 className="font-serif text-4xl font-black text-white mt-2 leading-tight">
          {shop.name}
        </h1>

        <p className="font-mono text-xs text-white/60 mt-2">
          {shop.address}
        </p>

        {shop.story?.insiderTip && (
          <p className="font-serif italic text-sm text-white/60 mt-2">
            {shop.story.insiderTip}
          </p>
        )}
      </div>

      {/* PHOTO ZONE */}
      <ShopPhoto photos={shop.photos ?? []} alt={shop.name} />

      <div className="max-w-lg mx-auto px-6 py-8">

        {/* STAMP BUTTON */}
        {!stamped ? (
          <button
            onClick={handleStamp}
            className="w-full py-4 bg-[#6b3f1e] text-[#f5edd8] text-center
                       font-mono text-sm tracking-widest uppercase rounded-sm
                       shadow-[3px_3px_0_#3b1f0a] hover:translate-x-[-1px]
                       hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#3b1f0a]
                       active:translate-x-[1px] active:translate-y-[1px]
                       active:shadow-[1px_1px_0_#3b1f0a]
                       transition-all"
          >
            Collect This Stamp
          </button>
        ) : (
          <div
            className={`
              text-center p-5 rounded-sm border-2 transition-all duration-700
              ${justStamped ? 'animate-stamp-in' : ''}
            `}
            style={{
              backgroundColor: `${shop.selloColor}15`,
              borderColor: shop.selloColor,
            }}
          >
            {/* Stamp circle */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: shop.selloColor }}
            >
              <span className="text-white text-3xl">✓</span>
            </div>

            <p className="font-serif text-lg font-bold text-[#3b1f0a]">
              {shop.stamp.welcomeLine}
            </p>
            <p className="font-serif italic text-sm text-[#6b3f1e] mt-1 leading-relaxed">
              {shop.stamp.subLine}
            </p>

            {stamps[slug] && (
              <p className="font-mono text-[10px] text-[#6b3f1e] opacity-50 mt-3">
                Stamped {new Date(stamps[slug]).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
        )}

        {/* STORY */}
        <div className="mt-8">
          <h2 className="font-serif text-xl font-bold text-[#3b1f0a] leading-snug">
            {shop.story.headline}
          </h2>

          <div className="relative mt-3">
            <p className="font-serif text-base text-[#3b1f0a] leading-relaxed transition-all duration-500">
              {showFullStory || !storyNeedsExpand ? storyBody : `${storyPreview}…`}
            </p>

            {!showFullStory && storyNeedsExpand && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#f5edd8] to-transparent" />
            )}
          </div>

          {storyNeedsExpand && (
            <button
              onClick={() => setShowFullStory(v => !v)}
              className="mt-2 font-mono text-xs text-[#6b3f1e] underline underline-offset-4
                         hover:text-[#3b1f0a] transition-colors"
            >
              {showFullStory ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* INSIDER TIP */}
        {shop.story.insiderTip && (
          <div className="mt-6 p-4 bg-[#e8d9b8] border border-[#6b3f1e]/20 rounded-sm">
            <p className="font-mono text-[10px] tracking-widest text-[#6b3f1e] opacity-60 uppercase mb-1">
              Insider Tip
            </p>
            <p className="font-serif italic text-sm text-[#3b1f0a] leading-relaxed">
              {shop.story.insiderTip}
            </p>
          </div>
        )}

        {/* HOURS */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <p className="font-mono text-[10px] tracking-widest text-[#6b3f1e] opacity-60 uppercase">
              Hours
            </p>
            <div className="flex-1 border-t border-dashed border-[#6b3f1e] opacity-20" />
          </div>

          <div className="flex flex-col gap-1">
            {dayOrder.map(day => {
              const val = shop.hours[day]
              const closed = val?.toLowerCase() === 'closed'
              const today = new Date().toLocaleDateString(
                'en-US', { weekday: 'short' }
              ).toLowerCase().slice(0, 3)
              const isToday = today === day
              return (
                <div key={day} className={`flex justify-between items-center py-1.5 px-3 rounded-sm
                  ${isToday ? 'bg-white/70 font-bold' : 'bg-white/30'}
                `}>
                  <span className={`font-mono text-xs uppercase
                    ${isToday ? 'text-[#3b1f0a]' : 'text-[#6b3f1e] opacity-60'}
                  `}>
                    {isToday ? '→ ' : ''}{dayLabels[day]}
                  </span>
                  <span className={`font-mono text-xs
                    ${closed ? 'text-[#b84c1a] opacity-60' :
                      isToday ? 'text-[#3b1f0a]' : 'text-[#3b1f0a] opacity-80'}
                  `}>
                    {closed ? 'Closed' : val}
                  </span>
                </div>
              )
            })}
          </div>

          {shop.hours.note && (
            <p className="font-serif italic text-xs text-[#6b3f1e] opacity-60 mt-2">
              {shop.hours.note}
            </p>
          )}
        </div>

        {/* PARKING */}
        {shop.story.parkingNote && (
          <p className="font-mono text-[10px] text-[#6b3f1e] opacity-50 mt-3">
            🅿 {shop.story.parkingNote}
          </p>
        )}

        {/* TRIVIA */}
        {shopTrivia && (
          <div className="mt-8">
            <button
              onClick={() => { setShowTrivia(!showTrivia); setShowAnswer(false) }}
              className="w-full text-left p-4 bg-white/50 border border-[#6b3f1e]/20
                         rounded-sm hover:bg-white/70 transition-all"
            >
              <p className="font-mono text-[10px] tracking-widest text-[#6b3f1e] opacity-60 uppercase mb-1">
                ☕ Local Trivia
              </p>
              <p className="font-serif text-sm font-bold text-[#3b1f0a]">
                {showTrivia ? 'Hide question' : 'Tap to reveal a question about this stop'}
              </p>
            </button>

            {showTrivia && (
              <div className="mt-3 p-4 bg-white/70 border border-[#6b3f1e]/20 rounded-sm">
                <p className="font-serif text-sm text-[#3b1f0a] leading-relaxed">
                  {shopTrivia.question}
                </p>
                {!showAnswer ? (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="mt-3 font-mono text-xs text-[#6b3f1e] underline
                               underline-offset-4 hover:text-[#3b1f0a] transition-colors"
                  >
                    Show answer
                  </button>
                ) : (
                  <div className="mt-3 pt-3 border-t border-dashed border-[#6b3f1e]/20">
                    <p className="font-serif italic text-sm text-[#6b3f1e] leading-relaxed">
                      {shopTrivia.answer}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* LINKS */}
        <div className="mt-8 flex flex-wrap gap-3">
          {shop.website && (
            <a
              href={`https://${shop.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[#6b3f1e] underline underline-offset-4
                         hover:text-[#3b1f0a] transition-colors"
            >
              Website ↗
            </a>
          )}
          {shop.instagram && (
            <a
              href={`https://instagram.com/${shop.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[#6b3f1e] underline underline-offset-4
                         hover:text-[#3b1f0a] transition-colors"
            >
              Instagram ↗
            </a>
          )}
          {shop.placeId && (
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${shop.placeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[#6b3f1e] underline underline-offset-4
                         hover:text-[#3b1f0a] transition-colors"
            >
              Directions ↗
            </a>
          )}
        </div>

        {/* SHARE BUTTON */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: shop.name,
                text: `I just stamped ${shop.name} on the Mount Airy Walkbook.`,
                url: window.location.href,
              })
            } else {
              navigator.clipboard.writeText(window.location.href)
              alert('Link copied!')
            }
          }}
          className="mt-4 w-full py-3 border border-[#6b3f1e]/30
                     rounded-sm font-mono text-xs tracking-widest
                     uppercase text-[#6b3f1e] hover:bg-white/50
                     transition-all"
        >
          Share This Stop
        </button>

        {/* PREV / NEXT NAV */}
        {isCore && (
          <div className="mt-10">
            {/* I-240 crossing callout */}
            {crossingI240 && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[#b84c1a] opacity-40" />
                <span className="font-mono text-[10px] text-[#b84c1a] tracking-widest px-2">
                  You crossed The Covered Bridge
                </span>
                <div className="flex-1 h-px bg-[#b84c1a] opacity-40" />
              </div>
            )}

            <div className="flex gap-3">
              {prevStop ? (
                <Link
                  href={`/stop/${prevStop.id}`}
                  className="flex-1 p-3 bg-white/50 border border-[#6b3f1e]/20 rounded-sm
                             hover:bg-white/80 transition-all text-center"
                >
                  <p className="font-mono text-[9px] text-[#6b3f1e] opacity-50 uppercase">
                    ← Stop {prevStop.passportStop}
                  </p>
                  <p className="font-serif text-xs font-bold text-[#3b1f0a] mt-0.5 truncate">
                    {prevStop.name}
                  </p>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {nextStop ? (
                <Link
                  href={`/stop/${nextStop.id}`}
                  className="flex-1 p-3 bg-white/50 border border-[#6b3f1e]/20 rounded-sm
                             hover:bg-white/80 transition-all text-center"
                >
                  <p className="font-mono text-[9px] text-[#6b3f1e] opacity-50 uppercase">
                    Stop {nextStop.passportStop} →
                  </p>
                  <p className="font-serif text-xs font-bold text-[#3b1f0a] mt-0.5 truncate">
                    {nextStop.name}
                  </p>
                </Link>
              ) : (
                <Link
                  href="/passport"
                  className="flex-1 p-3 bg-[#6b3f1e] rounded-sm
                             hover:bg-[#3b1f0a] transition-all text-center"
                >
                  <p className="font-mono text-[9px] text-[#c8973a] opacity-70 uppercase">
                    End of the road
                  </p>
                  <p className="font-serif text-xs font-bold text-[#f5edd8] mt-0.5">
                    View Passport →
                  </p>
                </Link>
              )}
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div className="bg-[#3b1f0a] px-6 py-6 text-center border-t-2 border-[#c8973a]">
        <Link
          href="/passport"
          className="font-mono text-xs text-[#c8973a] opacity-60
                     hover:opacity-100 transition-opacity tracking-widest uppercase"
        >
          ← Back to Passport
        </Link>
      </div>

      {/* Inline animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes stampIn {
          0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.08) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-stamp-in {
          animation: stampIn 0.5s ease-out;
        }
      `}} />

    </main>
  )
}
