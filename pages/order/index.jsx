import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import {
  Badge,
  Button,
  Col,
  Form,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import bca from "../../public/bca.png";
import styles from "../../styles/BookingOwner.module.css";

const Index = () => {
  const [userId, setUserId] = useState(0);
  const [allBooking, setAllBooking] = useState([]);
  const [show, setShow] = useState(false);
  const [showVa, setShowVa] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [va, setVa] = useState("");
  const router = useRouter();

  const payButtonEnter = () => {
    setIsHover(true);
  };
  const payButtonLeave = () => {
    setIsHover(false);
  };

  const handleShow = () => {
    setShow((prev) => !prev);
  };

  // get all booking list
  const getBookingList = async () => {
    await axios
      .get(`https://grupproject.site/bookings?user_id=${getCookie("user_id")}`)
      .then((res) => {
        setAllBooking(res.data.data);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      getBookingList();
    }, 1000);
  }, []);

  // get payment method
  const [paymentMethod, setPaymentMethod] = useState({
    payment_method: "",
  });
  const inputPayment = (e) => {
    let newPaymentMethod = { ...paymentMethod };
    newPaymentMethod[e.target.name] = e.target.id;
    setPaymentMethod(newPaymentMethod);
  };
  const getPaymentMethod = (e, id, va) => {
    e.preventDefault();
    const { payment_method } = paymentMethod;
    const data = { payment_method: payment_method };
    const myPromise = axios
      .post(`https://grupproject.site/bookings/${id}/addpayment`, data)
      .then(() => {
        getBookingList();
        setVa(va);
        setShow(false);
        // deleteBooking(id);
        router.push("/order/history");
      });
    toast.promise(myPromise, {
      loading: "Saving...",
      success: "Success get virtual account!",
      error: "Fail get virtual account",
    });
  };

  // Confirm payment
  const confirmPayment = () => {
    setShowVa(false);
    getBookingList;
  };

  // Delete booking
  const deleteBooking = (id) => {
    var config = {
      method: "delete",
      url: `https://grupproject.site/bookings/${id}`,
    };
    const myPromise = axios(config).then(() => {
      getBookingList();
    });
    toast.promise(myPromise, {
      loading: "Saving...",
      success: "Delete Success!",
      error: "Delete Failed",
    });
  };

  const handleSubmit = () => { };

  return (
    <Row className="mb-5">
      <Row className="ms-5 my-5">
        <h2>Pay Venue</h2>
      </Row>

      {allBooking?.length < 1 ? (
        // <p className="fs-5 text-center">List Order is Empty</p>
        <></>
      ) : (
        allBooking?.map((obj, index) => {
          const {
            name_venue,
            name_user,
            category,
            total_price,
            booking_id,
            start_hours,
            end_hours,
            status_payment,
            transaction_exp,
            virtual_account,
          } = obj;
          return (
            <>
            {status_payment === "pending" && <Row
              key={index}
              className="w-75 mx-auto d-flex border-bottom border-5 shadow-sm pb-4"
            >
              <Row className="ms-0 my-2 fs-4 fw-bold">{name_user}</Row>
              <Col lg={2} className="d-flex align-items-center">
                <Image alt="" src="/basket.jpg" width={300} height={240} />
              </Col>
              <Col lg={6} className="py-2">
                <p className="fs-5 fw-bold my-2 lh-sm">
                  {name_venue} - {category}
                </p>
                <p>
                  {start_hours} - {end_hours}
                </p>
              </Col>
              <Col
                lg={4}
                className="d-flex justify-content-center align-items-center"
              >
                <Badge pill bg="primary">
                  {status_payment}
                </Badge>
                <Button
                  className={`${styles.button}`}
                  onClick={() => setShow(true)}
                >
                  Rp {total_price}
                </Button>
                <AiOutlineDelete
                  className={`${styles.icon}`}
                  color="#EE0000"
                  size={30}
                  onClick={() => deleteBooking(booking_id)}
                />
              </Col>
              {/* Modal Payment Method */}
              <Modal centered show={show} onHide={() => setShow(false)}>
                <Modal.Header
                  closeButton
                  style={{ backgroundColor: "#D9EFED" }}
                >
                  <Modal.Title>Payment Method</Modal.Title>
                </Modal.Header>
                <Form
                  onSubmit={(e) =>
                    getPaymentMethod(e, booking_id, virtual_account)
                  }
                >
                  <Modal.Body>
                    <ListGroup onChange={(e) => inputPayment(e)}>
                      <Form.Check
                        type="radio"
                        id="BCA"
                        className="d-flex flex-row-reverse justify-content-between mb-2"
                      >
                        <Form.Check.Input type="radio" name="payment_method" />
                        <Form.Check.Label className={styles.boxbank}>
                          <div>
                            <Image alt="" src="/bca.png" width={40} height={40} />
                          </div>
                          <div>Bank BCA</div>
                        </Form.Check.Label>
                      </Form.Check>
                      <Form.Check
                        type="radio"
                        id="BNI"
                        className="d-flex flex-row-reverse justify-content-between mb-2"
                      >
                        <Form.Check.Input type="radio" name="payment_method" />
                        <Form.Check.Label className={styles.boxbank}>
                          <div>
                            <Image alt="" src="/bni.png" width={40} height={40} />
                          </div>
                          <div>Bank BNI</div>
                        </Form.Check.Label>
                      </Form.Check>
                      <Form.Check
                        type="radio"
                        id="BRI"
                        className="d-flex flex-row-reverse justify-content-between"
                      >
                        <Form.Check.Input type="radio" name="payment_method" />
                        <Form.Check.Label className={styles.boxbank}>
                          <div>
                            <Image alt="" src="/bri.png" width={40} height={40} />
                          </div>
                          <div>Bank BRI</div>
                        </Form.Check.Label>
                      </Form.Check>
                    </ListGroup>
                  </Modal.Body>
                  <Modal.Footer
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor: "#D9EFED",
                    }}
                  >
                    <div>
                      <div>Total Cost</div>
                      <h5>Rp {total_price}</h5>
                    </div>
                    <div>
                      <button
                        style={{
                          background: "#405654",
                          color: "#ECF7F6",
                          paddingTop: "5px",
                          paddingBottom: "5px",
                          paddingRight: "20px",
                          paddingLeft: "20px",
                          borderRadius: "10px",
                          border: "none",
                        }}
                        onMouseEnter={payButtonEnter}
                      >
                        Pay
                      </button>
                    </div>
                  </Modal.Footer>
                </Form>
              </Modal>

              {/* Modal for deliver virtual account */}
              <Modal centered show={showVa} onHide={() => setShowVa(false)}>
                <Modal.Body>
                  <div>
                    This is your virtual account payment. Please pay the bill
                    before {transaction_exp}. We have sent your invoice to
                    email.
                  </div>
                  <div>
                    <h5>Virtual Account</h5>
                    <h3>{virtual_account}</h3>
                  </div>
                  <div>
                    <p>Please confirm your payment</p>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={confirmPayment}>Confirm Payment</Button>
                </Modal.Footer>
              </Modal>
            </Row>}
            </>
          );
        })
      )}
    </Row>
  );
};

export default Index;
