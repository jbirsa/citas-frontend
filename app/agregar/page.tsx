"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { CheckCircle, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"
import { Spinner } from "@/components/spinner"
import { useAuth } from "@/contexts/auth-context"
import { createDate, fetchDates, type DateIdea, type MoneyLevel, type TimeOfDay } from "@/lib/api"

export default function AgregarPage() {
  return (
    <ProtectedRoute>
      <AgregarContent />
    </ProtectedRoute>
  )
}

function AgregarContent() {
  const { token } = useAuth()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [time, setTime] = useState<TimeOfDay | "all" | "">("")
  const [money, setMoney] = useState<MoneyLevel | "">("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentDates, setRecentDates] = useState<DateIdea[]>([])
  const [totalCount, setTotalCount] = useState(0)

  const loadRecentDates = useCallback(async () => {
    if (!token) return
    try {
      const dates = await fetchDates(token)
      setTotalCount(dates.length)
      setRecentDates(dates.slice(-3).reverse())
    } catch {
      // Silently fail for recent dates
    }
  }, [token])

  useEffect(() => {
    loadRecentDates()
  }, [loadRecentDates])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !name.trim() || !time || !money) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await createDate(token, { name: name.trim(), description: description.trim(), time, money })
      setSuccess(true)
      setName("")
      setDescription("")
      setTime("")
      setMoney("")
      loadRecentDates()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cita")
    } finally {
      setLoading(false)
    }
  }

  const timeLabels: Record<string, string> = {
    Day: "Día",
    Afternoon: "Tarde",
    Night: "Noche",
    all: "Cualquier momento",
  }

  const moneyLabels: Record<string, string> = {
    Low: "Bajo",
    Medium: "Medio",
    High: "Alto",
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Agregar Cita</h1>
          <p className="mt-2 text-muted-foreground">Sumá nuevas ideas para sorprender a tu pareja</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Nueva Idea</CardTitle>
              <CardDescription>Completá los datos de tu cita</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                {success && (
                  <div className="flex items-center gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    ¡Cita agregada correctamente!
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Picnic en el parque"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describí la cita..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Momento del día *</Label>
                  <Select value={time} onValueChange={(value) => setTime(value as TimeOfDay | "all")} required>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Day">Día</SelectItem>
                      <SelectItem value="Afternoon">Tarde</SelectItem>
                      <SelectItem value="Night">Noche</SelectItem>
                      <SelectItem value="all">Cualquier momento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="money">Presupuesto *</Label>
                  <Select value={money} onValueChange={(value) => setMoney(value as MoneyLevel)} required>
                    <SelectTrigger id="money">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Bajo</SelectItem>
                      <SelectItem value="Medium">Medio</SelectItem>
                      <SelectItem value="High">Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading || !name.trim() || !time || !money}>
                  {loading ? <Spinner className="h-5 w-5" /> : "Agregar Cita"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent dates */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{totalCount}</p>
                <p className="text-sm text-muted-foreground">citas cargadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Últimas citas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentDates.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay citas aún</p>
                ) : (
                  recentDates.map((date) => (
                    <div key={date.id} className="rounded-lg border border-border p-3">
                      <p className="font-medium text-card-foreground">{date.name}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {timeLabels[date.time]}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <DollarSign className="h-3 w-3" />
                          {moneyLabels[date.money]}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
