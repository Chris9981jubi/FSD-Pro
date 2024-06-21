const errorHandler = require("../utils/error");
const Listing = require("../models/listing.models")

const userController = (req,res)=>{
    res.json({
        success:true,
        message:"user api running succesfully"
    });

};
const updateUser= async(req,res ,next)=>{
    if(req.user.id!== re.params.id)return next(errorHandler(401, "You can only update your profile"))
        try{
    if(req.body.password){
        req.body.password= bcrypt.hashSync(req.body.password,10);
    }
    const updateUser = await user.findByIdAndUpdate(
        req.params.id,
        {
            $set:{
                username: req.body.username,
                email:req.body.email,
                password: req.body.password,
                avatar:req.body.avatar,
            }
        },
        {new: true}
    );
    const {password, ...rest}= updateUser._doc;
    res.status(200).json(rest);
    }catch(error){

    }
};

const deleteUser = async(req,res,next)=>{
    if(req.user.id !== request.params.id) return next(errorHandler(401,"you can only delete your own status"))
        try{
    await user.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token')
    res.status(200).json("user has been deleted")
    }catch(error){
        next(error);
    }
};
const getUserListings= async(req,res,next)=>{
    if(req.user.id===req.params.id){
        try{
            const listings = await Listing.find({userRef: req.params.id});
            res.status(200).json(listings);
        }catch(error){
            next(error)

        }
    }else{
        return next(errorHandler(401),"you can only view your own listings")
    }
}
module.exports=userController
module.exports = updateUser
module.exports = deleteUser
module.exports = getUserListings
