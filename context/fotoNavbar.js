import React, { createContext, useContext, useState } from "react"

const FotoContext = createContext()

export const useFotoContext = () => {
    const context = useContext(FotoContext)
    const [fotoProfile, setFotoProfile] = context.fotoProfile

    return { fotoProfile, setFotoProfile }
}

export const FotoProvider = ({ children }) => {
    const [fotoProfile, setFotoProfile] = useState("/profile.jpg")
    return (
        <FotoContext.Provider
            value={{ fotoProfile: [fotoProfile, setFotoProfile] }}
        >
            {children}
        </FotoContext.Provider>
    )
}