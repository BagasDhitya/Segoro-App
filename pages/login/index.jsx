import Image from "next/image"
import React, { useState, useEffect } from "react"
import { Col, FloatingLabel, Form, InputGroup, Row } from "react-bootstrap"
import { MDBBtn } from 'mdb-react-ui-kit';
import { BsFillEyeSlashFill, BsFillEyeFill } from "react-icons/bs"
import ReactLoading from "react-loading";
// Import Components
import styles from "../../styles/Login.module.css"
import { useNavbarContext } from "../../context/contextNavbar";
import axios from "axios";
import { setCookie } from "cookies-next";

const Login = () => {
    const { setStatusNav } = useNavbarContext()
    const [test, setTest] = useState(false)
    const [password, setPassword] = useState(true)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState({
        email: "",
        password: ""
    })
    const [register, setRegister] = useState({
        name_user: "",
        address_user: "",
        email: "",
        password: "",
        foto_user: null
    })

    useEffect(() => {
        setStatusNav("")
    })

    const togglePassword = (e) => {
        e.preventDefault()
        setPassword(prev => !prev)
    }

    const handleInput = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const handleLogin = (e) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => setLoading(false), 2000)
        axios.post("https://grupproject.site/login", user)
            .then(res => {
                const data = res.data
                setCookie("token", data.token)
                setCookie("user", data.user)
                setCookie("user_id", data.user_id)
                setCookie("foto_user", data.foto_user)
                setCookie("role", data.role)
                setCookie("user_owner", data.user_owner)
                swal("Login Successfully", `Welcome to segoro , ${data.user}`, "success")
                    .then(() => window.location.href = "/")
            })
            .catch(err => swal("Login Failed", `${err.response.data.message}`, "error"))
    }

    const handleForm = (e) => {
        const target = e.target
        let newRegister = { ...register }
        if (target.type === "file") {
            newRegister[e.target.name] = target.files[0]
            setRegister(newRegister)
        } else {
            newRegister[e.target.name] = target.value
            setRegister(newRegister)
        }
    }

    const handleRegister = (e) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => setLoading(false), 2000)
        const data = new FormData();
        for (var i in register) {
            data.append(i, register[i])
        }
        axios.post("https://grupproject.site/users", data)
            .then(res => swal("Register Successfully", `Login now to access segoro`, "success")
                .then(() => setTest(prev => !prev)))
            .catch(err => swal("Register Failed", `${err.response.data.message}`, "error"))
    }


    return (
        <>
            <Row className={styles.container}>
                <Row className={styles.imageBox}>
                    <Image
                        alt=""
                        priority="true"
                        src="/heroLogin.png"
                        width={751}
                        height={1032}
                    />
                </Row>
                <Col lg={6} xl={5}>
                    <Row>
                        <p className={styles.title}>Booking Now Enjoy Playing Later</p>
                    </Row>
                </Col>

                <Col className={styles.containerForm} lg={6} xl={7}>
                    <Row className={styles.logoBox}>
                        <Image
                            alt=""
                            src="/segoro.png"
                            width={230}
                            height={150}
                            className={styles.logo}
                        />
                    </Row>
                    {!test ? <Row className={styles.formBox}>
                        <h1 className={styles.loginTitle}>Login</h1>
                        <Form onSubmit={(e) => handleLogin(e)}>
                            <FloatingLabel
                                controlId="floatingEmail"
                                label="Email address"
                                className="mb-3"
                            >
                                <Form.Control
                                    className={styles.formControl}
                                    type="email"
                                    placeholder="placeholder"
                                    name="email"
                                    onChange={(e) => handleInput(e)}
                                />

                            </FloatingLabel>
                            <InputGroup>
                                <FloatingLabel
                                    controlId="floatingPassword"
                                    label="Password"
                                >
                                    <Form.Control
                                        className={styles.formControl}
                                        placeholder="placeholder"
                                        type={password ? "password" : "text"}
                                        name="password"
                                        onChange={(e) => handleInput(e)}
                                    />
                                </FloatingLabel>
                                <button className={styles.iconButton} onClick={(e) => togglePassword(e)}>
                                    {password ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
                                </button>
                            </InputGroup>
                            <MDBBtn type="submit" rippleColor='#A1D8D2'
                                className={loading ? styles.loading : styles.loginButton}>
                                {loading ? <ReactLoading type="spin" width={40} height={40} /> : "Login"}
                            </MDBBtn>
                            <p className={styles.validateText}>Don&apos;t have account ?
                                <span className={styles.span} onClick={() => setTest(prev => !prev)}>Register Now</span>
                            </p>
                        </Form>
                    </Row> :
                        <Row className={styles.formBox}>
                            <h1 className={styles.loginTitle}>Create Account</h1>
                            <Form onSubmit={(e) => handleRegister(e)}>
                                <FloatingLabel
                                    controlId="floatingInputUser"
                                    label="Username"
                                    className="mb-3"
                                >
                                    <Form.Control
                                        onChange={(e) => handleForm(e)}
                                        name="name_user"
                                        className={styles.formControl}
                                        type="text"
                                        placeholder="placeholder" />
                                </FloatingLabel>
                                <FloatingLabel
                                    controlId="floatingEmail"
                                    label="Email address"
                                    className="mb-3"
                                >
                                    <Form.Control
                                        onChange={(e) => handleForm(e)}
                                        name="email"
                                        className={styles.formControl}
                                        type="email"
                                        placeholder="placeholder" />
                                </FloatingLabel>
                                <InputGroup>
                                    <FloatingLabel
                                        controlId="floatingPassword"
                                        label="Password"
                                        className="mb-3"
                                    >
                                        <Form.Control
                                            name="password"
                                            onChange={(e) => handleForm(e)}
                                            className={styles.formControl}
                                            placeholder="placeholder"
                                            type={password ? "password" : "text"}
                                        />
                                    </FloatingLabel>
                                    <button className={styles.iconButton} onClick={(e) => togglePassword(e)}>
                                        {password ? <BsFillEyeSlashFill /> : <BsFillEyeFill />}
                                    </button>
                                </InputGroup>
                                <FloatingLabel className="mb-3" controlId="floatingTextarea23" label="Address">
                                    <Form.Control
                                        name="address_user"
                                        onChange={(e) => handleForm(e)}
                                        as="textarea"
                                        placeholder="Leave a comment here"
                                        style={{ height: '100px' }}
                                    />
                                </FloatingLabel>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <FloatingLabel
                                        controlId="floatingTextarea24"
                                        label="Profile picture" >
                                        <Form.Control name="foto_user" type="file" onChange={(e) => handleForm(e)} />
                                    </FloatingLabel>
                                </Form.Group>
                                <MDBBtn type="submit"
                                    className={loading ? styles.loading : styles.loginButton}>
                                    {loading ? <ReactLoading type="spin" width={40} height={40} /> : "Register"}
                                </MDBBtn>
                                <p className={styles.validateText}>Already have account ?
                                    <span className={styles.span} onClick={() => setTest(prev => !prev)}>Login Now</span>
                                </p>
                            </Form>
                        </Row>
                    }

                </Col>
            </Row>
        </>
    )
}

export default Login