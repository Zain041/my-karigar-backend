const express = require("express");
const connectDB = require("./config/db");
const app = express();
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;

const User = require("./routes/users");
const Profile = require("./routes/profiles");
// const Profile = require("./routes/api/profiles");
// const Category = require("./routes/api/categories");
// const Password = require("./routes/api/password");
// const Search = require("./routes/api/search");
// const JobRequests = require("./routes/api/jobRequests");
// const JobMessages = require("./routes/api/jobMessages");
// const Chats = require("./routes/api/Chat");
// const ShopMessages = require("./routes/api/shopMessages");
// const Notifications = require("./routes/api/notifications");
// const Products = require("./routes/api/products");
// const Favourites = require("./routes/api/favourites");
// const NewJobs = require("./routes/api/newJobs");
// app.use(bodyParser.json());
// app.use(express.static("public"));
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
// 


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
