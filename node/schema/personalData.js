const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const personalDataDB = new Schema({
    name: { type: String, required: true },//名称
    age: { type: Number, required: true },//年龄
    headPortrait: { type: String, require: true },//头像
    show: { type: Boolean, require: true },//是否展示
    strongPoint: { type: String, require: true },//优点
    aphorism: { type: String, require: true },//格言
    email: { type: String, require: true },//邮箱
    contactWay: { type: String, require: true },//联系方式
    date:{type:Number,require:true},//创建时间
    photo:[],//照片
},
    {
        versionKey: false
    }
);


module.exports = mongoose.model("personalData", personalDataDB); 