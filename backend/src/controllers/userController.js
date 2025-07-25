const User = require('../models/user');

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user by ID, exclude password field
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// PUT /users/:id
const updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const allowedUpdates = ['name', 'phone', 'kycDocs'];
  const updates = {};

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  updates.updatedAt = new Date();

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password'); // Do not return password

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};




const uploadKYC = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No KYC files uploaded' });
    }

    const filePaths = req.files.map(file => file.path); // Local file paths
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { kycDocs: filePaths, updatedAt: new Date() } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'KYC documents uploaded successfully',
      kycDocs: filePaths
    });
  } catch (err) {
    console.error('KYC Upload Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const getVerifiedSuppliers = async (req, res) => {
  try {
    const suppliers = await User.find({ role: 'supplier', isVerified: true }).select('-password');
    res.status(200).json({ success: true, suppliers });
  } catch (err) {
    console.error('Error fetching verified suppliers:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getUserProfile, updateUserProfile, uploadKYC, getVerifiedSuppliers};