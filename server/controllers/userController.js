import { clerkClient } from '@clerk/express';
import Booking from '../models/Booking.js';
import Movie from '../models/Movie.js';

export const getUserBookings = (req, res) => {

try{
    const user=req.auth().userId;

    const bookings = await Booking.find({user}).populate({

        path:'show',
        populate:{path:'movie'}
    }).sort({createdAt:-1});
    res.json({success:true,bookings}

    )
} catch(error){
console.log(error.message);
res.json({success:false,message:error.message})


}


}

//Api controller Function to add favourite movie in clerk User Metadata
export const updateFavorite = async (req,res)=>{
    try{
        const {movieId} = req.body;
        const {userId} = req.auth();


        const user =await clerkClient.users.getUser(userId);

        if(!user.privateMetadata.favorites){

            user.privateMetadata.favorites =[];
        }
        if(user.privateMetadata.favorites.includes(movieId)){
            user.privateMetadata.favorites.push(movieId)
        }else{
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(id=>id !== movieId)
        }
        await clerkClient.users.updateUserMetadata(userId,{
            privateMetadata:{favorites:user.privateMetadata.favorites}
        })
        res.json({success:true,message:"Added to favourites"})
    } catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})

    }
}

export const getFavorite = async (req,res)=>{
    try{
        const {userId} = req.auth();                
        const user = await clerkClient.users.getUser(userId);
        const movies= await Movie.find({_id:{$in:user.privateMetadata.favorites || []}});
        res.json({success:true,favorites:user.privateMetadata.favorites || []})     

    } catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}
