import { useRouter } from "next/router";
import React from "react";
import { Col, Row } from "react-bootstrap";
import styles from "../../styles/Admin.module.css";

const Index = () => {
  const router = useRouter();

  return (
    <div>
      <h2 className={styles.title}>Welcome Super Admin!</h2>
      <Row>
        <Col
          className={styles.column}
          onClick={() => router.push("/admin/user-reg")}
        >
          <div className={styles.box}>
            <h4>List User Request</h4>
          </div>
        </Col>
        <Col
          className={styles.column}
          onClick={() => router.push("/admin/user-plus")}
        >
          <div className={styles.box}>
            <h4>List All User</h4>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Index;
