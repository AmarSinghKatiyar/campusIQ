// Student Controller
const Student = require('../models/Student');
const { cloudinary } = require('../config/cloudinary');
const DatauriParser = require('datauri/parser');
const fs = require('fs/promises');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const knownSkills = [
    'JavaScript',
    'TypeScript',
    'React',
    'React.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'SQL',
    'Java',
    'Python',
    'C++',
    'C',
    'HTML',
    'CSS',
    'Tailwind CSS',
    'Git',
    'GitHub',
    'DSA',
    'Data Structures',
    'Algorithms',
    'REST API',
    'Redux',
    'MySQL',
    'PostgreSQL',
    'Firebase',
    'Docker',
    'AWS',
];

const hasUsableCloudinaryCredentials = () => {
    const values = [
        process.env.CLOUDINARY_CLOUD_NAME,
        process.env.CLOUDINARY_API_KEY,
        process.env.CLOUDINARY_API_SECRET,
    ];

    return values.every((value) => value && value.length > 6 && !/^x+$/i.test(value));
};

const saveResumeLocally = async (req) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'resumes');
    const fileName = `${req.user._id}-resume.pdf`;
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, req.file.buffer);

    return `${req.protocol}://${req.get('host')}/uploads/resumes/${fileName}`;
};

const normalizeProfileUrl = (url) => {
    if (!url) return '';
    const cleaned = url.replace(/[),.;\]]+$/, '');
    return /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
};

const parseResumeText = async (buffer) => {
    const parser = new PDFParse({ data: buffer });

    try {
        const result = await parser.getText();
        return result.text || '';
    } finally {
        await parser.destroy();
    }
};

const extractResumeDetails = (text) => {
    const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    const normalizedText = text.replace(/\s+/g, ' ');
    const extracted = {};

    const nameLine = lines.find((line) => {
        if (line.length < 2 || line.length > 50) return false;
        if (/@|https?:|www\.|github|linkedin|\d{4,}/i.test(line)) return false;
        if (/resume|curriculum vitae|profile|summary|education|skills|experience|project/i.test(line)) return false;
        return /^[a-zA-Z][a-zA-Z .'-]+$/.test(line);
    });

    if (nameLine) {
        extracted.name = nameLine.replace(/\s+/g, ' ');
    }

    const emailMatch = normalizedText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (emailMatch) {
        extracted.email = emailMatch[0].toLowerCase();
    }

    const phoneMatch = normalizedText.match(/(?:\+?91[\s-]?)?[6-9]\d(?:[\s-]?\d){8}/);
    if (phoneMatch) {
        const digits = phoneMatch[0].replace(/\D/g, '').slice(-10);
        if (digits.length === 10) {
            extracted.phoneNumber = digits;
        }
    }

    const githubMatch = normalizedText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+\/?/i);
    if (githubMatch) {
        extracted.githubUrl = normalizeProfileUrl(githubMatch[0]);
    }

    const linkedinMatch = normalizedText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/i);
    if (linkedinMatch) {
        extracted.linkedinUrl = normalizeProfileUrl(linkedinMatch[0]);
    }

    const cgpaMatch = normalizedText.match(/(?:CGPA|GPA)\s*[:\-]?\s*([0-9](?:\.[0-9]{1,2})?|10(?:\.0{1,2})?)(?:\s*\/\s*10)?/i);
    if (cgpaMatch) {
        const cgpa = Number(cgpaMatch[1]);
        if (!Number.isNaN(cgpa) && cgpa >= 0 && cgpa <= 10) {
            extracted.cgpa = cgpa;
        }
    }

    const branchMap = [
        [/computer science|cse/i, 'CSE'],
        [/information technology|\bIT\b/i, 'IT'],
        [/electronics|ece/i, 'ECE'],
        [/electrical|ee/i, 'EE'],
        [/mechanical|me/i, 'ME'],
        [/civil|ce/i, 'CE'],
    ];
    const branchMatch = branchMap.find(([pattern]) => pattern.test(normalizedText));
    if (branchMatch) {
        extracted.branch = branchMatch[1];
    }

    const yearMatch = normalizedText.match(/\b(202[4-9]|2030)\b/);
    if (yearMatch) {
        extracted.graduationYear = Number(yearMatch[1]);
    }

    const lowerText = normalizedText.toLowerCase();
    const skills = knownSkills.filter((skill) => {
        const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`(^|[^a-z0-9+#.])${escaped.toLowerCase()}([^a-z0-9+#.]|$)`, 'i').test(lowerText);
    });

    if (skills.length) {
        extracted.skills = [...new Set(skills)].slice(0, 20);
    }

    return extracted;
};

