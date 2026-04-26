"use client"

import { Home, MessageCircle, Lightbulb, BarChart3, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "expenses", label: "Gastos", icon: BarChart3 },
  { id: "havi", label: "HEYIA", icon: MessageCircle },
  { id: "recommendations", label: "Tips", icon: Lightbulb },
  { id: "profile", label: "Perfil", icon: User },
]

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[var(--hey-bg-1)] safe-area-bottom backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          const isHavi = item.id === "havi"
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all duration-200",
                isActive && !isHavi && "text-primary",
                !isActive && !isHavi && "text-muted-foreground",
                isHavi && "relative -mt-4"
              )}
            >
              {isHavi ? (
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 heyia-bubble",
                  isActive 
                    ? "scale-110" 
                    : "opacity-90"
                )}>
                  <Icon className="h-6 w-6 text-[var(--hey-bg-0)]" />
                </div>
              ) : (
                <>
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )} />
                  <span className={cn(
                    "text-[10px] font-medium transition-all duration-200",
                    isActive && "font-semibold text-primary"
                  )}>
                    {item.label}
                  </span>
                </>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
