const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const backUserDB = new Schema({
    userName: { type: String, required: true },//账户名
    password: { type: String, required: true }//密码
},
    {
        versionKey: false
    }
);


module.exports = mongoose.model("backUser", backUserDB); 