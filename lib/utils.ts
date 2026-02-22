import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface PrayerTimes {
  day: number;
  date: string;
  imsak: string;
  gunes: string;
  ogle: string;
  ikindi: string;
  aksam: string;
  yatsi: string;
  isHoliday?: boolean;
  holidayName?: string;
}

export function parsePrayerTime(timeStr: string, dateStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  // dateStr format: "19 Şubat 2026 Perşembe"
  const parts = dateStr.split(' ');
  const day = parseInt(parts[0]);
  const monthName = parts[1];
  const year = parseInt(parts[2]);

  const monthMap: { [key: string]: number } = {
    'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3, 'Mayıs': 4, 'Haziran': 5,
    'Temmuz': 6, 'Ağustos': 7, 'Eylül': 8, 'Ekim': 9, 'Kasım': 10, 'Aralık': 11
  };

  const month = monthMap[monthName];
  return new Date(year, month, day, hours, minutes, 0);
}

export function formatRemainingTime(ms: number) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    totalMs: ms
  };
}

export function getNextEvent(imsakiye: PrayerTimes[], now: Date) {
  // Find current day based on date
  const currentDayIndex = imsakiye.findIndex(d => {
    const dayDate = parsePrayerTime(d.imsak, d.date);
    return dayDate.getDate() === now.getDate() && dayDate.getMonth() === now.getMonth();
  });

  if (currentDayIndex === -1) {
    // If not in Ramadan range, check if it's before or after
    const firstDay = parsePrayerTime(imsakiye[0].imsak, imsakiye[0].date);
    if (now < firstDay) {
      return { type: 'Ramadan Starts', time: firstDay, dayData: imsakiye[0] };
    }
    return null; // After Ramadan
  }

  const today = imsakiye[currentDayIndex];
  const imsakToday = parsePrayerTime(today.imsak, today.date);
  const aksamToday = parsePrayerTime(today.aksam, today.date);

  if (now < imsakToday) {
    return { type: 'Sahur', time: imsakToday, dayData: today };
  } else if (now < aksamToday) {
    return { type: 'İftar', time: aksamToday, dayData: today };
  } else {
    // After iftar, next event is tomorrow's imsak
    const tomorrow = imsakiye[currentDayIndex + 1];
    if (tomorrow) {
      return { type: 'Sahur', time: parsePrayerTime(tomorrow.imsak, tomorrow.date), dayData: tomorrow };
    }
    return null; // End of Ramadan
  }
}
