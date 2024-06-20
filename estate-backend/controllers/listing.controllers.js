const Listing= require("../models/listing.models")
const createListing= async(req,res,next)=>{
    try{
        const listing= await Listing.create(req.body)
    }catch(error){
        next(error);
    }
}
module.exports= createListing;