/**
 * Get Student Profile
 * Route: GET /api/students/profile
 * Access: Private (Protected with JWT)
 */
exports.getProfile = async (req, res) => {
    try {
        // req.user is attached by authMiddleware
        const student = req.user;

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: student,
        });
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving profile: ' + error.message,
        });
    }
};

/**
 * Update Student Profile
 * Route: PUT /api/students/profile
 * Access: Private (Protected with JWT)
 * Allowed fields: name, email, cgpa, skills, githubUrl, linkedinUrl, phoneNumber, securityPreferences
 */
exports.updateProfile = async (req, res) => {
    try {
        // Define allowed fields for update
        const allowedFields = ['name', 'email', 'cgpa', 'skills', 'githubUrl', 'linkedinUrl', 'phoneNumber', 'securityPreferences'];

        // Filter request body to only include allowed fields
        const updateData = {};
        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key)) {
                updateData[key] = req.body[key];
            }
        });

        // Validate CGPA if provided
        if (updateData.cgpa !== undefined) {
            if (updateData.cgpa < 0 || updateData.cgpa > 10) {
                return res.status(400).json({
                    success: false,
                    message: 'CGPA must be between 0 and 10',
                });
            }
        }

        // Validate email if provided and ensure it is not already in use
        if (updateData.email !== undefined) {
            updateData.email = updateData.email.trim().toLowerCase();
            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            if (!emailRegex.test(updateData.email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid email',
                });
            }

            const existingStudent = await Student.findOne({
                email: updateData.email,
                _id: { $ne: req.user._id },
            });

            if (existingStudent) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered',
                });
            }
        }

        // Validate phone number if provided
        if (updateData.phoneNumber !== undefined) {
            const phoneRegex = /^[0-9]{10}$/;
            // Only validate if phoneNumber is provided and not empty
            if (updateData.phoneNumber !== null && updateData.phoneNumber !== '' && !phoneRegex.test(updateData.phoneNumber)) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number must be exactly 10 digits',
                });
            }
        }

        // Validate GitHub URL if provided
        if (updateData.githubUrl !== undefined && updateData.githubUrl) {
            const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
            if (!githubRegex.test(updateData.githubUrl)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid GitHub URL format',
                });
            }
        }

        // Validate LinkedIn URL if provided
        if (updateData.linkedinUrl !== undefined && updateData.linkedinUrl) {
            const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
            if (!linkedinRegex.test(updateData.linkedinUrl)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid LinkedIn URL format',
                });
            }
        }

        // Validate skills array if provided
        if (updateData.skills !== undefined) {
            if (!Array.isArray(updateData.skills)) {
                return res.status(400).json({
                    success: false,
                    message: 'Skills must be an array',
                });
            }

            if (updateData.skills.length > 20) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot have more than 20 skills',
                });
            }

            // Remove duplicate skills
            updateData.skills = [...new Set(updateData.skills)];
        }

        if (updateData.securityPreferences !== undefined) {
            const allowedSecurityFields = ['twoStepVerification', 'loginAlerts', 'profileVisibility'];
            const sanitizedPreferences = {};

            Object.keys(updateData.securityPreferences || {}).forEach((key) => {
                if (allowedSecurityFields.includes(key)) {
                    sanitizedPreferences[key] = updateData.securityPreferences[key];
                }
            });

            if (
                sanitizedPreferences.profileVisibility &&
                !['placement-team', 'recruiters', 'private'].includes(sanitizedPreferences.profileVisibility)
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid profile visibility setting',
                });
            }

            updateData.securityPreferences = {
                ...req.user.securityPreferences?.toObject?.(),
                ...sanitizedPreferences,
            };
        }

        // Update student profile using _id (consistent with Mongoose)
        const student = await Student.findByIdAndUpdate(req.user._id, updateData, {
            new: true, // Return updated document
            runValidators: true, // Run schema validators
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: student,
        });
    } catch (error) {
        console.error('Error in updateProfile:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages,
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating profile: ' + error.message,
        });
    }
};

