const express = require("express");
const route = express.Router();
const bcrypt = require("bcryptjs");

const user = require("../models/user_models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

route.post('/', (req, res) => {
    user.findOne({ email: req.body.email }).then((user) => {
        if(user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(result) {
                    const jsonWebTocken = jwt.sign({ _id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email }, process.env.JWT_KEY, { expiresIn: "24h" });
                    res.json({
                        message: "User logged in successfully",
                        user: {
                            _id: user._id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            status: user.status,
                            image: user.image,
                            description: user.description
                        },
                        token: jsonWebTocken
                    })
                } else {
                    res.json({
                        message: "Login Failed user or password incorrect"
                    });
                }
            });
        }
    }).catch((err) => {
        res.status(500).json({
            message: "Login Failed",
            error: err.message
        });
    })
})


module.exports = route;