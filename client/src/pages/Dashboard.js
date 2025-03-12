import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const userData = location.state && location.state.userData; // Check for undefined
  const navigate = useNavigate();

  const handleProduct = async () => {
    navigate('/Products' );
  };
  const handleAddProduct = async ()=>{
    navigate('/AddProduct');
  };

  return (
    <div className="dashboard">
      <h2>Welcome to the Dashboard</h2>
      {userData ? (
        <>
        <div className="user-data">
          <p>User ID: {userData.userID}</p>
          <p>Email: {userData.email}</p>
          <p>First Name: {userData.firstName}</p>
          <p>Last Name: {userData.lastName}</p>
          <p>Location ID: {userData.locationID}</p>
          <p>Reported: {userData.reported}</p>
          
        </div>
        <button className="Product" onClick = {handleProduct}>Go to all Products</button>
         <button className="Add Product" onClick = {handleAddProduct}>Add Products</button>
        </>
        
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
