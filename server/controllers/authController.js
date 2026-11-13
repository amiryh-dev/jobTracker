import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';

// POST /api/auth/signup
export async function signup(req, res, next) {
  try {
    const { name = '', email = '', password = '' } = req.body;

    if (!name.trim() || !email.trim() || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }
    if (await User.exists({ email: email.toLowerCase().trim() })) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ token: signToken(user._id), user });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/signin
export async function signin(req, res, next) {
  try {
    const { email = '', password = '' } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }
    res.json({ token: signToken(user._id), user });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
export async function me(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'Account not found. Sign in again.' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
