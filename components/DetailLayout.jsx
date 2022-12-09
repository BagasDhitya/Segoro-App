import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  OverlayTrigger,
  Tooltip,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { BsFillCameraFill } from "react-icons/bs";
import { RiImageEditFill } from "react-icons/ri";
import { getCookie } from "cookies-next";
// Import Component
import styles from "../styles/Detail.module.css";
import { AddFotoVenue } from "./AddModal";
import axios from "axios";

export const DetailLayout = ({
  user_id,
  detail,
  handleShow,
  showAddFoto,
  handleClose,
  handleForm,
  handleFoto,
  getDetail,
}) => {
  const [image, setImage] = useState("");
  const [userId, setUserId] = useState(false);
  const [id, setId] = useState("");
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [showing, setShowing] = useState(false);
  const [inputFoto, setInputFoto] = useState({});
  const [fotoId, setFotoId] = useState();
  useEffect(() => {
    if (detail !== null && detail !== undefined) {
      setImage(detail[0].foto_venue);
      setFotoId(detail[0].foto_venue_id);
    } else {
      setImage("/noImage.jpg");
    }
    setId(getCookie("user_id"));
    const ids = parseInt(id);
    const result = ids === user_id;
    setUserId(result);
  }, [detail,id,user_id]);

  const handleShows = (breakpoint) => {
    setFullscreen(breakpoint);
    setShow(true);
  };

  const handleSend = (item) => {
    setImage(item.foto_venue);
    setFotoId(item.foto_venue_id);
  };

  const handleInput = (e) => {
    const files = e.target.files;
    setInputFoto(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    data.append("foto_venue", inputFoto[0]);
    if (!fotoId) {
      swal(
        "Failed To Edit",
        "Choose picture you want to change in below",
        "warning"
      );
    } else {
      axios
        .put(`https://grupproject.site/venues/foto/${fotoId}`, data)
        .then((res) => {
          getDetail();
          const RES = res.data;
          swal(RES.status, RES.message, "success").then(handleShowing);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleShowing = () => {
    setShowing((prev) => !prev);
  };

  return (
    <>
      <Col md={12} lg={4}>
        <Row className={styles.leftCol}>
          <div
            className={styles.imageBoxMain}
            onClick={userId ? handleShowing : () => handleShows(true)}
          >
            <div className={userId ? styles.colorBox : styles.colorBoxs}>
              <Image
              alt=""
                src={image}
                width={500}
                height={500}
                className={styles.imageBox}
                onClick={userId ? handleShowing : () => handleShows(true)}
              />
              <Row
                className={`${styles.middle} d-flex justify-content-center text-center ms-0 fs-5 fw-bold`}
              >
                <RiImageEditFill size={50} />
                Edit Image
              </Row>
            </div>
          </div>
        </Row>
        <Row>
          <div className={styles.scrollImage}>
            {detail?.map((item, index) => {
              return (
                <div key={index} className={`${styles.imageItem}`}>
                  <Image
                  alt=""
                    onClick={() => handleSend(item)}
                    src={item.foto_venue}
                    width={165}
                    height={110}
                    className="rounded"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              );
            })}
            {userId ? (
              <Image
              alt=""
                onClick={handleShow}
                src="/add.png"
                width={165}
                height={130}
                className={`mt-3 rounded ${styles.hoverAdd}`}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <></>
            )}
          </div>
        </Row>
        <AddFotoVenue
          show={showAddFoto}
          handleClose={handleClose}
          handleForm={handleForm}
          handleFoto={handleFoto}
        />
      </Col>
      <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image alt="" src={image} layout="fill" />
        </Modal.Body>
      </Modal>
      <ModalEdit
        showing={showing}
        handleShowing={handleShowing}
        handleInput={handleInput}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export const DetailHeading = ({ page, item, price }) => {
  const router = useRouter();
  console.log(price);
  return (
    <>
      <Row>
        <div className={styles.title}>
          <h1 className={styles.fontOpen}>{item?.name_venue}</h1>
          <p className={styles.fontLato}>{item?.address_venue}</p>
          <p className={styles.price}>
            {" "}
            {price === 0 ? (
              <span>Available Soon</span>
            ) : (
              <span>Rp {price}</span>
            )}{" "}
          </p>
        </div>
      </Row>
      <Row className={styles.heading}>
        <Col
          sm={3}
          className={`${
            (page === "detail" && styles.headingActive) || styles.headingOff
          } py-auto text-center`}
          onClick={() => router.push("/venue/detail")}
        >
          <h5>Detail</h5>
        </Col>
        <Col
          sm={3}
          className={`${
            (page === "field" && styles.headingActive) || styles.headingOff
          } py-auto text-center`}
          onClick={() => router.push("/venue/field")}
        >
          <h5>Field</h5>
        </Col>
        <Col
          sm={3}
          className={`${
            (page === "review" && styles.headingActive) || styles.headingOff
          } py-auto text-center`}
          onClick={() => router.push("/venue/review")}
        >
          <h5>Review</h5>
        </Col>
      </Row>
    </>
  );
};

export const ModalEdit = ({
  showing,
  handleShowing,
  handleInput,
  handleSubmit,
}) => {
  return (
    <Modal show={showing} onHide={handleShowing}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Select your image</Form.Label>
          <FloatingLabel
            controlId="floatingInput"
            label="Profile picture"
            className="mb-3"
          >
            <Form.Control
              name="foto_user"
              onChange={(e) => handleInput(e)}
              type="file"
              placeholder="placeholder"
            />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={handleShowing}
            className={styles.close}
          >
            Close
          </button>
          <button type="submit" className={styles.save}>
            Save
          </button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