/**
 * Upload Resume
 * Route: POST /api/students/upload-resume
 * Access: Private (Protected with JWT)
 * Accepts: PDF files only (max 5MB)
 */
exports.uploadResume = async (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded. Please select a PDF file.',
            });
        }

        // Verify file is PDF
        if (req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({
                success: false,
                message: 'Only PDF files are allowed',
            });
        }

        let resumeUrl;

        if (hasUsableCloudinaryCredentials()) {
            // Parse file to datauri format for Cloudinary
            const parser = new DatauriParser();
            const extname = path.extname(req.file.originalname) || '.pdf';

            // Format datauri with file buffer
            const fileDataUri = parser.format(extname, req.file.buffer);

            if (!fileDataUri || !fileDataUri.content) {
                return res.status(400).json({
                    success: false,
                    message: 'Error processing file. Please try again.',
                });
            }

            // Upload PDFs as raw files so Cloudinary does not try to parse resumes as images.
            const result = await cloudinary.uploader.upload(fileDataUri.content, {
                resource_type: 'raw',
                folder: 'campusiq-resumes',
                public_id: `${req.user._id}-resume.pdf`,
                overwrite: true,
            });

            // Verify upload success
            if (!result || !result.secure_url) {
                return res.status(500).json({
                    success: false,
                    message: 'Resume upload failed. Please try again.',
                });
            }

            resumeUrl = result.secure_url;
        } else {
            resumeUrl = await saveResumeLocally(req);
        }

        let extractedDetails = {};
        try {
            const resumeText = await parseResumeText(req.file.buffer);
            extractedDetails = extractResumeDetails(resumeText);
        } catch (parseError) {
            console.warn('Resume text extraction failed:', parseError.message);
        }

        const updateData = {
            resumeUrl,
            ...extractedDetails,
        };

        if (updateData.email && updateData.email !== req.user.email) {
            const existingStudent = await Student.findOne({
                email: updateData.email,
                _id: { $ne: req.user._id },
            });

            if (existingStudent) {
                delete updateData.email;
            }
        }

        const student = await Student.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            data: {
                student,
                resumeUrl,
                extractedDetails,
            },
        });
    } catch (error) {
        console.error('Error in uploadResume:', error);

        if (error.http_code === 401 || /api_key|api secret|credentials/i.test(error.message || '')) {
            return res.status(500).json({
                success: false,
                message: 'Cloudinary credentials are invalid. Please check backend .env values.',
            });
        }

        // Handle file-specific Cloudinary errors without hiding configuration problems.
        if (error.message && /invalid (file|image)|unsupported|format/i.test(error.message)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid file format. Please upload a valid PDF.',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error uploading resume: ' + error.message,
        });
    }
};

/**
 * Delete Resume
 * Route: DELETE /api/students/resume
 * Access: Private (Protected with JWT)
 */
exports.deleteResume = async (req, res) => {
    try {
        const student = await Student.findById(req.user._id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        if (!student.resumeUrl) {
            return res.status(404).json({
                success: false,
                message: 'No resume found to delete',
            });
        }

        // Extract public_id from Cloudinary URL
        const publicId = `campusiq-resumes/${req.user._id}-resume`;

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
            // Log error but continue - resume might already be deleted
            console.error('Cloudinary deletion error:', cloudinaryError.message);
        }

        // Update student record
        const updatedStudent = await Student.findByIdAndUpdate(
            req.user._id,
            { resumeUrl: null },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Resume deleted successfully',
            data: updatedStudent,
        });
    } catch (error) {
        console.error('Error in deleteResume:', error);

        res.status(500).json({
            success: false,
            message: 'Error deleting resume: ' + error.message,
        });
    }
};
/**
 * Student Dashboard
 * Route: GET /api/students/dashboard
 * Access: Private (Protected with JWT)
 */
exports.getDashboard = async (req, res) => {
    try {
        const student = await Student.findById(req.user._id).select(
            "name cgpa skills placementStatus"
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        res.status(200).json({
            success: true,
            data: {
                name: student.name,
                cgpa: student.cgpa,
                skills: student.skills,
                placementStatus: student.placementStatus,
            },
        });
    } catch (error) {
        console.error("Error in getDashboard:", error);

        res.status(500).json({
            success: false,
            message: "Error fetching dashboard: " + error.message,
        });
    }
}; 
