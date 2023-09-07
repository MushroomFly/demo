let express = require("express");
let router = express.Router();
let personalDataDB = require("../../schema/personalData")
let articleDB = require("../../schema/article.js")
let classifyDB = require("../../schema/backClassify.js")
let { formatTime } = require("../../utils/formatTime");
//获取个人资料页面数据
router.get("/requirePersonal", async (req, res) => {
    let personalData = await personalDataDB.findOne({ show: true });
    let articleTotal = (await articleDB.find()).length;
    let classifyTotal = (await classifyDB.find()).length;

    res.send({
        classifyTotal, articleTotal, personalData,
    })
})
//获取分类以及文章数据
router.get('/requireData', async (req, res) => {
    let classifyData = await classifyDB.find();
    //$gte大于等于,$lte小于等于
    //(new Date() - 365 * 24 * 60 * 60 * 1000)//拿到一年前的日期
    let articleData = await articleDB.find({ date: { '$gte': (new Date() - 365 * 24 * 60 * 60 * 1000), "$lte": new Date() * 1 } });
    //文章日期
    let articleDate = [];
    //文章日期的数量
    let dateNumber = [];
    let dateObj = {};
    for (let i = 0; i < articleData.length; i++) {
        let date = formatTime(articleData[i].date);
        if (!dateObj[date]) {
            dateObj[date] = 1;
            articleDate.push(date);
        } else {
            dateObj[date] += 1;
        }
    }
    for (const key in dateObj) {
        dateNumber.push(dateObj[key]);
    }
    res.send({
        classifyData,
        articleDate,
        dateNumber
    })
})
module.exports = router;