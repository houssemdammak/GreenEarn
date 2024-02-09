import React, { useEffect, useState,useContext } from "react";
import Image from "../images/EarnGreen Icons/greenearn-high-resolution-logo.png";
import Logo from "../images/EarnGreen Icons/greenearn-favicon-black.png";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import  AuthContext  from "../contexts/authSlice";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidemail= emailPattern.test(email);
    // Réinitialiser les erreurs
    setEmailError("");
    setPasswordError("");

    if (email.length > 0 && password.length > 0 && isValidemail) {
        const formData = {
          email,
          password,
        };
  
        try {
          const response = await axios.post("/api/auth/login", formData, {
            headers: { "Content-Type": "application/json" },
          });
          //localStorage.setItem('auth', JSON.stringify(response.data.token));
          login(response.data.token);
         // navigate("/");
        } catch (err) {
          console.log(err.response);
          console.log(err.response.data.msg)
  
          if ( err.response.data.msg ==="Bad password") {
            setPasswordError("Incorrect password");
          } if(err.response.data.msg==="Bad credentails"){
            setEmailError("User does not exist");
          }
        }
      } else {
        if (!isValidemail){
          if(email.length==0){
            setEmailError("Please enter your email");
          }else{
            setEmailError("Please enter a valid  email");
        }
        }
        if(password.length==0){
          setPasswordError("Please enter your password");
        }
        
      }
    };
  useEffect(() => {
    const storedToken = JSON.parse(localStorage.getItem("auth")) || "";
    if (storedToken !== "") {
      toast.success("You already logged in");
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="login-center">
            <h2>Welcome to Admin Page</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleLoginSubmit}>
              <input type="email" placeholder="Email" name="email" />
              {emailError && <span className="error-message">{emailError}</span>}
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                )}
              </div>
              {passwordError && <span className="error-message">{passwordError}</span>}
              <div className="login-center-buttons">
                <button type="submit">Log In</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;