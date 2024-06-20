const express= require("express");
const router = express.Router();
const userController= require("../controllers/user");
const updateUser= require("../controllers/user")



router.get("/test", userController);
router.post("/update/:id", updateUser);

module.exports = router;
