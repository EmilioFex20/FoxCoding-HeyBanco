"use client";

import {
  ArrowUpRight,
  CreditCard,
  Send,
  Receipt,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Eye,
  EyeOff,
  Bell,
  QrCode,
  Banknote,
  PiggyBank,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { userData, recentTransactions, upcomingCharges } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Screen =
  | "home"
  | "havi"
  | "recommendations"
  | "expenses"
  | "profile"
  | "transaction"
  | "heypro";

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [showBalance, setShowBalance] = useState(true);

  const quickActions = [
    { id: "transfer", label: "Transferir", icon: Send },
    { id: "pay", label: "Pagar", icon: Receipt },
    { id: "withdraw", label: "Retiro sin tarjeta", icon: Banknote },
    { id: "cards", label: "Tarjetas", icon: CreditCard },
  ];

  const savingsData = {
    ahorroInmediato: 1250,
    ahorroProgramado: 4500,
    rendimiento: 4.0,
  };
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="flex flex-col gap-5 px-4 pt-12 pb-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <span className="text-xl font-bold text-primary">
              {userData.name[0]}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Buenas tardes,</p>
            <h1 className="text-xl font-bold text-foreground">
              {userData.name}
            </h1>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
        </Button>
      </header>

      {/* Balance Card - Hey Banco Style */}
      <Card className="overflow-hidden border-0 hey-gradient hey-card-shadow">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-primary-foreground/80 text-sm font-medium">
              Saldo disponible
            </p>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors p-1"
            >
              {showBalance ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-4xl font-bold text-primary-foreground tracking-tight">
            {showBalance ? `$${formatCurrency(userData.balance)}` : "••••••"}
            <span className="text-base font-medium text-primary-foreground/70 ml-1">
              MXN
            </span>
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-full px-3 py-1.5">
              <CreditCard className="h-4 w-4 text-primary-foreground/80" />
              <span className="text-sm text-primary-foreground font-medium">
                •••• 4521
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground rounded-full"
            >
              <QrCode className="h-4 w-4 mr-1.5" />
              Mi QR
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - Clean Grid */}
      <div className="grid grid-cols-4 gap-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className="flex flex-col items-center gap-2 rounded-2xl bg-card p-3 border border-border/50 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 active:scale-95"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground text-center leading-tight">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Ahorro Section - Hey Banco Feature */}
      <Card className="border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Mis Ahorros</span>
            </div>
            <Badge className="bg-primary/10 text-primary border-0 font-medium">
              {savingsData.rendimiento}% anual
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-xl p-3 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">
                Ahorro Inmediato
              </p>
              <p className="text-lg font-bold text-foreground">
                ${formatCurrency(savingsData.ahorroInmediato)}
              </p>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">
                Ahorro Programado
              </p>
              <p className="text-lg font-bold text-foreground">
                ${formatCurrency(savingsData.ahorroProgramado)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HAVI AI Recommendation */}
      <Card
        className="cursor-pointer border-primary/20 bg-card transition-all duration-200 hover:shadow-md active:scale-[0.99]"
        onClick={() => onNavigate("recommendations")}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">
                  HEYIA te recomienda
                </p>
                <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5">
                  IA
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Tienes cargos recurrentes esta semana. Activa Ahorro Inmediato
                para guardar automáticamente en cada compra.
              </p>
              <Button
                variant="link"
                className="mt-2 h-auto p-0 text-primary font-medium"
              >
                Ver recomendación
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Charges */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Cargos próximos</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary h-auto p-0 font-medium"
          >
            Ver todos
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {upcomingCharges.map((charge, index) => (
            <Card
              key={index}
              className="shrink-0 border-border/50 min-w-[140px]"
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {charge.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {charge.date}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-foreground">${charge.amount}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">
            Movimientos recientes
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary h-auto p-0 font-medium"
          >
            Ver todos
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <Card className="border-border/50">
          <CardContent className="divide-y divide-border p-0">
            {recentTransactions.slice(0, 4).map((tx, index) => (
              <button
                key={index}
                onClick={() =>
                  tx.status === "failed" && onNavigate("transaction")
                }
                className={cn(
                  "flex w-full items-center justify-between p-4 transition-colors hover:bg-secondary/50",
                  tx.status === "failed" &&
                    "bg-destructive/5 hover:bg-destructive/10",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      tx.amount > 0 ? "bg-primary/10" : "bg-secondary",
                    )}
                  >
                    {tx.amount > 0 ? (
                      <ArrowUpRight className="h-5 w-5 text-primary rotate-180" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground text-sm">
                      {tx.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                      {tx.status === "failed" && (
                        <Badge
                          variant="destructive"
                          className="text-xs px-1.5 py-0 h-4"
                        >
                          Rechazado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <p
                  className={cn(
                    "font-semibold",
                    tx.amount > 0 ? "text-primary" : "text-foreground",
                  )}
                >
                  {tx.amount > 0 ? "+" : "-"}${Math.abs(tx.amount)}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
