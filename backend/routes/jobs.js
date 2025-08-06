const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { authenticateToken } = require('../middleware/auth');

// Get all jobs with filtering
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      type,
      sort = 'createdAt',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = type;

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'salary':
        sortObj = { salary: -1 };
        break;
      case 'deadline':
        sortObj = { deadline: 1 };
        break;
      case 'views':
        sortObj = { views: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;
    
    const jobs = await Job.find(filter)
      .populate('employer', 'profile.firstName profile.lastName email')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'profile.firstName profile.lastName email')
      .populate('applications.applicant', 'profile.firstName profile.lastName email');

    if (!job) {
      return res.status(404).json({
        success: false,
        error: { code: 'JOB_001', message: 'Job not found' }
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Create job (employers only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is employer or admin
    if (!['employer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_002', message: 'Only employers can post jobs' }
      });
    }

    const jobData = {
      ...req.body,
      employer: req.user._id
    };

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      success: true,
      data: job,
      message: 'Job posted successfully'
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Apply for job
router.post('/:id/apply', authenticateToken, async (req, res) => {
  try {
    const { coverLetter, expectedSalary } = req.body;

    if (!coverLetter || !expectedSalary) {
      return res.status(400).json({
        success: false,
        error: { code: 'JOB_002', message: 'Cover letter and expected salary are required' }
      });
    }

    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: { code: 'JOB_001', message: 'Job not found' }
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: { code: 'JOB_003', message: 'Job is not accepting applications' }
      });
    }

    // Check if user already applied
    if (job.hasUserApplied(req.user._id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'JOB_004', message: 'You have already applied to this job' }
      });
    }

    await job.addApplication(req.user._id, coverLetter, expectedSalary);

    res.json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get user's applications
router.get('/user/applications', authenticateToken, async (req, res) => {
  try {
    const jobs = await Job.find({
      'applications.applicant': req.user._id
    }).populate('employer', 'profile.firstName profile.lastName company');

    const applications = jobs.map(job => {
      const application = job.applications.find(app => 
        app.applicant.toString() === req.user._id.toString()
      );
      return {
        job: {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          category: job.category,
          type: job.type,
          salary: job.salary
        },
        application: application
      };
    });

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Get employer's posted jobs
router.get('/user/posted', authenticateToken, async (req, res) => {
  try {
    if (!['employer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_002', message: 'Only employers can view posted jobs' }
      });
    }

    const jobs = await Job.find({ employer: req.user._id })
      .populate('applications.applicant', 'profile.firstName profile.lastName email');

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Error fetching posted jobs:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

// Update application status (employers only)
router.put('/:jobId/applications/:applicationId', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'JOB_005', message: 'Invalid status' }
      });
    }

    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: { code: 'JOB_001', message: 'Job not found' }
      });
    }

    // Check if user is the employer
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { code: 'AUTH_002', message: 'Only the job poster can update applications' }
      });
    }

    await job.updateApplicationStatus(req.params.applicationId, status);

    res.json({
      success: true,
      message: 'Application status updated successfully'
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_001', message: 'Internal server error' }
    });
  }
});

module.exports = router;
