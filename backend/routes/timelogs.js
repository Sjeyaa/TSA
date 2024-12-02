const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Tasks');
const Log = require('../models/Timelog');
const Project = require('../models/Project');

//Post the log to DB
router.post('/submit-log/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid task ID format" });
        }

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found for this ID!" });
        }

        const projectId = task.project;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: "Invalid project ID format" });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found for this task!" });
        }

        
        const hoursToSpend = parseFloat(req.body.hours_to_spend);
        if (isNaN(hoursToSpend) || hoursToSpend <= 0) {
            return res.status(400).json({ message: "Invalid hours to spend" });
        }

        
        const log = new Log({
            project_name: req.body.project_name,
            date: req.body.date,
            task: id,
            hours_to_spend: hoursToSpend,
            task_status: req.body.task_status,
            postedBy: userId,
        });

        const newLog = await log.save();
        const logId = newLog._id;

        
        task.time_logs.push(logId);
        task.status = req.body.task_status;
        
        
        task.actual_hours = (task.actual_hours || 0) + hoursToSpend;

        const updatedTask = await task.save();

        
        const allTasks = await Task.find({ project: projectId });
        const allTasksCompleted = allTasks.every((task) => task.status === "Completed");

        project.status = allTasksCompleted ? "Completed" : "In Progress";
        const updatedProject = await project.save();

        res.status(200).json({
            newLog,
            updatedTask,
            updatedProject,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



//Get tasks by Id for enter time log
router.get('/task-details/:id' , async(req,res) =>{
    try {
        const { id }= req.params;
        const task = await Task.findById(id)
            .populate('project','name')
        
        if(!task){
            return res.status(404).json({message : "Not Found task!"});
        }

        const response = {
            name: task.name,
            projectName: task.project?.name, 
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get User Logs
router.get('/user-logs' ,async(req,res) => {
    try {
        const userId = req.user.id;
        if(!userId){
            return res.status(404).json({message : "Not a valid user ID!"});
        }

        const logs = await Log.find({postedBy : userId})
            .populate('task','name')
            .populate('postedBy','username')

        res.status(200).json(logs)
    } catch (error) {
        res.status(500).json({message : error.message});
    }
});

//Get single log for edit
router.get('/user-log/:id' , async(req,res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID!" });
        }

        const log = await Log.findById(id)
            .populate('task','name');

        res.status(200).json(log);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
});

//Edit single log
router.put('/edit-log/:id', async (req, res) => {
    try {
        const userId = req.user.id; 
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid log ID format" });
        }

        const log = await Log.findById(id);
        if (!log) {
            return res.status(404).json({ message: "Log not found" });
        }

        
        log.project_name = req.body.project_name || log.project_name;
        log.date = req.body.date || log.date;
        log.task = req.body.task || log.task;
        log.task_status = req.body.task_status || log.task_status;
        log.postedBy = userId || log.postedBy;

        
        const task = await Task.findById(log.task);
        if (!task) {
            return res.status(404).json({ message: "Task not found for this log" });
        }

       
        const existingHoursToSpend = parseFloat(log.hours_to_spend) || 0;
        const newHoursToSpend = parseFloat(req.body.hours_to_spend) || 0;

        
        if (newHoursToSpend > existingHoursToSpend) {
            task.actual_hours = (task.actual_hours) + (newHoursToSpend - existingHoursToSpend);
        } else if (existingHoursToSpend > newHoursToSpend) {
            task.actual_hours = (task.actual_hours) - (existingHoursToSpend - newHoursToSpend);
        }

    
        task.status = req.body.task_status || task.status;
        task.updated_at = Date.now();
        log.hours_to_spend = req.body.hours_to_spend || log.hours_to_spend;
       
        const updatedLog = await log.save();
        const updatedTask = await task.save();

        
        const projectId = task.project;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found for this task" });
        }

        const allTasks = await Task.find({ project: projectId });
        const allTasksCompleted = allTasks.every((task) => task.status === "Completed");

        project.status = allTasksCompleted ? "Completed" : "In Progress";
        project.updated_at = Date.now();

        const updatedProject = await project.save();

        res.status(200).json({
            updatedLog,
            updatedTask,
            updatedProject,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;