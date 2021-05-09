const express = require("express");
const connectDB = require("./config/db");
const app = express();
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;

const User = require("./routes/users");
const Profile = require("./routes/profiles");
const Services = require("./routes/services")
const Appointment = require("./routes/appointments")
const Notifications = require("./routes/notifications");
const Password = require("./routes/password");
const Search = require("./routes/search");
const JobRequests = require("./routes/jobRequests");
const Chats = require("./routes/Chat");


app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//Connect Database
connectDB();

app.get("/", (req, res) => res.send("API Running"));

//init middleware
app.use(express.json({ extended: false }));

//user connection


//api routes here
app.use("/api/users", User);
app.use("/api/profiles", Profile);
app.use("/api/services", Services);
app.use("/api/appointments", Appointment);
app.use("/api/notifications", Notifications);
app.use("/api/chats", Chats);
// app.use("/api/password", Password);
app.use("/api/search", Search);
app.use("/api/jobRequests", JobRequests);
// 


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
