import React from "react";
import { Menu } from "antd";
import { HomeOutlined, BarsOutlined } from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';

const MenuList = () => {
  const navigate = useNavigate();

  return (
    <Menu onClick={({ key }) => { navigate(key) }} style={{ backgroundColor: '#C9EFC7', color: 'black' }} mode="inline" className="menu-bar"
      items={[
        { label: "Home", icon: <HomeOutlined />, key: "/manager" },
        {
          label: "Management", icon: <BarsOutlined />, children: [
            { label: "Bins", key: "/manager/bins" },
            { label: "Shippers", key: "/manager/shippers" },
            { label: "Citizens", key: "/manager/citizens" }
          ]
        }
      ]}
    />
  );
};

export default MenuList;

