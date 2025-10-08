import express from 'express';
import { getUserBookings } from '../controllers/userController.js';

import { updateFavorite,getFavorite ,getUserBookings} from '../controllers/userController.js';


const userRouter = express.Router();
userRouter.get ('/bookings', getUserBookings);
userRouter.post('/update-favorite',getUserBookings);
userRouter.get('/favorites',getUserBookings);

export default userRouter;