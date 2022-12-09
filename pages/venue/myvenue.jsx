import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { IoAddOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import toast, { Toaster } from "react-hot-toast";
// Import Components
import { AddModal } from "../../components/AddModal";
import styles from "../../styles/MyVenue.module.css";
import MyCard from "../../components/MyCard";

const Myvenue = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [allVenue, setAllVenue] = useState([]);
  const [cookiess, setCookiess] = useState();
  const [usercookie, setUsercookie] = useState();
  const [venue, setVenue] = useState({
    name_venue: "",
    Address_venue: "",
    latitude: 0,
    longitude: 0,
    description_venue: "",
  });

  useEffect(() => {
    setCookiess(getCookie("id"));
    setVenue({ ...venue, latitude: getCookie("lat"), longitude: getCookie("lng") })
  }, [venue]);

  // Get all venues
  const getVenues = () => {
    var axios = require("axios");
    var data = "";

    var config = {
      method: "get",
      url: `https://grupproject.site/venues?user_id=${getCookie("user_id")}`,
      data: data,
    };

    axios(config).then(function (resp) {
      setAllVenue(resp.data.data);
    });
  };

  // Add new venue
  const handleInput = (e) => {
    let newvenue = { ...venue };
    newvenue[e.target.name] = e.target.value;
    setVenue(newvenue);
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
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      description_venue: description_venue,
    };

    axios.post("https://grupproject.site/venues", data)
      .then(() => {
        deleteCookie("lat")
        deleteCookie("lng")
        getVenues();
        swal("Success", "Add new venue success", "success")
          .then(setShow(false))
      });
  };

  useEffect(() => {
    getVenues();
  }, []);

  // delete venue
  const handleDelete = (id) => {
    swal("Delete Venue", "Are you sure?", "warning", {
      dangerMode: true,
      buttons: true,
    })
      .then((res) => {
        if (res) {
          const myPromise = axios.delete(`https://grupproject.site/venues/${id}`)
            .then(() => {
              getVenues();
            });
          toast.promise(myPromise, {
            loading: "Waiting...",
            success: "Delete Successfully",
            error: "Delete Failed",
          });
        }
      })
  };


  return (
    <div>
      <Toaster />
      <div className={`${styles.container} container`}>
        <h2 className={styles.title}>My Venue</h2>
        <Row className={styles.boxBody}>
          <Col className={styles.boxAmount}>
            <span className={styles.amount}>{allVenue?.length}</span>
            <span> Venues</span>
          </Col>
          <Col className={styles.rightCol}>
            <div>
              <button
                className={styles.addButton}
                onClick={() => setShow(true)}
              >
                <IoAddOutline size={20} />
                <div>Add New Venue</div>
              </button>
            </div>
          </Col>
        </Row>
      </div>
      <Row>
        <MyCard item={allVenue} handleDelete={(id) => handleDelete(id)} />
      </Row>

      {/* Modal */}
      <AddModal
        add="venue"
        show={show}
        handleClose={() => setShow(false)}
        handleInput={handleInput}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Myvenue;
