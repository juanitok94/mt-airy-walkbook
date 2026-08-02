// /src/components/ShopPhoto.tsx
'use client'

type ShopPhotoProps = {
  photos: string[]
  alt: string
}

export default function ShopPhoto({ photos, alt }: ShopPhotoProps) {
  const src = photos?.[0] ? `/images/shops/${photos[0]}` : null

  return (
    <div
      className="relative w-full h-48 overflow-hidden"
      style={{ backgroundColor: 'var(--color-stone)' }}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling?.removeAttribute('hidden')
          }}
        />
      )}
      <div
        hidden={!!src}
        className="w-full h-48 flex flex-col items-center justify-center gap-2"
      >
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
