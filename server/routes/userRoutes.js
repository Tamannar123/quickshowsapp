import express from 'express';
import { updateFavorite, getFavorite, getUserBookings } from '../controllers/userController.js';

const userRouter = express.Router();

// For bookings
userRouter.get('/bookings', getUserBookings);

// For favorites
userRouter.post('/update-favorite', updateFavorite);
userRouter.get('/favorites', getFavorite);

export default userRouter;
