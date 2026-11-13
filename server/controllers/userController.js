import User from '../models/User.js';
import Job from '../models/Job.js';

// GET /api/users/me  — read the signed-in user's profile
export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Account not found.' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/me  — update name, email and/or password
// Changing the email or password requires the current password.
export async function updateProfile(req, res, next) {
  try {
    const { name, email, password, currentPassword = '' } = req.body;
    const user = await User.findById(req.userId).select('+password');
    if (!user) return res.status(404).json({ message: 'Account not found.' });

    const changingEmail = email !== undefined && email.toLowerCase().trim() !== user.email;
    const changingPassword = password !== undefined && password !== '';

    if ((changingEmail || changingPassword) && !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    if (name !== undefined) {
      if (!String(name).trim()) return res.status(400).json({ message: 'Name cannot be empty.' });
      user.name = name;
    }
    if (changingEmail) {
      const taken = await User.exists({ email: email.toLowerCase().trim(), _id: { $ne: user._id } });
      if (taken) return res.status(409).json({ message: 'An account with this email already exists.' });
      user.email = email;
    }
    if (changingPassword) {
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' });
      }
      user.password = password; // hashed by the pre('save') hook
    }

    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/users/me  — delete the account and all of its applications
export async function deleteProfile(req, res, next) {
  try {
    const { currentPassword = '' } = req.body || {};
    const user = await User.findById(req.userId).select('+password');
    if (!user) return res.status(404).json({ message: 'Account not found.' });

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    await Job.deleteMany({ user: user._id });
    await user.deleteOne();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
