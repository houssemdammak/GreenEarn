import React, { useEffect, useState } from 'react'
import "../styles/Dashboard.css";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Dashboard = () => {
  const [ token, setToken ] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [ data, setData ] = useState({});
  const navigate = useNavigate();
    
  useEffect(() => {
      localStorage.removeItem("auth");
      setTimeout(() => {
          navigate("/login");
      }, 3000);
  }, []);
    
  useEffect(() => {
    fetchLuckyNumber();
    if(token === ""){
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);

  return (
    <div className='dashboard-main'>
      <h1>Dashboard</h1>
      <p>Hi { data.msg }! { data.luckyNumber }</p>
      <Link to="/login" className="logout-button">Logout</Link>
    </div>
  )
}

export default Dashboard