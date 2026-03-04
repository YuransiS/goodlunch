'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

type MealPackage = 'meals3' | 'meals4'

interface OrderContextType {
    mealPackage: MealPackage
    setMealPackage: (pkg: MealPackage) => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
    const [mealPackage, setMealPackage] = useState<MealPackage>('meals3')

    return (
        <OrderContext.Provider value={{ mealPackage, setMealPackage }}>
            {children}
        </OrderContext.Provider>
    )
}

export function useOrder() {
    const context = useContext(OrderContext)
    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderProvider')
    }
    return context
}
