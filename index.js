// packages

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const mongoose = require("mongoose");
const users = require("./routes/api/users");
const courses = require("./routes/api/courses");

const helmet = require("helmet");
const cookyParser = require("cookie-parser");
require("dotenv").config();
const auth = require("./routes/auth");


// middleware

app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        "styleSrc": null,
        "scriptSrc": ["'self'", `localhost:${PORT}/api/users`, `localhost:${PORT}/api/courses`],
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookyParser());

app.get('/', (req, res) => {
    res.cookie('name', 'value').send('Cookie has been set');
});

// routes

app.use("/api/users", users);
app.use("/api/courses", courses);
app.use("/api/auth", auth);

// connect to mongodb

mongoose.connect(`mongodb+srv://db-daniels:${process.env.API_KEY}@cluster0.i5wf6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to mongodb");
}).catch(err => {
    console.log(err.message);
})


// server

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Press CTRL + C to stop server');
    console.log('Hello World ✨');
})