import React from "react";
import { Table } from "react-bootstrap";
import styles from "../../styles/BookingOwner.module.css";

const Bookinglist = () => {
  return (
    <div className={`${styles.container} container`}>
      <div className={styles.title}>
        <h3>Your Schedule</h3>
      </div>
      <div>
        <Table responsive="sm">
          <thead className={styles.titleTable}>
            <tr>
              <th  className="fw-bold">Venue</th>
              <th  className="fw-bold">Field</th>
              <th  className="fw-bold">Schedule</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gor Konoha</td>
              <td>Lapangan Basket</td>
              <td>Jumat 09.00-11.00</td>
            </tr>
            <tr>
              <td>Gor Konoha</td>
              <td>Lapangan Basket</td>
              <td>Jumat 09.00-11.00</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Bookinglist;
