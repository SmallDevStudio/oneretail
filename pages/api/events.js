import connetMongoDB from "@/lib/services/database/mongodb";
import Event from "@/database/models/Event";

export default async function handler(req, res) {
    const { method } = req;
    await connetMongoDB();

    switch (method) {
        case 'GET':
          try {
            const events = await Event.find({});
            res.status(200).json({ success: true, data: events });
          } catch (error) {
            res.status(400).json({ success: false });
          }
          break;
        case 'POST':
          try {
            const event = await Event.create(req.body);
            res.status(201).json({ success: true, data: event });
          } catch (error) {
            res.status(400).json({ success: false });
          }
          break;
        case 'PUT':
          try {
            const { id, ...data } = req.body;
            const event = await Event.findByIdAndUpdate(id, data, { new: true });
            res.status(200).json({ success: true, data: event });
          } catch (error) {
            res.status(400).json({ success: false });
          }
          break;
        case 'DELETE':
          try {
            const { id } = req.body;
            await Event.findByIdAndDelete(id);
            res.status(200).json({ success: true });
          } catch (error) {
            res.status(400).json({ success: false });
          }
          break;
        default:
          res.status(400).json({ success: false });
          break;
      }
    };