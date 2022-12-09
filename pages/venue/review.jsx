import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { Col, OverlayTrigger, Row, Tooltip, Button } from "react-bootstrap";
import { DetailHeading, DetailLayout } from "../../components/DetailLayout";
import { AiFillStar } from "react-icons/ai";
import { IoAddOutline } from "react-icons/io5";
import styles from "../../styles/Review.module.css";
import { AddModal } from "../../components/AddModal";
import swal from "sweetalert";
import toast from "react-hot-toast";

const Review = () => {
  const [show, setShow] = useState(false);
  const [showAddFoto, setShowAddFoto] = useState(false);
  // const [cookiess, setCookiess] = useState();
  const [detail, setDetail] = useState([]);
  const [reviews, setReviews] = useState([]);

  // get detail venue
  const getDetail = () => {
    axios
      .get(`https://grupproject.site/venues/${getCookie("id")}`)
      .then((res) => {
        setDetail(res.data.data);
      });
  };

  // get all review in id venue
  const getReviews = () => {
    axios
      .get(`https://grupproject.site/reviews/${getCookie("id")}`)
      .then((res) => {
        setReviews(res.data.data);
      });
  };

  useEffect(() => {
    getDetail();
    getReviews();
  }, []);

  // add foto
  const handleForm = (e) => {
    const files = e.target.files;
    setInputFoto(files);
  };
  const handleFoto = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    data.append("foto_venue", inputFoto[0]);

    axios
      .post(`https://grupproject.site/venues/foto/${getCookie("id")}`, data)
      .then((res) => {
        const RES = res.data;
        getDetail();
        swal(RES.status, RES.message, "success").then(setShowAddFoto(false));
      })
      .catch((err) => console.log(err));
  };

  // add new review
  const [addReview, setAddReview] = useState({
    name_user: getCookie("user"),
    venue_id: parseInt(getCookie("id")),
    user_id: parseInt(getCookie("user_id")),
    rate: parseInt(),
    feedback: "",
    foto_review: null,
  });

  const handleInput = (e) => {
    const target = e.target;
    let newReview = { ...addReview };
    if (target.type === "file") {
      newReview[e.target.name] = target.files[0];
      setAddReview(newReview);
    } else {
      newReview[e.target.name] = target.value;
      setAddReview(newReview);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (var i in addReview) {
      data.append(i, addReview[i]);
    }
    const myPromise = axios
      .post("https://grupproject.site/reviews", data)
      .then(() => {
        getReviews();
        setShow(false);
      });
    toast.promise(myPromise, {
      loading: "Saving...",
      success: "Adding Success!",
      error: "Adding Fail",
    });
  };

  return (
    <Row className={styles.container}>
      <DetailLayout
        detail={detail.foto_venue}
        handleForm={handleForm}
        handleFoto={handleFoto}
        handleShow={() => setShowAddFoto(true)}
        showAddFoto={showAddFoto}
        handleClose={() => setShowAddFoto(false)}
      />
      <Col md="12" lg="8">
        <div className={styles.containerRight}>
          <DetailHeading page="review" item={detail} />
          <div className={styles.reviewBody}>
            <div className={styles.titleBody}>
              <h5>Review :</h5>
            </div>
            <div>
              <OverlayTrigger
                key="top"
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Add review ?</Tooltip>}
              >
                <Button
                  variant="success"
                  className={styles.buttonAdd}
                  onClick={() => setShow(true)}
                >
                  <IoAddOutline size={35} />
                </Button>
              </OverlayTrigger>
            </div>
            <div className={styles.reviewBox}>
              {reviews?.length < 1 ? <>No reviews for this venue</> :
                reviews?.map((obj, index) => {
                  const { name_user, foto_user, rate, feedback, foto_review } =
                    obj;
                  if (rate > 5) {
                    var greyStars = 0
                  } else {
                    var greyStars = 5 - rate
                  }

                  console.log(greyStars)

                  return (
                    <Row className={styles.reviewItem} key={index}>
                      <div>
                        {[...Array(rate)].map((e, i) => {
                          return (
                            <AiFillStar color="#F6DE05" key={i} size={30} />
                          )
                        })}
                        {[...Array(greyStars)].map((e, i) => {
                          return (
                            <AiFillStar key={i} color="grey" size={30} />
                          )
                        })}
                      </div>
                      <div className={styles.reviewProfile}>
                        <div>
                          <Image
                            alt=""
                            className={styles.imageProfile}
                            src={foto_user ? foto_user : "/profile.jpg"}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className={styles.nameProfile}>
                          <h6>{name_user}</h6>
                        </div>
                      </div>
                      <div>
                        <p>{feedback}</p>
                      </div>
                      <div className={styles.imageBox}>
                        <Image
                          alt=""
                          className={styles.imageReview}
                          src={foto_review}
                          width={80}
                          height={50}
                        />
                      </div>
                    </Row>
                  );
                })
              }
            </div>
          </div>
        </div>
      </Col>

      {/* Modal */}
      <AddModal
        add="review"
        show={show}
        handleClose={() => setShow(false)}
        handleInput={handleInput}
        handleSubmit={handleSubmit}
      />
    </Row>
  );
};

export default Review;
