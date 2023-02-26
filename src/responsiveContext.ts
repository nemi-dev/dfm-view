import React from "react";

export interface TabContextType {
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

export const ScreenIsMobile = React.createContext(false)
export const TabContext = React.createContext<TabContextType>({
  activeTab: "장비",
  setActiveTab: (s) => {}
})