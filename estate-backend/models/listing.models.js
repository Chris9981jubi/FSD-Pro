const { Timestamp } = require("mongodb");
const mongoose= require("mongoose");

const listingSchema =  new mongoose.Schema(
    {

    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required:true,
    },
    regularPrice:{
        type:Number,
        required:true,

    },
    discountedPrice:{
        type:Number,
        required:true,
    },
    bedrooms:{
        type:Number,
        required:true,
    },
    furnished:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    offer:{
        type:Boolean,
        required: true,
    },
    imageUrls:{
        type:Array,
        required:true,
    },
    userRef:{
        type:String,
        required: true,
    },
    
}, {Timestamps:true}
);
const Listing= mongoose.model("Listing", listingSchema);
module.exports = Listing;