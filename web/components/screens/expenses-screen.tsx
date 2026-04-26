"use client"

import { 
  Wallet,
  UtensilsCrossed,
  Smartphone,
  Package,
  Car,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Store,
  ChevronRight,
  AlertCircle,
  BarChart3
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { categories, userData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type Screen = "home" | "havi" | "recommendations" | "expenses" | "profile" | "transaction" | "heypro"

interface ExpensesScreenProps {
  onNavigate: (screen: Screen) => void
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "UtensilsCrossed": return UtensilsCrossed
    case "Smartphone": return Smartphone
    case "Package": return Package
    case "Car": return Car
    case "MoreHorizontal": return MoreHorizontal
    default: return Wallet
  }
}

const frequentMerchants = [
  { name: "Uber Eats", visits: 12, amount: 1890 },
  { name: "Starbucks", visits: 8, amount: 760 },
  { name: "OXXO", visits: 15, amount: 675 },
  { name: "Amazon", visits: 4, amount: 2340 },
]

const insights = [
  {
    type: "increase",
    title: "Delivery subió 18%",
    description: "Gastaste $450 más que el mes pasado",
    icon: TrendingUp,
  },
  {
    type: "decrease",
    title: "Transporte bajó 12%",
    description: "Ahorraste $280 comparado con marzo",
    icon: TrendingDown,
  },
  {
    type: "alert",
    title: "Compras nocturnas",
    description: "3 compras inusuales después de las 11pm",
    icon: AlertCircle,
  },
]

export function ExpensesScreen({ onNavigate }: ExpensesScreenProps) {
  const totalSpent = categories.reduce((acc, cat) => acc + cat.amount, 0)
  const topCategory = categories[0]

  return (
    <div className="flex flex-col gap-5 px-4 pt-12 pb-4">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Salud Financiera</h1>
            <p className="text-sm text-muted-foreground">Abril 2024</p>
          </div>
        </div>
      </header>

      {/* Total Spent Card */}
      <Card className="border-0 hey-gradient hey-card-shadow overflow-hidden">
        <CardContent className="p-5">
          <p className="text-primary-foreground/80 text-sm font-medium">Total gastado este mes</p>
          <p className="mt-1 text-3xl font-bold text-primary-foreground tracking-tight">
            ${totalSpent.toLocaleString()}
            <span className="text-base font-medium text-primary-foreground/70 ml-1">MXN</span>
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-primary-foreground/10 rounded-full px-3 py-1">
              <TrendingUp className="h-3.5 w-3.5 text-primary-foreground/80" />
              <span className="text-sm text-primary-foreground/90">+8% vs marzo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Category Highlight */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Donde más gastas</p>
                <p className="font-semibold text-foreground">{topCategory.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-foreground">${topCategory.amount.toLocaleString()}</p>
              <p className="text-xs text-primary font-medium">{topCategory.percentage}% del total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <section>
        <h2 className="mb-3 font-semibold text-foreground">Por categoría</h2>
        <Card className="border-border/50">
          <CardContent className="divide-y divide-border p-0">
            {categories.map((category, index) => {
              const Icon = getIcon(category.icon)
              return (
                <div key={index} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.percentage}% del total</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <p className="font-semibold text-foreground w-16 text-right">
                      ${category.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </section>

      {/* Frequent Merchants */}
      <section>
        <h2 className="mb-3 font-semibold text-foreground">Comercios frecuentes</h2>
        <div className="grid grid-cols-2 gap-3">
          {frequentMerchants.map((merchant, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <Store className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-foreground text-sm truncate flex-1">{merchant.name}</p>
                </div>
                <p className="text-lg font-bold text-foreground">${merchant.amount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{merchant.visits} visitas</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Smart Insights */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Insights de HAVI</h2>
          <Badge className="bg-primary text-primary-foreground">
            <Sparkles className="mr-1 h-3 w-3" />
            IA
          </Badge>
        </div>
        <div className="flex flex-col gap-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <Card 
                key={index} 
                className={cn(
                  "border-border/50 cursor-pointer hover:shadow-sm transition-all",
                  insight.type === "increase" && "border-l-4 border-l-destructive",
                  insight.type === "decrease" && "border-l-4 border-l-primary",
                  insight.type === "alert" && "border-l-4 border-l-amber-500"
                )}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    insight.type === "increase" && "bg-destructive/10",
                    insight.type === "decrease" && "bg-primary/10",
                    insight.type === "alert" && "bg-amber-500/10"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5",
                      insight.type === "increase" && "text-destructive",
                      insight.type === "decrease" && "text-primary",
                      insight.type === "alert" && "text-amber-600"
                    )} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{insight.title}</p>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* HAVI Tip */}
      <Card className="border-primary/20 bg-card">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Consejo de HAVI</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Si reduces un 20% tus compras en delivery, podrías ahorrar $580 al mes. Activa una alerta cuando superes tu promedio semanal.
              </p>
              <Button variant="link" className="mt-2 h-auto p-0 text-primary font-medium">
                Activar alerta inteligente
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
