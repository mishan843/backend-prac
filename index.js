const express = require("express");
const mongoose = require('mongoose')
const cors = require('cors');
const dbConnect = require("./database/dbconnect");
const userRouter = require('./route/userRoute')
const productRouter = require('./route/productRoute')

const app = express();
const corsOptions = {
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

dbConnect()

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}`);
});
