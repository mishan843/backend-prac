const express = require('express')
const { createUser, loginUser, updateUser, getUsers, deleteUser, getUserDetail } = require('../controllers/userCtrl');
const authMiddleware = require('../middlleware/authentication');
const router = express.Router();


router.post('/create', createUser)
router.post('/login', loginUser)
router.put('/update/:userId', authMiddleware, updateUser)
router.get('/get/:userId', authMiddleware, getUserDetail)
router.delete('/delete/:userId', authMiddleware, deleteUser)
router.get('/getall', authMiddleware, getUsers)



module.exports = router;