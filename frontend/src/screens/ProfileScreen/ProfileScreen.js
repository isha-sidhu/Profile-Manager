import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import MainScreen from "../../components/MainScreen";
import "./ProfileScreen.css";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../actions/userActions";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { HOBBY_OPTIONS } from "../../constants/userConstants";
import Select from "react-select";
import { BASE_URL } from "../../constants/Const";

const ProfileScreen = ({ location, history }) => {
  const [currentUserId, setCurrentUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pic, setPic] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [dob, setDob] = useState("");
  const [picMessage, setPicMessage] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading, error, success } = userUpdate;

  const fetchData = async (userId) => {
    try {
      const response = await fetch(
        BASE_URL + `/api/users/getProfileById?id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`, // Include the bearer token
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCurrentUserId(userId);
      setName(data.name);
      setEmail(data.email);
      setPic(data.pic);
      setGender(data.gender);
      setHobbies(data.Hobbies);
      setDob(data.dob);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      history.push("/");
    } else {
      const urlParams = new URLSearchParams(location.search);
      const userId = urlParams.get("id");
      if (userId) {
        fetchData(userId);
      } else {
        // If no userId in the URL, use the userInfo from the Redux store
        setCurrentUserId(userInfo._id);
        setName(userInfo.name);
        setEmail(userInfo.email);
        setPic(userInfo.pic);
        setGender(userInfo.gender);
        setHobbies(userInfo.Hobbies);
        setDob(userInfo.dob);
      }
    }
  }, [history, location.search, userInfo]);
  const postDetails = (pics) => {
    setPicMessage(null);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "notezipper");
      data.append("cloud_name", "piyushproj");
      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
        })
        .catch((err) => {});
    } else {
      return setPicMessage("Please Select an Image");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const userData = {
      _id: currentUserId,
      name,
      email,
      password,
      pic,
      gender,
      Hobbies: hobbies,
      dob,
    };
    dispatch(updateProfile(userData));
  };

  return (
    <MainScreen title="EDIT PROFILE">
      <div>
        <Row className="profileContainer">
          <Col md={6}>
            <Form onSubmit={submitHandler}>
              {loading && <Loading />}
              {success && (
                <ErrorMessage variant="success">
                  Updated Successfully
                </ErrorMessage>
              )}
              {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="gender">
                <Form.Label>Gender</Form.Label>
                <div>
                  <Form.Check
                    inline
                    id="Male"
                    type="radio"
                    label="Male"
                    value="Male"
                    checked={gender === "Male"}
                    onChange={() => setGender("Male")}
                  />
                  <Form.Check
                    inline
                    id="Female"
                    type="radio"
                    label="Female"
                    value="Female"
                    checked={gender === "Female"}
                    onChange={() => setGender("Female")}
                  />
                  <Form.Check
                    inline
                    id="Others"
                    type="radio"
                    label="Others"
                    value="Others"
                    checked={gender === "Others"}
                    onChange={() => setGender("Others")}
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="dob">
                <Form.Label>Date of Birth</Form.Label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => {
                    setDob(e.target.value);
                  }}
                />
              </Form.Group>
              {picMessage && (
                <ErrorMessage variant="danger">{picMessage}</ErrorMessage>
              )}
              <Form.Group controlId="pic">
                <Form.Label>Change Profile Picture</Form.Label>
                <Form.File
                  onChange={(e) => postDetails(e.target.files[0])}
                  id="custom-file"
                  type="image/png"
                  label="Upload Profile Picture"
                  custom
                />
              </Form.Group>
              <Form.Group controlId="hobbies">
                <Form.Label>Hobbies</Form.Label>
                <Select
                  isMulti
                  options={HOBBY_OPTIONS}
                  value={hobbies?.map((hobby) => ({
                    value: hobby,
                    label: hobby,
                  }))}
                  onChange={(selectedOptions) =>
                    setHobbies(selectedOptions.map((option) => option.value))
                  }
                />
              </Form.Group>
              <Button
                onClick={() => {
                  history.push("/");
                }}
              >
                Back
              </Button>
              <Button className="float-right" type="submit" varient="primary">
                Update
              </Button>
            </Form>
          </Col>
          <Col
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={pic} alt={name} className="profilePic" />
          </Col>
        </Row>
      </div>
    </MainScreen>
  );
};

export default ProfileScreen;
