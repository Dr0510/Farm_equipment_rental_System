import React, { createContext, useContext } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!)

interface StripeContextType {
  stripe: Promise<Stripe | null>
}

const StripeContext = createContext<StripeContextType | undefined>(undefined)

export const useStripe = () => {
  const context = useContext(StripeContext)
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider')
  }
  return context
}

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = {
    stripe: stripePromise,
  }

  return (
    <StripeContext.Provider value={value}>
      <Elements stripe={stripePromise}>
        {children}
      </Elements>
    </StripeContext.Provider>
  )
}