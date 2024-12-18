import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import path from 'path';
import { fileURLToPath } from 'url';
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import multer from "multer";  // Import multer
import fs from "fs";
import { Post } from "./models/post.model.js";
import { app, server } from "./socket/socket.js";
const __filename = fileURLToPath(import.meta.url); // Get the file path
const __dirname = path.dirname(__filename); // Get the directory path
console.log(__dirname);

dotenv.config();
const PORT = process.env.PORT || 3000;

// Static file serving for 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file uploads
const photosMiddleware = multer({ dest: 'uploads/' });

// Route for file uploads
app.post('/uploads', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];

    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;

        // Rename the file with the proper extension
        fs.renameSync(path, newPath);
        
        // Push the file path for the response
        uploadedFiles.push(newPath.replace('uploads\\post\\', ''));
    }

    // Respond with the file paths
    res.json(uploadedFiles);
});

// Test route
// app.get("/", (req, res) => {
//     return res.status(200).json({
//         message: "I'm coming from backend",
//         success: true
//     });
// });

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
    origin: "http://localhost:5173",  // Replace with your frontend URL
    credentials: true
};
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// In your backend API (e.g., Express.js)
app.get('/api/v1/post/:id', async (req, res) => {
    try {
      const postId = req.params.id;
      console.log("Backend received post ID:", postId);  // Log the received ID
  
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ success: false, message: 'Invalid post ID' });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }
      
      console.log("Backend post:", post);  // Log the post found
      res.json({ success: true, post });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  

  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  })
// Start the server and connect to DB
server.listen(PORT, () => {
    connectDB();
    console.log(`Server is listening on port ${PORT}`);
});
