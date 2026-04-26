export const userData = {
  name: "Alex",
  age: 29,
  city: "Monterrey",
  platform: "app_ios",
  satisfaction: 9,
  hasHeyPro: false,
  balance: 8420,
  monthlySpend: 16800,
  preferredChannel: "App móvil",
  language: "Español",
  activityLevel: "Alto",
}

export const categories = [
  { name: "Restaurantes", amount: 5200, percentage: 31, icon: "UtensilsCrossed" },
  { name: "Servicios digitales", amount: 3800, percentage: 23, icon: "Smartphone" },
  { name: "Delivery", amount: 2900, percentage: 17, icon: "Package" },
  { name: "Transporte", amount: 2100, percentage: 13, icon: "Car" },
  { name: "Otros", amount: 2800, percentage: 16, icon: "MoreHorizontal" },
]

export const upcomingCharges = [
  { name: "Spotify", amount: 129, date: "28 Abr", icon: "Music" },
  { name: "Netflix", amount: 199, date: "1 May", icon: "Tv" },
  { name: "iCloud", amount: 49, date: "3 May", icon: "Cloud" },
]

export const recentTransactions = [
  { name: "Uber Eats", amount: -189, date: "Hoy", category: "Delivery", status: "completed" },
  { name: "Starbucks", amount: -95, date: "Hoy", category: "Restaurantes", status: "completed" },
  { name: "Amazon Prime", amount: -99, date: "Ayer", category: "Servicios", status: "failed" },
  { name: "OXXO", amount: -45, date: "Ayer", category: "Compras", status: "completed" },
  { name: "Transferencia recibida", amount: 2500, date: "22 Abr", category: "Transferencia", status: "completed" },
]

export const recommendations = [
  {
    id: "1",
    title: "Activa Hey Pro y recupera cashback",
    description: "En restaurantes podrías recuperar hasta $156 MXN este mes",
    reason: "Gastas en promedio $5,200 en restaurantes",
    action: "Activar Hey Pro",
    type: "upgrade",
    icon: "Sparkles",
  },
  {
    id: "2",
    title: "Tu gasto en delivery subió 18%",
    description: "Este mes gastaste $2,900 vs $2,450 el mes pasado",
    reason: "Detectamos 12 compras en apps de delivery",
    action: "Ver detalle",
    type: "insight",
    icon: "TrendingUp",
  },
  {
    id: "3",
    title: "Cargo recurrente próximo",
    description: "Spotify se cobrará el 28 de abril por $129 MXN",
    reason: "Este cargo se repite cada mes",
    action: "Configurar alerta",
    type: "alert",
    icon: "Bell",
  },
  {
    id: "4",
    title: "Podrías ahorrar más",
    description: "Tienes $3,200 sin usar este mes. Muévelos a inversión Hey",
    reason: "Tu saldo promedio ha sido de $8,000+ los últimos 3 meses",
    action: "Invertir ahora",
    type: "saving",
    icon: "PiggyBank",
  },
  {
    id: "5",
    title: "Reintentos en pagos recientes",
    description: "Detectamos 3 reintentos de pago la semana pasada",
    reason: "Failure score: 0.72 en conversación de soporte",
    action: "Revisar pagos",
    type: "warning",
    icon: "AlertTriangle",
  },
]

export const alerts = [
  { name: "Saldo mínimo", enabled: true },
  { name: "Cargos recurrentes", enabled: true },
  { name: "Compras mayores a $500", enabled: false },
  { name: "Transferencias recibidas", enabled: true },
]

export const heyProBenefits = {
  estimatedCashback: 184,
  categories: [
    { name: "Restaurantes", cashback: 92, percentage: 3 },
    { name: "Servicios digitales", cashback: 57, percentage: 2 },
    { name: "Delivery", cashback: 35, percentage: 1.5 },
  ],
}

export const failedTransaction = {
  merchant: "Amazon Prime",
  amount: 99,
  date: "Ayer, 14:32",
  reason: "Límite diario excedido",
  dailyLimit: 5000,
  dailySpent: 5100,
  suggestion: "Tu pago no pasó porque superaste tu límite diario. Puedes intentarlo mañana o ajustar tu límite desde configuración.",
}

export const chatMessages = [
  {
    id: "1",
    role: "assistant" as const,
    content: "¡Hola Alex! Soy Havi, tu asistente financiero personal. ¿En qué puedo ayudarte hoy?",
    timestamp: "10:30",
  },
]
