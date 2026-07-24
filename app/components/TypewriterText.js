"use client";

import { useEffect, useState, useRef } from 'react';

export default function TypewriterText({ text, delay = 0, speed = 45, className = "" }) {
    const [displayed, setDisplayed] = useState("");
    const [started, setStarted] = useState(false);
    const ref = useRef(null);
    const indexRef = useRef(0);

    // Start on scroll into view
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Type character by character
    useEffect(() => {
        if (!started) return;
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                indexRef.current += 1;
                setDisplayed(text.slice(0, indexRef.current));
                if (indexRef.current >= text.length) clearInterval(interval);
            }, speed);
            return () => clearInterval(interval);
        }, delay * 1000);
        return () => clearTimeout(timeout);
    }, [started, text, speed, delay]);

    return (
        <span ref={ref} className={className}>
            {displayed}
            {displayed.length < text.length && (
                <span className="inline-block w-[2px] h-[1em] bg-current animate-pulse ml-0.5 align-middle opacity-70" />
            )}
        </span>
    );
}
