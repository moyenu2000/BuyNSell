import React, { useState } from "react";
import axios from "axios";
import LocationSelector from "../components/locationSelector";
import { useNavigate } from "react-router-dom";
import "./signUp.css";

const Signup = () => {


  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [locationID, setLocationID] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  

  const validateFirstName = async (value) => {
    setFirstname(value);
  };
  const validateLastName = async (value) => {
    setLastname(value);
  };
  const validateEmail = async (value) => {
    setEmail(value);
    // try {
    //     const response = await axios.get(`http://localhost:8000/checkEmail/${value}`);
    //     if (response.data.exists) {
    //         setEmailError("Email is already in use.");
    //     } else {
    //         setEmailError("");
    //     }
    // } catch (error) {
    //     console.error(error);
    // }
  };

  const validatePassword = (value) => {
    setPassword(value);
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (/*usernameError ||*/ emailError || passwordError) return;
    //console.log('Location ID:', locationID);
    try {
      const response = await axios.post("http://localhost:8000/signup", {
        firstname,
        lastname,
        email,
        password,
        locationID,
      });
      console.log("hello1");
      if (response.status === 200) {
        const userData = response.data[0];
        console.log("hello");
        navigate("/login");
      }
      console.log("hello2");
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="clear-content-wrapper">
      <div className="container">
        <div className="signup-container">
          <h2>Signup</h2>
          <form onSubmit={handleSignup}>
            <input
             className="form-control"
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => validateFirstName(e.target.value)}
            />
            <input
             className="form-control"
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => validateLastName(e.target.value)}
            />

            <input
             className="form-control"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
            />
            {emailError && <div className="error-message">{emailError}</div>}

            <input
             className="form-control"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
            />
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
            <div className="location">
              <LocationSelector onLocationChange={setLocationID} />
            </div>
            <button type="submit">Signup</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
