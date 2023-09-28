// Antonio Hernandez
// INF656 Assignment 2 - Task Manager
// Muvva
// 9 - 27 - 23

const fs = require("fs").promises;
const readline = require("readline");

// Function to read the tasks.json file
async function getAllTasks() {
    try {
        const data = await fs.readFile('tasks.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading tasks:', error);
        return [];
    }
}

// Function to list (display) all tasks
async function listTasks() {
    const tasks = await getAllTasks();

    tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.title} - ${task.description} [${task.status}]`);
    });
    // promptUser(); // 
}

// Function to add a task by title and description 
async function addTask(title, description) {
    try {
        const tasks = await getAllTasks();
        const newTask = {
            title: title,
            description: description,
            status: 'not completed'
        };

        tasks.push(newTask);
        await fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2));
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Function to mark a task as complete
async function completeTask(title) {
    try {
        const tasks = await getAllTasks();
        // Case sensitive
        // const task = tasks.find(task => task.title === title);
        // Case insensitive
        const task = tasks.find(task => task.title.toLowerCase() === title.toLowerCase());

        if (task) {
            task.status = 'completed';
            await fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2));
        } else {
            console.error('Task not found!');
        }
    } catch (error) {
        console.error('Error marking task as complete:', error);
    }
}


// Function to prompt the user to choose an option by number e.g., 1 for list tasks
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptUser() {
    console.log(`
    Choose an option:
    1. List tasks
    2. Add task
    3. Complete task
    4. Exit
    `);

    rl.question("Choose your option: ", async (choice) => {
        switch (choice) {
            case "1":
                await listTasks();
                promptUser(); 
                break;
            case "2":
                rl.question("Enter task title: ", async (title) => {
                    rl.question("Enter task description: ", async (description) => {
                        await addTask(title, description);
                        promptUser();
                    });
                });
                break;
            case "3":
                // Displays the title of all tasks for User to know what available
                const tasks = await getAllTasks();
                console.log("Available tasks: ");
                tasks.forEach((task, index) => {
                    console.log(`${index + 1}. ${task.title}`);
                });

                rl.question("Enter task title to complete: ", async (title) => {
                    await completeTask(title);
                    promptUser();
                });
                break;
            case "4":
                rl.close();
                break;
            default:
                console.log("Invalid choice!");
                promptUser();
                break;
        }
    });
}

promptUser(); // Call the promptUser function to start the app
// The user can start by typing node taskmanager.js in the terminal