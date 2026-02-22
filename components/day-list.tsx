"use client"

import { useRef, useEffect } from "react"
import { PrayerTimes, cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface DayListProps {
    imsakiye: PrayerTimes[]
    currentDayIndex: number
}

export function DayList({ imsakiye, currentDayIndex }: DayListProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const activeItemRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (activeItemRef.current && scrollRef.current) {
            activeItemRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }
    }, [currentDayIndex])

    return (
        <div className="flex flex-col h-full bg-zinc-950/40 border-r border-white/5 overflow-hidden backdrop-blur-xl">
            <div className="p-8 pb-4 pt-20 lg:pt-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="h-5 w-5 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                    <h2 className="text-lg font-bold tracking-tight text-white/90">RAMAZAN 2026</h2>
                </div>
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.2em]">İmsakiye Çizelgesi</p>
            </div>

            <div className="px-8 py-4">
                <div className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent w-full" />
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3"
            >
                {imsakiye.map((item, index) => {
                    const isCurrent = index === currentDayIndex;
                    const isHoliday = item.isHoliday;
                    const isRamadanDay = index < 29;

                    return (
                        <div
                            key={`${item.day}-${index}`}
                            ref={isCurrent ? activeItemRef : null}
                            className={cn(
                                "group relative flex flex-col gap-3 p-5 rounded-[1.25rem] transition-all duration-500 border",
                                isCurrent
                                    ? 'bg-primary/10 border-primary/30 shadow-[0_0_40px_-15px_rgba(var(--primary),0.3)]'
                                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                            )}
                        >
                            {/* Active Indicator Bar */}
                            {isCurrent && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-full shadow-[4px_0_15px_rgba(var(--primary),0.6)]" />
                            )}

                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-md",
                                            isCurrent ? 'bg-primary/20 text-primary' : 'bg-white/5 text-zinc-500'
                                        )}>
                                            {isRamadanDay ? `${item.day}. GÜN` : 'DİNİ GÜN'}
                                        </span>
                                    </div>
                                    <span className={cn(
                                        "text-sm font-semibold tracking-tight transition-colors duration-300",
                                        isCurrent ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                                    )}>
                                        {item.date.split('|')[0].trim()}
                                    </span>
                                    {isHoliday && (
                                        <span className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">
                                            {item.holidayName}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {isRamadanDay && (
                                <div className="grid grid-cols-2 gap-x-6 pt-1 border-t border-white/[0.03] mt-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-600">İmsak</span>
                                        <span className={cn("text-xs font-medium font-mono", isCurrent ? "text-primary/80" : "text-zinc-400")}>{item.imsak}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-600">Akşam</span>
                                        <span className={cn("text-xs font-medium font-mono", isCurrent ? "text-primary/80" : "text-zinc-400")}>{item.aksam}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
