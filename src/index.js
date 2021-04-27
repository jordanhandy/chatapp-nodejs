const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const hbs = require('hbs');

// Define path for Express config
const publiDirPath= path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,'../src/templates/views');
const partialsPath = path.join(__dirname,'../src/templates/partials');

// setup handlebars engine and views location
app.set('view engine','hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publiDirPath));

app.get("/",(req,res)=>{
    res.render("index")
})

app.listen(PORT,()=>{
    console.log("Listening on port " + PORT);
})