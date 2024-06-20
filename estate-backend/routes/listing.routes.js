const express = require('express');
const verifyToken = require('../utils/verifyuser');
const createListing= require("../controllers/listing.controllers")

const router = express.Router();
router.post('/create', verifyToken , createListing);

module.exports= router;