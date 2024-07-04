import connectMongoDB from "@/lib/services/database/mongodb";
import Event from "@/database/models/Event";

export default async function handler(req, res) {
  const { method } = req;
  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const events = await Event.find({});
        res.status(200).json({ success: true, data: events });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      const { title, description, startDate, endDate, startTime, endTime, No, type, position, channel, place, mapLocation, link, note, status, creator } = req.body;
      console.log('Received form data:', req.body);
      if (!title || !description || !startDate || !endDate || !creator) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }
      try {
        const newEvent = new Event({ title, description, startDate, endDate, startTime, endTime, No, type, position, channel, place, mapLocation, link, note, status: true, creator });
        await newEvent.save();
        res.status(201).json({ success: true, data: newEvent });
      } catch (error) {
        console.error('Error creating event:', error.message);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
