const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const backClassifyDB = new Schema({
    title: { type: String, required: true },//标题
    des: { type: String, required: true },//描述
    color: { type: String },//色彩
    date: { type: String },//时间
    quantity:{type:Number,default:0},//所属文章数量
},
    {
        versionKey: false
    }
);


module.exports = mongoose.model("backClassify", backClassifyDB); 