const express = require('express');
const app = express();
const Port = 3000;
const Db = require('./db/connect');
const dotenv = require('dotenv');
const PostRoute = require('./routes/post.route');
const userRoute = require('./routes/user.route');
const commentRoute = require('./routes/comment.route');
const authRoute = require('./routes/auth.route');
const postRoutes = require('./routes/post.route');
const cors = require("cors")
const { protect } = require('./middleware/authMiddleware');
const upload = require('./middleware/uploadImage');
const path = require('path');
dotenv.config();
// app.use("/uploads", express.static("uploads")); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const corsOptions = {
    origin: ['http://localhost:5173'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions))

app.use("/api/v1/posts", protect,upload.single("image"), PostRoute)
app.use("/api/v1/users", userRoute)
app.use("/api/v1/comments", commentRoute)
app.use("/api/v1/auth", authRoute)


Db();


app.listen(Port, () => {
    console.log(`Server is running on port http://localhost:${Port}`);
})