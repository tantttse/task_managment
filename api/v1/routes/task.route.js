const express =require("express");
const router =express.Router();
const Task = require("../models/task.model");
const taskController=require("../controller/task.controller");

router.get("/",taskController.list);

router.get("/index",taskController.index);

router.get("/details/:id",taskController.details);

router.patch("/change-multi/",taskController.changeMulti);

router.delete("/delete/",taskController.deleted);

router.post("/create/",taskController.create);

router.patch("/join-task/",taskController.join);

router.patch("/leave-task/",taskController.leave);



module.exports = router;