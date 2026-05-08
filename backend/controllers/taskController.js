const Task = require("../models/Task");
const taskQueue = require("../queue/taskQueue");
const createTask = async (req, res) => {
  try {

    const { title, inputText, operation } = req.body;

    const task = await Task.create({
      title,
      inputText,
      operation,
      createdBy: req.user.id
    });
    await taskQueue.lpush(
  "taskQueue",
  JSON.stringify({
    taskId: task._id,
    inputText: task.inputText,
    operation: task.operation
  })
);

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getTasks = async (req, res) => {
  try {

    const tasks = await Task.find({
  createdBy: req.user.id
}).sort({ createdAt: -1 });

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createTask,
  getTasks
};
