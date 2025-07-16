import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'

export const createOwner = async (req, res) => {
  try {
    const { name, email, number, password, role, status } = req.body;

   if (!name || name.trim() === '') {
  return res.status(400).json({ error: 'Name is required' });
}

if (!email || email.trim() === '') {
  return res.status(400).json({ error: 'Email is required' });
}

if (!number || number.trim() === '') {
  return res.status(400).json({ error: 'Mobile number is required' });
}

if (!status || status.trim() === '') {
  return res.status(400).json({ error: 'User status (Active/Inactive) is required' });
}

if (!password || password.trim() === '') {
  return res.status(400).json({ error: 'Password is required' });
}

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          'Password must be at least 8 characters long and include at least one letter, one number, and one special character.',
      });
    }

    // Check if Owner already exists
    // if (role === 'Owner') {
    //   const existingOwner = await User.findOne({ role: 'Owner' });
    //   if (existingOwner) {
    //     return res.status(403).json({ error: 'Owner already exists' });
    //   }
    // }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      number,
      password: hashedPassword,
      role:"Owner",
      status,
    });

    await user.save();
    res.status(201).json({ message: 'Owner created successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const createAdmin = async (req, res) => {
  try {
    const { name, email,number, password, role, status } = req.body;
       if (!name || name.trim() === '') {
  return res.status(400).json({ error: 'Name is required' });
}

if (!email || email.trim() === '') {
  return res.status(400).json({ error: 'Email is required' });
}

if (!number || number.trim() === '') {
  return res.status(400).json({ error: 'Mobile number is required' });
}

if (!status || status.trim() === '') {
  return res.status(400).json({ error: 'User status (Active/Inactive) is required' });
}

if (!password || password.trim() === '') {
  return res.status(400).json({ error: 'Password is required' });
}

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          'Password must be at least 8 characters long and include at least one letter, one number, and one special character.',
      });
    } 

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword,number, role, status });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Get All Users (Owner)
export const getUsers = async (req, res) => {
  try {
    const { status, name } = req.query;

    const filter = {
      _id: { $ne: req.user._id } // exclude the logged-in user
    };

    if (status) {
      filter.status = status;
    }

    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // case-insensitive
    }

    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update User Status
export const updateUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, number } = req.body;

    // Optional: Check if mobile or email is being used by another user
    const existingEmail = await User.findOne({ email, _id: { $ne: id } });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already in use by another user' });
    }

    const existingNumber = await User.findOne({ number, _id: { $ne: id } });
    if (existingNumber) {
      return res.status(400).json({ error: 'Mobile number already in use by another user' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name, email, number },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Toggle status
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    user.status = newStatus;

    await user.save();

    res.json({
      message: `User status updated to ${newStatus}`,
      status: newStatus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Delete User
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
