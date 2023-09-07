let express = require("express");
let router = express.Router();
//获取文章数据库
let articleDB = require("../../schema/article.js")
//读取markdown文件内容
let { readMarkDown } = require('../../utils/readMarkDown.js');
//获取首页文章
router.get("/recommendArticle", async (req, res) => {
    let recommendData = await articleDB.find({ recommend: true }).populate("key");
    let articleData = (await articleDB.find().populate("key")).reverse();
    let total = articleData.length;
    res.send({ recommendData, articleData, total })
})
//查看markdown文件的数据
router.get("/readMarkDown", async (req, res) => {
    let { markDownTitle } = req.query;
    let isMarkDownTitle = await articleDB.findOne({ title: markDownTitle });
    if (!isMarkDownTitle) {
        return res.send({ code: 1 })
    } else {
        let info = readMarkDown(isMarkDownTitle.mdArticle);
        res.send({ ...info, articleImg: isMarkDownTitle.img });
    }
})
module.exports = router;