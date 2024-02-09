const express = require("express");
const router = express.Router();

const { login, register, getAllUsers } = require("../controllers/ManagerController");
//const authMiddleware = require('../middleware/auth')

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/users").get(getAllUsers);


module.exports = router;