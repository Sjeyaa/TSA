const express = require('express');
const router = express.Router();
const Task = require('../models/Tasks');
const Project = require('../models/Project');

//Get All tasks for admin dashboard
router.get('/all-tasks', async(req,res) => {
    try {
        const tasks = await Task.find({status:"Completed"})
                .populate('user','username')
                .populate('project','name');

        if(!tasks){
            return res.status(404).json({message : "No Tasks Found!"});
        }
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Get All projects for Admin Dash
router.get('/all-projects', async (req, res) => {
    try {
        const projects = await Project.find()
            .populate({
                path: 'tasks', 
                select: 'name description planned_hours actual_hours updated_at status'
            });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get All projects based on business unit
router.get('/business-unit-project', async (req, res) => {
    try {
        const { business_unit } = req.query;
        
        const query = business_unit 
            ? { 'business_unit': business_unit }
            : {};

        const projects = await Project.find(query)
            .populate('business_unit', 'name')
            .populate('department', 'name')
            .select('name client_name department status updated_at');
        
        return res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get user tasks for selected user
router.get('/user-tasks', async (req, res) => {
    try {
        const { user } = req.query;
        
        const query = user 
            ? { 'user': user }
            : {};

        const tasks = await Task.find(query)
            .populate('user', 'name')
            .populate({
                path: 'project',
                populate: {
                    path: 'business_unit',
                    select: 'name'
                }
            })
            .select('name description user project planned_hours actual_hours status updated_at');
        
        return res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all projects with planned and actual hours
router.get('/projects', async (req, res) => {
    try {
        
        const projects = await Project.find()
            .populate('department') 
            .populate('business_unit') 
            .populate({
                path: 'tasks',
                select: 'actual_hours' 
            });

        
        const projectData = projects.map(project => {
           
            const totalActualHours = project.tasks.reduce((sum, task) => sum + task.actual_hours, 0);
            return {
                projectName: project.name,
                departmentName: project.department ? project.department.name : 'Unknown',
                businessUnitName: project.business_unit ? project.business_unit.name : 'Unknown',
                plannedHours: project.planned_hours,
                actualHours: totalActualHours,
                status : project.status,
                updated_at : project.updated_at
            };
        });
        res.status(200).json(projectData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('user', 'username') 
            .populate('project', 'name')   
            .populate('time_logs');       

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

module.exports = router;