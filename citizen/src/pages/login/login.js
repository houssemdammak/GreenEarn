import React, { useState,useContext } from "react";
import "./login.css";
import register from "../../images/bitcoin.svg";
import log from "../../images/recycle.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { byPrefixAndName } from '@awesome.me/kit-KIT_CODE/icons'
import {  faCheck,  faEnvelope,  faIdBadge,  faLock,  faUser,  faWallet,  faSquareCheck,} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import  AuthContext  from "../../contexts/authContext";

import icon from "../../images/icon_black.png";

const Login = () => {
  //for login
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  //for signup
  const [fullnameError, setfullnameError] = useState("");
  const [emailErrorS, setEmailErrorS] = useState("");
  const [ConfirmpasswordError, setConfirmpasswordError] = useState("");
  const [walletError, setwalletError] = useState("");
  const [passwordErrorS, setpasswordErrorS] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isSignUpMode, setSignUpMode] = useState(false);

  const handleSignUpClick = () => {
    setSignUpMode(true);
    console.log("ena f")
    navigate("/Signup");
  };
  const handleSignInClick = () => {
    setSignUpMode(false);
    navigate("/Login");
  };
  const isPasswordStrong = (password) => {
    // Vérifier la force du mot de passe en fonction de certains critères
    // Vous pouvez modifier ces critères en fonction de vos besoins
    const regexStrong =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regexStrong.test(password);
  };
  const validateWalletID = (walletID) => {
    const addressRegex = /^0x[0-9a-fA-F]{40}$/; // Expression régulière pour valider une adresse Ethereum

    if (!walletID) {
      return "Wallet ID required";
    }
    if (!addressRegex.test(walletID)) {
      return "Wallet ID must be a valid Ethereum address.";
    }

    return ""; // Wallet ID valide
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidemail = emailPattern.test(email);
    console.log(email, password);
    // Réinitialiser les erreurs
    setEmailError("");
    setPasswordError("");

    if (email.length > 0 && password.length > 0 && isValidemail) {
      const formData = {
        email,
        password,
      };

      try {
        const response = await axios.post("/api/citizens/login", formData, {
          headers: { "Content-Type": "application/json" },
        });
        console.log(response);

        //localStorage.setItem('citizensAuth', JSON.stringify(response.data.token));
        ////login teb3a contexte
        login(response.data.token);
        //navigate("/Home");
      } catch (err) {
        console.log(err);
        console.log(err.response);
        console.log(err.response.data.msg);

        if (err.response.data.msg === "Bad password") {
          setPasswordError("Incorrect password");
        }
        if (err.response.data.msg === "Bad credentails") {
          setEmailError("User does not exist");
        }
      }
    } else {
      if (!isValidemail) {
        if (email.length == 0) {
          setEmailError("Please enter your email");
        } else {
          setEmailError("Please enter a valid  email");
        }
      }
      if (password.length == 0) {
        setPasswordError("Please enter your password");
      }
    }
  };
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    ///initialiser les erreur a vide
    setfullnameError("");
    setEmailErrorS("");
    setConfirmpasswordError("");
    setwalletError("");
    setpasswordErrorS("");
    //console.log(e.target.fullname)
    let fullname = (e.target.fullname?.value ?? "").trim();
    let walletid = (e.target.walletid?.value ?? "").trim();
    let email = (e.target.email?.value ?? "").trim();
    let password = (e.target.password?.value ?? "").trim();
    let confirmPassword = (e.target.confirmpassword?.value ?? "").trim();
    //walet id verification
    const errorWallet = "";
    //const errorWallet = validateWalletID(walletid);
    //email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidemail = emailPattern.test(email);
    // confirm password
    const confirmpass = confirmPassword == password;
    //valider password strong
    const validatePassword = isPasswordStrong(password);

    // if(fullname.length > 0 && walletid.length > 0 && email.length > 0 && password.length > 0 &&
    //   confirmPassword.length > 0 &&validatePassword && confirmpass &&isValidemail
    //   ){
    const formData = { fullname, email, password, walletid };

    try {
      const response = await axios.post("/api/citizens/register", formData, {
        headers: { "Content-Type": "application/json" },
      });
      // const response = await fetch('/api/citizens/login', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })
      //console.log(response.token);

      //localStorage.setItem('citizensAuth', JSON.stringify(response.data.token));
      ////login teb3a contexte
      login(response.data.token);
      //navigate("/Home");
    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.response.data.msg);
      if (err.response.data.msg === "Email already in use") {
        setEmailErrorS("Email already in use");
      }
    }

    // }else {
    console.log(confirmpass);
    if (!isValidemail) {
      if (email.length == 0) {
        setEmailErrorS("Please enter your email");
      } else {
        setEmailErrorS("Please enter a valid  email");
      }
    }
    if (fullname.length == 0) {
      setfullnameError("Please enter your fullname");
    }
    if (confirmPassword.length == 0) {
      setConfirmpasswordError("Please confirm your password");
    }
    if (password.length == 0) {
      setpasswordErrorS("Please enter your password");
    }
    if (walletid.length == 0) {
      setwalletError("Please enter your wallet id");
    }
    if (!confirmpass) {
      setConfirmpasswordError("Please confirm your password");
    }
    if (!validatePassword && email.length > 0) {
      setpasswordErrorS("Please enter strong password");
    }
    if (errorWallet != "" && walletid.length > 0) {
      setwalletError("Wallet ID must be a valid Ethereum address.");
    }
    // }
  };

  return (
    <>
      <div className={`containerLogin ${isSignUpMode ? "sign-up-mode" : ""}`}>
        <div className="forms-container">
          <div className="signin-signup">
            <form onSubmit={handleLoginSubmit} className="sign-in-form">
              <img
                src={icon}
                style={{ width: "350px", height: "50px", marginBottom: "70px" }}
                alt="register"
              />

              <h2 className="title">Log In</h2>
              <div className="input-field">
                <FontAwesomeIcon className="fontawesome-icon" icon={faUser} />
                <input type="email" name="email" placeholder="Email" />
              </div>
              {emailError && (
                <span className="error-message">{emailError}</span>
              )}
              <div className="input-field">
                <FontAwesomeIcon className="fontawesome-icon" icon={faLock} />
                <input type="password" name="password" placeholder="Password" />
              </div>
              {passwordError && (
                <span className="error-message">{passwordError}</span>
              )}
              <input type="submit" value="Login" className="button solid" />
            </form>
            <form onSubmit={handleSignUpSubmit} className="sign-up-form">
              <img
                src={icon}
                style={{ width: "350px", height: "50px", marginBottom: "70px" }}
                alt="register"
              />

              <h2 className="title">Sign up</h2>
              <div className="input-field">
                <FontAwesomeIcon className="fontawesome-icon" icon={faUser} />
                <input type="text" name="fullname" placeholder="Full Name " />
              </div>
              {fullnameError && (
                <span className="error-message">{fullnameError}</span>
              )}

              <div className="input-field">
                <FontAwesomeIcon className="fontawesome-icon" icon={faWallet} />
                <input type="text" name="walletid" placeholder="Wallet ID" />
              </div>
              {walletError && (
                <span className="error-message">{walletError}</span>
              )}

              <div className="input-field">
                <FontAwesomeIcon
                  className="fontawesome-icon"
                  icon={faEnvelope}
                />
                <input type="email" name="email" placeholder="Email" />
              </div>
              {emailErrorS && (
                <span className="error-message">{emailErrorS}</span>
              )}

              <div className="input-field">
                <FontAwesomeIcon className="fontawesome-icon" icon={faLock} />
                <input type="password" name="password" placeholder="Password" />
              </div>
              {passwordErrorS && (
                <span className="error-message">{passwordErrorS}</span>
              )}

              <div className="input-field">
                <FontAwesomeIcon
                  className="fontawesome-icon"
                  icon={faSquareCheck}
                />
                <input
                  type="password"
                  name="confirmpassword"
                  placeholder="Confirm Password"
                />
              </div>
              {ConfirmpasswordError && (
                <span className="error-message">{ConfirmpasswordError}</span>
              )}

              <input type="submit" className="button" value="Sign up" />
            </form>
          </div>
        </div>
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>
                Sign up to be part of GreenEarn community and get all benefits
                from recyling and earning crypto
              </p>
              <button
                className="button transparent"
                id="sign-up-btn"
                onClick={handleSignUpClick}
              >
                Sign up
              </button>
            </div>
            <img src={log} className="image" alt="login" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>Sign in and continue recycling and earning with GreenEarn</p>
              <button
                className="button transparent"
                id="sign-in-btn"
                onClick={handleSignInClick}
              >
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
