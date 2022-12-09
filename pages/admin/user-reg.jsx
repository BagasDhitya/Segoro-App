import React, { useEffect, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip, Modal } from "react-bootstrap";
import { RiArrowGoBackLine } from "react-icons/ri";
import { useRouter } from "next/router";
import axios from "axios";
import ReactLoading from "react-loading";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast"
import styles from "../../styles/Admin.module.css";

const UserReg = () => {

  const [list, setList] = useState([])
  const [image, setImage] = useState("");
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);

  const router = useRouter();
  const getUser = () => {
    axios.get("https://grupproject.site/users/request")
      .then((res) => setList(res.data.data))
      .catch(err => console.error(err.response))
  }
  useEffect(() => {
    getUser()
  }, [])

  const acceptUser = (id) => {
    const myPromise = axios.put(`https://grupproject.site/users/adminapprove/${id}`)
      .then(() => getUser())
    toast.promise(myPromise, {
      loading: "Please wait...",
      success: "Accept Successfully",
      error: "Accept Failed",
    });
  }

  const handleShows = (breakpoint) => {
    setFullscreen(breakpoint);
    setShow(true);
  }

  const handleImage = (image) => {
    setImage(image)
    handleShows(true)
  }

  return (
    <div className={`${styles.container} container`}>
      <Toaster />
      <div className={styles.titleUser}>
        <h3>List User Reguler</h3>
      </div>
      <div>
        <Table responsive="sm">
          <thead className={styles.titleTable}>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Address</th>
              <th>Image</th>
              <th>Accept</th>
            </tr>
          </thead>
          <tbody>
            {list?.map((user, index) => {
              console.log(user)
              return (
                <tr key={index}>
                  <td>{user.name_user}</td>
                  <td>{user.email}</td>
                  <td>{user.address_user}</td>
                  <td>
                    <Image alt="" style={{ cursor: "zoom-in" }} onClick={() => handleImage(user.foto_user)} src={user.foto_user} width={50} height={50} />
                  </td>
                  <td><Button onClick={() => acceptUser(user.id)} className={`${styles.accept}`}>Accept</Button></td>
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

      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
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
    </div>
  );
};

export default UserReg;
