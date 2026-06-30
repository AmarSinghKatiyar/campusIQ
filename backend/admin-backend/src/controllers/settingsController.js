import Admin from '../models/Admin.js';

// NOTE: I don't have your authMiddleware.js, so I don't know whether it attaches
// the logged-in admin as `req.admin` or `req.user`. This helper checks both —
// if neither exists, update this one line to match your middleware.
const adminId = (req) => req.admin?._id || req.user?._id;

// GET /api/settings/profile
export const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(adminId(req)).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/settings/profile  { name, email, jobTitle, phone }
export const updateProfile = async (req, res) => {
  try {
    const { name, email, jobTitle, phone } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      adminId(req),
      { name, email, jobTitle, phone },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/settings/notifications
export const updateNotifications = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      adminId(req),
      { notificationPrefs: req.body },
      { new: true }
    ).select('-password');
    res.json(admin.notificationPrefs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/settings/institution
export const updateInstitution = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      adminId(req),
      { institution: req.body },
      { new: true }
    ).select('-password');
    res.json(admin.institution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/settings/password  { currentPassword, newPassword }
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(adminId(req));

    const matches = await admin.matchPassword(currentPassword);
    if (!matches) return res.status(401).json({ message: 'Current password is incorrect' });

    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/settings/two-factor  { enabled }
export const updateTwoFactor = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      adminId(req),
      { twoFactorEnabled: req.body.enabled },
      { new: true }
    ).select('-password');
    res.json({ twoFactorEnabled: admin.twoFactorEnabled });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/settings/account
export const deleteAccount = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(adminId(req));
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};