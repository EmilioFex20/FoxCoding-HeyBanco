"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, Bell, Wallet, Calendar, CreditCard, TrendingUp, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { userData } from "@/lib/mock-data"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  actions?: { label: string; icon: string }[]
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: `¡Hola ${userData.name}! Soy HAVI, tu asesor con inteligencia artificial. Puedo ayudarte a resolver dudas sobre productos, movimientos o aclaraciones. ¿En qué te puedo ayudar hoy?`,
    timestamp: "10:30",
  },
]

const mockResponses: Record<string, { content: string; actions?: { label: string; icon: string }[] }> = {
  "pago": {
    content: "Detecté que tu pago a Amazon Prime fue rechazado ayer. Esto ocurrió porque superaste tu límite diario de $5,000 MXN. Puedo ayudarte a ajustar el límite o activar alertas para evitar que vuelva a pasar.",
    actions: [
      { label: "Ajustar límite", icon: "Settings" },
      { label: "Activar alertas", icon: "Bell" },
      { label: "Ver movimientos", icon: "Wallet" },
    ],
  },
  "limite": {
    content: `Tu límite diario actual es de $5,000 MXN. Ayer acumulaste gastos por $5,100 MXN antes del intento de pago a Amazon. ¿Te gustaría ajustar tu límite o ver el detalle de tus gastos?`,
    actions: [
      { label: "Cambiar límite", icon: "Settings" },
      { label: "Ver gastos del día", icon: "Calendar" },
    ],
  },
  "ahorro": {
    content: `¡Excelente pregunta! Con Ahorro Programado puedes configurar depósitos automáticos cada 7, 15 o 30 días y recibir 4% de rendimiento anual. También puedes activar Ahorro Inmediato para guardar un porcentaje de cada compra automáticamente.`,
    actions: [
      { label: "Configurar ahorro", icon: "Wallet" },
      { label: "Ver rendimientos", icon: "TrendingUp" },
    ],
  },
  "tarjeta": {
    content: `Tu tarjeta Hey termina en 4521. Actualmente tienes habilitadas las compras en línea y el pago sin contacto. Tu límite de crédito es de $25,000 MXN con un saldo utilizado de $8,500 MXN.`,
    actions: [
      { label: "Ver tarjeta", icon: "CreditCard" },
      { label: "Bloquear tarjeta", icon: "Settings" },
    ],
  },
  "retiro": {
    content: `¡Puedo generarte un código para retiro sin tarjeta! El código dura hasta 24 horas y lo puedes usar en cualquier cajero Banregio. ¿Cuánto necesitas retirar?`,
    actions: [
      { label: "Generar código", icon: "Wallet" },
      { label: "Buscar cajeros", icon: "Settings" },
    ],
  },
  "default": {
    content: "Entiendo tu consulta. Puedo ayudarte con información de tu cuenta, movimientos, ahorros, tarjetas, o realizar aclaraciones. ¿Sobre qué tema te gustaría saber más?",
    actions: [
      { label: "Ver mi cuenta", icon: "Wallet" },
      { label: "Mis movimientos", icon: "Calendar" },
      { label: "Hablar con asesor", icon: "Bell" },
    ],
  },
}

export function HaviChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()
    if (lowerMessage.includes("pago") || lowerMessage.includes("rechaz") || lowerMessage.includes("pasó") || lowerMessage.includes("fallo")) {
      return mockResponses["pago"]
    }
    if (lowerMessage.includes("límite") || lowerMessage.includes("limite")) {
      return mockResponses["limite"]
    }
    if (lowerMessage.includes("ahorro") || lowerMessage.includes("ahorra") || lowerMessage.includes("inversión") || lowerMessage.includes("rendimiento")) {
      return mockResponses["ahorro"]
    }
    if (lowerMessage.includes("tarjeta") || lowerMessage.includes("crédito") || lowerMessage.includes("credito")) {
      return mockResponses["tarjeta"]
    }
    if (lowerMessage.includes("retiro") || lowerMessage.includes("efectivo") || lowerMessage.includes("cajero")) {
      return mockResponses["retiro"]
    }
    return mockResponses["default"]
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response = getResponse(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
        actions: response.actions,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getActionIcon = (iconName: string) => {
    switch (iconName) {
      case "Bell": return Bell
      case "Wallet": return Wallet
      case "Calendar": return Calendar
      case "Sparkles": return Sparkles
      case "CreditCard": return CreditCard
      case "TrendingUp": return TrendingUp
      case "Settings": return Settings
      default: return Bell
    }
  }

  const suggestedQuestions = [
    "¿Por qué se rechazó mi pago?",
    "¿Cómo configuro mi ahorro?",
    "Generar retiro sin tarjeta",
    "¿Cuál es mi límite diario?",
  ]

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground text-lg">HAVI</h1>
            <p className="text-xs text-muted-foreground">Tu asesor con IA - Sin tiempos de espera</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn("flex gap-2 max-w-[90%]", message.role === "user" && "flex-row-reverse")}>
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary rounded-bl-md"
                  )}
                >
                  <p className={cn(
                    "text-sm leading-relaxed",
                    message.role === "user" ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {message.content}
                  </p>
                  {message.actions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.actions.map((action, index) => {
                        const Icon = getActionIcon(action.icon)
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs bg-card border-primary/30 text-primary hover:bg-primary/10"
                          >
                            <Icon className="mr-1.5 h-3.5 w-3.5" />
                            {action.label}
                          </Button>
                        )
                      })}
                    </div>
                  )}
                  <p className={cn(
                    "mt-2 text-xs",
                    message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3 rounded-bl-md">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="mt-6">
            <p className="mb-3 text-xs font-medium text-muted-foreground">Preguntas frecuentes</p>
            <div className="flex flex-col gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-auto py-3 px-4 text-sm justify-start text-left border-border hover:border-primary/30 hover:bg-primary/5"
                  onClick={() => setInput(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-20 border-t border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              className="w-full rounded-full border border-border bg-secondary px-4 py-3 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="h-12 w-12 shrink-0 rounded-full bg-primary hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
