const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    startBudget: {
        type: Number,
        default: 0
    },
    expenseAmount: {
        type: Array,
        default: {}
    },
    incomeAmount: {
        type: Array,
        default: {}
    },
    expenseNames: {
        type: Array,
        default: {}
    },
    incomeNames: {
        type: Array,
        default: {}
    },
    totalIncome: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    }
}, {_id: true})

const User = mongoose.model('User', UserSchema)

module.exports = User