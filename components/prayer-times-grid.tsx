"use client"

import { PrayerTimes, cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface PrayerTimesGridProps {
    dayData: PrayerTimes
    activeEvent: string | null
}

export function PrayerTimesGrid({ dayData, activeEvent }: PrayerTimesGridProps) {
    const times = [
        { label: "İmsak", value: dayData.imsak, key: "imsak" },
        { label: "Güneş", value: dayData.gunes, key: "gunes" },
        { label: "Öğle", value: dayData.ogle, key: "ogle" },
        { label: "İkindi", value: dayData.ikindi, key: "ikindi" },
        { label: "Akşam", value: dayData.aksam, key: "aksam" },
        { label: "Yatsı", value: dayData.yatsi, key: "yatsi" },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
            {times.map((item) => {
                const isNext = (activeEvent === "Sahur" && item.key === "imsak") ||
                    (activeEvent === "İftar" && item.key === "aksam");

                return (
                    <div
                        key={item.key}
                        className={cn(
                            "p-5 flex flex-col items-center justify-center gap-2 rounded-2xl transition-all duration-300 border",
                            isNext
                                ? 'bg-primary/10 border-primary/20 ring-1 ring-primary/20'
                                : 'bg-white/[0.02] border-white/5'
                        )}
                    >
                        <span className={cn(
                            "text-[9px] font-bold uppercase tracking-[0.2em]",
                            isNext ? 'text-primary' : 'text-muted-foreground/40'
                        )}>
                            {item.label}
                        </span>
                        <span className={cn(
                            "text-xl font-semibold tracking-tight",
                            isNext ? 'text-primary' : 'text-white/90'
                        )}>
                            {item.value}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
