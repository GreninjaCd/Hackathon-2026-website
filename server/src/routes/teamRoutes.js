const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const { createTeam, getTeamById, addMember, getMyTeam, getAllTeams, verifyTeamPayment, deleteTeam } = require('../controllers/teamController');

// Create team
router.post('/', protect, createTeam);

router.get('/myteam', protect, getMyTeam);

// Get team details
router.get('/:id', protect, getTeamById);

// Add member to team
router.post('/:id/members', protect, addMember);

// Admin: Get all teams
router.get('/', protect, admin, getAllTeams);

// Admin: Verify a team's payment
router.post('/:id/verify-payment', protect, admin, verifyTeamPayment);

router.delete('/:id',protect,admin,deleteTeam);

router.get('/:id', protect, getTeamById);

module.exports = router;