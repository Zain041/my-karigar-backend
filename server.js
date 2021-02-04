const express = require("express");
const connectDB = require("./config/db");
const app = express();
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;

const User = require("./routes/users");
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

let final = [
  {"a" : ["a" , "b" , "c" , "d"] },
  {"e" : ["e" , "f" , "g" , "h"] },
  {"i" : ["i" , "j" , "k" , "l" , "m" , "n"] },
  {"o" : ["o" , "p" , "q" , "r" ,"s" , "t"] },
  {"u" : ["u" , "v" , "w" , "x" , "y" , "z"] }
   ]
console.log(final[4].u[5]);
console.log(final[0].a[0]); 
//api routes here
app.use("/api/users", User);
// 


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
