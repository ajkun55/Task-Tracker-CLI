#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const fs = require("fs");
const path = "./data.json";

function base() {
  // Check if the file exists
  if (fs.existsSync(path)) {
    // File exists, read and parse it
    const data = fs.readFileSync(path, "utf8");
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      jsonData = []; // Fallback to an empty object
    }
    return jsonData;
  } else {
    // File does not exist, create an empty JSON object
    fs.writeFileSync(path, "[]");
    return [];
  }
}

function add(taskName) {
  const now = new Date().toLocaleString();
  const jsonData = base();
  const len = jsonData.length + 1;
  const task = {
    id: len,
    description: taskName,
    status: "todo",
    createdAt: now,
    updatedAt: now,
  };
  try {
    jsonData.push(task);
    fs.writeFileSync(path, JSON.stringify(jsonData, null, 2), "utf8");
    console.log(`Task added successfully (ID: ${task.id})`);
  } catch (error) {
    console.log(error);
  }
}

function update(id, taskName) {
  const tasks = base();
  const task = tasks.find((obj) => obj.id === Number(id));

  if (task) {
    task.description = taskName;
    const now = new Date().toLocaleString();
    task.updatedAt = now;
    fs.writeFileSync(path, JSON.stringify(tasks, null, 2), "utf8");
    console.log("Object found and updated:", task);
  } else {
    console.log("Task with the specified id not found.");
  }
}

function deleteTask(id) {
  const tasks = base();
  const task = tasks.find((obj) => obj.id === Number(id));

  if (task) {
    const newTasks = tasks.filter((obj) => obj.id !== Number(id));
    fs.writeFileSync(path, JSON.stringify(newTasks, null, 2), "utf8");
    console.log("Object found and deleted:");
  } else {
    console.log("Task with the specified id not found.");
  }
}

function markInProgress(id) {
  const tasks = base();
  const task = tasks.find((obj) => obj.id === Number(id));

  if (task) {
    task.status = "in-progress";
    const now = new Date().toLocaleString();
    task.updatedAt = now;
    fs.writeFileSync(path, JSON.stringify(tasks, null, 2), "utf8");
    console.log("Object found and marked in-progress:", task);
  } else {
    console.log("Task with the specified id not found.");
  }
}

function markDone(id) {
  const tasks = base();
  const task = tasks.find((obj) => obj.id === Number(id));

  if (task) {
    task.status = "done";
    const now = new Date().toLocaleString();
    task.updatedAt = now;
    fs.writeFileSync(path, JSON.stringify(tasks, null, 2), "utf8");
    console.log("Object found and marked Done:", task);
  } else {
    console.log("Task with the specified id not found.");
  }
}

function list(status) {
  if (!status) {
    const tasks = base();
    console.log(tasks);
  } else {
    const tasks = base().filter((task) => task.status === status);
    console.log(tasks);
  }
}

program
  .name("task-cli")
  .description("A simple CLI tool in Node.js")
  .version("1.0.0");

// Define the "add" command
program
  .command("add <taskName>")
  .description("Add task")
  .action((taskName) => {
    add(taskName);
  });

// Define the "update" command
program
  .command("update <id> <taskName>")
  .description("Update task")
  .action((id, taskName) => {
    update(id, taskName);
  });

// Define the "delete" command
program
  .command("delete <id>")
  .description("Delete task")
  .action((id) => {
    deleteTask(id);
  });

// Define the "mark-in-progress" command
program
  .command("mark-in-progress <id>")
  .description("Mark task in progress")
  .action((id) => {
    markInProgress(id);
  });

// Define the "mark-done" command
program
  .command("mark-done <id>")
  .description("Mark task done")
  .action((id) => {
    markDone(id);
  });

// Define the "list" commands
program
  .command("list [status]")
  .description("List tasks that done")
  .action((status) => {
    list(status);
  });

// Parse the arguments
program.parse(process.argv);
