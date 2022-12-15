const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    name: {
        type: String, 
        required: true, 
        lowercase: true
    },
    created_date: { 
        type: Date, 
        default: Date.now
    },
    modified_date: { 
        type: Date, 
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    },
    deleted: {
        type: Boolean,
        default: false
    }, 
    email: {
        type: String, 
        required: true, 
        lowercase: true, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    phoneNumber: {
        type: String,
        required: true, 
        min: 10, 
        max: 10, 
        unique: true
    }, 
    loginTime: {
        type: Number,
        default: 0    
    }, 
    loginTimeDate: {
        type: Date, 
        default: Date.now 
    }, 
    isAdmin: {
        type: Boolean,
        default: false    
    }
})

UserSchema.pre('save', async function (next) {
    try {
        console.log("Before save middleware");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
})

UserSchema.post('save', async function (next) {
    try {
        console.log("successfully saved!");
    } catch (error) {
        next(error);
    }
})

UserSchema.methods.isValidPassword = async function(password) {
    try {
        return bcrypt.compare(password, this.password);
    } catch (error) {
        next(error);
    }
}

const User = mongoose.model('user', UserSchema);
module.exports = User;