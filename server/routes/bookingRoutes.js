// server/routes/bookingRoutes.js

import express from "express";
// import { createBooking, getOccupiedSeats } from "../controllers/bookingController.js";
import { createBooking,getOccupiedSeats } from "../controllers/bookingController";
const bookingRouter = express.Router();

bookingRouter.post("/create", createBooking);
bookingRouter.get("/occupied/:showId", getOccupiedSeats);

export default bookingRouter;

// // bookingRoutes.js
// import express from "express";
// import { createBooking, getOccupiedSeats } from "../controllers/bookingController.js";

// const router = express.Router();

// // Create a booking
// router.post("/create", createBooking);

// // Get occupied seats for a show
// router.get("/occupied/:showId", getOccupiedSeats);

// export default router;
