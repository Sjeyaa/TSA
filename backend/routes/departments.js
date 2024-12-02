const express = require('express');
const router = express.Router();
const BusinessUnit = require('../models/BusinessUnit');
const Department = require('../models/Department');


//Get all departments
router.get('/' , async (req,res) => {
    try {
        const departments = await Department.find().populate('business_units', 'name');
        res.json(departments);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
});

// Get single department
router.get('/:id', async (req, res) => {
    try {
        const department = await Department.findById(req.params.id).populate('business_units');
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new department
router.post('/', async (req, res) => {
    try {
        const { name, business_units } = req.body;
        const validBusinessUnits = await BusinessUnit.find({ _id: { $in: business_units } });
        const existingName = await Department.findOne({name : name});
        
        
        if(existingName){
            return res.status(400).json({message : "Department already exists!"});
        }

        if (validBusinessUnits.length !== business_units.length) {
            return res.status(400).json({ message: "Invalid business unit(s) selected." });
        }

        const newDepartment = new Department({
            name,
            business_units,
        });

        const savedDepartment = await newDepartment.save();
        res.status(201).json(savedDepartment);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//Get Business unit by department ID for particular department
router.get('/business-unit/:id', async(req,res) => {
    try {
        const { id } = req.params;
        console.log('Querying business units for department ID:', id);
        
        const businessUnits = await Department.find({
            department: id
        });
        
        console.log('Found business units:', businessUnits);
        
        res.status(200).json(businessUnits);
    }
    catch (error) {
        console.error('Error fetching business units:', error);
        res.status(500).json({message : error.message})
    }
});

module.exports = router;