const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Tasks');


//Get User assigned Projects 
router.get('/user-assigned-projects' , async (req,res) =>{
    try {
        const projects = await Project.find({ $or: [
            { status: "Users Assigned" },
            { status: "Task Allocated" }
        ]})
            .populate('assigned_users', 'username')
            .populate('department', 'name')
            .populate('business_unit', 'name');
        res.status(200).json(projects);
    } 
    catch (error) {
         res.status(500).json({ message: error.message });
    }
});

//Get project users for task to allocate the single user
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: "Id not found!" });
        }

        const project = await Project.findOne({ _id: id })
            .populate('assigned_users', 'username _id'); 

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

       
        res.status(200).json({ assigned_users: project.assigned_users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//Post task to task collections
router.post('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const existingTask = await Task.findOne({ name: req.body.name });
        if (existingTask) {
            return res.status(400).json({ message: "Task Already exists" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid project ID format" });
        }

        const project = await Project.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        
        const task = new Task({
            name: req.body.name,
            description: req.body.description || " ",
            user: req.body.user,
            planned_hours: req.body.planned_hours,
            project: id, 
            due: req.body.due,
            priority: req.body.priority,
        });

        const newTask = await task.save();
        const taskId = newTask._id;
        
        project.tasks.push(taskId);
        project.planned_hours = project.planned_hours + task.planned_hours;
        project.status = "Task Allocated";
        
        const updatedProject = await project.save();
        res.status(201).json({
            newTask,
            updatedProject
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//List tasks of particular projects
router.get('/list-tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;

       
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid project ID format" });
        }

        const project = await Project.findById(id).populate({
            path: 'tasks',
            populate: {
                path: 'user', 
                select: 'username'
            },
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json({
            tasks: project.tasks
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

//Get single task by Id
router.get('/single-task/:taskId' , async(req,res) => {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: "Invalid task ID format" });
    }
    
    try {
        const task = await Task.findById(taskId)
            .populate('project','name');
        res.status(200).json(task);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

//Edit task 
router.put('/edit-task/:taskId/:projectId' , async(req,res) => {
    try {
        const { taskId , projectId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid task ID format" });
        }
        const task = await Task.findById(taskId);

        task.name = req.body.name || task.name;
        task.description = req.body.description || task.description;
        task.due = req.body.due || task.due;
        task.priority = req.body.priority || task.priority;
        task.user = req.body.user || task.user;

        const existingPlannedHour = task.planned_hours;
        const newPlannedhour = req.body.planned_hours;
        let hours = 0;

        if(newPlannedhour > existingPlannedHour){
            hours = newPlannedhour - existingPlannedHour;
        }
        else if(existingPlannedHour > newPlannedhour){
            hours = existingPlannedHour - newPlannedhour;
        }

        const project = await Project.findOne({ _id: projectId });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if(newPlannedhour > existingPlannedHour){
            project.planned_hours = project.planned_hours + hours;
        }
        else if(existingPlannedHour > newPlannedhour){
            project.planned_hours = project.planned_hours - hours;
        }
        task.planned_hours = req.body.planned_hours || task.planned_hours;
        task.updated_at = Date.now();
        project.updated_at = Date.now();
        const updatedTask = await task.save();
        const updatedProject = await project.save();
        res.status(200).json({
            updatedTask,
            updatedProject
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;