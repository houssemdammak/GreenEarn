import React, { useContext } from 'react';
import { Layout } from 'antd';
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
          <MenuList />
        </Sider>
      </Layout>
    </div>
  );
};

export default Sidebar;
