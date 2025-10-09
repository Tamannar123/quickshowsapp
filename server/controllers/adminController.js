import Booking from '../configs/models/Booking.js';
import Show from '../configs/models/Show.js';
import User from '../configs/models/User.js';
import Movie from '../configs/models/Movie.js';



export const isAdmin = async (req, res) => {

    res.json({ success: true, isadmin: true })
}

export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({ isPaid: true });
        const activeShows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie');
        const tototalUser = await User.countDocuments();
        const dashboardData = {
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0), activeShows,
            tototalUser,
            totalBookings: bookings.length,
        }
        res.json({ success: true, dashboardData })


    } catch (error) {

        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}


export const getAllUsers = async (req, res) => {

    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showDateTime: 1 });

        res.json({ success: true, shows })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}


export const getAllBookings = async (req, res) => {

    try {

        const bookings = await Booking.find({}).populate('user').populate({
            path: 'show',
            populate: { path: 'movie' }
        }).sort({ createdAt: -1 });
        res.json({ success: true, bookings })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }

}


export const getAllShows = async (req, res) => {
  try {
    // Fetch all shows and populate movie details
    const shows = await Show.find({})
      .populate('movie') // Populate the movie info
      .sort({ showDateTime: 1 }); // Sort by date ascending

    res.json({ success: true, shows });
  } catch (error) {
    console.error('Error fetching shows:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
