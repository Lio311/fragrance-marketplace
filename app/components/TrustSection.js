"use client";

import { ShieldCheck, Truck, Sparkles, MessageCircle } from 'lucide-react';

export default function TrustSection() {
    const items = [
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            title: "הגנת קונה מלאה",
            desc: "התשלום נשמר בנאמנות עד לאימות קבלת המוצר כפי שתואר. אין סיכונים."
        },
        {
            icon: <Truck className="w-6 h-6" />,
            title: "משלוחים מאובטחים",
            desc: "אפשרויות משלוח מגוונות ומאובטחות ישירות בין קונים למוכרים ברחבי הארץ."
        },
        {
            icon: <Sparkles className="w-6 h-6" />,
            title: "מוכרים מאומתים",
            desc: "מערכת דירוג אמינה המבוססת על עסקאות אמיתיות בלבד בתוך הפלטפורמה."
        },
        {
            icon: <MessageCircle className="w-6 h-6" />,
            title: "שירות לקוחות זמין",
            desc: "צוות האתר זמין לכל שאלה או בעיה, עם ליווי אישי עד להשלמת העסקה."
        }
    ];

    return (
        <section className="py-16 bg-[#050505] border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" dir="rtl">
                    {items.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-3 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#d4af37]/70 group-hover:bg-[#d4af37]/10 group-hover:text-[#d4af37] group-hover:border-[#d4af37]/30 transition-all duration-300">
                                {item.icon}
                            </div>
                            <h4 className="font-bold text-white">{item.title}</h4>
                            <p className="text-sm text-gray-400 leading-relaxed max-w-[220px] group-hover:text-gray-300 transition-colors">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
