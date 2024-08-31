const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: String,
    status: String,
    content: String,
    createdBy: String, // Note: This is a String type
    taskParentId:String,
    listUser: [String],
    timeStart: Date,
    timeFinish: Date,
    createdAt: Date,
    updatedAt: Date,
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema, "tasks"); // ModelName/Schema/TableName

module.exports = Task;
