import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import styles from "../../styles/BookingOwner.module.css";

const Bookinglist = () => {
  const [userId, setUserId] = useState();
  const [allBooking, setAllBooking] = useState([]);

  useEffect(() => {
    setUserId(getCookie("user_id"));
  });

  // get all booking list
  const getBookingList = () => {
    axios
      .get(`https://grupproject.site/bookings?UserID=${userId}`)
      .then((res) => {
        setAllBooking(res.data.data);
      });
  };

  useEffect(() => {
    getBookingList();
  }, []);

  return (
    <div className={`${styles.container} container`}>
      <div className={styles.title}>
        <h3>Booking List</h3>
      </div>
      <div>
        <Table responsive="sm">
          <thead className={styles.titleTable}>
            <tr>
              <th className={styles.titleItem}>Field</th>
              <th>Renter</th>
              <th>Schedule</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Transaction Time</th>
            </tr>
          </thead>
          <tbody>
            {allBooking?.map((obj, index) => {
              const {
                user_nama,
                category_field,
                start_hours,
                end_hours,
                total_price,
                status,
                transaction_time,
              } = obj;
              return (
                <tr key={index}>
                  <td>{category_field}</td>
                  <td>{user_nama}</td>
                  <td>
                    {start_hours} - {end_hours}
                  </td>
                  <td>{total_price}</td>
                  <td>{status}</td>
                  <td>{transaction_time}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Bookinglist;
