"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Heart, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const { token, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAuthPage = pathname === "/login" || pathname === "/register"

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navLinks = [
    { href: "/ruleta", label: "Ruleta" },
    { href: "/agregar", label: "Agregar" },
    { href: "/citas", label: "Mis Citas" },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Heart className="h-6 w-6 fill-primary" />
          <span>Citas</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          {token &&
            !isAuthPage &&
            navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!isAuthPage && (
            <>
              {token ? (
                <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex">
                  <LogOut className="mr-2 h-4 w-4" />
                  Salir
                </Button>
              ) : (
                <div className="hidden gap-2 md:flex">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Ingresar</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Registrarse</Link>
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {token ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-medium ${pathname === link.href ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-muted-foreground"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-primary"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
