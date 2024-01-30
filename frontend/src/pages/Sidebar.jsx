import React from 'react';
import { Layout, Button } from 'antd';
import Logo from '../components/Logo';
import MenuList from '../components/MenuList';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;
const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    console.log('Logout clicked');
      navigate("/login");
  };

  return (
    <div className="sidebar">
      <Layout>
        <Sider style={{ backgroundColor: '#C9EFC7', color: 'white' }}>
          <Logo />
          <Button type="primary" onClick={handleLogout} style={{ marginTop: '50px', marginLeft: '50px'  }}>
            Logout
          </Button>
          <MenuList />          
        </Sider>
      </Layout>
    </div>
  );
};

export default Sidebar;
