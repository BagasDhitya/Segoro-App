import axios from "axios";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import TimePicker from "react-bootstrap-time-picker";
import {
  Button,
  Col,
  ListGroup,
  OverlayTrigger,
  Row,
  Tooltip,
  Tabs,
  Tab,
} from "react-bootstrap";
import { BsInfoLg } from "react-icons/bs";
import { IoAddOutline } from "react-icons/io5";
import { AiFillEdit, AiOutlineDelete, AiOutlineClose } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import styles from "../../styles/Field.module.css";
import { DetailHeading, DetailLayout } from "../../components/DetailLayout";
import { AddModal, AddSchedule, EditField } from "../../components/AddModal";
import { getCookie } from "cookies-next";

const Field = () => {
  const router = useRouter();
  const [summon, setSummon] = useState(false);
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddFoto, setShowAddFoto] = useState(false);
  const [showAddSc, setShowAddSc] = useState(false);
  const [detail, setDetail] = useState([]);
  const [fields, setFields] = useState([]);
  const [idField, setIdField] = useState();
  const [result, setResult] = useState(null);
  const [cookiess, setCookiess] = useState();
  const [id, setId] = useState();
  const [allSchedule, setAllSchedule] = useState([]);
  const [perHour, setPerHour] = useState([]);
  const [idVenue, setIdVenue] = useState([]);
  const [userId, setUserId] = useState(false);
  const [user_id, setID] = useState(0);
  const [idd, setIdd] = useState("");
  const [hour, setHour] = useState({
    start: 0,
    end: 0,
  });

  useEffect(() => {
    setCookiess(getCookie("id"));
    setId(getCookie("user_id"));
  }, []);

  // get detail venue
  const getDetail = () => {
    axios
      .get(`https://grupproject.site/venues/${getCookie("id")}`)
      .then((res) => {
        setDetail(res.data.data);
      });
  };

  // get all fields ==> ini masih nyampur semua GOR
  const getFields = () => {
    axios
      .get(`https://grupproject.site/fields?venue_id=${getCookie("id")}`)
      .then((res) => {
        setFields(res.data.data);
        console.log(res.data.data);
      });
  };

  useEffect(() => {
    getDetail();
    getFields();
  }, []);

  // get all schedule by id_field
  const getSchedule = (id) => {
    axios
      .get(`https://grupproject.site/schedules?field_id=${id}`)
      .then((res) => {
        setAllSchedule(res.data.data);
      });
  };

  const getID = () => {
    axios
      .get(`https://grupproject.site/venues/${getCookie("id")}`)
      .then((res) => {
        setID(res.data.data.user_id);
      });
  };

  useEffect(() => {
    getSchedule();
    getID();
    setIdd(getCookie("user_id"));
    const ids = parseInt(idd);
    const result = ids === user_id;
    setUserId(result);
  }, [user_id,idd]);

  const handleId = (id) => {
    setIdField(id);
    getSchedule(id);
    getPrice(id);
  };

  const [price, setPrice] = useState(0);
  const getPrice = (id) => {
    axios.get(`https://grupproject.site/fields/${id}`).then((res) => {
      setPrice(res.data.data.price);
    });
  };

  // initiate state addfield
  const [addField, setAddField] = useState({
    venue_id: parseInt(getCookie("id")),
    category: "",
    price: parseInt(),
  });

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

  // Add new field
  const handleInput = (e) => {
    let newField = { ...addField };
    newField[e.target.name] = e.target.value;
    setAddField(newField);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var axios = require("axios");
    const { category, price } = addField;
    var data = {
      venue_id: parseInt(getCookie("id")),
      category: category,
      price: parseInt(price),
    };

    const myPromise = axios
      .post("https://grupproject.site/fields", data)
      .then(() => {
        getFields();
        setShow(false);
      });
    toast.promise(myPromise, {
      loading: "Saving...",
      success: "Adding Success!",
      error: "Adding Fail",
    });
  };

  // initiate state editfield
  const handleEdit = (id) => {
    setShowEdit(true);
    setIdField(id);
  };
  const [editField, setEditField] = useState();
  // Edit field
  const inputEdit = (e) => {
    let updateField = { ...editField };
    updateField[e.target.name] = e.target.value;
    setEditField(updateField);
  };

  const submitEdit = (e, id) => {
    e.preventDefault();
    var axios = require("axios");
    const { category, price } = editField;
    var data2 = {
      venue_id: parseInt(getCookie("id")),
      category: category,
      price: parseInt(price),
    };
    const myPromise = axios
      .put(`https://grupproject.site/fields/${id}`, data2)
      .then(() => {
        getFields();
        setShowEdit(false);
      });
    toast.promise(myPromise, {
      loading: "Saving...",
      success: "Update Success!",
      error: "Update Failed",
    });
  };

  // delete field
  const handleDelete = (id) => {
    var config = {
      method: "delete",
      url: `https://grupproject.site/fields/${id}`,
    };
    const myPromise = axios(config).then(() => {
      getFields();
    });
    toast.promise(myPromise, {
      loading: "Saving...",
      success: "Delete Success!",
      error: "Delete Failed",
    });
  };

  // HANDLING SCHEDULE
  const catchId = (idField) => {
    setShowAddSc(true);
  };

  // Initiate state add schedule
  const [addSchedule, setAddSchedule] = useState({
    field_id: idField,
    day: "",
    start_hours: "",
    end_hours: "",
  });

  const inputAdd = (e) => {
    if (typeof e === "number") {
      const time = e / 3600;
      if (hour.start === 0) {
        if (time < 10) {
          setHour({ ...hour, start: `0${time}:00` });
        } else {
          setHour({ ...hour, start: `${time}:00` });
        }
      } else {
        if (time < 10) {
          setHour({ ...hour, end: `0${time}:00` });
        } else {
          setHour({ ...hour, end: `${time}:00` });
        }
      }
    } else {
      let newSc = { ...addSchedule };
      newSc[e.target.name] = e.target.value;
      setAddSchedule(newSc);
    }
  };

  const inputReset = () => {
    setHour({ ...hour, start: 0, end: 0 });
  };

  const submitAdd = (e) => {
    e.preventDefault();
    var axios = require("axios");
    const { day, start_hours, end_hours } = addSchedule;
    var data = {
      field_id: idField,
      day: day,
      start_hours: hour.start,
      end_hours: hour.end,
    };

    const myPromise = axios
      .post("https://grupproject.site/schedules", data)
      .then(() => {
        getSchedule();
        setShowAddSc(false);
        inputReset();
      });
    toast.promise(myPromise, {
      loading: "Saving...",
      success: "Adding Schedule Success!",
      error: "Adding Fail",
    });
  };

  // get schedule per hour
  const getSchedulePerHour = (id, idVenue) => {
    axios.get(`https://grupproject.site/schedules/${id}`).then((res) => {
      setPerHour(res.data.data.schedule_detail);
      setIdVenue(idVenue);
    });
  };

  // ADD TO CART

  const addCart = (e, item) => {
    e.preventDefault();
    if (item.status_schedule !== "Available") {
      toast.error("Already Booked");
    } else {
      var axios = require("axios");
      var data = {
        field_id: idField,
        schedule_detail_id: item.schedule_detail_id,
        venue_id: idVenue,
      };

      const myPromise = axios
        .post("https://grupproject.site/bookings/addtocart", data)
        .then(() => {
          router.push("/order");
        });
      toast.promise(myPromise, {
        loading: "Saving...",
        success: "Adding Success!",
        error: "Adding Fail",
      });
    }
  };

  useEffect(() => {
    const idN = parseInt(id);
    const newResult = idN === detail.user_id;
    setResult(newResult);
  }, [detail,id]);

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
          <DetailHeading page="field" item={detail} price={price} />

          <div>
            <Row>
              {/* List Schedules */}
              <Col sm="12" md="8">
                <div className={`${styles.scheduleDay}`}>
                  {allSchedule?.length > 7 ? (
                    <>Schedule Not Available</>
                  ) : !allSchedule?.length ? (
                    <>Schedule Not Available</>
                  ) : (
                    allSchedule?.map((obj, index) => {
                      const { day } = obj;
                      return (
                        <div
                          className={`${styles.dayActive}`}
                          key={index}
                          onClick={() =>
                            getSchedulePerHour(obj.schedule_id, obj.venue_id)
                          }
                        >
                          {day}
                        </div>
                      );
                    })
                  )}
                </div>
                <div className={styles.scrollSchedule}>
                  <ListGroup>
                    {perHour?.map((item, index) => {
                      return (
                        <ListGroup.Item
                          key={index}
                          variant={
                            (item.status_schedule === "Available" && "light") ||
                            (item.status_schedule === "booked" && "warning")
                          }
                          action
                          onClick={(e) => addCart(e, item)}
                          className={styles.scheduleItem}
                        >
                          <div className={styles.perItem}>
                            <div>{item.start_hours}</div>
                            <div>{item.end_hours}</div>
                            <div>{item.status_schedule}</div>
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </div>
              </Col>
              <Col sm="12" md="4">
                <div>
                  <ListGroup variant="flush">
                    {fields.length < 1 ? (
                      <>Fields Not Available</>
                    ) : (
                      fields?.map((obj, index) => {
                        const { venue_id, category, price, id } = obj;
                        return (
                          <ListGroup.Item
                            key={index}
                            action
                            onClick={() => handleId(id)}
                            className={styles.listgroup}
                          >
                            <div>{category}</div>
                            {result && (
                              <div>
                                <OverlayTrigger
                                  key="top"
                                  placement="top"
                                  overlay={
                                    <Tooltip id={`tooltip-top`}>
                                      Add Schedule
                                    </Tooltip>
                                  }
                                >
                                  <button
                                    className={styles.addsc}
                                    onClick={() => catchId(id)}
                                  >
                                    <IoAddOutline size={20} />
                                  </button>
                                </OverlayTrigger>
                              </div>
                            )}
                          </ListGroup.Item>
                        );
                      })
                    )}
                  </ListGroup>
                </div>
                {result ? (
                  <div className={`${styles.fabContainer}`}>
                    {summon ? (
                      <Button
                        onClick={() => setSummon(false)}
                        className={styles.button}
                      >
                        <AiOutlineClose size={20} />
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
                              <Tooltip id={`tooltip-left`}>Add Field</Tooltip>
                            }
                          >
                            <Button
                              className={`${styles.infoButton} ${styles.addButton}`}
                              onClick={() => setShow(true)}
                            >
                              <IoAddOutline size={20} />
                            </Button>
                          </OverlayTrigger>
                        </li>
                        <li>
                          <OverlayTrigger
                            key="left"
                            placement="left"
                            overlay={
                              <Tooltip id={`tooltip-left`}>Edit Field</Tooltip>
                            }
                          >
                            <Button
                              className={`${styles.infoButton} ${styles.editButton}`}
                              onClick={() => handleEdit(idField)}
                            >
                              <AiFillEdit size={20} />
                            </Button>
                          </OverlayTrigger>
                        </li>
                        <li>
                          <OverlayTrigger
                            key="left"
                            placement="left"
                            overlay={
                              <Tooltip id={`tooltip-left`}>
                                Delete Field
                              </Tooltip>
                            }
                          >
                            <Button
                              className={`${styles.infoButton} ${styles.deleteButton}`}
                              onClick={() => handleDelete(idField)}
                            >
                              <AiOutlineDelete size={20} />
                            </Button>
                          </OverlayTrigger>
                        </li>
                      </ul>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <></>
                )}
                <div className={styles.colorLegend}>
                  <Row>
                    <Col xs="3">
                      <div className="d-flex justify-content-center py-2">
                        <div className={styles.colorIndexA}></div>
                      </div>
                    </Col>
                    <Col xs="9">
                      <div className="d-flex justify-content-start py-2">
                        <div className={styles.titleIndex}>Available</div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="3">
                      <div className="d-flex justify-content-center py-2">
                        <div className={styles.colorIndexB}></div>
                      </div>
                    </Col>
                    <Col xs="9">
                      <div className="d-flex justify-content-start py-2">
                        <div className={styles.titleIndex}>Booking</div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="3">
                      <div className="d-flex justify-content-center py-2">
                        <div className={styles.colorIndexC}></div>
                      </div>
                    </Col>
                    <Col xs="9">
                      <div className="d-flex justify-content-start py-2">
                        <div className={styles.titleIndex}>Playing</div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="3">
                      <div className="d-flex justify-content-center py-2">
                        <div className={styles.colorIndexD}></div>
                      </div>
                    </Col>
                    <Col xs="9">
                      <div className="d-flex justify-content-start py-2">
                        <div className={styles.titleIndex}>Done</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Col>

      {/* Modal add field*/}
      <AddModal
        add="field"
        show={show}
        handleClose={() => setShow(false)}
        handleInput={handleInput}
        handleSubmit={handleSubmit}
      />

      {/* Modal edit field */}
      <EditField
        showEdit={showEdit}
        closeEdit={() => setShowEdit(false)}
        inputEdit={inputEdit}
        submitEdit={(e) => submitEdit(e, idField)}
      />

      {/* Modal add Schedule */}
      <AddSchedule
        showAdd={showAddSc}
        closeAdd={() => setShowAddSc(false)}
        inputAdd={inputAdd}
        submitAdd={(e) => submitAdd(e)}
        hour={hour}
        inputReset={inputReset}
      />
    </Row>
  );
};

export default Field;
