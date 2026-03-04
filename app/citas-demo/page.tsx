"use client"

import { useState } from "react"
import { RefreshCw, Trash2, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { ConfirmModal } from "@/components/confirm-modal"

interface DateIdea {
  id: string
  name: string
  description?: string
  time: string
  money: string
}

const initialDates: DateIdea[] = [
  { id: "1", name: "Picnic en el parque", description: "Llevar mantita, snacks y música", time: "day", money: "low" },
  { id: "2", name: "Cena romántica", description: "Restaurante italiano del centro", time: "night", money: "high" },
  { id: "3", name: "Paseo en bicicleta", description: "Recorrido por la costanera", time: "afternoon", money: "low" },
  { id: "4", name: "Noche de películas", description: "Maratón de películas clásicas", time: "night", money: "low" },
  {
    id: "5",
    name: "Clase de cocina",
    description: "Aprender a hacer sushi juntos",
    time: "afternoon",
    money: "medium",
  },
  {
    id: "6",
    name: "Escape room",
    description: "El de misterio que nos recomendaron",
    time: "afternoon",
    money: "medium",
  },
  { id: "7", name: "Spa día", description: "Masajes y relajación", time: "day", money: "high" },
  { id: "8", name: "Concierto al aire libre", description: "Festival de música indie", time: "night", money: "medium" },
]

export default function CitasDemoPage() {
  const [dates, setDates] = useState<DateIdea[]>(initialDates)
  const [deleteTarget, setDeleteTarget] = useState<DateIdea | null>(null)

  const handleDelete = () => {
    if (!deleteTarget) return
    setDates((prev) => prev.filter((d) => d.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const timeLabels: Record<string, string> = {
    day: "Día",
    afternoon: "Tarde",
    night: "Noche",
    all: "Cualquier momento",
  }

  const moneyLabels: Record<string, string> = {
    low: "Económico",
    medium: "Moderado",
    high: "Premium",
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Citas</h1>
            <p className="mt-1 text-muted-foreground">{dates.length} ideas guardadas</p>
            <p className="text-xs text-primary">(Modo Demo - Sin backend)</p>
          </div>
          <Button variant="outline" onClick={() => setDates(initialDates)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refrescar
          </Button>
        </div>

        {dates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No tenés citas guardadas</p>
              <Button className="mt-4" asChild>
                <a href="/agregar-demo">Agregar primera cita</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dates.map((date) => (
              <Card key={date.id} className="relative overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="mb-2 pr-8 text-lg font-semibold text-card-foreground">{date.name}</h3>
                  {date.description && (
                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{date.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                      <Clock className="h-3 w-3" />
                      {timeLabels[date.time]}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                      <DollarSign className="h-3 w-3" />
                      {moneyLabels[date.money]}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteTarget(date)}
                    aria-label={`Eliminar ${date.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {deleteTarget && (
          <ConfirmModal
            title="Eliminar cita"
            message={`¿Estás seguro de eliminar "${deleteTarget.name}"? Esta acción no se puede deshacer.`}
            confirmText="Eliminar"
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={false}
          />
        )}
      </main>
    </div>
  )
}
