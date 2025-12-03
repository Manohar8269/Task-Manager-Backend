const Task = require('../models/Task');

// 🟢 Get all tasks for logged-in user
exports.getTasks = async (req, res) => {
  try {
    console.log("📩 Fetching Tasks for User:", req.user);
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error("❌ Error Fetching Tasks:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// 🟢 Add a new task (supports title + optional description)
exports.addTask = async (req, res) => {
  try {
    console.log("📩 Add Task Request:", req.body);
    console.log("👤 Authenticated User:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const taskTitle = req.body.title;
    const taskDescription = req.body.description || "";

    if (!taskTitle || taskTitle.trim() === "") {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = new Task({
      text: taskTitle,
      description: taskDescription,
      userId: req.user.id,
    });

    await task.save();
    console.log("✅ Task Saved Successfully:", task);
    res.status(201).json(task);
  } catch (err) {
    console.error("❌ Error Adding Task:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// 🟢 Delete a task
exports.deleteTask = async (req, res) => {
  try {
    console.log("🗑️ Deleting Task ID:", req.params.id);
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("❌ Error Deleting Task:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// 🟢 Update a task (title + description)
exports.updateTask = async (req, res) => {
  try {
    console.log("✏️ Updating Task:", req.params.id, "with data:", req.body);

    const updateData = {};
    if (req.body.title) updateData.text = req.body.title;
    if (req.body.description) updateData.description = req.body.description;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error("❌ Error Updating Task:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
