import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { TbSoccerField, TbHome } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { BiLogOut } from "react-icons/bi"
import { useRouter } from "next/router";
import { getCookie, deleteCookie } from "cookies-next"
import toast, { Toaster } from "react-hot-toast";
// Import Components
import styles from "../styles/Navbars.module.css";
import { useNavbarContext } from "../context/contextNavbar";
import { useFotoContext } from "../context/fotoNavbar";

export const Navbars = () => {
    const router = useRouter()
    const { statusNav, handleHover, handleClick } = useNavbarContext();
    const { fotoProfile } = useFotoContext()
    const [username, setUsername] = useState("")

    useEffect(() => {
        setUsername(getCookie("user"))
    }, [])

    const handleLogout = (e) => {
        e.preventDefault()
        swal("Logout", "Are you sure?", "warning", {
            dangerMode: true,
            buttons: true,
        })
            .then((res) => {
                if (res) {
                    deleteCookie("token")
                    deleteCookie("user")
                    deleteCookie("user_id")
                    deleteCookie("foto_user")
                    deleteCookie("role");
                    deleteCookie("user_owner");
                    router.push("/login")
                    toast.success("You have been logout")
                }
            })
    }

    return (
        <>
            <div>
                <Toaster />
            </div>
            {statusNav ? <Row className={`${styles.container}`}>
                <Col md={2} className="d-none d-md-flex">
                    <a className="navbar-brand">
                        <Image
                            alt=""
                            src="/segoroSM.png"
                            width={195}
                            height={60}
                        />
                    </a>
                </Col>
                <Col md={9} lg={7} className={styles.nav}>
                    {/* Top Navbar */}
                    <Col md={4} className={`${styles.navBox} d-none d-md-flex`}>
                        <a onClick={() => handleClick("home")}
                            className={statusNav === "home" ? styles.linkActive : styles.link}
                        >Home</a>
                        <a onClick={() => handleClick("venue")}
                            className={statusNav === "venue" ? styles.linkActive : styles.link}
                        >Venue</a>
                    </Col>
                    <Col md={5} className={`${styles.profileBox} d-none d-md-flex`}>
                        <Image
                            alt=""
                            onClick={() => handleClick("profile")}
                            className={styles.profileImage}
                            src={(fotoProfile && fotoProfile) || "/profile.jpg"}
                            width={50}
                            height={50}
                        />
                        <a onClick={() => handleClick("profile")}
                            className={statusNav === "profile" ? styles.linkActive : styles.link}
                            style={{ marginLeft: "1rem" }}>
                            {(username && username) || "Login"}
                        </a>
                        <BiLogOut onClick={(e) => handleLogout(e)} color="#202B2A" style={{ cursor: "pointer" }} size={30} className="ms-5" />
                    </Col>
                </Col>

                {/* Bottom Navbar ss*/}
                <Col className={`d-flex d-md-none text-center `}>
                    <Row className={styles.container}>
                        <Col onMouseLeave={() => handleHover("kosong")} onMouseEnter={() => handleHover("home")} onClick={() => handleClick("home")}>
                            <TbHome
                                color={(statusNav === "home") && "#ECF7F6" || "#202B2A"}
                                className={`${styles.icon} my-2`}
                                size={20} />
                            {statusNav === "home" ? <p className={styles.titleIcon}>Home</p> : ""}
                        </Col>
                        <Col onMouseLeave={() => handleHover("kosong")} onMouseEnter={() => handleHover("venue")} onClick={() => handleClick("venue")}>
                            <TbSoccerField
                                color={(statusNav === "venue") && "#ECF7F6" || "#202B2A"}
                                className={`${styles.icon} my-2 `}
                                size={20} />
                            {statusNav === "venue" ? <p className={styles.titleIcon}>Venue</p> : ""}
                        </Col>
                        <Col onMouseLeave={() => handleHover("kosong")} onMouseEnter={() => handleHover("profile")} onClick={() => handleClick("profile")}>
                            <CgProfile
                                color={(statusNav === "profile") && "#ECF7F6" || "#202B2A"}
                                className={`${styles.icon} my-2`}
                                size={20} />
                            {statusNav === "profile" ? <p className={styles.titleIcon}>Profile</p> : ""}
                        </Col>
                    </Row>
                </Col>
            </Row> : ""}
        </>
    )
}