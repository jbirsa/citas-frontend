"use client"

import { X, Clock, DollarSign, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DateIdea } from "@/lib/api"

interface DateModalProps {
  date: DateIdea
  onClose: () => void
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

export function DateModal({ date, onClose }: DateModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-md animate-in fade-in zoom-in rounded-xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onClose} aria-label="Cerrar">
          <X className="h-5 w-5" />
        </Button>

        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h2 className="mb-2 text-center text-2xl font-bold text-card-foreground">{date.name}</h2>

        <p className="mb-6 text-center text-muted-foreground">{date.description || "Sin descripción"}</p>

        <div className="mb-6 flex justify-center gap-4">
          <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
            <Clock className="h-4 w-4" />
            <span>{timeLabels[date.time]}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
            <DollarSign className="h-4 w-4" />
            <span>{moneyLabels[date.money]}</span>
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={onClose}>
          ¡Vamos!
        </Button>
      </div>
    </div>
  )
}
