const express = require("express");
const route = express.Router();
const bcrypt = require('bcryptjs');
const user = require("../../models/user_models");

const Joi = require('joi');

// Joi validation schema for user


const schema = Joi.object({

    first_name: Joi.string()
        .min(3)
        .max(40)
        .required(),

    last_name: Joi.string()
        .min(3)
        .max(40)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})


// @route   GET api/users

route.get('/', (req, res) => {
    let results = getAllUsers();

    results.then(users => {
        res.json(users);
    }).catch(err => {
        res.json(err.message);
    })
});


// @route   POST api/users


route.post('/', (req, res) => {
    const body = req.body;

    user.findOne({email: body.email}).then((user) => {
        if(user){
            return res.status(400).json({
                message: 'User already exists'
            });
        } else {
            const { error, value } = schema.validate(body);

            if (error) {
                res.json(error.message);
            }else{
                const newUser = createNewUser(body);

                newUser.then(user => {
                    res.json({
                        message: "User created successfully",
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        image: user.image,
                        description: user.description,
                        status: user.status,
                    });
                }).catch(err => {
                    res.json(err.message);
                })
            }
        }
    })


});


// @route   PUT api/users/:id


route.put('/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;

    const { error, value } = schema.validate(body);

    if (error) {
        res.json(error.message);
    }else{
        updateUser(id, body).then(user => {
            res.json({
                message: `User updated successfully ${user.first_name} ${user.last_name}`,
            });
        }).catch(err => {
                res.json(err.message);
        })
    }
})


// @route   DELETE (deactivate) api/users/:id


route.delete('/:id', (req, res) => {
    const id = req.params.id;

    deactivateUser(id).then(user => {
        res.json({
            message: `User deactivated successfully ${user.first_name} ${user.last_name}`,
        });
    }).catch(err => {
        res.json(err.message);
    })
})


// Function to get all users


async function getAllUsers() {
    let Users = await user.find({ status: true }).select({ first_name: 1, last_name: 1, email: 1, image: 1, description: 1 });

    return Users;
}



// Function to create a new user


async function createNewUser(body) {
    let users = new user({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        status: body.status,
        image: body.image,
        description: body.description,
    });

    return await users.save();
}


// Function to update a user


async function updateUser(id, body) {
    return await user.findByIdAndUpdate(id, body, { new: true });
}


// Function to delete a user


async function deactivateUser(id) {
    return await user.findByIdAndUpdate(id, { status: false }, { new: true });
}


module.exports = route;