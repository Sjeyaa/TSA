const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    project: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true 
    },
    time_logs : [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Timelog'
    }],
    planned_hours : {
        type : Number,
        required : true
    },
    actual_hours : {
        type : Number,
        default : 0
    },
    due : {
        type : Date
    },
    priority : { 
        type: String, 
        enum: ['High','Less','Severe'], 
        default: 'Less' 
    },
    status : { 
        type: String, 
        enum: ['Pending','In Progress','Completed'], 
        default: 'Pending' 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    },
    
});

module.exports = mongoose.model('Task', taskSchema);