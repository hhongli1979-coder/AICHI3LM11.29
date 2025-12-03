import React, { createContext, useState, useContext } from 'react'

const LoadingContext = createContext()

export const LoadingProvider = ({ children }) => {
  const [addressLoaded, setAddressLoaded] = useState(false)

  return (
    <LoadingContext.Provider value={{ addressLoaded, setAddressLoaded }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoadingContext = () => useContext(LoadingContext)
