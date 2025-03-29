import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Slide, Dialog } from "@mui/material";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import MainMenuForm from "./MainMenuForm";
import SubMenuForm from "./SubMenuForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const fetcher = (url) => fetch(url).then((res) => res.json());

const GroupData = [
  { name: "Retail", value: "Retail" },
  { name: "AL", value: "AL" },
  { name: "TCON", value: "TCON" },
  { name: "PB", value: "PB" },
];

export default function Menu() {
  const [menu, setMenu] = useState({});
  const [selected, setSelected] = useState(null);
  const [openMainMenuForm, setMainMenuForm] = useState(false);
  const [openSubMenuForm, setOpenSubMenuForm] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [group, setGroup] = useState(GroupData.map((g) => g.value));
  const [expandedMenus, setExpandedMenus] = useState({});
  const { data: session, status } = useSession();

  const { data, mutate } = useSWR("/api/perf360/allmenu", fetcher, {
    onSuccess: (data) => setMenu(data.data),
  });

  useEffect(() => {
    if (status === "loading") return;
  }, [status]);

  const handleToggleGroup = (value) => {
    setGroup((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleClickOpenMainMenu = () => setMainMenuForm(true);
  const handleClickCloseMainMenu = () => {
    setSelected(null);
    setMainMenuForm(false);
  };

  const handleClickOpenSubMenu = () => setOpenSubMenuForm(true);
  const handleClickCloseSubMenu = () => {
    setSelectedSub(null);
    setOpenSubMenuForm(false);
  };

  const handleEditMainMenu = (data) => {
    setSelected(data);
    setMainMenuForm(true);
  };

  const handleEditSubMenu = (data) => {
    setSelectedSub(data);
    setOpenSubMenuForm(true);
  };

  const handleDeleteMainMenu = async (id) => {
    const confirm = await Swal.fire({
      title: "ยืนยันลบเมนูหลัก?",
      icon: "warning",
      showCancelButton: true,
    });
    if (!confirm.isConfirmed) return;
    await axios.delete(`/api/perf360/menu/${id}`);
    mutate();
    toast.success("ลบเมนูเรียบร้อย");
  };

  const handleDeleteSubMenu = async (id) => {
    const confirm = await Swal.fire({
      title: "ยืนยันลบเมนูย่อย?",
      icon: "warning",
      showCancelButton: true,
    });
    if (!confirm.isConfirmed) return;
    await axios.delete(`/api/perf360/submenu/${id}`);
    mutate();
    toast.success("ลบเมนูย่อยเรียบร้อย");
  };

  const toggleMenu = (id) => {
    setExpandedMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateMenuOrder = async (menuId, direction, groupName) => {
    const groupMenus = menu[groupName].map((item) => item.menu);
    const index = groupMenus.findIndex((m) => m._id === menuId);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= groupMenus.length) return;

    const updatedMenus = [...groupMenus];
    const temp = updatedMenus[index];
    updatedMenus[index] = updatedMenus[newIndex];
    updatedMenus[newIndex] = temp;

    const items = updatedMenus.map((m, idx) => ({ id: m._id, order: idx + 1 }));

    await axios.put(`/api/perf360/menu/reorder`, {
      type: "menu",
      group: groupName,
      items,
    });
    mutate();
  };

  const handleUpdateSubMenuOrder = async (submenuId, direction, groupName) => {
    const allSubmenus = menu[groupName]
      .flatMap((item) => item.submenu || [])
      .filter((s) => s.group === groupName);

    const index = allSubmenus.findIndex((s) => s._id === submenuId);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= allSubmenus.length) return;

    const updatedSubmenus = [...allSubmenus];
    const temp = updatedSubmenus[index];
    updatedSubmenus[index] = updatedSubmenus[newIndex];
    updatedSubmenus[newIndex] = temp;

    const items = updatedSubmenus.map((s, idx) => ({
      id: s._id,
      order: idx + 1,
    }));

    await axios.put(`/api/perf360/menu/reorder`, {
      type: "submenu",
      group: groupName,
      items,
    });
    mutate();
  };

  const handleUpdateActiveSubmenu = async (submenuId, active) => {
    await axios.put(`/api/perf360/submenu/${submenuId}`, {
      active,
    });
    mutate();
    toast.success("อัพเดตสถานะเมนูย่อยเรียบร้อย");
  };

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex justify-center gap-4">
        <button
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={handleClickOpenMainMenu}
        >
          + เมนูหลัก
        </button>
        <button
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={handleClickOpenSubMenu}
        >
          + เมนูย่อย
        </button>
      </div>

      {/* Filter */}
      <div className="mt-4 flex gap-2 justify-between border rounded-lg p-2">
        {GroupData.map((g) => (
          <label key={g.value} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={group.includes(g.value)}
              onChange={() => handleToggleGroup(g.value)}
            />
            {g.name}
          </label>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4">
        {Object.entries(menu)
          .filter(([groupName]) => group.includes(groupName))
          .map(([groupName, items]) => (
            <div key={groupName}>
              <h2 className="text-lg font-bold text-[#0056FF] mb-2">
                กลุ่ม {groupName}
              </h2>
              {items.map((item, index) => (
                <div key={item.menu._id} className="mb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={index === 0}
                        onClick={() =>
                          handleUpdateMenuOrder(item.menu._id, "up", groupName)
                        }
                      >
                        <FaAngleUp className="text-blue-600" />
                      </button>
                      <button
                        disabled={index === items.length - 1}
                        onClick={() =>
                          handleUpdateMenuOrder(
                            item.menu._id,
                            "down",
                            groupName
                          )
                        }
                      >
                        <FaAngleDown className="text-green-600" />
                      </button>
                      <p className="font-bold">{item.menu.title}</p>
                    </div>
                    <div className="text-sm flex gap-2">
                      <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => handleEditMainMenu(item.menu)}
                      >
                        Edit
                      </span>
                      <span
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteMainMenu(item.menu._id)}
                      >
                        Delete
                      </span>
                    </div>
                  </div>

                  {/* Submenus */}
                  {expandedMenus[item.menu._id] && (
                    <ul className="ml-8 mt-2">
                      {item.submenu.map((sub, sidx) => (
                        <li
                          key={sub._id}
                          className="flex justify-between mb-1 text-sm"
                        >
                          <div className="flex gap-2">
                            <button
                              disabled={sidx === 0}
                              onClick={() =>
                                handleUpdateSubMenuOrder(
                                  sub._id,
                                  "up",
                                  groupName
                                )
                              }
                            >
                              <FaAngleUp className="text-blue-600" />
                            </button>
                            <button
                              disabled={sidx === item.submenu.length - 1}
                              onClick={() =>
                                handleUpdateSubMenuOrder(
                                  sub._id,
                                  "down",
                                  groupName
                                )
                              }
                            >
                              <FaAngleDown className="text-green-600" />
                            </button>
                            {sub.title}
                          </div>
                          <div className="flex gap-1 text-xs">
                            <span
                              className={`${
                                sub.active ? "text-green-500" : "text-red-500"
                              }`}
                              onClick={() =>
                                handleUpdateActiveSubmenu(sub._id, !sub.active)
                              }
                            >
                              {sub.active ? "online" : "offline"}
                            </span>
                            |
                            <span
                              className="text-blue-600 cursor-pointer"
                              onClick={() => handleEditSubMenu(sub)}
                            >
                              Edit
                            </span>
                            |
                            <span
                              className="text-red-500 cursor-pointer"
                              onClick={() => handleDeleteSubMenu(sub._id)}
                            >
                              Delete
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div
                    className="text-sm text-blue-500 cursor-pointer ml-8"
                    onClick={() => toggleMenu(item.menu._id)}
                  >
                    {expandedMenus[item.menu._id]
                      ? "ซ่อนเมนูย่อย"
                      : item.submenu.length > 0 && "แสดงเมนูย่อย"}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>

      <Dialog
        fullScreen
        open={openMainMenuForm}
        onClose={handleClickCloseMainMenu}
        TransitionComponent={Transition}
        keepMounted
      >
        <MainMenuForm
          onClose={handleClickCloseMainMenu}
          mutate={mutate}
          data={selected}
          newData={!selected}
        />
      </Dialog>

      <Dialog
        fullScreen
        open={openSubMenuForm}
        onClose={handleClickCloseSubMenu}
        TransitionComponent={Transition}
        keepMounted
      >
        <SubMenuForm
          onClose={handleClickCloseSubMenu}
          mutate={mutate}
          data={selectedSub}
          newData={!selectedSub}
        />
      </Dialog>
    </div>
  );
}
