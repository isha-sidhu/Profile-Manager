import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import "./HomeStyles.css";
import { BASE_URL } from "../../constants/Const";

const ProfileCard = ({ pic, name, email, _id, dob, gender }) => {
  return (
    <div className="profile-card">
      <img src={pic} alt={name} className="profile-pic" />
      <div className="profile-info">
        <h3>{name}</h3>
        <p>{email}</p>
        <p>{gender}</p>
        <p>{dob}</p>
      </div>
      <Button className="w-100" href={`/profile?id=${_id}`}>
        Edit
      </Button>
    </div>
  );
};

function LandingPage({ history }) {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(BASE_URL + "/api/users/getAllProfile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`, // Include the bearer token
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userInfo) {
      fetchData(); // Fetch data only when userInfo is available
    } else {
      history.push("/");
    }
  }, [history, userInfo]);

  return (
    <div id="card-container">
      {userData.map((user) => (
        <ProfileCard key={user._id} {...user} />
      ))}
    </div>
  );
}

export default LandingPage;
