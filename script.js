
        document.addEventListener('DOMContentLoaded', function() {

            const taskInput = document.getElementById('task-input');
            const addButton = document.getElementById('add-btn');
            const tasksContainer = document.getElementById('tasks-container');
            const totalTasksSpan = document.getElementById('total-tasks');
            const completedTasksSpan = document.getElementById('completed-tasks');
            

            let tasks = [];
            

            loadTasks();

            addButton.addEventListener('click', addTask);
            

            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addTask();
                }
            });
            

            function addTask() {

                const taskText = taskInput.value.trim();
                

                if (taskText === '') {
                    return;
                }
                

                const task = {
                    id: Date.now(), 
                    text: taskText,
                    completed: false
                };
                

                tasks.push(task);
                

                saveTasks();
                

                taskInput.value = '';
                

                renderTasks();
            }
            

            function toggleComplete(taskId) {

                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].id === taskId) {

                        tasks[i].completed = !tasks[i].completed;
                        break;
                    }
                }
                

                saveTasks();
                renderTasks();
            }

            function deleteTask(taskId) {

                tasks = tasks.filter(task => task.id !== taskId);
                

                saveTasks();
                renderTasks();
            }
            

            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
                updateStats();
            }
            

            function loadTasks() {
                const tasksJSON = localStorage.getItem('tasks');
                
                if (tasksJSON) {
                    tasks = JSON.parse(tasksJSON);
                }
                
                renderTasks();
            }
            

            function updateStats() {
                const totalTasks = tasks.length;
                const completedTasks = tasks.filter(task => task.completed).length;
                
                totalTasksSpan.textContent = `Total tasks: ${totalTasks}`;
                completedTasksSpan.textContent = `Completed: ${completedTasks}`;
            }
            

            function renderTasks() {

                tasksContainer.innerHTML = '';

                if (tasks.length === 0) {
                    tasksContainer.innerHTML = `
                        <div class="empty-state">
                            <i>✓</i>
                            <p>No tasks yet. Add a task to get started!</p>
                        </div>
                    `;
                    updateStats();
                    return;
                }
                

                tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.className = `task ${task.completed ? 'completed' : ''}`;
                    
                    taskElement.innerHTML = `
                        <span class="task-text">${task.text}</span>
                        <div class="task-actions">
                            <button class="complete-btn" onclick="toggleComplete(${task.id})">
                                ${task.completed ? '↶' : '✓'}
                            </button>
                            <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
                        </div>
                    `;
                    
                    tasksContainer.appendChild(taskElement);
                });
                
                updateStats();
            }
            

            window.toggleComplete = toggleComplete;
            window.deleteTask = deleteTask;
        });