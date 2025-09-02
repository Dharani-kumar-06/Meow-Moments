const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

require("dotenv").config(); // load env variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  date: { type: Date, default: Date.now }
});
const Blog = mongoose.model("Blog", blogSchema);

app.get("/api/blogs", async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});

app.post("/api/blogs", async (req, res) => {
  const blog = new Blog(req.body);
  await blog.save();
  res.json(blog);
});

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup (file uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage });

// --- Connect to MongoDB (Your DB URL) ---
mongoose.connect(
  'mongodb+srv://Jameera:Jamy%40007@cluster0.cgvqlou.mongodb.net/glow-flora-blogdb?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log('✅ MongoDB Connected (Glow Flora DB)'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// --- Moment model ---
const momentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: String,
  createdAt: { type: Date, default: Date.now }
});
const Moment = mongoose.model('Moment', momentSchema);

// --- Routes ---
app.get('/', (req, res) => {
  res.send('🌺 Glow Flora Backend Running');
});

// Create moment
app.post('/moments', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const newMoment = new Moment({ title, description, imagePath });
    await newMoment.save();
    res.status(201).json(newMoment);
  } catch (err) {
    console.error('Error creating moment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all moments
app.get('/moments', async (req, res) => {
  try {
    const moments = await Moment.find().sort({ createdAt: -1 });
    res.json(moments);
  } catch (err) {
    console.error('Error fetching moments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a moment (text only)
app.put("/moments/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedMoment = await Moment.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    res.json(updatedMoment);
  } catch (err) {
    res.status(500).json({ error: "Failed to update moment" });
  }
});

// Delete a moment
app.delete("/moments/:id", async (req, res) => {
  try {
    await Moment.findByIdAndDelete(req.params.id);
    res.json({ message: "Moment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete moment" });
  }
});

// --- Serve frontend in production ---
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "glow-flora-blog-frontend", "build")));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "glow-flora-blog-frontend", "build", "index.html"));
  });
}

// --- Start server ---
app.listen(PORT, () => console.log(`🚀 Glow Flora Blog Server running on port ${PORT}`));
