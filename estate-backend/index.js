const express = require("express")
const mongoose = require("mongoose")
const userRoutes = require("./routes/user");
const authRoutes= require("./routes/auth");
const signUp = require("./controllers/auth");
const signIn = require("./controllers/auth");
const cookieParser = require("cookie-parser")
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log("Database connected succesfully")})
.catch((err)=>{console.log("ERROR LOADING DATABASE")
});
const app = express();
app.use(express.json());
app.use(cookieParser);
app.use("/api/user" ,userRoutes);
app.use("/api/auth",authRoutes);

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