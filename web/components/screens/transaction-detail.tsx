"use client"

import { 
  XCircle,
  AlertTriangle,
  Settings,
  RefreshCw,
  MessageCircle,
  ChevronLeft,
  Sparkles,
  Clock
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { failedTransaction } from "@/lib/mock-data"

type Screen = "home" | "havi" | "recommendations" | "expenses" | "profile" | "transaction" | "heypro"

interface TransactionDetailProps {
  onNavigate: (screen: Screen) => void
}

export function TransactionDetail({ onNavigate }: TransactionDetailProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card px-4 py-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate("home")}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="font-semibold text-foreground">Detalle de movimiento</h1>
        </div>
      </header>

      <div className="flex-1 px-4 py-6">
        <div className="flex flex-col items-center gap-5">
          {/* Failed Icon */}
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <Badge variant="destructive" className="mb-3 px-3">
              Rechazado
            </Badge>
            <h2 className="text-xl font-bold text-foreground">{failedTransaction.merchant}</h2>
            <p className="text-3xl font-bold text-foreground mt-2 tracking-tight">
              -${failedTransaction.amount}
              <span className="text-base font-medium text-muted-foreground ml-1">MXN</span>
            </p>
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{failedTransaction.date}</span>
            </div>
          </div>

          {/* Reason Card */}
          <Card className="w-full border-destructive/30 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Motivo del rechazo</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {failedTransaction.reason}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HAVI Explanation */}
          <Card className="w-full border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">HAVI te explica</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {failedTransaction.suggestion}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limit Details */}
          <Card className="w-full border-border/50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Detalle del límite</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Límite diario</span>
                  <span className="font-semibold text-foreground">${failedTransaction.dailyLimit.toLocaleString()} MXN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gastado ese día</span>
                  <span className="font-semibold text-destructive">${failedTransaction.dailySpent.toLocaleString()} MXN</span>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Uso del límite</span>
                    <span className="text-destructive font-medium">102%</span>
                  </div>
                  <div className="h-3 rounded-full bg-secondary overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-destructive transition-all duration-500"
                      style={{ width: `100%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-destructive/5 rounded-lg p-3 mt-2">
                  <p className="text-sm text-destructive text-center font-medium">
                    Excediste tu límite por ${(failedTransaction.dailySpent - failedTransaction.dailyLimit).toLocaleString()} MXN
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-20 border-t border-border bg-card p-4 space-y-3">
        <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
          <Settings className="mr-2 h-5 w-5" />
          Ajustar mi límite
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="lg" className="border-border">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary/30 text-primary hover:bg-primary/5"
            onClick={() => onNavigate("havi")}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Hablar con HAVI
          </Button>
        </div>
      </div>
    </div>
  )
}
