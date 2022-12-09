import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import { getCookie } from "cookies-next";
import dynamic from 'next/dynamic'
import { Toaster, toast } from "react-hot-toast"
// Import Component
import styles from "../../styles/Detail.module.css";
import { AddModal } from "../../components/AddModal";
import { DetailLayout, DetailHeading } from "../../components/DetailLayout";

function Detail() {
  const [show, setShow] = useState(false);
  const [showAddFoto, setShowAddFoto] = useState(false);
  const [detail, setDetail] = useState([]);
  const [id, setId] = useState("")
  const [result, setResult] = useState(null)
  const [venue, setVenue] = useState({
    name_venue: "",
    Address_venue: "",
    latitude: parseInt(),
    longitude: parseInt(),
    description_venue: "",
  });
  const [inputFoto, setInputFoto] = useState({})

  // get detail venue
  const getDetail = () => {
    axios
      .get(`https://grupproject.site/venues/${getCookie("id")}`)
      .then((res) => {
        setDetail(res.data.data);
      });
  };

  useEffect(() => {
    getDetail();
    setId(getCookie("user_id"))
  }, []);

  // add foto
  const handleForm = (e) => {
    const files = e.target.files
    setInputFoto(files)
  };
  const handleFoto = (e) => {
    e.preventDefault()
    const data = new FormData(e.target)
    data.append("foto_venue", inputFoto[0])

    axios.post(`https://grupproject.site/venues/foto/${getCookie("id")}`, data)
      .then(res => {
        const RES = res.data
        getDetail()
        swal(RES.status, RES.message, "success")
          .then(setShowAddFoto(false))
      })
      .catch(err => console.log(err))
  };

  // edit venue
  const handleInput = (e) => {
    let newVenue = { ...venue };
    newVenue[e.target.name] = e.target.value;
    setVenue(newVenue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var axios = require("axios");
    const {
      name_venue,
      Address_venue,
      latitude,
      longitude,
      description_venue,
    } = venue;
    var data = {
      name_venue: name_venue,
      Address_venue: Address_venue,
      latitude: parseInt(latitude),
      longitude: parseInt(longitude),
      description_venue: description_venue,
    };

    const myPromise = axios
      .put(`https://grupproject.site/venues/${getCookie("id")}`, data)
      .then(() => {
        getDetail();
        setShow(false);
      });
    toast.promise(myPromise, {
      loading: "Saving...",
      success: "Update Successfully",
      error: "Update Failed",
    });
  };

  const ShowMap = dynamic(() => import('../../components/ShowMap'), {
    ssr: false,
  })

  useEffect(() => {
    const idN = parseInt(id)
    const newResult = idN === detail.user_id
    setResult(newResult)
  }, [detail,id])

  return (
    <Row className={`${styles.container}`}>
      <div>
        <Toaster />
      </div>
      <DetailLayout
        detail={detail.foto_venue}
        user_id={detail.user_id}
        handleForm={handleForm}
        handleFoto={handleFoto}
        handleShow={() => setShowAddFoto(true)}
        showAddFoto={showAddFoto}
        handleClose={() => setShowAddFoto(false)}
        getDetail={getDetail}
      />
      <Col md="12" lg="8" className={styles.containerRight}>
        <DetailHeading page="detail" item={detail} />
        <Row className={styles.description}>
          <Row>
            <div className={styles.descTitle}>
              <h5>Description :</h5>
              {result ? <OverlayTrigger
                key="top"
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`}>Edit this page ?</Tooltip>
                }
              >
                <Button
                  variant="success"
                  className={styles.buttonEdit}
                  onClick={() => setShow(true)}
                >
                  <AiFillEdit size={35} />
                </Button>
              </OverlayTrigger> : <></>
              }
            </div>
          </Row>
          <Row>
            <p className={styles.descBody}>{detail.description_venue}</p>
          </Row>
          <Row className={styles.location}>
            <h5 className="mb-2 fw-reguler">Lokasi :</h5>
            <p className={`${styles.fontLato} mb-4`}>{detail.address_venue}</p>
            <div className="p-2" style={{ backgroundColor: "lightgrey" }}>
              <div className="my-1 mb-2 mx-auto text-dark w-50 text-center fs-6">Click map to see location</div>
              <ShowMap marker={detail} />
            </div>
          </Row>
        </Row>
      </Col>

      {/* Modal */}
      <AddModal
        add="venue"
        show={show}
        handleClose={() => setShow(false)}
        handleInput={handleInput}
        handleSubmit={handleSubmit}
      />
    </Row>
  );
};

export default Detail;
