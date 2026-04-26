"use client"

import { 
  Smartphone,
  Globe,
  Bell,
  Sparkles,
  ChevronRight,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  CreditCard,
  Fingerprint,
  FileText,
  Gift,
  Star
} from "lucide-react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { userData, alerts } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: CreditCard, label: "Mis tarjetas", description: "2 tarjetas activas" },
  { icon: Shield, label: "Seguridad", description: "Autenticación y límites" },
  { icon: Fingerprint, label: "Face ID / Touch ID", description: "Activado" },
  { icon: FileText, label: "Estados de cuenta", description: "Consulta y descarga" },
  { icon: Gift, label: "Invita y gana", description: "Comparte Hey con amigos" },
  { icon: HelpCircle, label: "Ayuda", description: "Centro de ayuda" },
]

export function ProfileScreen() {
  const [alertsState, setAlertsState] = useState(alerts)
  const [haviEnabled, setHaviEnabled] = useState(true)

  const toggleAlert = (index: number) => {
    setAlertsState((prev) =>
      prev.map((alert, i) =>
        i === index ? { ...alert, enabled: !alert.enabled } : alert
      )
    )
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-12 pb-4">
      {/* Header - User Profile */}
      <header className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
          {userData.name[0]}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">{userData.name}</h1>
          <p className="text-sm text-muted-foreground">{userData.city}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-0">
              <Star className="mr-1 h-3 w-3" />
              Fan Hey
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>
      </header>

      {/* Account Summary */}
      <Card className="border-primary/20 hey-gradient hey-card-shadow overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-primary-foreground">
            <div>
              <p className="text-sm text-primary-foreground/80">Cuenta Hey</p>
              <p className="text-lg font-bold">•••• •••• •••• 4521</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-foreground/80">CLABE</p>
              <p className="font-medium">•••• 7890</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HAVI Preferences */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Asesor HAVI</p>
                <p className="text-sm text-muted-foreground">
                  Recomendaciones con IA
                </p>
              </div>
            </div>
            <Switch
              checked={haviEnabled}
              onCheckedChange={setHaviEnabled}
            />
          </div>
          {haviEnabled && (
            <p className="mt-3 text-xs text-muted-foreground bg-secondary/50 rounded-lg p-2">
              HAVI analiza tus movimientos para darte consejos personalizados sin tiempos de espera.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Notificaciones</h2>
          <Badge variant="secondary" className="text-xs">
            {alertsState.filter((a) => a.enabled).length} activas
          </Badge>
        </div>
        <Card className="border-border/50">
          <CardContent className="divide-y divide-border p-0">
            {alertsState.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    alert.enabled ? "bg-primary/10" : "bg-secondary"
                  )}>
                    <Bell className={cn(
                      "h-4 w-4",
                      alert.enabled ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <p className="font-medium text-foreground text-sm">{alert.name}</p>
                </div>
                <Switch
                  checked={alert.enabled}
                  onCheckedChange={() => toggleAlert(index)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Menu Items */}
      <section>
        <h2 className="mb-3 font-semibold text-foreground">Mi cuenta</h2>
        <Card className="border-border/50">
          <CardContent className="divide-y divide-border p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  className="flex w-full items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              )
            })}
          </CardContent>
        </Card>
      </section>

      {/* App Settings */}
      <section>
        <h2 className="mb-3 font-semibold text-foreground">Preferencias</h2>
        <Card className="border-border/50">
          <CardContent className="divide-y divide-border p-0">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Canal preferido</p>
                  <p className="text-xs text-muted-foreground">{userData.preferredChannel}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Idioma</p>
                  <p className="text-xs text-muted-foreground">{userData.language}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Logout */}
      <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30">
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar sesión
      </Button>

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground">
        Hey Banco v4.2.1 - El banco 100% digital
      </p>
    </div>
  )
}
