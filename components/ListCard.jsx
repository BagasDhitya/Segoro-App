import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { MdDeleteOutline } from "react-icons/md";
import styles from "../styles/Detail.module.css";

const ListCard = ({ item, handleDelete }) => {
  const router = useRouter();
  const handleDetail = (item) => {
    router.push("/venue/detail");
    setCookie("id", item.id);
  };

  return (
    <Row className={`${styles.listContainer} mb-5 pb-5`}>
      {item?.map((item, index) => {
        return (
          <Col
            sm={6}
            md={4}
            lg={3}
            className="mt-5 d-flex justify-content-center"
            key={index}
          >
            <Card
              style={{ width: "18rem" }}
              className={`${styles.cardItem} shadow`}
            >
              <Card.Img
                style={{ minHeight: "20rem", maxHeight: "66%" }}
                variant="top"
                src={item.foto_venue === null ? "/noImage.jpg" : item.foto_venue[0].foto_venue}
                onClick={() => handleDetail(item)}
              />
              <Card.Body onClick={() => handleDetail(item)}>
                <Card.Title className={`${styles.fontOpen}`}>
                  {item.name_venue}
                </Card.Title>
                <Card.Text className={`${styles.fontLato} fs-5 fw-bold`}>
                  {!item.min_price ? <span>Available Soon</span> : <span>Rp {item.min_price} - Rp {item.max_price}</span>}
                </Card.Text>
                <div>{item.name_user}</div>
              </Card.Body>

            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ListCard;
