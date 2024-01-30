import React from "react";
import icon from "../images/EarnGreen Icons/icon_black.png";

const Home = () => {
  return (
    <div className="home-page ">
      <img className="logo-home" style={{width: '600px', height:'120px', marginTop:'70px'}}  src={icon} alt="Logo" />
      <div className="welcome-container">
        <h1>Welcome to GreenEarn Management App</h1>
      </div>
    </div>
  );
};

export default Home;
