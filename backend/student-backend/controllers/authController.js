const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

/**
 * Register a new student
 * Route: POST /api/auth/register
 */
exports.register = async (req, res) => {
    try {
        const { name, email, password, rollNumber, branch, graduationYear, cgpa } = req.body;

        if (!name || !email || !password || !rollNumber || !branch || graduationYear === undefined || cgpa === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered',
            });
        }

        const student = await Student.create({
            name,
            email,
            password,
            rollNumber,
            branch,
            graduationYear,
            cgpa,
        });

        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            data: student,
        });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed: ' + error.message,
        });
    }
};

/**
 * Login student and set JWT cookie
 * Route: POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        const student = await Student.findOne({ email }).select('+password');

        if (!student) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const isMatch = await student.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const token = jwt.sign(
            { id: student._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            data: student,
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed: ' + error.message,
        });
    }
};

/**
 * Logout student by clearing token cookie
 * Route: POST /api/auth/logout
 */
exports.logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};
