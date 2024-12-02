const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    }, 
    business_units: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Business_unit' 
        }
    ], 
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Department', departmentSchema);
