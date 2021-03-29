const mongoose = require("mongoose");
const { modelName } = require("./menu");
const Schema = mongoose.Schema;


const NewsletterSchema = Schema({
    email:{
        type:String,
        unique: true
    }
})


module.exports = mongoose.model("Newsletter",NewsletterSchema);