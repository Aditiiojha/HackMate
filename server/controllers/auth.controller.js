import User from '../models/user.model.js';

export const register = async (req, res) => {
  try {
    const { uid, name, email, college } = req.body;
    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({ uid, name, email, college });
    }
    const safe = user.toObject();
    delete safe.password;
    return res.status(201).json(safe);
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Registration failed' });
  }
};

export const me = async (req, res) => {
  const safe = req.user.toObject ? req.user.toObject() : req.user;
  delete safe.password;
  return res.status(200).json(safe);
};
