'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Reviews({ dict }: { dict: any }) {
  // Реальные медиа пользователя
  const clientReviews = [
    { id: 1, type: "video", url: "/images/IMG_1623.webm", label: "Reels" },
    { id: 2, type: "photo", url: "/images/photo_2026-02-18_12-40-33.jpg", label: "Story" },
    { id: 3, type: "video", url: "/images/IMG_1682.webm", label: "Reels" },
    { id: 4, type: "photo", url: "/images/photo_2026-02-18_12-40-51.jpg", label: "Story" },
    { id: 5, type: "video", url: "/images/IMG_1601.webm", label: "Story" },
    { id: 6, type: "photo", url: "/images/photo_2026-02-18_12-40-34.jpg", label: "Story" },
    { id: 7, type: "video", url: "/images/IMG_1626.webm", label: "Reels" },
    { id: 8, type: "photo", url: "/images/photo_2026-02-18_12-40-50.jpg", label: "Story" },
    { id: 9, type: "video", url: "/images/IMG_1656.webm", label: "Story" },
    { id: 10, type: "photo", url: "/images/photo_2026-02-18_12-40-52.jpg", label: "Story" },
    { id: 11, type: "video", url: "/images/IMG_1681.webm", label: "Story" },
    { id: 12, type: "video", url: "/images/IMG_1685.webm", label: "Story" },
    { id: 13, type: "photo", url: "/images/photo_2026-02-20_15-06-21.jpg", label: "Story" },
    { id: 14, type: "video", url: "/images/IMG_1686.webm", label: "Story" },
    { id: 15, type: "photo", url: "/images/photo_2026-02-18_12-40-33 (2).jpg", label: "Story" },
    { id: 16, type: "video", url: "/images/IMG_1687.webm", label: "Story" },
    { id: 17, type: "photo", url: "/images/photo_2026-02-18_12-40-51 (2).jpg", label: "Story" },
    { id: 18, type: "video", url: "/images/IMG_1657.webm", label: "Story" },
    { id: 19, type: "video", url: "/images/IMG_1660.webm", label: "Story" }
  ]

  return (
    <section id="opinie" className="py-24 bg-brand-bg overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-dark mb-4">{dict.reviews.title}</h2>
          <p className="text-brand-orange text-lg font-medium">{dict.reviews.subtitle}</p>
        </div>

        {/* Сетка / Слайдер для вертикальных видео и фото */}
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 snap-x snap-mandatory hide-scrollbar lg:grid lg:grid-cols-4 sm:overflow-visible">
          {clientReviews.map((media) => (
            <div
              key={media.id}
              className="relative w-[280px] sm:w-[320px] lg:w-full aspect-[9/16] bg-brand-dark rounded-3xl overflow-hidden flex-shrink-0 snap-center group cursor-pointer shadow-xl border border-white/10"
            >
              {media.type === 'video' ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  poster="/images/video-placeholder.jpg"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <source src={media.url} type="video/webm" />
                </video>
              ) : (
                <Image
                  src={media.url}
                  alt={media.label}
                  fill
                  loading="lazy"
                  className="object-cover opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 300px"
                  unoptimized // Из-за пробелов и кириллицы в исходниках лучше отключить оптимизацию на этапе MVP
                />
              )}

              {/* Метка "Reels / Story" */}
              <div className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                {media.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  )
}