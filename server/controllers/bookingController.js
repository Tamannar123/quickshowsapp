import Booking from "../configs/models/Booking.js";
import Show from "../configs/models/Show.js";




const checkSeatsAvailability =async (showId,selectedSeats)=>{
    try{

       const showData =  await Show.findById(showId)

       if(!showData)return false;
       const occupiedSeats=showData.occupiedSeats

       const isAnySeatTaken = selectedSeats.some(seat=>occupiedSeats[seat]);

       return !isAnySeatTaken;
    }catch (error){
 console.log(error.message);
 return false;
    }
}

export const createBooking = async (req,res)=>{
    try{
        const{userId}=req.auth();
        const {showId,selectedSeats}= req.body;
        const{origin}=req.headers;


        const isAvailable =await checkSeatsAvailability(showId,selectedSeats)

        if(!isAvailable){
            return res.json({success:false,message:"Selected Seats are not available."})
        }


        const  showData= await Show.findById(showId).populate("movie");

        const booking = await Booking.create({
            user: userId,
            show:showId,
            amount :showData.showPrice * selectedSeats.length,
            bookedSeats:selectedSeats
        })

        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seats]= userId

        })
  showData.markModified("occupiedSeats");

  await showData.save();


  res.json({sucess:true,message:'Booked sucessfully'})
    } catch(error){
  console.log(error.message);
  res.json ({sucess:false,message:"Booked successfully"})
    }
}

export const getOccupiedSeats =async ( req,res)=>{
    try{

    }catch (error){
        console.log (error.message);
        res.json({success:false,message: error.message})

    }

}
export const OccupiedSeats = async (req,res)=>{
    try{
        const {showId}=req.params;
        const showData =await show.findById(showId)
        const occupiedSeats = Object.keys (showData.occupiedSeats)
        res.json({success:true,occupiedSeats})

    } catch(error){
        console.log(error.message);
        res.json ({success:false,message:error.message})
    }
}