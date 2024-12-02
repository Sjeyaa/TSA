const express = require('express');
const router = express.Router();
const Unit = require('../models/BusinessUnit');

//Get All Business unit
router.get('/', async(req,res) => {
    try {
        const units = await Unit.find();
        res.json(units);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
});

//Create new Business unit
router.post('/',async (req,res) =>{
    const unit = new Unit({
        name: req.body.name
    })
    try {
        const existingUnit = await Unit.findOne({
            $or: [
                { name: req.body.name }
            ],
        })

        if(existingUnit){
            return res.status(400).json({ message: "Unit already exists" });
        }
        const newUnit = await unit.save();
        res.status(201).json(newUnit);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;