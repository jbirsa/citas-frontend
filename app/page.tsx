"use client"

import Link from "next/link"
import { Heart, Sparkles, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/spinner"

export default function HomePage() {
  const { user, token, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        {/* Hero Section */}
        <section className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Salí de la rutina
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {user ? (
              <>
                Para que{" "}
                <span className="text-primary">
                  {user.name} y {user.partner_name}
                </span>{" "}
                planifiquen sus citas
              </>
            ) : (
              <>
                Tu agenda secreta de citas para <span className="text-primary">salir de la zona de comfort</span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Dejá de preguntarte &quot;¿qué hacemos hoy?&quot;. Esta app te ayuda a vos y a tu pareja a descubrir nuevas
            actividades, planificar citas memorables y romper con la monotonía del día a día.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {token ? (
              <>
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/ruleta">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Ver Ruleta
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                  <Link href="/agregar">
                    <Calendar className="mr-2 h-5 w-5" />
                    Agregar cita
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/register">
                    Empezar ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-card-foreground">Ruleta de Ideas</h3>
            <p className="text-sm text-muted-foreground">
              Girá la ruleta y dejá que el destino elija tu próxima aventura juntos.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-card-foreground">Citas Personalizadas</h3>
            <p className="text-sm text-muted-foreground">
              Agregá tus propias ideas según momento del día y presupuesto.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-card-foreground">Para Parejas</h3>
            <p className="text-sm text-muted-foreground">Diseñado para que ambos se sorprendan y disfruten juntos.</p>
          </div>
        </section>
      </main>
    </div>
  )
}
