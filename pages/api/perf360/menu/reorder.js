import connectMongoDB from "@/lib/services/database/mongodb";
import Menu from "@/database/models/Perf360/Menu";
import SubMenu from "@/database/models/Perf360/SubMenu";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  await connectMongoDB();

  try {
    const { group, items, type } = req.body; // items = [{ id, order }], type = 'menu' | 'submenu'

    if (type === "menu") {
      for (const item of items) {
        await Menu.findByIdAndUpdate(item.id, { order: item.order, group });
      }
      res.status(200).json({ success: true, message: "Menu order updated" });
    } else if (type === "submenu") {
      for (const item of items) {
        await SubMenu.findByIdAndUpdate(item.id, { order: item.order, group });
      }
      res.status(200).json({ success: true, message: "SubMenu order updated" });
    } else {
      res.status(400).json({ success: false, message: "Invalid type" });
    }
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
