import Link from 'next/link'
import shopsData from '@/data/shops.json'
import layersData from '@/data/layers.json'
import HeroCarousel from '@/components/HeroCarousel'

const shops = shopsData as any[]
const layers = layersData as any[]

const heroImages = [
  { src: '/mount-airy-hero.jpg', alt: 'First Baptist Church, downtown Mount Airy, NC' },
  { src: '/images/shops/balladeer-hotel-01.jpeg', alt: 'The Balladeer Hotel' },
  { src: '/images/shops/will-monday-house-01.jpeg', alt: 'Will Monday House' },
]

const coreStops = shops
  .filter(s => s.passportType === 'core')
  .sort((a, b) => a.passportStop - b.passportStop)

const songbookFive = shops.filter(s => s.hygge === true)

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-parchment)] text-[var(--color-ink)]">

      {/* HEADER */}
      <div className="bg-[var(--color-espresso)] px-6 py-10 text-center border-b-4 border-[var(--color-gold)]">
        <p className="text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-2 font-mono">
           Mount Airy, NC
        </p>
        <h1 className="font-serif text-5xl font-black text-[var(--color-parchment)] leading-none">
          Mount Airy
        </h1>
        <h2 className="font-serif text-4xl italic text-[var(--color-gold)] leading-none mt-1">
          Walkbook
        </h2>
        <p className="text-[var(--color-parchment)] text-sm italic mt-3 opacity-70">
          Along N Main Street
        </p>
        <div className="flex items-center justify-center gap-3 mt-4 text-[var(--color-gold)] opacity-50 text-sm">
          <span>★</span><span>✦</span><span>★</span>
        </div>
        <HeroCarousel images={heroImages} />
      </div>

      {/* INTRO */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <p className="font-serif text-lg leading-relaxed text-[var(--color-ink)] italic text-center mb-6">
          "Built on granite, rewritten in brick, remembered in song."
        </p>
        <p className="font-serif text-lg leading-relaxed text-[var(--color-ink)]">
          Main Street in Mount Airy is the real Mayberry — but it's also
          a granite town, a music town, and a town where buildings outlive
          their first purpose. This is a walking guide. Start at Snappy
          Lunch. End at the porch on North Main. Everything in between
          is the story.
        </p>

        {/* CTA */}
        <Link
          href="/passport"
          className="block w-full mt-8 py-4 bg-[var(--color-rust)] text-[var(--color-parchment)] text-center
                     font-mono text-sm tracking-widest uppercase rounded-sm
                     shadow-[3px_3px_0_var(--color-espresso)] hover:translate-x-[-1px]
                     hover:translate-y-[-1px] hover:shadow-[4px_4px_0_var(--color-espresso)]
                     transition-all"
        >
          Start Your Walk
        </Link>

        <Link
          href="/map"
          className="block w-full mt-3 py-4 border border-[var(--color-rust)] text-[var(--color-rust)]
                     text-center font-mono text-sm tracking-widest uppercase rounded-sm
                     hover:bg-[var(--color-rust)] hover:text-[var(--color-parchment)] transition-all"
        >
          Explore the Map
        </Link>
      </div>

      {/* THE ROUTE */}
      <div className="max-w-2xl mx-auto px-6 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="font-serif text-2xl font-bold text-[var(--color-espresso)]">The Route</h3>
          <div className="flex-1 border-t border-dashed border-[var(--color-rust)] opacity-30" />
        </div>

        {/* Mayberry Core — stops 1–5 */}
        <p className="font-mono text-[11px] tracking-widest text-[var(--color-rust)] opacity-80 uppercase mb-4 border-l-2 border-[var(--color-gold)]/40 pl-3">
          Mayberry Core
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {coreStops.filter(s => s.zone === 'north').map(shop => (
            <Link
              key={shop.id}
              href={`/stop/${shop.id}`}
              className="flex items-center gap-3 p-4 bg-white/70 border border-[var(--color-rust)]/20
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
                <p className="font-serif font-bold text-[var(--color-espresso)] text-base truncate">
                  {shop.name}
                </p>
                <p className="font-mono text-[11px] text-[var(--color-rust)] opacity-80">
                  {shop.address}
                </p>
              </div>
              <span className="text-[var(--color-rust)] text-lg opacity-40 group-hover:opacity-70 transition-all">
                ›
              </span>
            </Link>
          ))}
        </div>

        {/* The Second Life — stops 6–11 */}
        <p className="font-mono text-[11px] tracking-widest text-[var(--color-rust)] opacity-80 uppercase mb-4 border-l-2 border-[var(--color-gold)]/40 pl-3">
          The Second Life
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {coreStops.filter(s => s.zone === 'south').map(shop => (
            <Link
              key={shop.id}
              href={`/stop/${shop.id}`}
              className="flex items-center gap-3 p-4 bg-white/70 border border-[var(--color-rust)]/20
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
                <p className="font-serif font-bold text-[var(--color-espresso)] text-base truncate">
                  {shop.name}
                </p>
                <p className="font-mono text-[11px] text-[var(--color-rust)] opacity-80">
                  {shop.address}
                </p>
              </div>
              <span className="text-[var(--color-rust)] text-lg opacity-40 group-hover:opacity-70 transition-all">
                ›
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* SONGBOOK FIVE */}
      <div className="max-w-2xl mx-auto px-6 pb-10">
        <div className="mt-6 p-6 bg-white/60 backdrop-blur-sm border border-[var(--color-rust)]/30 rounded-sm
                        shadow-[0_2px_12px_rgba(59,31,10,0.10)]">
          <p className="font-mono text-[10px] tracking-widest text-[var(--color-sage)] uppercase mb-1">
            🕯 Hidden Collection
          </p>
          <p className="font-serif text-lg font-bold text-[var(--color-espresso)]">
            The Songbook Five
          </p>
          <p className="font-serif italic text-sm text-[var(--color-rust)] mt-1 leading-relaxed">
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

      {/* BEYOND MAIN STREET */}
      <div className="max-w-2xl mx-auto px-6 pb-10">
        <div className="p-6 bg-white/60 backdrop-blur-sm border border-[var(--color-rust)]/30 rounded-sm
                        shadow-[0_2px_12px_rgba(59,31,10,0.10)]">
          <p className="font-mono text-[10px] tracking-widest text-[var(--color-sage)] uppercase mb-1">
            🎻 Beyond Main Street
          </p>
          <p className="font-serif italic text-sm text-[var(--color-rust)] mt-1 mb-4 leading-relaxed">
            Mount Airy sits inside a real Appalachian old-time and bluegrass
            circuit. Not passport stops — just worth knowing about.
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <p className="font-serif font-bold text-[var(--color-espresso)] text-sm">
                Mount Airy Fiddlers' Convention
              </p>
              <p className="font-mono text-[10px] text-[var(--color-rust)] opacity-70 tracking-wide">
                First weekend of June · Veterans Memorial Park · Est. 1972
              </p>
            </div>
            <div>
              <p className="font-serif font-bold text-[var(--color-espresso)] text-sm">
                Galax Old Fiddlers' Convention
              </p>
              <p className="font-mono text-[10px] text-[var(--color-rust)] opacity-70 tracking-wide">
                Every August · Felts Park, Galax, VA · Est. 1935 — "World's Capital of Old Time Mountain Music"
              </p>
            </div>
            <div>
              <p className="font-serif font-bold text-[var(--color-espresso)] text-sm">
                FloydFest
              </p>
              <p className="font-mono text-[10px] text-[var(--color-rust)] opacity-70 tracking-wide">
                Five days every July · Floyd, VA · Est. 2002
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-[var(--color-espresso)] px-6 py-8 text-center border-t-2 border-[var(--color-gold)]">
        <p className="font-serif italic text-[var(--color-parchment)] text-sm opacity-70 leading-relaxed">
          Built on granite, rewritten in brick, remembered in song.
          <br />
          These aren't just stops on a map — they're the story of a town that kept going.
        </p>
        <p className="font-mono text-[10px] text-[var(--color-gold)] opacity-50 tracking-widest mt-4">
          #MtAiryWalkbook · #MountAiry · #NCHistory
        </p>
      </div>

    </main>
  )
}
