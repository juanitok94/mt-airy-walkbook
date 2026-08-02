// /src/types/shop.ts

export type WeekdayHours = {
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
  note?: string
}

export type RentalHours = {
  checkIn: string
  checkOut: string
  note?: string
}

export type ShopHours = WeekdayHours | RentalHours

export function isRentalHours(hours: ShopHours): hours is RentalHours {
  return 'checkIn' in hours
}
