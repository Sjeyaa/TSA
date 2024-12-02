const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password: { 
        type: String, 
        required: true,
    }, 
    email: { 
        type: String, 
        unique: true, 
        required: true 
    },
    phone: { 
        type: String,
        required: true 
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
    role: { 
        type: String, 
        enum: ['Admin', 'User'], 
        default: 'User' 
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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function() {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET || "123456",
        { expiresIn: process.env.JWT_EXPIRES_TIME || "1d" }
    );
};

userSchema.methods.isValidPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);