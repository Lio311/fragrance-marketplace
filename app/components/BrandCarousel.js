"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function BrandCarousel({ brands }) {
    if (!brands || brands.length === 0) return null;

    return (
        <div className="w-full bg-[#050505] py-16 border-t border-white/5 overflow-hidden" dir="rtl">
            <div className="container mx-auto px-4 text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-widest uppercase">המותגים המובילים</h2>
                <div className="w-12 h-0.5 bg-[#d4af37] mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="relative w-full overflow-hidden group">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>

                <div className="flex animate-scroll whitespace-nowrap gap-16 md:gap-24 w-max pause-on-hover items-center py-4">
                    {/* Duplicate the array to create infinite loop effect - Using 3 copies for smoothness */}
                    {[...brands, ...brands, ...brands].map((brand, i) => (
                        <Link
                            key={`${brand.name}-${i}`}
                            href={`/catalog?q=${encodeURIComponent(brand.name)}`}
                            className="flex-shrink-0 flex items-center justify-center w-32 h-16 md:w-40 md:h-20 p-2 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110 opacity-70 hover:opacity-100"
                        >
                            {brand.logo_url ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={brand.logo_url}
                                        alt={brand.name}
                                        fill
                                        className="object-contain brightness-0 invert"
                                        sizes="(max-width: 768px) 120px, 160px"
                                    />
                                </div>
                            ) : (
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{brand.name}</span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>

            <style jsx>{`
            @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(33.33%); }
            }
            .animate-scroll {
                animation: scroll 60s linear infinite;
            }
            .pause-on-hover:hover {
                animation-play-state: paused;
            }
        `}</style>
        </div>
    );
}
