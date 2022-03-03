const express = require("express");
const route = express.Router();
const courses = require("../../models/course_models");

const Joi = require('joi');


// Joi validation schema for courses


const schema = Joi.object({

    name: Joi.string()
        .alphanum()
        .min(3)
        .max(40)
        .required(),
    
    description: Joi.string()
        .alphanum()
        .min(5)
        .required(),
});


// @route   GET api/courses

route.get('/', (req, res) => {
    let results = getAllCourses();

    results.then(courses => {
        res.json(courses);
    }).catch(err => {
        res.json(err.message);
    })
});


// @route   POST api/courses


route.post('/', (req, res) => {
    const body = req.body;

    const { error, value } = schema.validate(body);

    if (error) {
        res.json(error.message);
    }else {
        const newCourse = createNewCourse(body);
    
        newCourse.then(course => {
            res.json({
                success: true,
                message: "Course created successfully",
                name: course.name,
                description: course.description,
                status: course.status,
                image: course.image,
                qualification: course.qualification,
            });
        }).catch(err => {
            res.json(err.message);
        })
    }


})


// @route   PUT api/courses/:id


route.put('/:id', (req, res) => {
    const id = req.id;
    const body = req.body;

    const { error, value } = schema.validate(body);

    if(error){
        res.json(error.message);
    }else {
        updateCourse(id, body).then(course => {
            res.json({
                message: "Course updated successfully",
                name: course.name,
                description: course.description,
                status: course.status,
                image: course.image,
                qualification: course.qualification,
            });
        }).catch(err => {
            res.json(err.message);
        })
    }

})



// @route   DELETE (deactivate) api/courses/:id


route.delete('/:id', (req, res) => {
    const id = req.params.id;

    deactivateCourse(id).then(course => {
        res.json({
            message: `Course deactivated successfully ${course.name}`,
        });
    }).catch(err => {
        res.json(err.message);
    })
})


// Function to get all courses


async function getAllCourses() {
    let Courses = await courses.find({ "status": true }).select({
        name: 1,
        description: 1,
        status: 1,
        image: 1,
        qualification: 1,
    });

    return Courses;
}


// Function to create a new course


async function createNewCourse(body){
    let course = new courses({
        name: body.name,
        description: body.description,
        status: body.status,
        image: body.image,
    })

    return await course.save();
}


// Function to update a course


async function updateCourse(id, body){
    return await courses.findByIdAndUpdate(id, body);
}

// Function to deactivate a course


async function deactivateCourse(id){
    return courses.findByIdAndUpdate(id, {status: false}, { new: true });
}

module.exports = route;