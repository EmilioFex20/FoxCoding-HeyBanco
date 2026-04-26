"use client"

import { 
  ChevronLeft,
  Sparkles,
  Check,
  Crown,
  UtensilsCrossed,
  Smartphone,
  Package,
  Zap,
  Gift
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { heyProBenefits, categories } from "@/lib/mock-data"

interface HeyProScreenProps {
  onBack: () => void
}

const benefits = [
  { text: "3% cashback en restaurantes", icon: UtensilsCrossed },
  { text: "2% cashback en servicios digitales", icon: Smartphone },
  { text: "1.5% cashback en delivery", icon: Package },
  { text: "Sin comisiones en transferencias", icon: Zap },
  { text: "Retiros gratis en cualquier cajero", icon: Gift },
  { text: "Atención prioritaria con HAVI", icon: Sparkles },
]

export function HeyProScreen({ onBack }: HeyProScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card px-4 py-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <h1 className="font-bold text-foreground">Hey Pro</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 py-6">
        <div className="flex flex-col gap-5">
          {/* Hero Card */}
          <Card className="overflow-hidden border-0 hey-gradient hey-card-shadow">
            <CardContent className="p-5">
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 mb-3">
                Recomendado para ti
              </Badge>
              <h2 className="text-2xl font-bold text-primary-foreground text-balance leading-tight">
                Haz más con tu dinero
              </h2>
              <p className="mt-2 text-primary-foreground/80 text-sm leading-relaxed">
                HAVI analizó tus hábitos y Hey Pro es perfecto para tu estilo de vida.
              </p>
            </CardContent>
          </Card>

          {/* Personalized Estimate */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tu cashback estimado</p>
                  <p className="text-2xl font-bold text-primary">
                    ${heyProBenefits.estimatedCashback}
                    <span className="text-sm font-medium text-muted-foreground ml-1">MXN/mes</span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-2">
                Calculado en base a tus gastos de los últimos 3 meses
              </p>
            </CardContent>
          </Card>

          {/* Personalized Breakdown */}
          <section>
            <h2 className="mb-3 font-semibold text-foreground">Donde más aprovecharías</h2>
            <Card className="border-border/50">
              <CardContent className="divide-y divide-border p-0">
                {heyProBenefits.categories.map((category, index) => {
                  const icons = [UtensilsCrossed, Smartphone, Package]
                  const Icon = icons[index]
                  const originalCategory = categories.find(c => c.name === category.name)
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{category.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${originalCategory?.amount.toLocaleString()} gastados/mes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">+${category.cashback}</p>
                        <p className="text-xs text-muted-foreground">{category.percentage}% cashback</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </section>

          {/* Benefits List */}
          <section>
            <h2 className="mb-3 font-semibold text-foreground">Todos los beneficios</h2>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon
                    return (
                      <li key={index} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-foreground">{benefit.text}</span>
                        <Check className="h-4 w-4 text-primary ml-auto" />
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* ROI Card */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2">Tu retorno estimado</h3>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="text-center p-3 bg-card rounded-xl">
                  <p className="text-2xl font-bold text-primary">${heyProBenefits.estimatedCashback - 99}</p>
                  <p className="text-xs text-muted-foreground">Ganancia mensual</p>
                </div>
                <div className="text-center p-3 bg-card rounded-xl">
                  <p className="text-2xl font-bold text-primary">${(heyProBenefits.estimatedCashback - 99) * 12}</p>
                  <p className="text-xs text-muted-foreground">Ganancia anual</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Precio mensual</p>
              <p className="text-3xl font-bold text-foreground tracking-tight">
                $99
                <span className="text-base font-medium text-muted-foreground ml-1">MXN</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="sticky bottom-20 border-t border-border bg-card p-4">
        <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
          <Crown className="mr-2 h-5 w-5" />
          Activar Hey Pro
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Sin permanencia. Cancela cuando quieras.
        </p>
      </div>
    </div>
  )
}
