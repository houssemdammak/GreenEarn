import React from "react";
import { Menu } from "antd";
import {  HomeOutlined,  BarsOutlined} from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';
const MenuList = () => {
//   return (
// <Menu style={{ backgroundColor: '#C9EFC7', color:'black'}} mode="inline" className="menu-bar">
// <Link to="/">
//   <Menu.Item key="home"  icon={<HomeOutlined />}>Home</Menu.Item>  </Link>
//   <Menu.SubMenu key="tasks" icon={<BarsOutlined />} title="Management" >
//   <Link to="/bins"><Menu.Item key="bins">Bins</Menu.Item></Link>
//   <Link to="/shippers"><Menu.Item key="shippers">Shippers</Menu.Item></Link>
//   <Link to="/citizens"><Menu.Item key="citizens">Citizens</Menu.Item></Link>
//   </Menu.SubMenu>
// </Menu>
//   );
const navigate=useNavigate();
return (
 <Menu onClick={({key})=>{navigate(key)}} style={{ backgroundColor: '#C9EFC7', color:'black'}} mode="inline" className="menu-bar" 
 items={[
  {label:"Home", icon:<HomeOutlined /> ,key:"/" },
  {label:"Management", icon:<BarsOutlined />,children:[
    {label:"Bins",key:"/bins"},
    {label:"Shippers",key:"/shippers" },
    {label:"Citizens",key:"/citizens"}
  ]}

 ]}
 >

 </Menu>
);
};

export default MenuList;
{/* <Menu.Item key="activity" icon={<AppstoreOutlined />}>
        Activity
      </Menu.Item> */}
{/* <Menu.Item key="progress" icon={<AreaChartOutlined />}>
        Progress
      </Menu.Item>
      <Menu.Item key="payment" icon={<PayCircleOutlined />}>
        Payment
      </Menu.Item>
      <Menu.Item key="setting" icon={<SettingOutlined />}>
        Setting
      </Menu.Item> */}