const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        minlength: [10, 'Phone number must be at least 10 digits'],
        maxlength: [15, 'Phone number cannot exceed 15 digits']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [1, 'Age must be at least 1'],
        max: [120, 'Age cannot exceed 120']
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        minlength: [5, 'Address must be at least 5 characters long'],
        maxlength: [200, 'Address cannot exceed 200 characters']
    }
}, {
    timestamps: true
});

// Index for faster email lookups
UserSchema.index({ email: 1 });

// Virtual for user's full info (useful for debugging)
UserSchema.virtual('fullInfo').get(function() {
    return `${this.name} (${this.email}) - Age: ${this.age}`;
});

// Pre-save middleware to ensure email uniqueness
UserSchema.pre('save', async function(next) {
    if (this.isModified('email')) {
        const existingUser = await this.constructor.findOne({ 
            email: this.email, 
            _id: { $ne: this._id } 
        });
        if (existingUser) {
            const error = new Error('Email already exists');
            error.code = 11000;
            return next(error);
        }
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);