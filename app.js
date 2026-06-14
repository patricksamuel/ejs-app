// app.js
const express = require("express");
const app = express();
const path = require("node:path");

const aboutRouter =require("./routes/aboutRouter");



app.set("views", path.join(__dirname, "views")); // rmmber the include path willbe alays form views
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));



const links = [
  { href: "/", text: "Home" },
  { href: "/about", text: "About" },
];

const users = ["Rose", "Cake", "Biff"];

app.use((req, res, next) => {
  res.locals.links = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About" },
  ];
  next();
});


app.get("/", (req,res) => {
    res.render("index", { message:"EJS rocks", links:links, users: users});
})

app.use("/about", aboutRouter);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));