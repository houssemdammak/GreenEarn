import React from "react";
import manager from "../images/Programming-bro.svg";
import myVideo from '../images/video.mp4';

const Home = () => {
  return (
    <div className="home-page ">
  
<div className="welcome-container">
        <h1 style={{fontFamily:'monotype corsiva'}}>Welcome to GreenEarn<br></br> Admin Page</h1>
        <img style={{width: '350px', height:'250px'}} src={manager} alt=" Logo" />

      </div>
      <div className="video-frame">
    {/* <img className="logo-home" style={{width: '600px', height:'120px', marginTop:'70px'}}  src={icon} alt="Logo" /> */}
    
    <div className="video-container">
      <video autoPlay loop style={{width: '500px', height:'100%'}}>
        <source src={myVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div> 
      
   
    </div>
  );
};

export default Home;
