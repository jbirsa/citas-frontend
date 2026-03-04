"use client"

import { Sun, Moon, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="relative"
      aria-label={`Tema actual: ${theme}. Click para cambiar.`}
    >
      {theme === "light" && <Sun className="h-5 w-5" />}
      {theme === "dark" && <Moon className="h-5 w-5" />}
      {theme === "pink" && <Heart className="h-5 w-5 text-pink-500" />}
    </Button>
  )
}
