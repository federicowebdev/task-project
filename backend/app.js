import fs from 'node:fs/promises';

import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(express.static('images'));
app.use(bodyParser.json());

// CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

app.get('/tasks', async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 0));

  const debug = false;

  if (debug) {
    return res.status(500).json();
  }

  const fileContent = await fs.readFile('./data/tasks.json');

  const tasksData = JSON.parse(fileContent);

  res.status(200).json({ tasks: tasksData });
});

app.put('/tasks', async (req, res) => {
  const debug = false;

  if (debug) {
    return res.status(500).json();
  }

  const taskId = req.body.taskId;
  const status = req.body.status;

  const fileContent = await fs.readFile('./data/tasks.json');
  const tasksData = JSON.parse(fileContent);

  const updatedTasksData = tasksData.map((task) =>
    task.id === taskId ? { ...task, status: status } : task
  );

  await fs.writeFile('./data/tasks.json', JSON.stringify(updatedTasksData));

  res.status(200).json({ tasks: updatedTasksData });
});

app.post('/tasks', async (req, res) => {
  const debug = false;

  if (debug) {
    return res.status(500).json();
  }

  const task = req.body.task;

  const fileContent = await fs.readFile('./data/tasks.json');
  const tasksData = JSON.parse(fileContent);

  const updatedTasksData = [...tasksData, task];

  await fs.writeFile('./data/tasks.json', JSON.stringify(updatedTasksData));

  res.status(200).json({ tasks: updatedTasksData });
});

// 404
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

app.listen(3000);
