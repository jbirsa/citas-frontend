"use client"

import { useState, useRef, useMemo } from "react"
import { useTheme } from "@/contexts/theme-context"
import type { DateIdea } from "@/lib/api"

interface RouletteWheelProps {
  items: DateIdea[]
  onFinish: (item: DateIdea) => void
}

const THEME_COLORS = {
  light: ["#A07761", "#8E6E58", "#A47864", "#C8A48A", "#E0BFA2", "#F2D9C3", "#FAEADC"],
  dark: ["#696E71", "#B2B6BA", "#D2D5D8", "#E1E2E4", "#F8F9FB"],
  pink: ["#5F84A2", "#91AEC4", "#B7D0E1", "#DBECF4"],
}

function generateNonContiguousColors(itemCount: number, palette: string[]): string[] {
  if (itemCount === 0) return []
  if (itemCount === 1) return [palette[0]]

  const result: string[] = []

  for (let i = 0; i < itemCount; i++) {
    // Filter out the previous color to avoid contiguous same colors
    const previousColor = i > 0 ? result[i - 1] : null
    // Also check last color if we're at the end (for circular continuity)
    const lastColorCheck = i === itemCount - 1 ? result[0] : null

    let availableColors = palette.filter((c) => c !== previousColor)

    // If last segment, also exclude the first segment's color
    if (lastColorCheck && itemCount > 2) {
      availableColors = availableColors.filter((c) => c !== lastColorCheck)
    }

    // If no colors available (edge case), use any from palette
    if (availableColors.length === 0) {
      availableColors = palette
    }

    // Pick random from available
    const randomIndex = Math.floor(Math.random() * availableColors.length)
    result.push(availableColors[randomIndex])
  }

  return result
}

export function RouletteWheel({ items, onFinish }: RouletteWheelProps) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const wheelRef = useRef<SVGSVGElement>(null)
  const { theme } = useTheme()

  const palette = THEME_COLORS[theme]

  const segmentColors = useMemo(() => {
    return generateNonContiguousColors(items.length, palette)
  }, [items.length, palette])

  if (items.length === 0) {
    return (
      <div className="flex h-80 w-80 items-center justify-center rounded-full border-4 border-dashed border-border">
        <p className="text-center text-muted-foreground">No hay citas disponibles</p>
      </div>
    )
  }

  const segmentAngle = 360 / items.length

  const spin = () => {
    if (spinning) return

    setSpinning(true)
    const winnerIndex = Math.floor(Math.random() * items.length)

    const baseRotation = rotation + 360 * 5
    const targetAngle = 360 - (winnerIndex * segmentAngle + segmentAngle / 2)
    const finalRotation = baseRotation + targetAngle

    setRotation(finalRotation)

    setTimeout(() => {
      setSpinning(false)
      onFinish(items[winnerIndex])
    }, 3000)
  }

  const createSegmentPath = (index: number) => {
    const startAngle = index * segmentAngle - 90
    const endAngle = startAngle + segmentAngle
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = 150 + 140 * Math.cos(startRad)
    const y1 = 150 + 140 * Math.sin(startRad)
    const x2 = 150 + 140 * Math.cos(endRad)
    const y2 = 150 + 140 * Math.sin(endRad)

    const largeArc = segmentAngle > 180 ? 1 : 0

    return `M 150 150 L ${x1} ${y1} A 140 140 0 ${largeArc} 1 ${x2} ${y2} Z`
  }

  const getTextPosition = (index: number) => {
    const angle = (index * segmentAngle + segmentAngle / 2 - 90) * (Math.PI / 180)
    return {
      x: 150 + 85 * Math.cos(angle),
      y: 150 + 85 * Math.sin(angle),
      rotation: index * segmentAngle + segmentAngle / 2,
    }
  }

  const textColor = theme === "dark" ? "#1a1a1a" : theme === "light" ? "#4a4a4a" : "#1a1a1a"

  return (
    <div className="relative">
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-2">
        <div className="h-0 w-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-primary" />
      </div>

      <svg
        ref={wheelRef}
        viewBox="0 0 300 300"
        className="h-72 w-72 md:h-80 md:w-80"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
        }}
      >
        {items.map((item, index) => {
          const textPos = getTextPosition(index)
          const truncatedName = item.name.length > 12 ? item.name.slice(0, 10) + "..." : item.name
          const isSingleItem = items.length === 1

          return (
            <g key={item.id}>
              {isSingleItem ? (
                <circle cx="150" cy="150" r="140" fill={segmentColors[index]} stroke="#fff" strokeWidth="2" />
              ) : (
                <path d={createSegmentPath(index)} fill={segmentColors[index]} stroke="#fff" strokeWidth="2" />
              )}
              <text
                x={textPos.x}
                y={textPos.y}
                fill={textColor}
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
              >
                {truncatedName}
              </text>
            </g>
          )
        })}
        <circle cx="150" cy="150" r="20" fill="#fff" stroke="#ddd" strokeWidth="2" />
      </svg>

      <button
        onClick={spin}
        disabled={spinning || items.length === 0}
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
      >
        {spinning ? "..." : "GIRAR"}
      </button>
    </div>
  )
}
