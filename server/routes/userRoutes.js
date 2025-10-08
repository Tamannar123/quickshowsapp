import express from 'express';
import {getUserBookings} from '../controllers/bookingController.js'
import { updateFavorite, getFavorite } from '../controllers/favoriteController.js';


const userRouter = express.Router();

// For bookings
userRouter.get('/bookings', getUserBookings);

// For favorites
userRouter.post('/update-favorite', updateFavorite);
userRouter.get('/favorites', getFavorite);

export default userRouter;
