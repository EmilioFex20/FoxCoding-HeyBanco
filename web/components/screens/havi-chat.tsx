"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, Bell, Wallet, Calendar, CreditCard, TrendingUp, Settings, AlertTriangle, Target, PiggyBank, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { userData } from "@/lib/mock-data"

// User profile types for HEYIA analysis
interface UserProfile {
  churn_risk: number
  gasto_score: number
  ahorro_score: number
  emocion: "frustrado" | "positivo" | "neutral"
  top_category: string
  monthly_income: number
  monthly_expenses: number
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  actions?: { label: string; icon: string }[]
  isScoreCard?: boolean
  scoreData?: UserProfile
  actionType?: string
}

// Generate random user profile for demo
function generateUserProfile(): UserProfile {
  const churn = Math.floor(Math.random() * 60) + 20
  const gasto = Math.floor(Math.random() * 50) + 30
  const ahorro = Math.floor(Math.random() * 60) + 20
  const emociones: ("frustrado" | "positivo" | "neutral")[] = ["frustrado", "positivo", "neutral"]
  const categorias = ["entretenimiento", "supermercado", "delivery", "viajes", "tecnología"]
  
  return {
    churn_risk: churn,
    gasto_score: gasto,
    ahorro_score: ahorro,
    emocion: emociones[Math.floor(Math.random() * emociones.length)],
    top_category: categorias[Math.floor(Math.random() * categorias.length)],
    monthly_income: Math.floor(Math.random() * 50000) + 25000,
    monthly_expenses: Math.floor(Math.random() * 30000) + 15000,
  }
}

// Prescriptive actions based on user profile
const ACTIONS: Record<string, { tag: string; color: string; msg: string; replies: string[] }> = {
  retencion: {
    tag: "RETENCIÓN ACTIVA",
    color: "#ff4757",
    msg: "He detectado señales importantes en tu actividad. Tu nivel de uso bajó este mes y quiero asegurarme de que todo esté bien.\n\n¿Hay algo que no esté funcionando como esperabas?",
    replies: ["Tengo un problema", "Solo revisaba", "Quiero cancelar"],
  },
  gasto: {
    tag: "CONTROL DE GASTO",
    color: "#ffa502",
    msg: "Noté que tus gastos en tu categoría principal aumentaron significativamente. Puedo ayudarte a crear un límite inteligente o activar alertas.\n\n¿Te gustaría optimizar tus finanzas?",
    replies: ["Ver mis gastos", "Crear límite", "Activar alertas"],
  },
  ahorro: {
    tag: "OPORTUNIDAD DE AHORRO",
    color: "#2ed573",
    msg: "Tu perfil muestra potencial para mejorar tu ahorro. Actualmente tienes capacidad de apartar hasta el 15% de tus ingresos automáticamente.\n\n¿Configuramos un plan de ahorro?",
    replies: ["Configurar ahorro", "Ver opciones", "Ahora no"],
  },
  inactivo: {
    tag: "REACTIVACIÓN",
    color: "#a78bfa",
    msg: "Hace tiempo que no usas tu cuenta. Tengo algunas opciones y beneficios activos que podrían interesarte.\n\n¿Te muestro lo que tienes disponible?",
    replies: ["Ver beneficios", "Usar cashback", "Solo revisaba"],
  },
  general: {
    tag: "OPTIMIZACIÓN",
    color: "#00c3ff",
    msg: "¿En qué puedo ayudarte hoy? Cuéntame lo que necesitas y buscaré la mejor opción para tu perfil.",
    replies: ["Ahorro", "Mis gastos", "Necesito ayuda"],
  },
}

// Get prescriptive action based on user profile
function getPrescriptiveAction(user: UserProfile): string {
  if (user.churn_risk > 70) return "retencion"
  if (user.gasto_score > 65) return "gasto"
  if (user.ahorro_score < 35) return "ahorro"
  if (user.churn_risk > 50 && user.emocion === "neutral") return "inactivo"
  return "general"
}

// NLP Router - simple keyword intent detection
function nlpRoute(text: string): string {
  const t = text.toLowerCase()
  if (/ahorro|invert|rend|crecer|fondos/.test(t)) return "ahorro"
  if (/gasto|compra|caro|cara|deuda|limit/.test(t)) return "gasto"
  if (/problema|error|falla|bloqueada|no puedo|no me|queja/.test(t)) return "retencion"
  if (/sí|si\b|quiero|acepto|dale|confirma|perfecto|listo/.test(t)) return "confirm"
  if (/\bno\b|ahora no|luego|después|deja|espera/.test(t)) return "decline"
  if (/tarjeta|crédito|credito/.test(t)) return "tarjeta"
  if (/retiro|efectivo|cajero/.test(t)) return "retiro"
  if (/pago|rechaz|pasó|fallo/.test(t)) return "pago"
  if (/límite|limite/.test(t)) return "limite"
  return "unknown"
}

