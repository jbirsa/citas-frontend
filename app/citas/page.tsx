"use client"

import { useState, useEffect, useCallback } from "react"
import { RefreshCw, Trash2, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { ConfirmModal } from "@/components/confirm-modal"
import { Spinner } from "@/components/spinner"
import { useAuth } from "@/contexts/auth-context"
import { fetchDates, deleteDate, type DateIdea } from "@/lib/api"

export default function CitasPage() {
  return (
    <ProtectedRoute>
      <CitasContent />
    </ProtectedRoute>
  )
}

function CitasContent() {
  const { token } = useAuth()
  const [dates, setDates] = useState<DateIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DateIdea | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadDates = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchDates(token)
      setDates(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las citas")
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadDates()
  }, [loadDates])

  const handleDelete = async () => {
    if (!token || !deleteTarget) return
    setDeleting(true)
    try {
      await deleteDate(token, deleteTarget.id)
      setDates((prev) => prev.filter((d) => d.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar")
    } finally {
      setDeleting(false)
    }
  }

  const timeLabels: Record<string, string> = {
    Day: "Día",
    Afternoon: "Tarde",
    Night: "Noche",
    all: "Cualquier momento",
  }

  const moneyLabels: Record<string, string> = {
    Low: "Económico",
    Medium: "Moderado",
    High: "Premium",
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Citas</h1>
            <p className="mt-1 text-muted-foreground">{dates.length} ideas guardadas</p>
          </div>
          <Button variant="outline" onClick={loadDates} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refrescar
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-center text-destructive">
            <p>{error}</p>
            <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={loadDates}>
              Reintentar
            </Button>
          </div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner />
          </div>
        ) : dates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No tenés citas guardadas</p>
              <Button className="mt-4" asChild>
                <a href="/agregar">Agregar primera cita</a>
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

        {/* Delete confirmation modal */}
        {deleteTarget && (
          <ConfirmModal
            title="Eliminar cita"
            message={`¿Estás seguro de eliminar "${deleteTarget.name}"? Esta acción no se puede deshacer.`}
            confirmText="Eliminar"
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleting}
          />
        )}
      </main>
    </div>
  )
}
