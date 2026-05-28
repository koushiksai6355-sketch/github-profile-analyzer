const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.post('/analyze/:username', profileController.analyzeProfile);
router.get('/profiles', profileController.getAllProfiles);
router.get('/profiles/:username', profileController.getProfileByUsername);

module.exports = router;
