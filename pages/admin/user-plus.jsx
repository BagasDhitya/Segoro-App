import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
  Modal
} from "react-bootstrap";
import { RiArrowGoBackLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image"
import ReactLoading from "react-loading";
import styles from "../../styles/Admin.module.css";
import { VerifyModal } from "../../components/AddModal";

const UserPlus = () => {
  const router = useRouter();
  const [image, setImage] = useState("");
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [shows, setShows] = useState(false);
  const [list, setList] = useState([])

  const getUser = () => {
    axios.get("https://grupproject.site/users")
      .then((res) => setList(res.data.data))
  }
  useEffect(() => {
    getUser()
  }, [])

  const handleShows = (breakpoint) => {
    setFullscreen(breakpoint);
    setShows(true);
  }

  const handleImage = (image) => {
    setImage(image)
    handleShows(true)
  }

  return (
    <div className={`${styles.container} container`}>
      <div className={styles.titleUser}>
        <h3>List All User</h3>
      </div>
      <div>
        <Table responsive="sm">
          <thead className={styles.titleTable}>
            <tr>
              <th className="fs-5 fw-bold">Image</th>
              <th className="fs-5 fw-bold">Name</th>
              <th className="fs-5 fw-bold">Email</th>
              <th className="fs-5 fw-bold">Address</th>
              <th className="fs-5 fw-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {list?.map((user, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Image style={{ cursor: "zoom-in" }} 
                    alt=""
                    width={50} 
                    height={50} 
                    onClick={() => handleImage(user.foto_user)} 
                    src={user.foto_user ? user.foto_user : "/profile.jpg"} 
                    />
                  </td>
                  <td className="pt-4 fs-6">{user.name_user}</td>
                  <td className="pt-4 fs-6">{user.email}</td>
                  <td className="pt-4 fs-6">{user.address_user}</td>
                  <td className="pt-4 fs-6">
                    {user.role}
                    {user.user_owner ? "+" : ""}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
      <div>
        <OverlayTrigger
          key="top"
          placement="top"
          overlay={<Tooltip id={`tooltip-top`}>Go back to dashboard</Tooltip>}
        >
          <Button
            variant="success"
            className={styles.goBack}
            onClick={() => router.push("/admin")}
          >
            <RiArrowGoBackLine size={35} />
          </Button>
        </OverlayTrigger>
      </div>

      <Modal show={shows} fullscreen={fullscreen} onHide={() => setShows(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex align-items-center justify-content-center">
          <ReactLoading
            type="spokes"
            color="#a1d8d2"
            height={300}
            width={300}
            className={`d-flex `}
          />
          <Image
          alt=""
            src={image}
            layout="fill"
          />
        </Modal.Body>
      </Modal>
      {/* Verify Modal */}
      {/* <VerifyModal show={show} handleClose={() => setShow(false)} /> */}
    </div>
  );
};

export default UserPlus;
