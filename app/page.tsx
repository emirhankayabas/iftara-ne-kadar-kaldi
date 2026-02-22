"use client"

import { useEffect, useState, useMemo } from "react"
import istanbulData from "@/data/istanbul.json"
import ankaraData from "@/data/ankara.json"
import izmirData from "@/data/izmir.json"
import holidaysData from "@/data/holidays.json"
import { getNextEvent, PrayerTimes, cn } from "@/lib/utils"
import { DayList } from "@/components/day-list"
import { CountdownDisplay } from "@/components/countdown-display"
import {
    Moon,
    Sun,
    SunDim,
    CloudSun,
    Sunset,
    MoonStar,
    Calendar,
    Clock,
    Menu,
    LayoutDashboard,
    X
} from "lucide-react"

export default function Home() {
    const [now, setNow] = useState<Date | null>(null)
    const [selectedCity, setSelectedCity] = useState("istanbul")
    const [showLeftSidebar, setShowLeftSidebar] = useState(false)
    const [showRightSidebar, setShowRightSidebar] = useState(false)

    const cities = [
        { id: "istanbul", name: "İstanbul" },
        { id: "ankara", name: "Ankara" },
        { id: "izmir", name: "İzmir" },
    ]

    useEffect(() => {
        setNow(new Date())
        const timer = setInterval(() => setNow(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

    const imsakiye = useMemo(() => {
        const cityDataMap: { [key: string]: any[] } = {
            istanbul: istanbulData,
            ankara: ankaraData,
            izmir: izmirData,
        }

        const baseData = cityDataMap[selectedCity] || []
        // Deep copy to avoid mutating imports
        const merged = JSON.parse(JSON.stringify(baseData))

        // Merge holidays
        holidaysData.forEach(holiday => {
            const existingDayIndex = merged.findIndex((d: any) => d.date === holiday.date)
            if (existingDayIndex !== -1) {
                merged[existingDayIndex] = { ...merged[existingDayIndex], ...holiday }
            } else {
                merged.push({
                    day: merged.length + 1,
                    imsak: "-",
                    gunes: "-",
                    ogle: "-",
                    ikindi: "-",
                    aksam: "-",
                    yatsi: "-",
                    ...holiday
                })
            }
        })

        return merged as PrayerTimes[]
    }, [selectedCity])

    const currentDayIndex = useMemo(() => {
        if (!now) return -1
        return imsakiye.findIndex(d => {
            const dayParts = d.date.split(' ')
            const day = parseInt(dayParts[0])
            const monthMap: { [key: string]: number } = { 'Şubat': 1, 'Mart': 2 };
            const month = monthMap[dayParts[1]];
            return day === now.getDate() && month === now.getMonth();
        })
    }, [imsakiye, now])

    const event = useMemo(() => {
        if (!now || imsakiye.length === 0) return null
        return getNextEvent(imsakiye, now)
    }, [imsakiye, now])

    const holidays = useMemo(() => imsakiye.filter(d => d.isHoliday), [imsakiye])

    if (!now) return <div className="min-h-screen bg-background" />
    if (imsakiye.length === 0) return <div className="min-h-screen bg-background flex items-center justify-center">Veri Yüklenemedi</div>

    return (
        <main className="flex h-screen bg-zinc-950 overflow-hidden overflow-x-hidden text-zinc-100 selection:bg-primary/30 font-sans">
            {/* Sidebar - Days Explorer (Left) */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-full sm:w-[320px] lg:w-[320px] 2xl:w-[380px] shrink-0 h-full transition-all duration-300 lg:relative lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto",
                showLeftSidebar ? "translate-x-0 opacity-100 pointer-events-auto" : "-translate-x-full opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto lg:translate-x-0"
            )}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setShowLeftSidebar(false)} />
                <div className="relative h-full bg-zinc-950 border-r border-white/5">
                    <DayList imsakiye={imsakiye} currentDayIndex={currentDayIndex} />
                    <button
                        onClick={() => setShowLeftSidebar(false)}
                        className="lg:hidden absolute top-6 right-6 p-2 bg-white/5 rounded-full border border-white/10"
                    >
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>
            </aside>

            {/* Main Content (Center) */}
            <div className="flex-1 flex flex-col h-full min-w-0 max-w-full overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.015),transparent)]">
                {/* Header */}
                <header className="px-6 lg:px-10 py-5 lg:py-8 flex justify-between items-center z-30 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowLeftSidebar(true)}
                            className="lg:hidden p-2 bg-white/5 rounded-xl border border-white/10 text-zinc-400"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col gap-0.5">
                            <h1 className="text-base lg:text-xl font-bold tracking-tight text-white/90">RAMAZAN TAKİP</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-zinc-500 uppercase">
                                    {now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/5">
                            {cities.map(city => (
                                <button
                                    key={city.id}
                                    onClick={() => setSelectedCity(city.id)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                                        selectedCity === city.id
                                            ? "bg-white text-zinc-950 shadow-lg shadow-white/20"
                                            : "text-zinc-500 hover:text-zinc-300"
                                    )}
                                >
                                    {city.name}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden xs:flex items-center gap-3">
                                <div className="bg-white/5 rounded-full border border-white/10 flex items-center justify-center py-2 px-4">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase">
                                        {imsakiye[currentDayIndex]?.day ? `${imsakiye[currentDayIndex].day}. GÜN` : 'RAMAZAN'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowRightSidebar(true)}
                                className="lg:hidden p-2 bg-white/5 rounded-xl border border-white/10 text-zinc-400"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex flex-col p-4 lg:p-12 overflow-y-auto custom-scrollbar items-center justify-center">
                    {event ? (
                        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
                            <div className="w-full py-8 lg:py-16 flex flex-col items-center">
                                <div className="flex items-center gap-2 mb-6 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                                        {cities.find(c => c.id === selectedCity)?.name}
                                    </span>
                                </div>
                                <CountdownDisplay targetTime={event.time} eventType={event.type} />
                            </div>

                            {/* Mobile Info Display (Compact) */}
                            <div className="lg:hidden w-full flex flex-col items-center gap-6 mt-4 pb-12">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 sm:hidden mb-4">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase">
                                        {imsakiye[currentDayIndex]?.day}. GÜN
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 w-full max-w-sm">
                                    <div className="p-5 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center gap-2">
                                        <Moon className="w-5 h-5 text-zinc-500" />
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">İmsak</span>
                                        <span className="text-xl font-bold font-mono text-white">{imsakiye[currentDayIndex]?.imsak}</span>
                                    </div>
                                    <div className="p-5 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center gap-2">
                                        <Sunset className="w-5 h-5 text-primary" />
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">İftar</span>
                                        <span className="text-xl font-bold font-mono text-white">{imsakiye[currentDayIndex]?.aksam}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                                <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-4xl font-bold tracking-tight text-white/90">Ramazan Sona Erdi</h2>
                                <p className="text-zinc-500 font-medium max-w-sm mx-auto text-sm">Hayırlı bayramlar.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar - Stats & Holidays (Right) */}
            <aside className={cn(
                "fixed inset-y-0 right-0 z-50 w-full sm:w-[320px] lg:w-[320px] 2xl:w-[380px] shrink-0 h-full border-l border-white/5 bg-zinc-950/40 backdrop-blur-xl transition-all duration-300 lg:relative lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto",
                showRightSidebar ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto lg:translate-x-0"
            )}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setShowRightSidebar(false)} />
                <div className="relative h-full flex flex-col bg-zinc-950/80">
                    <button
                        onClick={() => setShowRightSidebar(false)}
                        className="lg:hidden absolute top-6 right-6 z-10 p-2 bg-white/5 rounded-full border border-white/10"
                    >
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                    <div className="p-6 pt-20 lg:pt-6 space-y-10 h-full overflow-y-auto custom-scrollbar">
                        {event && (
                            <section className="space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                                        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Günün Akışı</h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{event.dayData.day}. GÜN</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { l: "İmsak", v: event.dayData.imsak, icon: Moon },
                                        { l: "Güneş", v: event.dayData.gunes, icon: Sun },
                                        { l: "Öğle", v: event.dayData.ogle, icon: SunDim },
                                        { l: "İkindi", v: event.dayData.ikindi, icon: CloudSun },
                                        { l: "Akşam", v: event.dayData.aksam, h: event.type === "İftar", icon: Sunset },
                                        { l: "Yatsı", v: event.dayData.yatsi, icon: MoonStar }
                                    ].map((t, idx) => {
                                        const Icon = t.icon;
                                        return (
                                            <div key={idx} className={cn(
                                                "flex flex-col gap-3 p-3.5 rounded-xl border transition-all duration-300",
                                                t.h
                                                    ? "bg-primary/5 border-primary/20 shadow-[0_4px_15px_-5px_rgba(var(--primary),0.2)]"
                                                    : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                                            )}>
                                                <div className="flex items-center justify-between">
                                                    <div className={cn(
                                                        "w-7 h-7 flex items-center justify-center rounded-lg",
                                                        t.h ? "bg-primary text-zinc-950" : "bg-zinc-900 text-zinc-600"
                                                    )}>
                                                        <Icon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={cn(
                                                            "text-xs font-bold font-mono tracking-tight",
                                                            t.h ? "text-primary" : "text-white/80"
                                                        )}>
                                                            {t.v}
                                                        </span>
                                                        {t.h && <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />}
                                                    </div>
                                                </div>
                                                <span className={cn(
                                                    "text-[11px] font-bold uppercase tracking-wider",
                                                    t.h ? "text-white" : "text-zinc-300"
                                                )}>
                                                    {t.l}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>
                        )}

                        <section className="space-y-6 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-2 px-2">
                                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Dini Günler</h3>
                            </div>
                            <div className="space-y-2">
                                {holidays.map((h, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all">
                                        <span className="text-[13px] font-bold text-zinc-300">{h.holidayName}</span>
                                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{h.date.split(' ').slice(0, 2).join(' ')}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="mt-auto p-6 border-t border-white/5 flex items-center justify-between">
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-700">Ver: 2026.1.1</p>
                        <div className="flex gap-1.5">
                            <div className="h-1 w-1 rounded-full bg-zinc-800" />
                            <div className="h-1 w-1 rounded-full bg-zinc-800" />
                        </div>
                    </div>
                </div>
            </aside>
        </main>
    )
}