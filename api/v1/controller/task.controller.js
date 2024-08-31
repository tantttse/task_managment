const Task = require("../models/task.model")
const searchHelper=require("../../../helpers/search.js")
const paginationHelper=require("../../../helpers/pagination.js")

module.exports.list= async (req,res)=>{
    const taskList=await Task.find({
        deleted: false
    }).select("")
    res.json(taskList);
}

module.exports.index = async (req, res) => {
    try {
        
        const find = {
        deleted: false,
        $or:[{
            createdby:req.user.id
        },{
            listUser:req.user.id
        }
    ]
      };
  
      if (req.query.status) {
        find.status = req.query.status;
      }
  
      const searchObject = searchHelper(req.query);
  
      if (req.query.keyword) {
        find.title = searchObject.regex;
      }
  
      // Set default pagination values
      let paginationObject = {
        limitObject: 2,
        currentPage: 1,
      };
  
      // Count total documents that match the `find` criteria
      const total = await Task.countDocuments(find);
  
      // Calculate pagination using the helper
      paginationObject = paginationHelper(
        paginationObject,
        req.query,
        total
      );
  
      // Fetch the task list with applied pagination
      const taskList = await Task.find(find)
        .limit(paginationObject.limitObject)
        .skip(paginationObject.skip);
  
      // Return the task list as JSON
      res.json({
        code: 200,
        message: 'Tasks retrieved successfully',
        tasks: taskList,
        pagination: paginationObject
      });
  
    } catch (error) {
      // Handle any errors that occur during the execution
      res.status(500).json({
        code: 500,
        message: 'An error occurred while retrieving tasks',
        error: error.message,
      });
    }
  };
  
module.exports.details= async (req,res)=>{
    const id=req.params.id;
    console.log(id);
    const taskList=await Task.findOne({
        deleted: false,
        _id:id
    }).select("")
    res.json(taskList);
}

//[patch] /change-multi
module.exports.changeMulti= async (req,res)=>{
    console.log('Request Body:', req.body); // Log the entire request body

    const idsList = req.body.ids;
    const deletedStatus = req.body.deleted;

    console.log('idsList:', idsList);
    console.log('deletedStatus:', deletedStatus);

    try {
        // Update all tasks whose _id is in the array of idsToUpdate
        const result = await Task.updateMany({ _id: { $in: idsList } }, {deleted:deletedStatus});

        res.json({ message: 'Updated successfully', matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error('Error updating tasks:', error);
        res.status(500).json({ message: 'Failed to update tasks', error });
    }
}

//[delete]
module.exports.deleted= async (req,res)=>{
    console.log('Request Body:', req.body); // Log the entire request body

    const idsList = req.body.ids;

    console.log('idsList:', idsList);

    await Task.deleteMany({ _id: { $in: idsList } })

    try {
        res.json({ message: 'Deleted successfully', idsList});
    } catch (error) {
        console.error('Error updating tasks:', error);
        res.status(500).json({ message: 'Failed to update tasks', error });
    }
}

//[POST]
module.exports.create= async (req,res)=>{
    // console.log('Request Body:', req.body); // Log the entire request body
    req.body.createdBy=req.user.id;
    // If `object` key is used, make sure it's provided in the request body
    const { title, status, content, timeStart, timeFinish ,createdBy,taskParentId} = req.body;

    try {
        const newTask = new Task(req.body
        //     {
        //     title,
        //     status,
        //     content,
        //     createdBy,
        //     taskParentId,
        //     timeStart,
        //     timeFinish,
        //     listUser: []
        // }
    )
        ;

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
}

module.exports.join = async (req, res) => {
    const { taskId, userId } = req.body;

    try {
        // Find the task by ID
        const taskResult = await Task.findById(taskId);

        if (!taskResult) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Add userId to the listUser array if it's not already present
        // Use `$addToSet` to avoid duplicate entries
        taskResult.listUser = [...new Set([...taskResult.listUser, userId])]; // Ensure uniqueness

        // Save the updated task
        await taskResult.save();

        res.status(200).json({ message: 'User joined the task successfully', task: taskResult });
    } catch (error) {
        res.status(500).json({ message: 'Error joining the task', error });
    }
};

module.exports.leave = async (req, res) => {
    const { taskId, userId } = req.body;

    try {
        // Find the task by ID
        const taskResult = await Task.findById(taskId);

        if (!taskResult) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Remove userId from the listUser array if it exists
        taskResult.listUser = taskResult.listUser.filter(id => id !== userId);

        // Save the updated task
        await taskResult.save();

        res.status(200).json({ message: 'User left the task successfully', task: taskResult });
    } catch (error) {
        res.status(500).json({ message: 'Error leaving the task', error });
    }
};

