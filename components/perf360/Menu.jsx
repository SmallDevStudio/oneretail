import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";
import { Divider, Slide, Dialog } from "@mui/material";
import { IoClose } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa";
import Upload from "../utils/Upload";
import { deleteFile } from "@/lib/hook/useStorage";
import { FaPlus } from "react-icons/fa6";
import MainMenuForm from "./MainMenuForm";
import SubMenuForm from "./SubMenuForm";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

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
  const [menu, setMenu] = useState([]);
  const [selected, setSelected] = useState(null);
  const [openMainMenuForm, setMainMenuForm] = useState(false);
  const [openSubMenuForm, setOpenSubMenuForm] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [group, setGroup] = useState(GroupData.map((g) => g.value));
  const [expandedMenus, setExpandedMenus] = useState({});
  const [draggingGroup, setDraggingGroup] = useState(null);
  const [draggingMenus, setDraggingMenus] = useState([]);
  const [editMode, setEditMode] = useState(null); // 'menu' | 'submenu'

  const { data: session, status } = useSession();

  const { data, error, isLoading, mutate } = useSWR(
    "/api/perf360/allmenu",
    fetcher,
    {
      onSuccess: (data) => setMenu(data.data),
    }
  );

  useEffect(() => {
    if (status === "loading") return;
  }, [status]);

  const handleToggleGroup = (value) => {
    if (!Array.isArray(group)) return;
    setGroup((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleClickOpenMainMenu = () => {
    setMainMenuForm(true);
  };

  const handleClickCloseMainMenu = () => {
    setSelected(null);
    setMainMenuForm(false);
  };

  const handleEditMainMenu = (data) => {
    setSelected(data);
    setMainMenuForm(true);
  };

  const handleDeleteMainMenu = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this menu? This process cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/perf360/menu/${id}`);
        mutate();
        toast.success("ลบ menu เรียบร้อย");
      } catch (error) {
        console.error(error);
        toast.error("ลบ menu ไม่สําเร็จ");
      }
    }
  };

  const handleClickOpenSubMenu = () => {
    setOpenSubMenuForm(true);
  };

  const handleClickCloseSubMenu = () => {
    setSelectedSub(null);
    setOpenSubMenuForm(false);
  };

  const handleEditSubMenu = (data) => {
    setSelectedSub(data);
    setOpenSubMenuForm(true);
  };

  const handleDeleteSubMenu = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this submenu? This process cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/perf360/submenu/${id}`);
        mutate();
        toast.success("ลบ submenu เรียบร้อย");
      } catch (error) {
        console.error(error);
        toast.error("ลบ submenu ไม่สําเร็จ");
      }
    }
  };

  const toggleMenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // เพิ่มฟังก์ชันเพื่อ handle การกดค้างเพื่อเข้าสู่ editMode
  const handleLongPress = (mode, group, menuId = null) => {
    setEditMode(mode);
    setDraggingGroup(group);

    if (mode === "menu") {
      const list = menu[group].map((m) => m.menu);
      setDraggingMenus(list);
    }
    if (mode === "submenu") {
      const submenus =
        menu[group]
          ?.find((m) => m.menu._id === menuId)
          ?.submenu.filter((s) => s.group.includes(group)) || [];
      setDraggingMenus(submenus);
    }
  };

  return (
    <div className="flex flex-col mt-2 w-full">
      {/* Header */}
      <div className="flex flex-row items-center justify-center gap-4 mt-2 w-full">
        <div
          className="px-6 py-2 bg-gray-200 rounded-lg"
          onClick={handleClickOpenMainMenu}
        >
          <div className="flex items-center gap-1">
            <FaPlus size={15} />
            <span>เมนูหลัก</span>
          </div>
        </div>
        <div
          className="px-6 py-2 bg-gray-200 rounded-lg"
          onClick={handleClickOpenSubMenu}
        >
          <div className="flex items-center gap-1">
            <FaPlus size={15} />
            <span>เมนูย่อย</span>
          </div>
        </div>
      </div>
      {/* filter */}
      <div className="mt-2 px-2 py-2 border border-gray-200 rounded-lg mx-2">
        <div className="flex flex-row items-center justify-between gap-2 w-full">
          {GroupData.map((g, index) => (
            <div key={index} className="flex flex-row items-center gap-1">
              <input
                type="checkbox"
                name={g.name}
                checked={Array.isArray(group) && group.includes(g.value)}
                onChange={() => handleToggleGroup(g.value)}
              />
              <span>{g.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex flex-col p-4 w-full">
        {menu &&
          Object.entries(menu)
            .filter(([groupName]) => group.includes(groupName)) // ✅ แสดงเฉพาะ group ที่เลือก
            .map(([groupName, menus]) => {
              // ✅ กรองเฉพาะเมนูและ submenu ที่มี group ตรงกับ checkbox
              const filteredMenus = menus
                .map((item) => {
                  const isMenuInGroup = item.menu.group?.some((g) =>
                    group.includes(g)
                  );

                  const filteredSubmenu = item.submenu?.filter((sub) =>
                    sub.group?.some((g) => group.includes(g))
                  );

                  return isMenuInGroup || filteredSubmenu.length > 0
                    ? { ...item, submenu: filteredSubmenu }
                    : null;
                })
                .filter(Boolean); // ลบ null ที่ไม่ตรงเงื่อนไขออก

              if (filteredMenus.length === 0) return null;

              return (
                <div
                  key={groupName}
                  className="mb-6"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleLongPress("menu", groupName);
                  }}
                  onTouchStart={(e) => {
                    const touchTimer = setTimeout(
                      () => handleLongPress("menu", groupName),
                      500
                    );
                    e.target.addEventListener(
                      "touchend",
                      () => clearTimeout(touchTimer),
                      { once: true }
                    );
                  }}
                >
                  <h2 className="text-xl font-bold text-[#0056FF] mb-2">
                    สังกัด: {groupName}
                  </h2>

                  {editMode === "menu" && draggingGroup === groupName ? (
                    <DndContext
                      collisionDetection={closestCenter}
                      onDragEnd={({ active, over }) => {
                        if (!over || active.id === over.id) return;
                        const oldIndex = draggingMenus.findIndex(
                          (i) => i._id === active.id
                        );
                        const newIndex = draggingMenus.findIndex(
                          (i) => i._id === over.id
                        );
                        const newList = arrayMove(
                          draggingMenus,
                          oldIndex,
                          newIndex
                        );
                        setDraggingMenus(newList);

                        axios.put(`/api/perf360/${editMode}/reorder`, {
                          group: draggingGroup,
                          items: newList.map((item, index) => ({
                            id: item._id,
                            order: index + 1,
                          })),
                        });
                        mutate();
                      }}
                    >
                      <SortableContext
                        items={draggingMenus.map((m) => m._id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {draggingMenus.map((m) => (
                          <SortableItem key={m._id} id={m._id}>
                            <div className="bg-white p-2 border my-1 rounded">
                              {m.title}
                            </div>
                          </SortableItem>
                        ))}
                      </SortableContext>
                    </DndContext>
                  ) : (
                    // normal rendering here
                    filteredMenus.map((item, idx) => (
                      <div key={idx} className="">
                        <div className="flex justify-between items-center">
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => toggleMenu(item.menu._id)}
                          >
                            {item.submenu?.length > 0 ? (
                              expandedMenus[item.menu._id] ? (
                                <IoIosArrowDown />
                              ) : (
                                <IoIosArrowForward />
                              )
                            ) : (
                              <div className="ml-4" />
                            )}
                            <p className="font-bold">{item.menu.title}</p>
                          </div>

                          <div className="flex gap-1 text-sm">
                            <span
                              className={`${
                                item.menu.active
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {item.menu.active ? "Online" : "Offline"}
                            </span>
                            |
                            <span
                              className="text-[#0056FF]"
                              onClick={() => handleEditMainMenu(item.menu)}
                            >
                              Edit
                            </span>
                            |
                            <span
                              className="text-red-500"
                              onClick={() =>
                                handleDeleteMainMenu(item.menu._id)
                              }
                            >
                              Delete
                            </span>
                          </div>
                        </div>

                        {/* SubMenu List */}
                        {expandedMenus[item.menu._id] &&
                          item.submenu?.length > 0 && (
                            <ul className="ml-8 list-disc text-sm text-gray-700">
                              {item.submenu.map((sub, sidx) => (
                                <li key={sidx} className="mb-1">
                                  <div className="flex justify-between">
                                    {sub.title}
                                    <div className="flex gap-1 text-sm">
                                      <span
                                        className={`${
                                          sub.active
                                            ? "text-green-500"
                                            : "text-red-500"
                                        }`}
                                      >
                                        {sub.active ? "Online" : "Offline"}
                                      </span>
                                      |
                                      <span
                                        className="text-[#0056FF]"
                                        onClick={() => handleEditSubMenu(sub)}
                                      >
                                        Edit
                                      </span>
                                      |
                                      <span
                                        className="text-red-500"
                                        onClick={() =>
                                          handleDeleteSubMenu(sub._id)
                                        }
                                      >
                                        Delete
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
                    ))
                  )}

                  {editMode && draggingGroup === groupName && (
                    <button
                      onClick={() => {
                        setEditMode(null);
                        setDraggingGroup(null);
                        setDraggingMenus([]);
                      }}
                      className="bg-red-500 text-white font-bold px-4 py-2 rounded mt-2"
                    >
                      ยกเลิกการจัดเรียง
                    </button>
                  )}
                </div>
              );
            })}
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
