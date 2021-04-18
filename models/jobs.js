const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobsSchema = new Schema({
//   _id: { type: String, required: true },
  key: { type: String, required: true },
  project_name: { type: String, required: true },
  client_name: { type: String, required: true },
  start_date: { type: String, required: true },
  no_of_employees: { type: String, required: true },
  experience: { type: String, required: true },
  skills: { type: [String], required: true },
  location: { type: [String], required: true },
});

module.exports = mongoose.model("Jobs", JobsSchema);
