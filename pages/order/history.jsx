import axios from "axios";
import { getCookie } from "cookies-next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { Accordion, Badge, Col, Row } from "react-bootstrap";

const Index = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true)

  const getHistory = () => {
    axios
      .get(`https://grupproject.site/history/?user_id=${getCookie("user_id")}`)
      .then((res) => {
        setList(res.data.data)
        setLoading(false)
      });
  };

  useEffect(() => {
    setTimeout(() => {
      getHistory();
    }, 3000);
  }, []);

  return (
    <Row className="mb-5">
      <Row className="ms-5 my-5">
        <h2>Booking History</h2>
      </Row>
      {loading ?
        <ReactLoading
        className="mx-auto d-flex justify-content-center"
          type="bubbles"
          color="#81ADA8"
          height={700}
          width={400}
        /> :
        <>
          {list?.length < 1 ? (
            <p className="fs-5 text-center">Booking History is Empty</p>
          ) : (
            list?.map((item, index) => {
              return (
                <>
                  <Accordion
                    style={{ paddingRight: "200px", paddingLeft: "200px" }}
                  >
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <Row className="w-75 mx-auto d-flex border-bottom border-5 shadow-sm pb-4">
                          <Row key={index} className="ms-0 my-2 fs-4 fw-bold">
                            {item.name_user}
                          </Row>
                          <Col lg={2} className="d-flex align-items-center">
                            <Image alt="" src="/futsal.jpg" width={300} height={240} />
                          </Col>
                          <Col lg={6} className="py-2">
                            <p className="fs-5 fw-bold my-2 lh-sm">
                              {item.name_venue} - {item.category}{" "}
                            </p>
                            <p>
                              {item.start_hours} - {item.end_hours}
                            </p>
                            <p>Rp {item.price}</p>
                          </Col>
                          <Col
                            lg={4}
                            className="d-flex justify-content-center align-items-center"
                          >
                            <Badge bg={(
                              item.status_payment === "Pending" && "warning" || 
                              item.status_payment === "Paid" && "success"
                            )}>{item.status_payment}</Badge>
                          </Col>
                        </Row>
                      </Accordion.Header>
                      <Accordion.Body className="text-center">
                        <h6>Virtual Account</h6>
                        <h3>{item.virtual_account}</h3>
                        <div className="text-start px-5">
                          <h6 className="px-5">
                            Payment Method : Transfer Bank {item.payment_method}
                          </h6>
                          <h6 className="px-5">Order ID : {item.order_id}</h6>
                          <h6 className="px-5">
                            Status Payment : {item.status_payment}
                          </h6>
                          <h6 className="px-5">
                            Transaction time : {item.transaction_time}
                          </h6>
                          <h6 className="px-5">
                            Transaction expire : {item.transaction_exp}
                          </h6>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </>
              );
            })
          )}
        </>
      }

    </Row>
  );
};

export default Index;
