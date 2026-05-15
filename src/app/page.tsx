import Link from 'next/link'
import shopsData from '@/data/shops.json'
import layersData from '@/data/layers.json'

const shops = shopsData as any[]
const layers = layersData as any[]

const coreStops = shops
  .filter(s => s.passportType === 'core')
  .sort((a, b) => a.passportStop - b.passportStop)

const songbookFive = shops.filter(s => s.hygge === true)

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5edd8] text-[#1a1208]">

      {/* HEADER */}
      <div className="bg-[#3b1f0a] px-6 py-10 text-center border-b-4 border-[#c8973a]">
        <p className="text-[#c8973a] text-xs tracking-[0.3em] uppercase mb-2 font-mono">
           Mount Airy, NC
        </p>
        <h1 className="font-serif text-5xl font-black text-[#f5edd8] leading-none">
          Mount Airy
        </h1>
        <h2 className="font-serif text-4xl italic text-[#c8973a] leading-none mt-1">
          Walkbook
        </h2>
        <p className="text-[#e8d9b8] text-sm italic mt-3 opacity-70">
          Along N Main Street
        </p>
        <div className="flex items-center justify-center gap-3 mt-4 text-[#c8973a] opacity-50 text-sm">
          <span>★</span><span>✦</span><span>★</span>
        </div>
      </div>

      {/* INTRO */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <p className="font-serif text-lg leading-relaxed text-[#1a1208] italic text-center mb-6">
          "Built on granite, rewritten in brick, remembered in song."
        </p>
        <p className="font-serif text-lg leading-relaxed text-[#1a1208]">
          Main Street in Mount Airy is the real Mayberry — but it's also
          a granite town, a music town, and a town where buildings outlive
          their first purpose. This is a walking guide. Start at Snappy
          Lunch. End at the porch on North Main. Everything in between
          is the story.
        </p>

        {/* CTA */}
        <Link
          href="/passport"
          className="block w-full mt-8 py-4 bg-[#6b3f1e] text-[#f5edd8] text-center
                     font-mono text-sm tracking-widest uppercase rounded-sm
                     shadow-[3px_3px_0_#3b1f0a] hover:translate-x-[-1px]
                     hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#3b1f0a]
                     transition-all"
        >
          Start Your Walk
        </Link>

        <Link
          href="/map"
          className="block w-full mt-3 py-4 border border-[#6b3f1e] text-[#6b3f1e]
                     text-center font-mono text-sm tracking-widest uppercase rounded-sm
                     hover:bg-[#6b3f1e] hover:text-[#f5edd8] transition-all"
        >
          Explore the Map
        </Link>
      </div>

      {/* THE ROUTE */}
      <div className="max-w-2xl mx-auto px-6 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="font-serif text-2xl font-bold text-[#3b1f0a]">The Route</h3>
          <div className="flex-1 border-t border-dashed border-[#6b3f1e] opacity-30" />
        </div>

        {/* Mayberry Core — stops 1–5 */}
        <p className="font-mono text-[11px] tracking-widest text-[#6b3f1e] opacity-80 uppercase mb-4 border-l-2 border-[#c8973a]/40 pl-3">
          Mayberry Core
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {coreStops.filter(s => s.zone === 'north').map(shop => (
            <Link
              key={shop.id}
              href={`/stop/${shop.id}`}
              className="flex items-center gap-3 p-4 bg-white/70 border border-[#6b3f1e]/20
                         rounded-sm hover:bg-white/80 hover:-translate-y-0.5
                         shadow-[0_2px_8px_rgba(59,31,10,0.08)]
                         hover:shadow-[0_4px_16px_rgba(59,31,10,0.14)]
                         transition-all duration-200 group"
            >
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center
                           text-white text-xs font-mono font-bold flex-shrink-0"
                style={{ backgroundColor: shop.selloColor }}
              >
                {shop.passportStop}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-serif font-bold text-[#3b1f0a] text-base truncate">
                  {shop.name}
                </p>
                <p className="font-mono text-[11px] text-[#6b3f1e] opacity-80">
                  {shop.address}
                </p>
              </div>
              <span className="text-[#6b3f1e] text-lg opacity-40 group-hover:opacity-70 transition-all">
                ›
              </span>
            </Link>
          ))}
        </div>

        {/* The Second Life — stops 6–10 */}
        <p className="font-mono text-[11px] tracking-widest text-[#6b3f1e] opacity-80 uppercase mb-4 border-l-2 border-[#c8973a]/40 pl-3">
          The Second Life
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {coreStops.filter(s => s.zone === 'south').map(shop => (
            <Link
              key={shop.id}
              href={`/stop/${shop.id}`}
              className="flex items-center gap-3 p-4 bg-white/70 border border-[#6b3f1e]/20
                         rounded-sm hover:bg-white/80 hover:-translate-y-0.5
                         shadow-[0_2px_8px_rgba(59,31,10,0.08)]
                         hover:shadow-[0_4px_16px_rgba(59,31,10,0.14)]
                         transition-all duration-200 group"
            >
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center
                           text-white text-xs font-mono font-bold flex-shrink-0"
                style={{ backgroundColor: shop.selloColor }}
              >
                {shop.passportStop}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-serif font-bold text-[#3b1f0a] text-base truncate">
                  {shop.name}
                </p>
                <p className="font-mono text-[11px] text-[#6b3f1e] opacity-80">
                  {shop.address}
                </p>
              </div>
              <span className="text-[#6b3f1e] text-lg opacity-40 group-hover:opacity-70 transition-all">
                ›
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* SONGBOOK FIVE */}
      <div className="max-w-2xl mx-auto px-6 pb-10">
        <div className="mt-6 p-6 bg-white/60 backdrop-blur-sm border border-[#6b3f1e]/30 rounded-sm
                        shadow-[0_2px_12px_rgba(59,31,10,0.10)]">
          <p className="font-mono text-[10px] tracking-widest text-[#5a7a4a] uppercase mb-1">
            🕯 Hidden Collection
          </p>
          <p className="font-serif text-lg font-bold text-[#3b1f0a]">
            The Songbook Five
          </p>
          <p className="font-serif italic text-sm text-[#6b3f1e] mt-1 leading-relaxed">
            Five places where Mount Airy's story lives in the walls.
            Find all five.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {songbookFive.map(shop => (
              <span
                key={shop.id}
                className="text-xs font-mono px-2 py-1 rounded-sm text-white opacity-80"
                style={{ backgroundColor: shop.selloColor }}
              >
                {shop.name.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-[#3b1f0a] px-6 py-8 text-center border-t-2 border-[#c8973a]">
        <p className="font-serif italic text-[#e8d9b8] text-sm opacity-70 leading-relaxed">
          Built on granite, rewritten in brick, remembered in song.
          <br />
          These aren't just stops on a map — they're the story of a town that kept going.
        </p>
        <p className="font-mono text-[10px] text-[#c8973a] opacity-50 tracking-widest mt-4">
          #MtAiryWalkbook · #MountAiry · #NCHistory
        </p>
      </div>

    </main>
  )
}
