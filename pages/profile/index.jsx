import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Col, Row, Table } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { TbSoccerField } from "react-icons/tb";
import { BsCalendarCheck } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineSchedule } from "react-icons/ai";
import { MdOutlineDashboard } from "react-icons/md";
import { useRouter } from "next/router";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import toast, { Toaster } from "react-hot-toast";
import ReactLoading from "react-loading";
import axios from "axios";
import { BsFillCameraFill } from "react-icons/bs";
// import Components
import { useNavbarContext } from "../../context/contextNavbar";
import { AddModal, RegisPlus } from "../../components/AddModal";
import styles from "../../styles/Profile.module.css";
import { useFotoContext } from "../../context/fotoNavbar";

const Index = () => {
  // active nav
  const { setStatusNav } = useNavbarContext();
  useEffect(() => {
    setStatusNav("profile");
  }, [setStatusNav]);

  const router = useRouter();
  const { fotoProfile, setFotoProfile } = useFotoContext()
  const [show, setShow] = useState(false);
  const [add, setAdd] = useState("profile");
  const [show2, setShow2] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState({
    role: "user",
    owner: ""
  });
  const [update, setUpdate] = useState({
    name_user: "",
    address_user: "",
  });

  const handleLogout = () => {
    deleteCookie("token");
    deleteCookie("user");
    deleteCookie("user_id");
    deleteCookie("foto_user");
    deleteCookie("role");
    deleteCookie("user_owner");
    toast.success("You have been logout");
    router.push("/login");
  };

  const getProfile = () => {
    setLoading(true);
    axios
      .get(`https://grupproject.site/users/${getCookie("user_id")}`)
      .then((res) => {
        const data = res.data.data;
        setProfile(data);
        setUpdate({
          ...update,
          name_user: data.name_user,
          address_user: data.address_user
        })
        setLoading(false)
      })
      .catch(err => console.error(err))
  }
  useEffect(() => {
    getProfile()
    setStatus({ ...status, role: getCookie("role"), owner: getCookie("user_owner") })
  }, [])

  const handleImage = () => {
    setShow(true);
    setAdd("profileImage");
  };
  const handleEdit = () => {
    setShow(true);
    setAdd("profile");
  };

  const handleInput = (e) => {
    const target = e.target;
    let newUpdate = { ...update };
    if (target.type === "file") {
      newUpdate[e.target.name] = target.files[0];
      setUpdate(newUpdate);
    } else {
      newUpdate[e.target.name] = target.value;
      setUpdate(newUpdate);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    for (var i in update) {
      data.append(i, update[i]);
    }
    setCookie("user", update.name_user)

    const myPromise = axios
      .put("https://grupproject.site/users", data)
      .then((res) => {
        setShow(false);
        getProfile();
      })
      .catch((err) => console.error(err));

    toast.promise(myPromise, {
      loading: "Saving...",
      success: "Update Successfully",
      error: "Update Failed",
    });
  };

  const handleReg = (e) => {
    setFile(e.target.files[0])
  }

  const handleRegSubmit = (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append("foto_owner", file)
    axios.post("https://grupproject.site/users/owner", data)
      .then(() => swal("Register success", "Please wait admin to aprove your request", "success").then(setShow(false)))
      .catch(() => swal("Register Failed", "Please try again later", "error"))
  }

  setFotoProfile(profile?.foto_user)
  return (
    <div>
      <div>
        <Toaster />
      </div>
      {loading ? (
        <Row className="d-flex justify-content-center align-items-center">
          <ReactLoading
            type="bubbles"
            color="#81ADA8"
            height={667}
            width={375}
          />
        </Row>
      ) : (
        <Row className={styles.container}>
          <Col md="4">
            <div className={styles.colLeft}>
              <div className={styles.topBox}>
                <h5 className="mb-0">General</h5>
                <div className={styles.itemLeft} onClick={handleEdit}>
                  <div>
                    <FiEdit size={30} />
                  </div>
                  <div className={styles.itemLabel}>Edit Profile</div>
                </div>
                <div
                  className={styles.itemLeft}
                  onClick={() => router.push("/schedule")}
                >
                  <div>
                    <AiOutlineSchedule size={30} />
                  </div>
                  <div className={styles.itemLabel}>My Schedule</div>
                </div>
                {(status.owner &&
                  <>
                    <h5 className="mt-2 mb-0">Owner</h5>
                    <div
                      className={styles.itemLeft}
                      onClick={() => router.push("/venue/myvenue")}
                    >
                      <div>
                        <TbSoccerField size={30} />
                      </div>
                      <div className={styles.itemLabel}>My Venues</div>
                    </div>
                    <div
                      className={styles.itemLeft}
                      onClick={() => router.push("/profile/bookinglist")}
                    >
                      <div>
                        <BsCalendarCheck size={30} />
                      </div>
                      <div className={styles.itemLabel}>My Booking List</div>
                    </div>
                  </>)

                }

                {status.role === "admin" &&
                  <>
                    <h5 className="mt-2 mb-0">Admin</h5>
                    <div
                      className={styles.itemLeft}
                      onClick={() => router.push("/admin")}
                    >
                      <div>
                        <MdOutlineDashboard size={30} />
                      </div>
                      <div className={styles.itemLabel}>Admin Dashboard</div>
                    </div>
                  </>
                }

              </div>

              <div className={styles.bottomBox}>
                {!status.owner ?
                  <div className={styles.beOwner}>
                    Become an Owner?
                    <span onClick={() => setShow2(true)}> Click Here!</span>
                  </div> : <></>}
                <div>
                  <div className={styles.logOut} onClick={handleLogout}>
                    <div>
                      <BiLogOut size={30} />
                    </div>
                    <div className={styles.itemLabel}>Log Out</div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col md="8">
            <div className={styles.colRight}>
              <div className={styles.topItem}>
                <h2>My Profile</h2>
                <p>
                  Manage your profile information to control, protect and secure
                  your account
                </p>
              </div>
              <div className={styles.imageBox}>
                <div className={styles.colorBox} onClick={handleImage}>
                  <Image
                    alt=""
                    src={
                      profile?.foto_user ? profile?.foto_user : "/profile.jpg"
                    }
                    width={250}
                    height={250}
                    className={styles.imageProfile}
                  />
                  <ReactLoading
                    type="bars"
                    color="white"
                    height={100}
                    width={100}
                    className={`position-absolute ${styles.loadingImage}`}
                  />
                  <Row
                    className={`${styles.middle} d-flex justify-content-center text-center ms-0 fs-5 fw-bold`}
                  >
                    <BsFillCameraFill size={50} />
                    Change Profile Picture
                  </Row>
                </div>
              </div>
              <div>
                <Table className={styles.tableBox}>
                  <tbody>
                    <tr>
                      <td>Username</td>
                      <td>{profile?.name_user}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>{profile?.email}</td>
                    </tr>
                    <tr>
                      <td>Role</td>
                      <td>{profile?.role}{(status.owner && "+")}</td>
                    </tr>
                    <tr>
                      <td>Address</td>
                      <td>{profile?.address_user}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* Modal */}
      <AddModal
        add={add}
        profile={update}
        show={show}
        handleClose={() => setShow(false)}
        handleInput={handleInput}
        handleSubmit={handleSubmit}
      />

      {/* Modal for register user plus */}
      <RegisPlus show={show2} handleClose={() => setShow2(false)} handleRegSubmit={handleRegSubmit} handleReg={handleReg} />
    </div>
  );
};

export default Index;
