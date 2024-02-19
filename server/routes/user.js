const express = require("express");
const router = express.Router();
//const {authenticationMiddleware}=require('../middleware/auth')

const { login, register, getAllUsers } = require("../controllers/ManagerController");
const authMiddleware = require('../middleware/auth')

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/users").get(authMiddleware,getAllUsers);


module.exports = router;