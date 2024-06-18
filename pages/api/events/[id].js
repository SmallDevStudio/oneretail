import connetMongoDB from "@/lib/services/database/mongodb";
import Event from "@/database/models/Event";

export default async function handler(req, res) {
    await connetMongoDB();
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
          try {
            const event = await Event.findById(id);
            if (!event) {
              return res.status(404).json({ success: false });
            }
            res.status(200).json({ success: true, data: event });
          } catch (error) {
            res.status(400).json({ success: false });
          }
          break;
        case 'PUT':
          try {
            const event = await Event.findByIdAndUpdate(id, req.body, { new: true });
            if (!event) {
              return res.status(404).json({ success: false });
            }
            res.status(200).json({ success: true, data: event });
          } catch (error) {
            res.status(400).json({ success: false });
          }
          break;
        case 'DELETE':
          try {
            const deletedEvent = await Event.deleteOne({ _id: id });
            if (!deletedEvent) {
              return res.status(404).json({ success: false });
            }
            res.status(200).json({ success: true, data: {} });
          } catch (error) {
            res.status(400).json({ success: false });
          }
          break;
        default:
          res.status(400).json({ success: false });
          break;
      }
    };
