const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ role: 'super-admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Super admin already exists!');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      await mongoose.connection.close();
      return;
    }

    // Create super admin
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const superAdmin = new Admin({
      username: 'superadmin',
      email: 'admin@screenplex.com',
      password: hashedPassword,
      fullName: 'Super Administrator',
      role: 'super-admin',
      permissions: {
        canManageMovies: true,
        canManageUsers: true,
        canViewAnalytics: true,
        canManageAdmins: true
      },
      isActive: true
    });

    await superAdmin.save();

    console.log('✅ Super admin created successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Admin Login Credentials:');
    console.log('═══════════════════════════════════════');
    console.log('URL:      http://localhost:3000/admin-panel/login');
    console.log('Username: superadmin');
    console.log('Password: Admin@123');
    console.log('Email:    admin@screenplex.com');
    console.log('Role:     super-admin');
    console.log('═══════════════════════════════════════');
    console.log('⚠️  Please change the password after first login!');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin();
