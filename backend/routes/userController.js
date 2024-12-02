const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Tasks');
const { isAuthenticatedUser } = require('../middlewares/authenticate')

//Get Single User
router.get('/' , isAuthenticatedUser,async(req,res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId)
            .populate('department','name')
            .populate('business_unit','name');

        if(!user){
            return res.status(404).json({message : "User not found!"});
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message : error.message});
    }
});

//Get User projects from projects
router.get('/user-projects', async (req, res) => {
    try {
        const userId = req.user.id; 
        const projects = await Project.find({ assigned_users: userId })
            .populate('assigned_users', 'username')
            .populate('department','name')
            .populate('business_unit','name');


        if (!projects) {
            return res.status(404).json({ message: 'No projects found for this user.' });
        }
        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get tasks of particular user
router.get('/user-tasks' , async(req,res) => {
    try {
        const userId = req.user.id;
        const tasks = await Task.find({user : userId})
            .populate('user','username')
            .populate('project','name');

        if (!tasks){
            return res.status(404).json({ message: 'No tasks for this user.' });
        }

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;