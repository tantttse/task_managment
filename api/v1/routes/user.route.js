const express =require("express");
const router =express.Router();
const Task = require("../models/user.model");
const userController=require("../controller/user.controller");
const authMiddleware=require("../middlewares/auth.middleware")

router.post("/register/",userController.create);

router.post("/login/",userController.login);

router.post("/details/:id",userController.details);

router.post("/password/forgot",userController.forgotPassword);

router.post("/password/otp",userController.otpConfirmation);

router.post("/password/reset",userController.reset);

router.post("/details/",authMiddleware.requireAuth,userController.details);

router.get("/list/",authMiddleware.requireAuth,userController.list);

module.exports = router;