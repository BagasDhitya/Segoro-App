import { useRouter } from "next/router"
import React, { createContext, useContext, useState } from "react"

const NavbarContext = createContext()

export const useNavbarContext = () => {
    const router = useRouter()
    const context = useContext(NavbarContext)
    const [statusNav, setStatusNav] = context.statusNav

    const handleHover = (title) => {
        switch (title) {
            case "home":
                setStatusNav("home");
                break;
            case "venue":
                setStatusNav("venue");
                break;
            case "profile":
                setStatusNav("profile");
                break;
            case "kosong":
                setStatusNav("kosong");
                break;
        }
    };

    const handleClick = (title) => {
        switch (title) {
            case "home":
                setStatusNav("home");
                router.push("/");
                break;
            case "venue":
                setStatusNav("venue");
                router.push("/venue");
                break;
            case "profile":
                setStatusNav("profile");
                router.push("/profile");
                break;
        }
    };

    return { statusNav, setStatusNav, handleHover, handleClick }
}

export const NavbarProvider = ({ children }) => {
    const [statusNav, setStatusNav] = useState("show")

    return (
        <NavbarContext.Provider
            value={{ statusNav: [statusNav, setStatusNav] }}
        >
            {children}
        </NavbarContext.Provider>
    )
}