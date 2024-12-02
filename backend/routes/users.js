const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Department = require('../models/Department');
const BusinessUnit = require('../models/BusinessUnit');
const Project = require('../models/Project');
const Log = require('../models/Timelog');
const sendEmail = require('../utils/sendEmail');
const mongoose = require('mongoose');

//Get All Users
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
            .populate('department', 'name')
            .populate('business_unit', 'name');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get All logs
router.get('/all-user-logs', async (req, res) => {
    try {
        const logs = await Log.find()
            .populate('postedBy', 'username')
            .populate('task', 'name');

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/availableusers', async (req, res) => {
    try {
        const { department, business_unit } = req.query;

        if (!department || !business_unit) {
            return res.status(400).json({ message: 'Department and business unit are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(department) || !mongoose.Types.ObjectId.isValid(business_unit)) {
            return res.status(400).json({ message: 'Invalid department or business unit ID' });
        }

        const users = await User.find({
            department: new mongoose.Types.ObjectId(department),
            business_unit: new mongoose.Types.ObjectId(business_unit),
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Get Single User
router.get('/:id', async(req,res) => {
    try{
        const id = req.params.id;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message : "User not Found!"});
        }
        res.status(200).json(user);
    }
    catch (error){
        res.status(500).json({message : error.message});
    }
});

//Create user
router.post('/', async (req, res) => {
    try {
        
        const department = await Department.findById(req.body.department);
        const businessUnit = await BusinessUnit.findById(req.body.business_unit);

        if (!department || !businessUnit) {
            return res.status(400).json({ message: "Invalid department or business unit" });
        }

        
        if (!department.business_units.includes(businessUnit._id)) {
            return res.status(400).json({ message: "Business unit does not belong to selected department" });
        }

        const user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            phone: req.body.phone,
            department: req.body.department,
            business_unit: req.body.business_unit,
            role: req.body.role || 'User',
        });

        
        const existingUser = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email },
            ],
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        const newUser = await user.save();
        await newUser.populate(['department', 'business_unit']);

        // Send email 
        await sendEmail(
            req.body.email,
            req.body.username,
            req.body.password
        );

        const token = user.getJwtToken();

        res.status(201).json({
            message: "User created successfully and email sent",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
            token,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(400).json({ message: error.message });
    }
});


// Update user
router.put('/:id', async (req, res) => {
    try {
       
        const updateData = {
            ...req.body,
            updated_at: Date.now()
        };


        
        if (updateData.department || updateData.business_unit) {
            const department = await Department.findById(updateData.department);
            const businessUnit = await BusinessUnit.findById(updateData.business_unit);

            if (!department || !businessUnit) {
                return res.status(400).json({ message: "Invalid department or business unit" });
            }

            
            if (!department.business_units.includes(businessUnit._id)) {
                return res.status(400).json({ message: "Business unit does not belong to selected department" });
            }
        }

        
        if (updateData.email || updateData.username) {
            const existingUser = await User.findOne({
                _id: { $ne: req.params.id },
                $or: [
                    { username: updateData.username },
                    { email: updateData.email },
                ],
            });

            if (existingUser) {
                return res.status(400).json({ message: "Username or email already exists" });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate(['department', 'business_unit']);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        
        const projects = await Project.find({ assigned_users: userId });

        if (projects.length > 0) {
           
            const updatePromises = projects.map(project => {
                return Project.updateOne(
                    { _id: project._id },
                    { $pull: { assigned_users: userId } }
                );
            });

            
            await Promise.all(updatePromises);   
        }

        // Step 2: Proceed to delete the user
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