// Get NLP response based on intent
function getNlpResponse(intent: string): { content: string; actions?: { label: string; icon: string }[] } {
  const responses: Record<string, { content: string; actions?: { label: string; icon: string }[] }> = {
    ahorro: {
      content: "Basándome en tu perfil, te recomiendo mover al menos el 10% de tu saldo a Inversión Hey. Tasa actual: 12% anual con liquidez inmediata.\n\n¿Configuramos el traspaso automático?",
      actions: [
        { label: "Configurar ahorro", icon: "PiggyBank" },
        { label: "Ver rendimientos", icon: "TrendingUp" },
      ],
    },
    gasto: {
      content: "Analicé tus patrones de gasto. Tu mayor rubro este mes fue Tecnología (+18% vs mes anterior).\n\nPuedo crear un límite inteligente automático. ¿Lo activamos?",
      actions: [
        { label: "Crear límite", icon: "Target" },
        { label: "Ver detalle", icon: "Calendar" },
      ],
    },
    retencion: {
      content: "Entiendo la situación. Tengo acceso a soporte prioritario para ti.\n\nTambién puedo escalar tu caso a un asesor humano en menos de 5 minutos. ¿Qué prefieres?",
      actions: [
        { label: "Soporte prioritario", icon: "Bell" },
        { label: "Hablar con asesor", icon: "Settings" },
      ],
    },
    confirm: {
      content: "¡Perfecto!\n\nEjecutando acción en tu cuenta...\nCambio guardado. Recibirás confirmación por notificación push en segundos.",
    },
    decline: {
      content: "Sin problema, no hay prisa. Cuando necesites algo, estaré aquí.\n\nTu cuenta siempre está monitorizada.",
    },
    tarjeta: {
      content: `Tu tarjeta Hey termina en 4521. Actualmente tienes habilitadas las compras en línea y el pago sin contacto. Tu límite de crédito es de $25,000 MXN con un saldo utilizado de $8,500 MXN.`,
      actions: [
        { label: "Ver tarjeta", icon: "CreditCard" },
        { label: "Bloquear tarjeta", icon: "Settings" },
      ],
    },
    retiro: {
      content: "¡Puedo generarte un código para retiro sin tarjeta! El código dura hasta 24 horas y lo puedes usar en cualquier cajero Banregio. ¿Cuánto necesitas retirar?",
      actions: [
        { label: "Generar código", icon: "Wallet" },
        { label: "Buscar cajeros", icon: "Settings" },
      ],
    },
    pago: {
      content: "Detecté que tu último pago fue rechazado. Esto ocurrió porque superaste tu límite diario de $5,000 MXN. Puedo ayudarte a ajustar el límite o activar alertas para evitar que vuelva a pasar.",
      actions: [
        { label: "Ajustar límite", icon: "Settings" },
        { label: "Activar alertas", icon: "Bell" },
        { label: "Ver movimientos", icon: "Wallet" },
      ],
    },
    limite: {
      content: "Tu límite diario actual es de $5,000 MXN. Ayer acumulaste gastos por $5,100 MXN antes del intento de pago. ¿Te gustaría ajustar tu límite o ver el detalle de tus gastos?",
      actions: [
        { label: "Cambiar límite", icon: "Settings" },
        { label: "Ver gastos del día", icon: "Calendar" },
      ],
    },
    unknown: {
      content: "Entendí tu mensaje. Déjame procesar la mejor acción para tu perfil...\n\n¿Puedes darme un poco más de contexto?",
      actions: [
        { label: "Ver mi cuenta", icon: "Wallet" },
        { label: "Mis movimientos", icon: "Calendar" },
        { label: "Hablar con asesor", icon: "Bell" },
      ],
    },
  }
  return responses[intent] || responses.unknown
}

