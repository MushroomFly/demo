let express = require("express");
let router = express.Router();
//获取文章数据库
let articleDB = require("../../schema/article.js")
//搜索结果
router.get("/searchResult", async (req, res) => {
    let {searchTerms}=req.query;
    let str=".*"+searchTerms+".*$"
    let reg = new RegExp(str)
    let searchAll=[];
    let searchTitle=await articleDB.find({title:{$regex: reg,$options:'i'}});
    let searchDes=await articleDB.find({des:{$regex: reg,$options:'i'}});
    let obj={};
    searchAll.push(...searchTitle,...searchDes);
    searchAll.sort((a,b)=>{
       return b.date-a.date;
    })
    for(let i=0;i<searchAll.length;i++){
        let id=searchAll[i]._id;
        if(!obj[id]){
            obj[id]=searchAll[i];
        }
    }
    res.send({searchResult:obj})
})
module.exports = router;