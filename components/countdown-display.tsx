"use client"

import { useEffect, useState } from "react"
import { formatRemainingTime } from "@/lib/utils"

interface CountdownDisplayProps {
    targetTime: Date
    eventType: string
}

export function CountdownDisplay({ targetTime, eventType }: CountdownDisplayProps) {
    const [timeLeft, setTimeLeft] = useState<{ hours: string, minutes: string, seconds: string, totalMs: number } | null>(null)

    useEffect(() => {
        const update = () => {
            const diff = targetTime.getTime() - Date.now()
            if (diff > 0) {
                setTimeLeft(formatRemainingTime(diff))
            } else {
                setTimeLeft({ hours: "00", minutes: "00", seconds: "00", totalMs: 0 })
            }
        }

        update()
        const timer = setInterval(update, 1000)
        return () => clearInterval(timer)
    }, [targetTime])

    if (!timeLeft) return null

    return (
        <div className="flex flex-col items-center justify-center gap-6 py-12 md:py-20 px-4 text-center">
            <div className="flex flex-col gap-4">
                <span className="text-[10px] md:text-base font-semibold text-muted-foreground/80 uppercase tracking-[0.4em]">
                    {eventType === "İftar" ? "İftara Kalan Süre" : "Sahura Kalan Süre"}
                </span>
                <div className="flex items-baseline gap-2 md:gap-6 font-mono">
                    <div className="flex flex-col items-center">
                        <span className="text-[4rem] xs:text-[5.5rem] md:text-[9rem] lg:text-[11rem] font-bold leading-none tracking-tight text-white/90">
                            {timeLeft.hours}
                        </span>
                        <span className="text-[10px] md:text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mt-2">Saat</span>
                    </div>
                    <span className="text-[3rem] md:text-[6rem] font-light leading-none opacity-10 -translate-y-4 md:-translate-y-6">:</span>
                    <div className="flex flex-col items-center">
                        <span className="text-[4rem] xs:text-[5.5rem] md:text-[9rem] lg:text-[11rem] font-bold leading-none tracking-tight text-white/90">
                            {timeLeft.minutes}
                        </span>
                        <span className="text-[10px] md:text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mt-2">Dakika</span>
                    </div>
                    <span className="text-[3rem] md:text-[6rem] font-light leading-none opacity-10 -translate-y-4 md:-translate-y-6">:</span>
                    <div className="flex flex-col items-center">
                        <span className="text-[4rem] xs:text-[5.5rem] md:text-[9rem] lg:text-[11rem] font-bold leading-none tracking-tight text-white/90">
                            {timeLeft.seconds}
                        </span>
                        <span className="text-[10px] md:text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mt-2">Saniye</span>
                    </div>
                </div>
            </div>

            {timeLeft.totalMs > 0 && (
                <div className="mt-4 flex items-center gap-4">
                    <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary/80 transition-all duration-1000"
                            style={{ width: `${Math.min(100, (timeLeft.totalMs / (24 * 60 * 60 * 1000)) * 100)}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-[0.2em]">Gün Akışı</span>
                </div>
            )}
        </div>
    )
}
