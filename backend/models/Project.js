const mongoose = require('mongoose');


const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    client_name: {
        type: String,
        required: true
    },
    address: {
        city: String,
        state: String,
        country: String,
        zip_code: String
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    business_unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business_unit',
        required: true
    },
    project_type: {
        type: String,
        required: true
    },
    assigned_users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    status: {
        type: String,
        enum: ['Not Started', 'Users Assigned','Task Allocated','In Progress', 'Completed'],
        default: 'Not Started'
    },
    planned_hours : {
        type : Number,
        default : 0
    },
    estimated_hours : {
        type : Number
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);