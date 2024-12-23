const express = require('express');
const Bull = require('bull');
const cron = require('node-cron');
const axios = require('axios');

// Initialize the Express server
const app = express();

// Create a Bull queue with Redis configuration
const jobQueue = new Bull('jobQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: '',
  },
});

// Set to store processed job IDs to avoid duplicates
let i=1;
const processedJobIds = new Set();
// Define a job processor for the queue with concurrency
jobQueue.process(10, async (job) => { // This sets concurrency to 10
  console.log(`Processing job: ${job.id} with data:`);
  console.log(i++)
  console.log("something")

  try {
    // Simulate processing the job data
    console.log(`Processed data for job ${job.id}:`, job.data);
  } catch (error) {
    console.error(`Error processing job ${job.id}:`, error.message);
  }

  console.log(`Job ${job.id} completed`);
});

// Schedule a cron job to run every minute
cron.schedule('* * * * *', async () => {
  try {
    console.log('Cron job running...');

    // Fetch data from the API
    const response = await axios.get('http://localhost:3000/api/entry/fetch');
    const fetchedData = response.data;

    if (!Array.isArray(fetchedData)) {
      console.error('Invalid data format received from API. Expected an array.');
      return;
    }

    // Filter out duplicates based on unique ID
    const newData = fetchedData.filter((item) => !processedJobIds.has(item.id));

    // If there’s no new data to add, return early
    if (newData.length === 0) {
      console.log('No new data to add to the queue.');
      return;
    }

    // Take the first 10 new items and mark them as processed
    const jobsToAdd = newData.slice(0, 2);
    jobsToAdd.forEach((job) => processedJobIds.add(job.id));

    // Add the jobs to the queue
    await jobQueue.addBulk(jobsToAdd.map((data) => ({ data })));
    console.log('2 jobs added to the queue');
  } catch (error) {
    console.error('Error in cron job:', error.message);
  }
});

// Add a route for monitoring or triggering jobs
app.get('/jobs', async (req, res) => {
  const jobCounts = await jobQueue.getJobCounts(); // Get counts of jobs in different states
  res.json(jobCounts);
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
