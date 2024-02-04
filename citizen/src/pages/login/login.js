import React, { useState } from "react";
import "./login.css";
import register from '../../images/bitcoin.svg'
import log from '../../images/recycle.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { byPrefixAndName } from '@awesome.me/kit-KIT_CODE/icons'
import { faEnvelope, faIdBadge, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import icon from '../../images/icon_black.png'

const Login = () => {
  const [isSignUpMode, setSignUpMode] = useState(false);

  const handleSignUpClick = () => {
    setSignUpMode(true);
  };

  const handleSignInClick = () => {
    setSignUpMode(false);
  };
  return (
    <>
      <div className={`containerLogin ${isSignUpMode ? 'sign-up-mode' : ''}`}>
        
        <div className="forms-container">

          <div className="signin-signup">

            <form action="#" className="sign-in-form">
            <img src={icon} style={{width: '350px', height:'50px', marginBottom:'70px'}} alt="register" />

              <h2 className="title">Log In</h2>
              <div className="input-field">
              <FontAwesomeIcon className="fontawesome-icon" icon={faUser} />
                <input type="text" placeholder="Username" />
              </div>
              <div className="input-field">
              <FontAwesomeIcon className="fontawesome-icon" icon={faLock}  />
                <input type="password" placeholder="Password" />
              </div>
              <input type="submit" value="Login" className="button solid" />
            </form>
            <form action="#" className="sign-up-form">
            <img src={icon} style={{width: '350px', height:'50px', marginBottom:'70px'}} alt="register" />

              <h2 className="title">Sign up</h2>
              <div className="input-field">
              <FontAwesomeIcon className="fontawesome-icon" icon={faUser} />
                <input type="text" placeholder="Username" />
              </div>
              <div className="input-field">
              <FontAwesomeIcon className="fontawesome-icon" icon={faIdBadge}  />

                <input type="text" placeholder="Id Card" />
              </div>
              <div className="input-field">
              <FontAwesomeIcon className="fontawesome-icon" icon={faEnvelope}  />
                <input type="email" placeholder="Email" />
              </div>
              <div className="input-field">
              <FontAwesomeIcon className="fontawesome-icon" icon={faLock}  />

                <input type="password" placeholder="Password" />
              </div>
              <input type="submit" className="button" value="Sign up" />
            </form>
          </div>
        </div>
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>
                Sign up to be part of GreenEarn community and get all benefits from recyling and earning crypto 
              </p>
              <button className="button transparent" id="sign-up-btn" onClick={handleSignUpClick}>
                Sign up
              </button>
            </div>
            <img src={log} className="image" alt="login" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>
                Sign in and continue recycling and earning with GreenEarn
              </p>
              <button className="button transparent" id="sign-in-btn" onClick={handleSignInClick}>
                Log In
              </button>
            </div>
            <img src={register} className="image" alt="register" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
