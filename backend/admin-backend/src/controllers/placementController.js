import Placement from '../models/Placement.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import Activity from '../models/Activity.js';

// GET /api/placements?status=
export const getPlacements = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;

    const drives = await Placement.find(query).sort({ createdAt: -1 });

    // Attach lightweight application counts for the drive cards
    const withCounts = await Promise.all(
      drives.map(async (d) => {
        const applications = await Application.find({ placement: d._id });
        return {
          ...d.toObject(),
          candidateCount: applications.length,
          shortlistedCount: applications.filter((a) => a.stage === 'Shortlisted').length,
          placedCount: applications.filter((a) => a.stage === 'Placed').length,
        };
      })
    );

    res.json(withCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/placements/:id
export const getPlacementById = async (req, res) => {
  try {
    const drive = await Placement.findById(req.params.id);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });
    res.json(drive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/placements
export const createPlacement = async (req, res) => {
  try {
    const drive = await Placement.create(req.body);

    await Activity.create({
      type: 'drive',
      text: `New drive created: ${drive.companyName} — ${drive.jobRole}`,
      relatedPlacementId: drive._id,
    });

    res.status(201).json(drive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/placements/:id
export const updatePlacement = async (req, res) => {
  try {
    const drive = await Placement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!drive) return res.status(404).json({ message: 'Drive not found' });
    res.json(drive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/placements/:id
export const deletePlacement = async (req, res) => {
  try {
    const drive = await Placement.findByIdAndDelete(req.params.id);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });
    await Application.deleteMany({ placement: drive._id });
    res.json({ message: 'Drive deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- Applications (candidates) ----

// GET /api/placements/:id/applications
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ placement: req.params.id }).populate(
      'student',
      'name rollNumber branch cgpa'
    );

    const formatted = applications.map((a) => ({
      applicationId: a._id,
      id: a.student?.rollNumber,
      studentId: a.student?._id,
      name: a.student?.name,
      branch: a.student?.branch,
      cgpa: a.student?.cgpa,
      stage: a.stage,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/placements/:id/applications  { studentId }
export const addApplication = async (req, res) => {
  try {
    const { studentId } = req.body;
    const drive = await Placement.findById(req.params.id);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });

    const application = await Application.create({ placement: drive._id, student: studentId });
    drive.registeredStudents += 1;
    await drive.save();

    await Activity.create({
      type: 'placement',
      text: `New application received for ${drive.companyName} — ${drive.jobRole}`,
      relatedStudentId: studentId,
      relatedPlacementId: drive._id,
    });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This student has already applied to this drive' });
    }
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/placements/:id/applications/:applicationId  { stage }
export const updateApplicationStage = async (req, res) => {
  try {
    const { stage } = req.body;
    const application = await Application.findById(req.params.applicationId).populate('student');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const previousStage = application.stage;
    application.stage = stage;
    await application.save();

    const drive = await Placement.findById(req.params.id);

    if (stage === 'Placed' && previousStage !== 'Placed') {
      drive.selectedStudents += 1;
      await drive.save();

      await Student.findByIdAndUpdate(application.student._id, {
        placementStatus: 'Placed',
        companyPlaced: drive.companyName,
      });

      await Activity.create({
        type: 'placement',
        text: `${application.student.name} was placed at ${drive.companyName}`,
        relatedStudentId: application.student._id,
        relatedPlacementId: drive._id,
      });
    } else if (stage === 'Shortlisted' && previousStage !== 'Shortlisted') {
      await Activity.create({
        type: 'placement',
        text: `${application.student.name} was shortlisted for ${drive.companyName}`,
        relatedStudentId: application.student._id,
        relatedPlacementId: drive._id,
      });
    }

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};