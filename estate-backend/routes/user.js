const express= require("express");
const router = express.Router();
const userController= require("../controllers/user");
const updateUser= require("../controllers/user")
const deleteUser= require("../controllers/user")
const verifyToken= require("../utils/verifyuser")
const getUserListings = require("../controllers/user")



router.get("/test", userController);
router.post("/update/:id",verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id",verifyToken,getUserListings)

module.exports = router;
