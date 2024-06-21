const express = require("express")
const mongoose = require("mongoose")
const userRoutes = require("./routes/user");
const authRoutes= require("./routes/auth");
const signUp = require("./controllers/auth");
const signIn = require("./controllers/auth");
const cookieParser = require("cookie-parser");
const listingRouter= require("./routes/listing.routes")
const path = require("path")
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log("Database connected succesfully")})
.catch((err)=>{console.log("ERROR LOADING DATABASE")
});

const _dirname= path.resolve();
const app = express();
app.use(express.json());
app.use(cookieParser);
app.use("/api/user" ,userRoutes);
app.use("/api/auth",authRoutes);
app.use(".api/listing", listingRouter);

app.use(express.static(path.join(_dirname,"/real-estate/dist")));

app.get("*",(req,res)=>{
    res.sendFile(path.join(_dirname,"real-estate", "dist", "index.html"))
})

app.listen(3000, ()=>{
    console.log("Server is up and running at port 3000!!")
});

app.use((err, req, res, next) => {
    const statusCode= err.statusCode || 500;
    const message = err.message || "INTERNAL SERVER ERROR";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});