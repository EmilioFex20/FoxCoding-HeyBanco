"use client"

import { useState } from "react"
import { BottomNavigation } from "./bottom-navigation"
import { HomeScreen } from "./screens/home-screen"
import { HaviChat } from "./screens/havi-chat"
import { RecommendationsScreen } from "./screens/recommendations-screen"
import { ExpensesScreen } from "./screens/expenses-screen"
import { ProfileScreen } from "./screens/profile-screen"
import { TransactionDetail } from "./screens/transaction-detail"
import { HeyProScreen } from "./screens/hey-pro-screen"

type Screen = "home" | "havi" | "recommendations" | "expenses" | "profile" | "transaction" | "heypro"

export function AppShell() {
  const [activeTab, setActiveTab] = useState<string>("home")
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentScreen(tab as Screen)
  }

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen)
    if (["home", "havi", "recommendations", "expenses", "profile"].includes(screen)) {
      setActiveTab(screen)
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onNavigate={navigateTo} />
      case "havi":
        return <HaviChat />
      case "recommendations":
        return <RecommendationsScreen onNavigate={navigateTo} />
      case "expenses":
        return <ExpensesScreen onNavigate={navigateTo} />
      case "profile":
        return <ProfileScreen />
      case "transaction":
        return <TransactionDetail onNavigate={navigateTo} />
      case "heypro":
        return <HeyProScreen onBack={() => navigateTo("home")} />
      default:
        return <HomeScreen onNavigate={navigateTo} />
    }
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-lg bg-background">
      <main className="pb-24">
        {renderScreen()}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}
