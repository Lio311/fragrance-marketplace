'use client';

import { useState } from 'react';

export default function HeroCarousel({ banners = [], contentOverlays = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe || isRightSwipe) {
            if (isLeftSwipe) {
                setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
            } else {
                setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
            }
        }
    };

    if (!banners || banners.length === 0) return null;

    const getFallbackPosition = (banner) => {
        return banner.objectPosition && banner.objectPosition.includes('%') ? parseInt(banner.objectPosition.split(' ')[1]) : 50;
    };

    return (
        <div 
            className="hero-carousel-wrapper relative w-screen h-full overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <style dangerouslySetInnerHTML={{__html: `
                .banner-slide .banner-media {
                    object-position: 50% var(--active-bg-y-mobile);
                }
                .banner-slide .banner-content {
                    display: var(--active-content-display);
                    top: var(--active-content-y-mobile);
                    left: 50%;
                    transform: translate(-50%, calc(var(--active-content-y-mobile) * -1)) scale(var(--active-content-scale-mobile));
                    transform-origin: 50% var(--active-content-y-mobile);
                }
                .banner-slide .content-box-bg {
                    background-color: rgba(255, 255, 255, var(--active-content-opacity-mobile));
                }
                @media (min-width: 768px) {
                    .banner-slide .banner-media {
                        object-position: 50% var(--active-bg-y-desktop);
                    }
                    .banner-slide .banner-content {
                        display: var(--active-content-display);
                        top: var(--active-content-y-desktop);
                        left: var(--active-content-x-desktop);
                        transform: translate(calc(var(--active-content-x-desktop) * -1), calc(var(--active-content-y-desktop) * -1)) scale(var(--active-content-scale-desktop));
                        transform-origin: var(--active-content-x-desktop) var(--active-content-y-desktop);
                    }
                    [dir="ltr"] .banner-slide .banner-content {
                        left: auto;
                        right: var(--active-content-x-desktop);
                        transform: translate(calc(var(--active-content-x-desktop) * 1), calc(var(--active-content-y-desktop) * -1)) scale(var(--active-content-scale-desktop));
                        transform-origin: calc(100% - var(--active-content-x-desktop)) var(--active-content-y-desktop);
                    }
                    .banner-slide .content-box-bg {
                        background-color: rgba(255, 255, 255, var(--active-content-opacity-desktop));
                    }
                }
            `}} />

            {banners.map((banner, index) => {
                const bgYDesktop = banner.objectPositionDesktop ?? getFallbackPosition(banner);
                const bgYMobile = banner.objectPositionMobile ?? getFallbackPosition(banner);
                const contentYDesktop = banner.contentPositionDesktop ?? 50;
                const contentYMobile = banner.contentPositionMobile ?? 80;
                const contentXDesktop = banner.contentPositionXDesktop ?? 50;
                const contentScaleDesktop = banner.contentScaleDesktop ?? 100;
                const contentScaleMobile = banner.contentScaleMobile ?? 100;
                const contentOpacityDesktop = banner.contentOpacityDesktop ?? 60;
                const contentOpacityMobile = banner.contentOpacityMobile ?? 60;
                const hideContentBox = banner.hideContentBox || false;

                return (
                    <div 
                        key={index} 
                        className={`banner-slide absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                        style={{
                            '--active-bg-y-desktop': `${bgYDesktop}%`,
                            '--active-bg-y-mobile': `${bgYMobile}%`,
                            '--active-content-y-desktop': `${contentYDesktop}%`,
                            '--active-content-y-mobile': `${contentYMobile}%`,
                            '--active-content-x-desktop': `${contentXDesktop}%`,
                            '--active-content-scale-desktop': contentScaleDesktop / 100,
                            '--active-content-scale-mobile': contentScaleMobile / 100,
                            '--active-content-opacity-desktop': contentOpacityDesktop / 100,
                            '--active-content-opacity-mobile': contentOpacityMobile / 100,
                            '--active-content-display': hideContentBox ? 'none' : 'block',
                        }}
                    >
                        {banner.type === 'video' ? (
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                fetchPriority={index === 0 ? "high" : "auto"}
                                className="w-full h-full object-cover banner-media transition-all duration-700"
                            >
                                <source src={banner.url || "/hero-video.mp4"} type="video/mp4" />
                            </video>
                        ) : (
                            <img
                                src={banner.url || "/hero-bg.jpg"}
                                alt={`Banner ${index + 1}`}
                                className="w-full h-full object-cover banner-media transition-all duration-700"
                                fetchPriority={index === 0 ? "high" : "auto"}
                            />
                        )}

                        {contentOverlays[index] && (
                            <div className="absolute inset-0 z-20 pointer-events-none">
                                <div className="absolute banner-content transition-all duration-700 ease-in-out pointer-events-auto">
                                    {contentOverlays[index]}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {banners.length > 1 && (
                <div className="absolute bottom-5 md:bottom-3 left-0 right-0 z-20 flex justify-center gap-3">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full transition-all duration-300 shadow-md border border-white/50 ${
                                index === currentIndex 
                                    ? 'bg-white scale-125' 
                                    : 'bg-white/40 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
