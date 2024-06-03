import React from "react";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

const Comments = (id) => {
    return (
        <div className="w-full flex justify-center">
            <div className="w-full h-full flex p-2 ml-5">
                <div className="flex flex-row space-x-2 mr-2 me-2 justify-normal">
                    <div className="w-40 h-40">
                        <PersonOutlinedIcon style={{ fontSize: "40px" }}/>
                    </div>

                    <div className="flex-col space-y-1 row-span-4">
                        <span className="font-bold flex">
                            Lorem ipsum dolor sit amet
                        </span>
                        <span className="font-light flex" style={{ fontSize: "12px" }}>
                            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its 
                        </span>
                        <div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}


export default Comments;