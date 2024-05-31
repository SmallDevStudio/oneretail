import { Box, IconButton, useTheme } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import UserAvartar from "@/components/UserAvartar";
import { useSession } from "next-auth/react";

const Topbar = () => {
    const { data: session } = useSession();
  
    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-between space-x-4 p-4 w-full">
                {/* SEARCH BAR */}
                <div
                    className="flex bg-white rounded-2xl items-center"
                >
                <input sx={{ ml: 2, flex: 1 }} placeholder="ค้นหา" className="flex ml-2 p-2 rounded-2xl border" />
                <IconButton type="button" className="p-2">
                    <SearchIcon />
                </IconButton>
                </div>
        
                {/* ICONS */}
                <div className="flex">
                    <IconButton>
                        <NotificationsOutlinedIcon />
                    </IconButton>
                    <IconButton>
                        <SettingsOutlinedIcon />
                    </IconButton>
                    <IconButton>
                        {/* Avatar */}
                        <UserAvartar />
                    </IconButton>
                </div>
            </div>
      </div>
    );
  };
  
  export default Topbar;