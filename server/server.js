const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const User = require('./models/User');
const Item = require('./models/Item');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CampusFind API is running successfully' });
});

// Seed sample data if DB is empty
const seedSampleData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial campus sample users and items...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const demoUser = await User.create({
        name: 'Alex Rivera',
        email: 'alex.rivera@igdtuw.ac.in',
        password: hashedPassword
      });

      const demoUser2 = await User.create({
        name: 'Sarah Chen',
        email: 'sarah.chen@igdtuw.ac.in',
        password: hashedPassword
      });

      await Item.create([
        {
          title: 'MacBook Pro M2 (Space Gray)',
          description: 'Left inside a leather sleeve on the 3rd floor library study table near window 4.',
          category: 'Electronics',
          status: 'Lost',
          location: 'Main Library 3rd Floor',
          date: new Date(Date.now() - 3600000 * 5),
          contact: 'alex.rivera@igdtuw.ac.in | Ph: 555-0192',
          postedBy: demoUser._id
        },
        {
          title: 'Student ID Card & Dorm Keycard',
          description: 'Found a blue lanyard with student ID card for "Jordan Smith" outside the cafeteria.',
          category: 'ID & Cards',
          status: 'Found',
          location: 'Student Union Cafeteria Entrance',
          date: new Date(Date.now() - 3600000 * 12),
          contact: 'sarah.chen@igdtuw.ac.in',
          postedBy: demoUser2._id
        },
        {
          title: 'Calculus III Hardcover Textbook',
          description: 'Left on bench outside Science Building Block B. Has yellow sticky notes inside.',
          category: 'Books & Notes',
          status: 'Lost',
          location: 'Science Building Block B Lawn',
          date: new Date(Date.now() - 3600000 * 24),
          contact: 'alex.rivera@igdtuw.ac.in',
          postedBy: demoUser._id
        },
        {
          title: 'AirPods Pro with Cyberpunk Case',
          description: 'Found on gym bench near locker room 2. Returned safely to owner!',
          category: 'Electronics',
          status: 'Returned',
          location: 'Campus Sports Center Gym',
          date: new Date(Date.now() - 3600000 * 48),
          contact: 'sarah.chen@igdtuw.ac.in',
          postedBy: demoUser2._id
        }
      ]);

      console.log('Sample data seeded successfully! Demo account: alex.rivera@igdtuw.ac.in / password123');
    }
  } catch (err) {
    console.error('Error seeding sample data:', err.message);
  }
};

const PORT = process.env.PORT || 5000;

// Connect to DB and Start Server
connectDB().then(() => {
  seedSampleData();
  app.listen(PORT, () => {
    console.log(`🚀 CampusFind Backend Server running on http://localhost:${PORT}`);
  });
});
