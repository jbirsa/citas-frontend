export const API_BASE = "https://citas-backend-ohpp.onrender.com"
//export const API_BASE = "http://localhost:3000"

export type MoneyLevel = "Low" | "Medium" | "High"
export type TimeOfDay = "Day" | "Afternoon" | "Night"

export interface DateIdea {
  id: number
  name: string
  description: string
  time: TimeOfDay | "all"
  money: MoneyLevel
}

type RawDateIdea = Omit<DateIdea, "time" | "money"> & {
  time: string
  money: string
}

const normalizeMoney = (value: string): MoneyLevel => {
  const normalized = value?.toLowerCase()

  switch (normalized) {
    case "high":
      return "High"
    case "medium":
      return "Medium"
    default:
      return "Low"
  }
}

const normalizeTime = (value: string): DateIdea["time"] => {
  const normalized = value?.toLowerCase()

  switch (normalized) {
    case "day":
      return "Day"
    case "afternoon":
      return "Afternoon"
    case "night":
      return "Night"
    case "all":
      return "all"
    default:
      return "Day"
  }
}

const normalizeDateIdea = (date: RawDateIdea): DateIdea => ({
  ...date,
  money: normalizeMoney(date.money),
  time: normalizeTime(date.time),
})

export async function fetchDates(token: string): Promise<DateIdea[]> {
  const res = await fetch(`${API_BASE}/dates`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Error al cargar las citas")
  const data: RawDateIdea[] = await res.json()
  return data.map(normalizeDateIdea)
}

export async function fetchDatesByPrice(token: string, price: MoneyLevel): Promise<DateIdea[]> {
  const res = await fetch(`${API_BASE}/dates/price/${price}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Error al filtrar por precio")
  const data: RawDateIdea[] = await res.json()
  return data.map(normalizeDateIdea)
}

export async function fetchDatesByTime(token: string, time: TimeOfDay): Promise<DateIdea[]> {
  const res = await fetch(`${API_BASE}/dates/time/${time}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Error al filtrar por momento")
  const data: RawDateIdea[] = await res.json()
  return data.map(normalizeDateIdea)
}

export async function fetchDatesByPriceAndTime(
  token: string,
  price: MoneyLevel,
  time: TimeOfDay,
): Promise<DateIdea[]> {
  const res = await fetch(`${API_BASE}/dates/${price}/${time}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Error al filtrar")
  const data: RawDateIdea[] = await res.json()
  return data.map(normalizeDateIdea)
}

export async function createDate(
  token: string,
  payload: { name: string; description: string; time: TimeOfDay | "all"; money: MoneyLevel },
): Promise<DateIdea> {
  const res = await fetch(`${API_BASE}/dates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Error al crear la cita")
  const response: RawDateIdea = await res.json()
  return normalizeDateIdea(response)
}

export async function deleteDate(token: string, id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/dates/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Error al eliminar la cita")
}
