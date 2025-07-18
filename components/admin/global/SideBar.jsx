import { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import Link from "next/link";
import "react-pro-sidebar/dist/css/styles.css";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import {
  FaTachometerAlt,
  FaUsers,
  FaFileAlt,
  FaCalendarAlt,
  FaGift,
  FaGamepad,
  FaHome,
  FaFileSignature,
  FaFile,
} from "react-icons/fa";
import { LuGroup, LuVote } from "react-icons/lu";
import { RiPagesLine } from "react-icons/ri";
import {
  MdOutlineSubtitles,
  MdOutlineCampaign,
  MdOutlineHowToVote,
} from "react-icons/md";
import { FcSurvey } from "react-icons/fc";
import { GrArticle } from "react-icons/gr";
import { GoFileMedia } from "react-icons/go";
import { TbReportAnalytics } from "react-icons/tb";
import { TfiLayoutSlider } from "react-icons/tfi";
import { IoShareSocialOutline } from "react-icons/io5";
import { PiExam } from "react-icons/pi";
import { SlBadge } from "react-icons/sl";
import { LuSticker } from "react-icons/lu";
import { LuBaby } from "react-icons/lu";
import { TbSpeakerphone } from "react-icons/tb";
import { FaWpforms } from "react-icons/fa";
import { BiCalendarStar } from "react-icons/bi";
import { RiCoupon3Line } from "react-icons/ri";
import { LuNotebookText } from "react-icons/lu";
import { FaRegNewspaper } from "react-icons/fa6";
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
    <div className="relative">
      <Box
        sx={{
          "& .pro-sidebar": {
            zIndex: "50",
          },
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
          },
        }}
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
                  <Image
                    src="/dist/img/logo-one-retail.png"
                    alt="one-retail logo"
                    width={200}
                    height={200}
                    style={{ width: "auto", height: "auto" }}
                  />
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {!isCollapsed && <Box mb="25px"></Box>}

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

              <SubMenu title="จัดการเนื้อหา" icon={<FaFileAlt />}>
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

                <Item
                  title="จัดการ SubGroups"
                  to="/admin/contents/subgroups"
                  icon={<LuGroup />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </SubMenu>

              <Item
                title="จัดการบทความ"
                to="/admin/articles"
                icon={<GrArticle />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Personalize"
                to="/admin/personalized"
                icon={<LuBaby />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="จัดการ Events"
                to="/admin/events"
                icon={<FaCalendarAlt />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="จัดการหลักสูตร"
                to="/admin/courses"
                icon={<BiCalendarStar />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="จัดการข้อสอบ"
                to="/admin/examinations"
                icon={<PiExam />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="จัดการ Redeem"
                to="/admin/redeem"
                icon={<FaGift />}
                selected={selected}
                setSelected={setSelected}
              />
              <SubMenu title="Campaign" icon={<MdOutlineCampaign />}>
                <Item
                  title="จัดการ Campaigns"
                  to="/admin/campaigns"
                  icon={<MdOutlineCampaign />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="ส่งชื่อประกวด"
                  to="/admin/campaigns/votenames"
                  icon={<MdOutlineHowToVote />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="SocialMedia Club"
                  to="/admin/socialclub"
                  icon={<IoShareSocialOutline />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </SubMenu>

              <SubMenu title="จัดการเกมส์" icon={<FaGamepad />}>
                <Item
                  title="เกมส์คำถาม"
                  to="/admin/games/quiz"
                  icon={<FaGift />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="เกมส์จับคู่"
                  to="/admin/games/matching"
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
                title="จัดการ Badges"
                to="/admin/badges"
                icon={<SlBadge />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="จัดการ Stickers"
                to="/admin/stickers"
                icon={<LuSticker />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="จัดการ Coupons"
                to="/admin/coupons"
                icon={<RiCoupon3Line />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="จัดการของขวัญปีใหม่"
                to="/admin/gifts"
                icon={<FaGift />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="จัดการข่าวสาร"
                to="/admin/news"
                icon={<FaRegNewspaper />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="จัดการ Ebooks"
                to="/admin/ebooks"
                icon={<LuNotebookText />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="จัดการ Vote"
                to="/admin/votes"
                icon={<LuVote />}
                selected={selected}
                setSelected={setSelected}
              />

              <SubMenu title="จัดการ Gallery" icon={<GoFileMedia />}>
                <Item
                  title="จัดการ Gallery"
                  to="/admin/galleries"
                  icon={<GoFileMedia />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="จัดการ Media"
                  to="/admin/medias"
                  icon={<GoFileMedia />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </SubMenu>

              <SubMenu title="จัดการหน้าแรก" icon={<FaHome />}>
                <Item
                  title="จัดการ Slide"
                  to="/admin/homeoptions"
                  icon={<TfiLayoutSlider />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title="จัดการ Ads"
                  to="/admin/ads"
                  icon={<TbSpeakerphone />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </SubMenu>

              <Item
                title="Survey"
                to="/admin/survey"
                icon={<FcSurvey />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Satisfaction"
                to="/admin/satisfactions"
                icon={<FcSurvey />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Form"
                to="/admin/forms"
                icon={<FaWpforms />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Report"
                to="/admin/reports"
                icon={<TbReportAnalytics />}
                selected={selected}
                setSelected={setSelected}
              />

              <Item
                title="Log"
                to="/admin/logs"
                icon={<FaFileSignature />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </div>
  );
};

export default Sidebar;
