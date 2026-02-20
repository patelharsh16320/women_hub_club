const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create user - POST /api/users
const createUser = async (req, res) => {
	try {
		const { name, email, password, role } = req.body;
		if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });

		const exists = await User.findOne({ email: email.toLowerCase() });
		if (exists) return res.status(409).json({ message: 'Email already registered' });

		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		const user = new User({ name, email: email.toLowerCase(), password: hashed, role });
		const saved = await user.save();

		const userObj = saved.toObject();
		delete userObj.password;
		res.status(201).json(userObj);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get all users - GET /api/users
const getUsers = async (req, res) => {
	try {
		const users = await User.find({}).select('-password');
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get single user - GET /api/users/:id
const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select('-password');
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Update user - PUT /api/users/:id
const updateUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: 'User not found' });

		const { name, email, password, role } = req.body;
		if (name !== undefined) user.name = name;
		if (email !== undefined) user.email = email.toLowerCase();
		if (role !== undefined) user.role = role;

		if (password) {
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
		}

		const updated = await user.save();
		const userObj = updated.toObject();
		delete userObj.password;
		res.json(userObj);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Delete user - DELETE /api/users/:id
const deleteUser = async (req, res) => {
	try {
		const deleted = await User.findByIdAndDelete(req.params.id);
		if (!deleted) return res.status(404).json({ message: 'User not found' });
		res.json({ message: 'User deleted' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = {
	createUser,
	getUsers,
	getUserById,
	updateUser,
	deleteUser
};
