import Booking from "../models/Booking.js";

// Assign Guide (Agency)
export const assignGuide = async (req, res) => {
  try {
    const { guideId } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.guide = guideId;
    booking.guideAssigned = true;

    await booking.save();

    res.json({ message: "Guide assigned successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};