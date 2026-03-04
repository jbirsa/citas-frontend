"use client"

import { useState, useEffect, useCallback } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { RouletteWheel } from "@/components/roulette-wheel"
import { DateModal } from "@/components/date-modal"
import { Spinner } from "@/components/spinner"
import { useAuth } from "@/contexts/auth-context"
import {
  fetchDates,
  fetchDatesByPrice,
  fetchDatesByTime,
  fetchDatesByPriceAndTime,
  type DateIdea,
  type MoneyLevel,
  type TimeOfDay,
} from "@/lib/api"

export default function RuletaPage() {
  return (
    <ProtectedRoute>
      <RuletaContent />
    </ProtectedRoute>
  )
}

function RuletaContent() {
  const { user, token } = useAuth()
  const [dates, setDates] = useState<DateIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [priceFilter, setPriceFilter] = useState<"all" | MoneyLevel>("all")
  const [timeFilter, setTimeFilter] = useState<"all" | TimeOfDay>("all")
  const [selectedDate, setSelectedDate] = useState<DateIdea | null>(null)

  const loadDates = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      let data: DateIdea[]
      if (priceFilter !== "all" && timeFilter !== "all") {
        data = await fetchDatesByPriceAndTime(token, priceFilter, timeFilter)
      } else if (priceFilter !== "all") {
        data = await fetchDatesByPrice(token, priceFilter)
      } else if (timeFilter !== "all") {
        data = await fetchDatesByTime(token, timeFilter)
      } else {
        data = await fetchDates(token)
      }
      setDates(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las citas")
    } finally {
      setLoading(false)
    }
  }, [token, priceFilter, timeFilter])

  useEffect(() => {
    loadDates()
  }, [loadDates])

  const handleRouletteFinish = (date: DateIdea) => {
    setSelectedDate(date)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Ruleta de Citas</h1>
          {user && (
            <p className="mt-2 text-muted-foreground">
              Para que <span className="font-medium text-primary">{user.name}</span> y{" "}
              <span className="font-medium text-primary">{user.partner_name}</span> se sorprendan
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Presupuesto:</span>
            <Select value={priceFilter} onValueChange={(value) => setPriceFilter(value as "all" | MoneyLevel)}>
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
            <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as "all" | TimeOfDay)}>
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

          <Button variant="outline" size="sm" onClick={loadDates} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>

        {/* Roulette */}
        <div className="flex flex-col items-center">
          {loading ? (
            <div className="flex h-80 items-center justify-center">
              <Spinner />
            </div>
          ) : error ? (
            <div className="rounded-lg bg-destructive/10 p-4 text-center text-destructive">
              <p>{error}</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={loadDates}>
                Reintentar
              </Button>
            </div>
          ) : (
            <RouletteWheel items={dates} onFinish={handleRouletteFinish} />
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {dates.length > 0 ? `${dates.length} ideas disponibles` : "Agregá citas para girar la ruleta"}
          </p>
        </div>

        {/* Modal */}
        {selectedDate && <DateModal date={selectedDate} onClose={() => setSelectedDate(null)} />}
      </main>
    </div>
  )
}