// Score Card Component
function ScoreCard({ user, actionType }: { user: UserProfile; actionType: string }) {
  const riskLabel = user.churn_risk > 70 ? "Alto" : user.churn_risk > 40 ? "Medio" : "Bajo"
  const gastoLabel = user.gasto_score > 70 ? "Alto" : user.gasto_score > 40 ? "Moderado" : "Normal"
  const ahorroLabel = user.ahorro_score > 70 ? "Alto" : user.ahorro_score > 40 ? "Medio" : "Bajo"
  const riskColor = user.churn_risk > 70 ? "#ff4757" : user.churn_risk > 40 ? "#ffa502" : "#2ed573"
  const emojiEmo = user.emocion === "frustrado" ? "Frustrado" : user.emocion === "positivo" ? "Positivo" : "Neutral"
  
  const oppLabels: Record<string, string> = {
    retencion: "Mitigación de churn",
    gasto: "Optimización de gasto",
    ahorro: "Inversión automática",
    inactivo: "Reactivación",
    general: "Mejora de experiencia",
  }
  
  const actionInfo = ACTIONS[actionType] || ACTIONS.general

  return (
    <div className="heyia-score-card rounded-2xl p-4 w-full">
      <div className="text-xs font-bold tracking-wider uppercase text-primary mb-3 flex items-center gap-2">
        <TrendingUp className="h-3.5 w-3.5" />
        Análisis rápido · HEYIA
      </div>
      
      <div className="space-y-2.5">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Riesgo de abandono</span>
          <span className="font-bold" style={{ color: riskColor }}>
            {user.churn_risk}% — {riskLabel}
          </span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${user.churn_risk}%`, backgroundColor: riskColor }}
          />
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Nivel de gasto</span>
          <span className="font-bold text-[#ffa502]">
            {gastoLabel} ({user.gasto_score}%)
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Score de ahorro</span>
          <span className="font-bold text-[#2ed573]">
            {ahorroLabel} ({user.ahorro_score}%)
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Estado emocional</span>
          <span className="font-bold">{emojiEmo}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Oportunidad</span>
          <span className="font-bold text-[#00c3ff]">{oppLabels[actionType]}</span>
        </div>
      </div>
      
      <div
        className="inline-block mt-3 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide"
        style={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: actionInfo.color,
          color: actionInfo.color,
        }}
      >
        {actionInfo.tag}
      </div>
    </div>
  )
}

export function HaviChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [currentAction, setCurrentAction] = useState<string>("general")
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [chatStarted, setChatStarted] = useState(false)
  const [status, setStatus] = useState({ text: "En línea", color: "#2ed573" })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startChat = (scenario: string) => {
    const profile = generateUserProfile()
    
    // Adjust profile based on selected scenario
    if (scenario === "retencion") profile.churn_risk = Math.floor(Math.random() * 20) + 75
    if (scenario === "gasto") profile.gasto_score = Math.floor(Math.random() * 20) + 70
    if (scenario === "ahorro") profile.ahorro_score = Math.floor(Math.random() * 25) + 10
    if (scenario === "inactivo") {
      profile.churn_risk = Math.floor(Math.random() * 30) + 50
      profile.emocion = "neutral"
    }
    
    setUserProfile(profile)
    const action = scenario !== "general" ? scenario : getPrescriptiveAction(profile)
    setCurrentAction(action)
    setChatStarted(true)
    
    // Initial greeting
    setStatus({ text: "HEYIA está analizando tu perfil...", color: "#ffa502" })
    
    setTimeout(() => {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: `Hola ${userData.name}, soy HEYIA, tu asistente inteligente de Hey Banco.`,
          timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      
      // Show score card after analysis
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setMessages((prev) => [
            ...prev,
            {
              id: "2",
              role: "assistant",
              content: "",
              timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
              isScoreCard: true,
              scoreData: profile,
              actionType: action,
            },
          ])
          
          // Show prescriptive message
          setTimeout(() => {
            setStatus({ text: "En línea", color: "#2ed573" })
            setIsTyping(true)
            setTimeout(() => {
              setIsTyping(false)
              const actionInfo = ACTIONS[action]
              setMessages((prev) => [
                ...prev,
                {
                  id: "3",
                  role: "assistant",
                  content: actionInfo.msg,
                  timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
                },
              ])
              setQuickReplies(actionInfo.replies)
            }, 1500)
          }, 500)
        }, 1900)
      }, 1100)
    }, 350)
  }

  const handleQuickReply = (reply: string) => {
    setQuickReplies([])
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: reply,
      timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)
    
    setTimeout(() => {
      const response = currentAction === "retencion"
        ? "Escalé tu caso a soporte prioritario.\nUn asesor te contactará en menos de 10 minutos por el canal que prefieras.\n\n¿Hay algo más en lo que pueda ayudarte?"
        : "Perfecto.\nSe aplicó la acción recomendada en tu cuenta. El impacto se reflejará en tu próximo estado de cuenta.\n\n¿Necesitas algo más?"
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setIsTyping(false)
    }, 1600)
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
    setStatus({ text: "HEYIA está procesando...", color: "#ffa502" })

    setTimeout(() => {
      const intent = nlpRoute(input)
      const response = getNlpResponse(intent)
      setStatus({ text: "En línea", color: "#2ed573" })
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
        actions: response.actions,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1700)
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
      case "AlertTriangle": return AlertTriangle
      case "Target": return Target
      case "PiggyBank": return PiggyBank
      default: return Bell
    }
  }

  const scenarios = [
    { id: "retencion", icon: "🚨", name: "Cliente en riesgo", desc: "Probabilidad alta de abandono", badge: "Crítico" },
    { id: "gasto", icon: "💳", name: "Gasto elevado", desc: "Patrones de gasto fuera de norma", badge: "Alerta" },
    { id: "ahorro", icon: "🎯", name: "Bajo ahorro", desc: "Potencial de mejora detectado", badge: "Oportunidad" },
    { id: "inactivo", icon: "😴", name: "Usuario inactivo", desc: "Sin actividad reciente", badge: "Reactivar" },
    { id: "general", icon: "✨", name: "Perfil aleatorio", desc: "Genera un usuario al azar", badge: "Demo" },
  ]

  const resetChat = () => {
    setChatStarted(false)
    setMessages([])
    setUserProfile(null)
    setQuickReplies([])
    setCurrentAction("general")
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--hey-bg-0)]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/5 bg-gradient-to-r from-[var(--hey-bg-1)] to-[var(--hey-bg-2)] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full heyia-bubble">
              <span className="text-xs font-black text-[var(--hey-bg-0)] tracking-tight">HEY</span>
            </div>
            <div>
              <h1 className="font-bold text-foreground text-base tracking-wide">HEYIA</h1>
              <p className="text-xs flex items-center gap-1.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span style={{ color: status.color }}>{status.text}</span>
              </p>
            </div>
          </div>
          {chatStarted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetChat}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Reiniciar
            </Button>
          )}
        </div>
      </header>

      {/* Profile Picker or Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!chatStarted ? (
          <div className="flex flex-col justify-center h-full">
            <div className="mb-5">
              <p className="text-xs font-bold tracking-wider uppercase text-primary mb-1.5">
                Selecciona un perfil
              </p>
              <p className="text-sm text-muted-foreground">
                Elige un escenario para ver cómo HEYIA analiza y responde al perfil del usuario.
              </p>
            </div>
            
            <div className="space-y-2.5">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => startChat(scenario.id)}
                  className="w-full p-3 bg-white/[0.026] border border-white/[0.07] rounded-xl text-left transition-all hover:border-primary/30 hover:bg-primary/[0.04] hover:translate-x-1 flex items-center gap-3"
                >
                  <span className="text-2xl w-9 text-center flex-shrink-0">{scenario.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-bold text-muted-foreground block">{scenario.name}</span>
                    <span className="text-xs text-[var(--hey-text-3)]">{scenario.desc}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap bg-primary/[0.08] text-primary border border-primary/20">
                    {scenario.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex animate-in fade-in slide-in-from-bottom-2 duration-300",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn("flex gap-2 max-w-[90%]", message.role === "user" && "flex-row-reverse")}>
                  {message.role === "assistant" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full heyia-bubble">
                      <span className="text-[8px] font-black text-[var(--hey-bg-0)]">HEY</span>
                    </div>
                  )}
                  
                  {message.isScoreCard && message.scoreData ? (
                    <ScoreCard user={message.scoreData} actionType={message.actionType || "general"} />
                  ) : (
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3",
                        message.role === "user"
                          ? "heyia-msg-out rounded-br-sm"
                          : "heyia-msg-in rounded-bl-sm"
                      )}
                    >
                      <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
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
                                className="h-8 text-xs bg-[var(--hey-bg-card)] border-primary/30 text-primary hover:bg-primary/10"
                              >
                                <Icon className="mr-1.5 h-3.5 w-3.5" />
                                {action.label}
                              </Button>
                            )
                          })}
                        </div>
                      )}
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        {message.timestamp}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full heyia-bubble">
                    <span className="text-[8px] font-black text-[var(--hey-bg-0)]">HEY</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl heyia-msg-in px-4 py-3 rounded-bl-sm">
                    <span className="h-1.5 w-1.5 rounded-full heyia-typing-dot" />
                    <span className="h-1.5 w-1.5 rounded-full heyia-typing-dot" />
                    <span className="h-1.5 w-1.5 rounded-full heyia-typing-dot" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Quick Reply Chips */}
      {quickReplies.length > 0 && (
        <div className="px-4 py-2 border-t border-white/[0.04] flex gap-2 flex-wrap">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply)}
              className="heyia-chip px-3.5 py-2 rounded-full text-sm font-semibold text-primary"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      {chatStarted && (
        <div className="sticky bottom-20 border-t border-white/[0.04] bg-[var(--hey-bg-1)] p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..."
              className="flex-1 rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="h-10 w-10 shrink-0 rounded-full heyia-bubble border-0 hover:opacity-90"
            >
              <Send className="h-4 w-4 text-[var(--hey-bg-0)]" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
