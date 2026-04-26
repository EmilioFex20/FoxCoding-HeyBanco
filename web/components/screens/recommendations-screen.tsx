"use client"

import { 
  Sparkles, 
  TrendingUp, 
  Bell, 
  PiggyBank, 
  AlertTriangle,
  ChevronRight,
  X,
  Lightbulb,
  Shield,
  Percent
} from "lucide-react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { recommendations, userData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type Screen = "home" | "havi" | "recommendations" | "expenses" | "profile" | "transaction" | "heypro"

interface RecommendationsScreenProps {
  onNavigate: (screen: Screen) => void
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Sparkles": return Sparkles
    case "TrendingUp": return TrendingUp
    case "Bell": return Bell
    case "PiggyBank": return PiggyBank
    case "AlertTriangle": return AlertTriangle
    default: return Lightbulb
  }
}

const getTypeStyles = (type: string) => {
  switch (type) {
    case "upgrade":
      return {
        bg: "bg-primary/10",
        border: "border-l-4 border-l-primary",
        icon: "text-primary",
        badge: "bg-primary text-primary-foreground",
      }
    case "insight":
      return {
        bg: "bg-blue-500/10",
        border: "border-l-4 border-l-blue-500",
        icon: "text-blue-600",
        badge: "bg-blue-500/10 text-blue-600",
      }
    case "alert":
      return {
        bg: "bg-amber-500/10",
        border: "border-l-4 border-l-amber-500",
        icon: "text-amber-600",
        badge: "bg-amber-500/10 text-amber-600",
      }
    case "saving":
      return {
        bg: "bg-primary/10",
        border: "border-l-4 border-l-primary",
        icon: "text-primary",
        badge: "bg-primary/10 text-primary",
      }
    case "warning":
      return {
        bg: "bg-destructive/10",
        border: "border-l-4 border-l-destructive",
        icon: "text-destructive",
        badge: "bg-destructive/10 text-destructive",
      }
    default:
      return {
        bg: "bg-secondary",
        border: "border-border",
        icon: "text-muted-foreground",
        badge: "bg-secondary text-secondary-foreground",
      }
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case "upgrade": return "Mejora tu cuenta"
    case "insight": return "Análisis"
    case "alert": return "Recordatorio"
    case "saving": return "Oportunidad"
    case "warning": return "Importante"
    default: return "Info"
  }
}

export function RecommendationsScreen({ onNavigate }: RecommendationsScreenProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([])

  const visibleRecommendations = recommendations.filter(
    (rec) => !dismissedIds.includes(rec.id)
  )

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id])
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-12 pb-4">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Hola, {userData.name}</h1>
            <p className="text-sm text-muted-foreground">HAVI tiene recomendaciones para ti</p>
          </div>
        </div>
      </header>

      {/* Summary Card */}
      <Card className="border-0 hey-gradient hey-card-shadow overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-primary-foreground">
            <div>
              <p className="text-sm text-primary-foreground/80">Oportunidades encontradas</p>
              <p className="text-3xl font-bold">{visibleRecommendations.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20">
              <Lightbulb className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Basado en tu actividad de los últimos 30 días
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <Percent className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">4%</p>
            <p className="text-xs text-muted-foreground">Rendimiento</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <PiggyBank className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">$580</p>
            <p className="text-xs text-muted-foreground">Puedes ahorrar</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-3 text-center">
            <Shield className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">2</p>
            <p className="text-xs text-muted-foreground">Alertas activas</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations Feed */}
      <section>
        <h2 className="mb-3 font-semibold text-foreground">Recomendaciones personalizadas</h2>
        <div className="flex flex-col gap-3">
          {visibleRecommendations.map((rec) => {
            const Icon = getIcon(rec.icon)
            const styles = getTypeStyles(rec.type)
            
            return (
              <Card 
                key={rec.id} 
                className={cn(
                  "relative overflow-hidden transition-all duration-300 border-border/50",
                  styles.border
                )}
              >
                <button
                  onClick={() => handleDismiss(rec.id)}
                  className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors z-10"
                >
                  <X className="h-4 w-4" />
                </button>
                
                <CardContent className="p-4 pr-10">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      styles.bg
                    )}>
                      <Icon className={cn("h-5 w-5", styles.icon)} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Badge variant="secondary" className={cn("text-xs px-2 py-0 mb-2", styles.badge)}>
                        {getTypeLabel(rec.type)}
                      </Badge>
                      
                      <h3 className="font-semibold text-foreground text-balance leading-tight">{rec.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {rec.description}
                      </p>
                      
                      <p className="mt-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg px-2 py-1.5 inline-block">
                        {rec.reason}
                      </p>
                      
                      <Button 
                        size="sm" 
                        className="mt-3 bg-primary hover:bg-primary/90"
                        onClick={() => {
                          if (rec.type === "upgrade") {
                            onNavigate("heypro")
                          }
                        }}
                      >
                        {rec.action}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {visibleRecommendations.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-lg">Todo al día</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Revisaste todas las recomendaciones. HAVI te notificará cuando tenga algo nuevo para ti.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
