const express = require('express');
const routes = express.Router();

const views = __dirname + '/views/';

const profile = {
    name: 'João Manoel',
    avatar: 'https://github.com/joaomanoelfarias.png',
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 75
}

const jobs = [
    {
        id: 1,
        name: 'Pizzaria Guloso',
        "daily-hours": 2,
        "total-hours": 2,
        created_at: Date.now(),
    },
    {
        id: 2,
        name: 'OneTwo Project',
        "daily-hours": 3,
        "total-hours": 47,
        created_at: Date.now(),
    },

];

function remainingDays(job) {
       const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();
       const createdDate = new Date(job.created_at);
       const dueDay = createdDate.getDate() + Number(remainingDays);
       const dueDateInMs = createdDate.setDate(dueDay);

       const timeDiffInMs = dueDateInMs - Date.now();

       const dayInMs = 1000 * 60 * 60 * 24;

       const dayDiff = Math.floor(timeDiffInMs / dayInMs);

       return dayDiff;
}

routes.get('/', (req, res) => {

   const updatedJobs = jobs.map(job => {
       
       const remaining = remainingDays(job);
       const status = remaining <= 0 ? 'done' : 'progress';


       return {
           ...job,
           remaining,
           status,
           budget: profile["value-hour"] * job["total-hours"],
       };
   });

   console.log(updatedJobs);

   return res.render(views + 'index', { jobs: updatedJobs })
});
routes.get('/job-edit', (req, res) => res.render(views + 'job-edit'));
routes.get('/job', (req, res) => res.render(views + 'job'));
routes.post('/job', (req, res) => {

   const lastId = jobs[jobs.length - 1]?.id || 0;
   
   jobs.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now()
   });

   console.log(jobs);

   return res.redirect('/');
});
routes.get('/profile', (req, res) => res.render(views + 'profile', { profile }));

module.exports = routes;
