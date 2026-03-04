"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"

interface DateIdea {
  id: string
  name: string
  description?: string
  time: string
  money: string
}

export default function AgregarDemoPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [time, setTime] = useState<string>("")
  const [money, setMoney] = useState<string>("")
  const [success, setSuccess] = useState(false)
  const [recentDates, setRecentDates] = useState<DateIdea[]>([
    { id: "1", name: "Picnic en el parque", time: "day", money: "low" },
    { id: "2", name: "Cena romántica", time: "night", money: "high" },
    { id: "3", name: "Paseo en bicicleta", time: "afternoon", money: "low" },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !time || !money) return

    const newDate: DateIdea = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      time,
      money,
    }

    setRecentDates((prev) => [newDate, ...prev].slice(0, 3))
    setSuccess(true)
    setName("")
    setDescription("")
    setTime("")
    setMoney("")
    setTimeout(() => setSuccess(false), 3000)
  }

  const timeLabels: Record<string, string> = {
    day: "Día",
    afternoon: "Tarde",
    night: "Noche",
    all: "Cualquier momento",
  }

  const moneyLabels: Record<string, string> = {
    low: "Bajo",
    medium: "Medio",
    high: "Alto",
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Agregar Cita</h1>
          <p className="mt-2 text-muted-foreground">Sumá nuevas ideas para sorprender a tu pareja</p>
          <p className="mt-1 text-xs text-primary">(Modo Demo - Sin backend)</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Nueva Idea</CardTitle>
              <CardDescription>Completá los datos de tu cita</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {success && (
                  <div className="flex items-center gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Cita agregada correctamente!
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
                  <Select value={time} onValueChange={setTime} required>
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Día</SelectItem>
                      <SelectItem value="afternoon">Tarde</SelectItem>
                      <SelectItem value="night">Noche</SelectItem>
                      <SelectItem value="all">Cualquier momento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="money">Presupuesto *</Label>
                  <Select value={money} onValueChange={setMoney} required>
                    <SelectTrigger id="money">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Bajo</SelectItem>
                      <SelectItem value="medium">Medio</SelectItem>
                      <SelectItem value="high">Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={!name.trim() || !time || !money}>
                  Agregar Cita
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{recentDates.length + 5}</p>
                <p className="text-sm text-muted-foreground">citas cargadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Últimas citas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentDates.map((date) => (
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
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
