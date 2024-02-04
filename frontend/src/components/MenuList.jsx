import React from "react";
import { Menu } from "antd";
import { HomeOutlined, BarsOutlined } from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';

const MenuList = () => {
  const navigate = useNavigate();

  return (
    <Menu onClick={({ key }) => { navigate(key) }} style={{ backgroundColor: '#C9EFC7', color: 'black' }} mode="inline" className="menu-bar"
      items={[
        { label: "Home", icon: <HomeOutlined />, key: "/" },
        {
          label: "Management", icon: <BarsOutlined />, children: [
            { label: "Bins", key: "/bins" },
            { label: "Shippers", key: "/shippers" },
            { label: "Citizens", key: "/citizens" }
          ]
        }
      ]}
    />
  );
};

export default MenuList;

