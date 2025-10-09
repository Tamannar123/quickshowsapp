import Booking from "../configs/models/Booking.js";
import Show from "../configs/models/Show.js";

/**
 * Helper function to check if selected seats are available
 */
const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats || {};
    const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (error) {
    console.error("Error in checkSeatsAvailability:", error.message);
    return false;
  }
};

/**
 * Create a new booking
 */
export const createBooking = async (req, res) => {
  try {
    const userId = req.auth?.userId || req.body.userId; // depends on your auth
    const { showId, selectedSeats } = req.body;

    if (!userId || !showId || !selectedSeats || selectedSeats.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check seat availability
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: "Selected seats are not available" });
    }

    const showData = await Show.findById(showId);
    if (!showData) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats
    });

    // Mark selected seats as occupied
    selectedSeats.forEach(seat => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified("occupiedSeats");
    await showData.save();

    res.json({ success: true, message: "Booking successful", booking });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all bookings of a user
 */
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.auth?.userId || req.body.userId; 
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        populate: { path: "movie" }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all occupied seats for a specific show
 */
export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);

    if (!showData) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }

    const occupiedSeats = Object.keys(showData.occupiedSeats || {});
    res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.error("Error fetching occupied seats:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
