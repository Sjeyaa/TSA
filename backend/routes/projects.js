const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const Department = require('../models/Department');
const BusinessUnit = require('../models/BusinessUnit');
const Project = require('../models/Project');


//Create project
router.post('/',async (req,res) =>{
    try {
        const department = await Department.findById(req.body.department);
        const businessUnit = await BusinessUnit.findById(req.body.business_unit);

        if (!department || !businessUnit) {
            return res.status(400).json({ message: "Invalid department or business unit" });
        }

        if (!department.business_units.includes(businessUnit._id)) {
            return res.status(400).json({ message: "Business unit does not belong to selected department" });
        }

        const project = new Project({
            name : req.body.name,
            client_name : req.body.client_name,
            address: {
                city: req.body.address.city,
                state: req.body.address.state,
                country: req.body.address.country,
                zip_code: req.body.address.zip_code
            },
            department: req.body.department,
            business_unit : req.body.business_unit,
            project_type : req.body.project_type
        });

        const newProject = await project.save();
        await newProject.populate(['department', 'business_unit']);

        res.status(201).json(newProject);

    } catch (error) {
        res.status(500).json({message : error.message})
    }
});

//Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('assigned_users', 'username')
            .populate('department', 'name')
            .populate('business_unit', 'name');
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Fetch user details based on projects department and business unit
router.get('/:id', async (req, res) => {
    try {
      const project = await Project.findById(req.params.id)
        .populate('department')
        .populate('business_unit');
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      const matchingUsers = await User.find({
        department: project.department._id,
        business_unit: project.business_unit._id
      })
      .populate('department', 'name')
      .populate('business_unit', 'name')
      .select('_id username department business_unit');
  
      res.json({
        project: {
          name: project.name,
          department: project.department.name,
          business_unit: project.business_unit.name
        },
        users: matchingUsers.map(user => ({
          id: user._id,
          username: user.username,
          departmentName: user.department.name,
          businessUnitName: user.business_unit.name
        }))
      });
  
    } catch (error) {
      res.status(500).json({message : error.message});
    }
});

//Assign users to project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { selectedUsers } = req.body;

    if (!selectedUsers || !Array.isArray(selectedUsers)) {
      return res.status(400).json({ message: "Invalid input: selectedUsers must be an array of usernames" });
    }

    const users = await User.find({ username: { $in: selectedUsers } }, '_id');
    const userIds = users.map(user => user._id);

    if (userIds.length !== selectedUsers.length) {
      return res.status(400).json({ message: "Some users were not found" });
    }

    
    const updatedProject = await Project.findByIdAndUpdate(
      id, 
      {
        $addToSet: { assigned_users: { $each: userIds } }, 
        $set: { 
          status: "Users Assigned", 
          updated_at: new Date()    
        }
      },
      { 
        new: true,               
        runValidators: true       
      }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.status(200).json(updatedProject);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//Get project for edit
router.get('/edit-project/:id', async(req,res) => {
  try {
      const id = req.params.id;
      const project = await Project.findById(id)
         .populate('department', 'name')
         .populate('business_unit', 'name');
     if(!project){
         return res.status(404).json({message : "Project not Found!"});
      }
      res.status(200).json(project);
  }
  catch (error){
    res.status(500).json({message : error.message});
  }
});

// Edit on single project
router.put('/edit-single-project/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  try {
    const { 
      name, 
      client_name, 
      address, 
      department, 
      business_unit, 
      project_type,
      assigned_users
    } = req.body;

    
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    
    if (Array.isArray(assigned_users) && assigned_users.length > 0) {
      
      const isValidIds = assigned_users.every(userId => 
        mongoose.Types.ObjectId.isValid(userId)
      );

      if (!isValidIds) {
        return res.status(400).json({ message: "Invalid user IDs in assigned_users" });
      }

      project.assigned_users = assigned_users; 
    }

   
    project.name = name || project.name;
    project.client_name = client_name || project.client_name;
    project.address = address || project.address;
    project.department = department || project.department;
    project.business_unit = business_unit || project.business_unit;
    project.project_type = project_type || project.project_type;

    
    const updatedProject = await project.save();

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;