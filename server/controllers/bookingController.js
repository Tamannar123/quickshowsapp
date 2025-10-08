
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
    console.log("Error in checkSeatsAvailability:", error.message);
    return false;
  }
};

/**
 * Create a new booking
 */
export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth(); // For Clerk or JWT-based auth
    const { showId, selectedSeats } = req.body;

    // Check seat availability
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.json({ success: false, message: "Selected seats are not available." });
    }

    const showData = await Show.findById(showId).populate("movie");
    if (!showData) {
      return res.json({ success: false, message: "Show not found." });
    }

    // Create a new booking
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

    res.json({ success: true, message: "Booked successfully", booking });
  } catch (error) {
    console.log("Error creating booking:", error.message);
    res.json({ success: false, message: error.message });
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
      return res.json({ success: false, message: "Show not found" });
    }

    const occupiedSeats = Object.keys(showData.occupiedSeats || {});
    res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.log("Error fetching occupied seats:", error.message);
    res.json({ success: false, message: error.message });
  }
};
