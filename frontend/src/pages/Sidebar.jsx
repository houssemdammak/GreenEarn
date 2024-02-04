import React, { useContext } from 'react';
import { Layout, Button } from 'antd';
import Logo from '../components/Logo';
import MenuList from '../components/MenuList';
import AuthContext from '../contexts/authSlice';

const { Sider } = Layout;

const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="sidebar">
      <Layout>
        <Sider style={{ backgroundColor: '#C9EFC7', color: 'white' }}>
          <Logo />
          <Button type="primary" onClick={handleLogout} style={{ marginTop: '50px', marginLeft: '60px', backgroundColor:"white", color:"black"}}>
            Logout
          </Button>
          <MenuList />
        </Sider>
      </Layout>
    </div>
  );
};

export default Sidebar;
