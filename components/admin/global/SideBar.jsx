import { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import Link from "next/link";
import "react-pro-sidebar/dist/css/styles.css";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { FaTachometerAlt, FaUsers, FaFileAlt, FaCalendarAlt, FaGift, FaGamepad, FaHome, FaFileSignature, FaFile } from 'react-icons/fa';
import { LuGroup } from "react-icons/lu";
import { RiPagesLine } from "react-icons/ri";
import { MdOutlineSubtitles } from "react-icons/md";
import Image from "next/image";

const Item = ({ title, to, icon, selected, setSelected }) => {
   
    return (
      <MenuItem
        active={selected === title}
        style={{
          color: "#000",
          fontWeight: "bold !important",
          fontWeight: "500 !important",
        }}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        <Typography style={{ fontFamily: "ttb" }}>{title}</Typography>
        <Link href={to} />
      </MenuItem>
    );
  };
  
  const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");
  
    return (
      <Box
        sx={{
          "& .pro-sidebar-inner": {
            background: "#ffffff !important",
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
            fontFamily: "ttb",
          },
          "& .pro-inner-item:hover": {
            color: "#868dfb !important",
          },
          "& .pro-menu-item.active": {
            color: "#314D9B !important",
            fontWeight: "bold !important",
            fontWeight: "500 !important",
          },
          "& .pro-sub-menu": {
            fontWeight: "500 !important",
            fontFamily: "ttb",
            color: "#000000",
            fontWeight: "500 !important",
          }
        }}
        className="basic-1/4"
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            {/* LOGO AND MENU ICON */}
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                 <Image src="/dist/img/logo-one-retail.png" alt="one-retail logo" width={200} height={200}/>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>
  
            {!isCollapsed && (
              <Box mb="25px">
                
              </Box>
            )}
  
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Item
                title="Dashboard"
                to="/admin"
                icon={<FaTachometerAlt />}
                selected={selected}
                setSelected={setSelected}
              />
  
              <Item
                title="จัดการผู้ใช้"
                to="/admin/users"
                icon={<FaUsers />}
                selected={selected}
                setSelected={setSelected}
              />
              
              <SubMenu
                title="จัดการเนื้อหา"
                icon={<FaFileAlt />}
              >

                <Item
                  title="จัดการเนื้อหา"
                  to="/admin/contents"
                  icon={<FaFileAlt />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="จัดการหมวดหมู่"
                  to="/admin/contents/category"
                  icon={<RiPagesLine />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="จัดการหมวดหมู่ย่อย"
                  to="/admin/contents/sub-categories"
                  icon={<MdOutlineSubtitles />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="จัดการ Groups"
                  to="/admin/contents/groups"
                  icon={<LuGroup />}
                  selected={selected}
                  setSelected={setSelected}
                />
                
              </SubMenu>
              
              <Item
                title="จัดการ Events"
                to="/admin/events"
                icon={<FaCalendarAlt />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="จัดการ Redeem"
                to="/admin/events"
                icon={<FaGift />}
                selected={selected}
                setSelected={setSelected}
              />

              <SubMenu
                title="จัดการเกมส์"
                icon={<FaGamepad />}
              >
                  <Item
                  title="เกมส์คำถาม"
                  to="/admin/games/quiz"
                  icon={<FaGift />}
                  selected={selected}
                  setSelected={setSelected}
                  />

                  <Item
                  title="เกมส์"
                  to="/admin/games/games"
                  icon={<FaGamepad />}
                  selected={selected}
                  setSelected={setSelected}
                  />

              </SubMenu>

                  <Item
                  title="จัดการหน้าแรก"
                  to="/admin/homeoptions"
                  icon={<FaHome />}
                  selected={selected}
                  setSelected={setSelected}
                  />

                  <Item
                  title="Log"
                  to="/admin/log"
                  icon={<FaFileSignature />}
                  selected={selected}
                  setSelected={setSelected}
                  />
  
             
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    );
  };
  
  export default Sidebar;