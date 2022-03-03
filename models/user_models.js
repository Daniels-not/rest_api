const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({

    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    status: {
        type: Boolean,
        default: true
    },

    image: {
        type: String,
        default: "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-9.jpg"
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date,
        default: Date.now
    },

    description: {
        type: String,
        default: "No description"
    }
});

module.exports = mongoose.model("User", userSchema);