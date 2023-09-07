let express = require("express");
let router = express.Router();
// 获取分类数据库
let classifyDB = require("../../schema/backClassify")
//获取文章数据库
let articleDB = require("../../schema/article");
//获取分类数据
router.get('/getCategories', async (req, res) => {
    let categoriesData = await classifyDB.find();
    res.send({ categoriesData });
})
//获取筛选文章数据
router.get('/getArticle', async (req, res) => {
    let { title } = req.query;
    let isExist=await classifyDB.findOne({title})
    if(!isExist){
        return res.send({code:1});
    }else{
        let articleList=(await articleDB.find({key:isExist._id}).populate("key")).reverse();
        let total=articleList.length;
        res.send({code:0,articleList,total});
    }
})
module.exports = router;