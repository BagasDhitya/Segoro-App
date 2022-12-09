import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Col, Row, Button, OverlayTrigger, Tooltip } from "react-bootstrap"
import { HiOutlineClipboardList } from "react-icons/hi"
import { RiMoneyDollarCircleLine } from "react-icons/ri"
import { AiOutlineSchedule, AiOutlineClose } from "react-icons/ai"
import { BsInfoLg } from "react-icons/bs"
import { useRouter } from "next/router"
import axios from "axios"
import { getCookie } from "cookies-next"
// Import Component
import styles from "../styles/Home.module.css"
import ListCard from "../components/ListCard"
import { useNavbarContext } from "../context/contextNavbar"
import { useFotoContext } from "../context/fotoNavbar";

export const getServerSideProps = async (context) => {
  const token = getCookie("token", context)
  const response = await fetch("https://grupproject.site/venues", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const list = await response.json()
  return {
    props: {
      list: list
    }
  }
}

const Home = (props) => {
  const router = useRouter()
  const [summon, setSummon] = useState(false);
  const { setFotoProfile } = useFotoContext()
  const [list, setList] = useState([])
  // active Nav
  const { setStatusNav } = useNavbarContext()
  // Get all venue
  useEffect(() => {
    setStatusNav("home")
    setList(props.list.data)
    setFotoProfile(getCookie("foto_user"))
  }, [props.list.data,setFotoProfile,setStatusNav])


  return (
    <div className="mb-5">
      <div className={`${styles.fabContainer} d-sm-block d-md-none`}>
        {summon ? (
          <Button
            onClick={() => setSummon(false)}
            className={styles.buttonClose}
          >
            <AiOutlineClose size={20} color="#fff"/>
          </Button>
        ) : (
          <Button
            onClick={() => setSummon(true)}
            className={styles.button}
          >
            <BsInfoLg size={20} />
          </Button>
        )}
        {summon ? (
          <ul
            onMouseEnter={() => setSummon(true)}
            onMouseLeave={() => setSummon(false)}
            className={`${styles.option}`}
          >
            <li>
              <OverlayTrigger
                key="left"
                placement="left"
                overlay={
                  <Tooltip id={`tooltip-left`}>Booking History</Tooltip>
                }
              >
                <Button
                  className={`${styles.infoButton} ${styles.addButton}`}
                  onClick={() => router.push("/order/history")}
                >
                  <HiOutlineClipboardList size={20} />
                </Button>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger
                key="left"
                placement="left"
                overlay={
                  <Tooltip id={`tooltip-left`}>Pay Venue</Tooltip>
                }
              >
                <Button
                  className={`${styles.infoButton} ${styles.editButton}`}
                  onClick={() => window.location.href = "/order"}
                >
                  <RiMoneyDollarCircleLine size={20} />
                </Button>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger
                key="left"
                placement="left"
                overlay={
                  <Tooltip id={`tooltip-left`}>My Schedule</Tooltip>
                }
              >
                <Button
                  className={`${styles.infoButton} ${styles.deleteButton}`
                  }
                  onClick={() => router.push("/schedule")}
                >
                  <AiOutlineSchedule size={20} />
                </Button>
              </OverlayTrigger>
            </li>
          </ul>
        ) : (
          ""
        )}
      </div>
      <Row className={`${styles.jumbotron}`}>
        <Col>
          <p className={`fs-1 fw-bold ${styles.title}`}>SEGORO</p>
          <p className={`fs-2 fw-lighter ${styles.title}`}>Searching, booking, and playing</p>
          <p className={`fs-6 fw-normal ${styles.title}`}>enjoy your playing with comfortable venue</p>
        </Col>

        <Row className={`${styles.flyingBox} d-none d-md-block`}>
          <Row className="w-75 mx-auto">
            <Col className={`${styles.contentBox}`} onClick={() => router.push("/order/history")}>
              <HiOutlineClipboardList size={28} className="mb-1 me-2" />Booking History
            </Col>
            <Col className={`${styles.contentBox}`} onClick={() => router.push("/order")}>
              <RiMoneyDollarCircleLine size={28} className="mb-1 me-2" /> Pay Venue
            </Col>
            <Col className={`${styles.contentBox}`} onClick={() => router.push("/schedule")}>
              <AiOutlineSchedule size={28} className="mb-1 me-2" /> My Schedule
            </Col>
          </Row>
          <Row className={`${styles.wave}`}>
            <Image
            alt=""
              style={{ borderRadius: "0px 0px 10px 10px" }}
              src="/wave.png"
              layout="fill"
            />
          </Row>
        </Row>
      </Row>
      <Row className={`${styles.popBox} text-center`}>
        <p className="fs-2 fw-bold" style={{ color: "#202B2A" }}>Popular Venue</p>
      </Row>
      <ListCard item={list} />
    </div>
  )
}

export default Home