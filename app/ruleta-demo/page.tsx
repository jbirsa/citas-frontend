"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { RouletteWheel } from "@/components/roulette-wheel"
import { DateModal } from "@/components/date-modal"
import type { DateIdea, MoneyLevel, TimeOfDay } from "@/lib/api"

// Demo data
const DEMO_DATES: DateIdea[] = [
  {
    id: 1,
    name: "Picnic en el parque",
    description: "Preparar comida casera y disfrutar al aire libre",
    money: "Low",
    time: "Day",
  },
  {
    id: 2,
    name: "Cena romántica",
    description: "Restaurante italiano con velas y vino",
    money: "High",
    time: "Night",
  },
  {
    id: 3,
    name: "Tarde de cine",
    description: "Película en el cine con palomitas",
    money: "Medium",
    time: "Afternoon",
  },
  { id: 4, name: "Paseo en bici", description: "Recorrer la ciudad en bicicleta", money: "Low", time: "Day" },
  {
    id: 5,
    name: "Cocinar juntos",
    description: "Preparar una receta nueva en casa",
    money: "Low",
    time: "Night",
  },
  {
    id: 6,
    name: "Spa casero",
    description: "Masajes, mascarillas y relajación",
    money: "Low",
    time: "Afternoon",
  },
  { id: 7, name: "Karaoke", description: "Noche de karaoke y risas", money: "Medium", time: "Night" },
  { id: 8, name: "Museo", description: "Visitar una exposición de arte", money: "Medium", time: "Afternoon" },
]

export default function RuletaDemoPage() {
  const [dates, setDates] = useState<DateIdea[]>(DEMO_DATES)
  const [priceFilter, setPriceFilter] = useState<"all" | MoneyLevel>("all")
  const [timeFilter, setTimeFilter] = useState<"all" | TimeOfDay>("all")
  const [selectedDate, setSelectedDate] = useState<DateIdea | null>(null)

  const filterDates = () => {
    let filtered = DEMO_DATES
    if (priceFilter !== "all") {
      filtered = filtered.filter((d) => d.money === priceFilter)
    }
    if (timeFilter !== "all") {
      filtered = filtered.filter((d) => d.time === timeFilter)
    }
    setDates(filtered)
  }

  const handlePriceChange = (value: string) => {
    setPriceFilter(value as "all" | MoneyLevel)
    let filtered = DEMO_DATES
    if (value !== "all") {
      filtered = filtered.filter((d) => d.money === value)
    }
    if (timeFilter !== "all") {
      filtered = filtered.filter((d) => d.time === timeFilter)
    }
    setDates(filtered)
  }

  const handleTimeChange = (value: string) => {
    setTimeFilter(value as "all" | TimeOfDay)
    let filtered = DEMO_DATES
    if (priceFilter !== "all") {
      filtered = filtered.filter((d) => d.money === priceFilter)
    }
    if (value !== "all") {
      filtered = filtered.filter((d) => d.time === value)
    }
    setDates(filtered)
  }

  const handleRouletteFinish = (date: DateIdea) => {
    setSelectedDate(date)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-2 text-center">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">DEMO</span>
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Ruleta de Citas</h1>
          <p className="mt-2 text-muted-foreground">
            Para que <span className="font-medium text-primary">Usuario</span> y{" "}
            <span className="font-medium text-primary">Pareja</span> se sorprendan
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Presupuesto:</span>
            <Select value={priceFilter} onValueChange={handlePriceChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Low">Bajo</SelectItem>
                <SelectItem value="Medium">Medio</SelectItem>
                <SelectItem value="High">Alto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Momento:</span>
            <Select value={timeFilter} onValueChange={handleTimeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Day">Día</SelectItem>
                <SelectItem value="Afternoon">Tarde</SelectItem>
                <SelectItem value="Night">Noche</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm" onClick={filterDates}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>

        {/* Roulette */}
        <div className="flex flex-col items-center">
          <RouletteWheel items={dates} onFinish={handleRouletteFinish} />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {dates.length > 0 ? `${dates.length} ideas disponibles` : "No hay citas con estos filtros"}
          </p>
        </div>

        {/* Modal */}
        {selectedDate && <DateModal date={selectedDate} onClose={() => setSelectedDate(null)} />}
      </main>
    </div>
  )
}
