import React from "react";
import manager from "../images/Programming-bro.svg";
import myVideo from '../images/video.mp4';

const Home = () => {
  return (
    <div className="home-page ">
  
<div className="welcome-container">
        <h1 style={{fontFamily:'monotype corsiva',fontWeight: 800}}>Welcome to GreenEarn Admin Page</h1>

      </div>
      <div className="video-frame">
    
    <div className="video-container">
      <video autoPlay loop style={{width: '670px', height:'100%'}}>
        <source src={myVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div> 
      
   
    </div>
  );
};

export default Home;
