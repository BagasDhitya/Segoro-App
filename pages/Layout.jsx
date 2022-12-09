import {Navbars} from "../components/Navbars"

const Layout = ({ children }) => {
    return (
        <>
            <Navbars />
            {children}
        </>
    )
}

export default Layout