
require("dotenv").config();

const express = require("express");

const methodOverride = require('method-override');

const cookieParser=require("cookie-parser");

const bodyParser=require("body-parser");

const cors=require("cors");

const database=require("./configs/database");

const Task = require("./api/v1/models/task.model");

const apiV1=require("./api/v1/routes/index.route");

const port =process.env.PORT;

const app = express();

app.use(methodOverride('_method'));

app.use(cors());

app.use(cookieParser())

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

database.connect();

app.listen(port,()=>{
    console.log(`this is port ${3000}`);
})

apiV1(app);




