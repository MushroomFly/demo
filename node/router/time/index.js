let express = require("express");
let router = express.Router();
//获取文章数据库
let articleDB = require("../../schema/article.js")
let { time } = require("../../utils/time");
//获取全部文章
router.get("/timeRequire", async (req, res) => {
    let data=(await articleDB.find()).reverse();
    let obj={};
    for(let i=0;i<data.length;i++){
        let date=time(data[i].date);
        if(!obj[date]){
            obj[date]=[];
            obj[date].push(data[i]);
        }else{
            obj[date].push(data[i]);
        }
    }
    res.send({articleInfo:obj});
})
module.exports = router;