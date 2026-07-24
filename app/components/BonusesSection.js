"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Search, TrendingUp } from "lucide-react";
import Link from 'next/link';

export default function BonusesSection() {
    return (
        <section className="w-full relative flex flex-col justify-center items-center bg-black overflow-hidden perspective-1000 py-16 border-t border-white/5">
            {/* Static Background - High Performance */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent_60%)] blur-3xl opacity-60" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent_60%)] blur-3xl opacity-60" />
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="shrink-0 mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 drop-shadow-lg tracking-[0.1em] uppercase">למה לבחור בנו?</h2>
                    <p className="text-gray-300 text-base mb-2">סטנדרט חדש לקניית בשמי יוקרה ברשת.</p>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto rounded-full opacity-70"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto perspective-1000" dir="rtl">
                    {/* Feature 1 */}
                    <motion.div
                        whileHover={{ scale: 1.05, rotateY: 5, z: 50 }}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                        className="group relative bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-xl shadow-xl hover:bg-white/10 transition-all duration-500 flex flex-col items-center border-t-white/20 border-r-white/20"
                    >
                        <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="mb-4 text-[#d4af37]/70 group-hover:text-[#d4af37] transition-colors">
                            <Search size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white">חיפוש חכם</h3>
                        <p className="text-gray-300 text-sm group-hover:text-white transition-colors">מנוע חיפוש מתקדם המאפשר למצוא בדיוק את הבושם שחיפשתם בעברית או באנגלית בקליק אחד.</p>
                    </motion.div>

                    {/* Feature 2 - Highlighted */}
                    <motion.div
                        whileHover={{ scale: 1.1, rotateY: 0, z: 80 }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                        className="group relative bg-gradient-to-bl from-white/10 to-white/5 border border-white/30 p-8 rounded-xl backdrop-blur-2xl shadow-[0_0_50px_rgba(212,175,55,0.05)] hover:shadow-[0_0_80px_rgba(212,175,55,0.15)] transition-all duration-500 flex flex-col items-center transform scale-105 z-10 border-t-white/40 border-r-white/40"
                    >
                        <div className="absolute -top-3 bg-gradient-to-r from-[#d4af37] via-[#ffdf73] to-[#d4af37] text-black px-4 py-0.5 rounded-full text-xs font-bold tracking-widest shadow-lg uppercase">
                            הכי משתלם
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-bl from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="mb-5 text-[#d4af37]/80 group-hover:text-[#d4af37] transition-colors group-hover:scale-110 duration-500">
                            <TrendingUp size={56} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-white">השוואת מחירים</h3>
                        <p className="text-gray-200 text-base font-medium group-hover:text-white transition-colors">קבלו גישה למספר מוכרים עבור אותו בושם, כך שתוכלו להשוות ולבחור את ההצעה המשתלמת ביותר.</p>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div
                        whileHover={{ scale: 1.05, rotateY: -5, z: 50 }}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                        className="group relative bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-xl shadow-xl hover:bg-white/10 transition-all duration-500 flex flex-col items-center border-t-white/20 border-l-white/20"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="mb-4 text-[#d4af37]/70 group-hover:text-[#d4af37] transition-colors">
                            <ShieldCheck size={40} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white">קנייה בטוחה</h3>
                        <p className="text-gray-300 text-sm group-hover:text-white transition-colors">מערכת ביקורות פתוחה ושקופה מבטיחה שתוכלו לרכוש ממוכרים אמינים בלבד בביטחון מלא.</p>
                    </motion.div>
                </div>

                <div className="text-center mt-12">
                    <Link href="/catalog" className="inline-block border px-8 py-3 text-sm font-bold tracking-widest transition duration-500 uppercase rounded-full border-white text-white hover:bg-white hover:text-black">
                        התחל לקנות
                    </Link>
                </div>
            </div>
        </section>
    );
}
