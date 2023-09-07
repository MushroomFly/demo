const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleDB = new Schema({
    title: { type: String, required: true },//标题
    des: { type: String, required: true },//描述
    img: { type: String, required: true },//图片
    date: { type: String, required: true },//时间
    mdArticle: { type: String, required: true },//markdown文档
    key: {//关键字
        type: Schema.Types.ObjectId,
        ref: "backClassify"
    },
    recommend:{type:Boolean,require:true},//是否推荐
},
    {
        versionKey: false
    }
);


module.exports = mongoose.model("article", articleDB); 