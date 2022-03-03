const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const courseSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    status: {
        type: Boolean,
        default: true
    },

    image: {
        type: String,
        default: "https://dummyimage.com/600x400/000/f2f2f2.jpg",
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date,
        default: Date.now
    },

    qualifications: {
        type: Number,
        default: 0,
    }
});


module.exports = mongoose.model("Course", courseSchema);