const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");

const Jobs = require("./models/jobs");

dotEnv.config();

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use("/", router);

const PORT = process.env.PORT || 3001;

mongoose.connect(
  "mongodb+srv://harry:Pmy2_FXRK*!!LY!@cluster0.1ihom.mongodb.net/Jobs?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

router.use((req, res, next) => {
  console.log(`${req.method} request received`);
  next();
});

// Add jobs to Database for testing
router.get("/addJob", (req, res) => {
  const data = new Jobs({
    key: "3",
    project_name: "Full stack",
    client_name: "L Crypt",
    start_date: "2021-04-27",
    no_of_employees: 78,
    experience: 4,
    skills: ["Angular", "Node", "Git", "Jira"],
    location: ["mumbai", "delhi"],
  });
  data.save().then((err) => {
    if (err) console.log(err);
    console.log("saved");
    res.send({ message: "success" });
  });
});

router.get("/jobs", (req, res) => {
  Jobs.find({}, (err, job) => {
    if (err) throw err;
    console.log(job);
    res.send(job);
  });
});

router.post("/jobs", (req, res) => {
  const userQuery = req.body.query;
  const dateRange = req.body.dateRange;
  const query = new RegExp(userQuery, "i");

  Jobs.find(
    {
      $or: [
        {
          project_name: query,
        },
        {
          client_name: query,
        },
        {
          skills: query,
        },
        { location: query },
      ],
    },
    (error, jobsFound) => {
      if (!error) console.log(jobsFound);
      if (dateRange && dateRange[0]) {
        jobsFound = jobsFound.filter((job) => {
          const jobDate = new Date(job.start_date);
          const startDate = new Date(dateRange[0]);
          const endDate = new Date(dateRange[1]);
          return startDate <= jobDate && endDate >= jobDate;
        });
      }
      res.send(jobsFound);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
