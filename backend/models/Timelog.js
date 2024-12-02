const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    project_name : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    task : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Task'
    },
    hours_to_spend : {
        type : Number,
        required : true,
    },
    task_status : {
        type : String,
        required : true
    },
    postedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    createdAt : {
        type: Date, 
        default: Date.now 
    },
    updatedAt : {
        type: Date, 
        default: Date.now 
    }

});

module.exports = mongoose.model('Timelog', logSchema);