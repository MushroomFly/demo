let express = require("express");
let router = express.Router();
let upload = require("../../middle/multer/article.js");
let fs = require('fs');
// 获取分类数据库
let classifyDB = require("../../schema/backClassify")
// 删除多余文件
let { removeFiles } = require("../../utils/removeFiles.js")
//获取文章数据库
let articleDB = require("../../schema/article.js")
//读取markdown文件内容
let { readMarkDown } = require('../../utils/readMarkDown.js');
// 获取文章分类
router.get('/articleClassify', async (req, res) => {
    let classifyInfo = await classifyDB.find();
    if (classifyInfo) {
        res.send({ code: 0, classifyInfo })
    } else {
        res.send({ code: 1 });
    }
})
//获取文章
router.get('/gainArticle', async (req, res) => {
    let articleInfo = (await articleDB.find().populate("key")).reverse();
    let articleTotal = articleInfo.length;//拿取文章数量
    res.send({
        articleInfo,
        articleTotal
    })
})
// 创建文章
router.post('/createArticle', async (req, res) => {
    let { title, des, key, articleSrc, recommend } = req.body
    let isTitle = await articleDB.findOne({ title: title });
    //如果存在
    if (isTitle) {
        for (let item in articleSrc) {
            if (item !== "code") {
                removeFiles("./public" + articleSrc[item]);
            }
        }
        return res.send({ code: 1 })
    }
    let data = await articleDB.create({ title, des, key, img: articleSrc.img, mdArticle: articleSrc.mdArticle, recommend, date: new Date() * 1 });
    let result = await articleDB.findById({ _id: data._id }).populate("key");
    //让所属分类的文章数量+1
    await classifyDB.findByIdAndUpdate({ _id: key }, { $inc: { quantity: 1 } });
    res.send({
        code: 0,
        result
    })
})
//放置文章与图片
// 这里的upload.array("file")的作用就是接收多个数据,并且name相同为file
router.post('/ImgAndArticle', upload.array("file"), (req, res) => {
    let img = "";
    let mdArticle = "";
    try {
        req.files.forEach(item => {
            //获取后缀
            let suffix = item.originalname.split(".")[1];
            //将后缀转换为小写
            suffix = '.' + suffix.toLowerCase()
            // 查看是否为图片的正则
            let strRegex = /\.(jpg|png|gif|bmp|jpeg)$/;
            //截取图片与文章地址
            if (strRegex.test(suffix)) {
                img = item.path.split("public")[1]
            } else {
                mdArticle = item.path.split("public")[1]
            }
        })
        res.send({ img, mdArticle, code: 0 })
    } catch (error) {
        res.send({ code: 2 });
    }
})
//查看markdown文件的数据
router.get("/lookMarkDown", async (req, res) => {
    let { markDownTitle } = req.query;
    let isMarkDownTitle = await articleDB.findOne({ title: markDownTitle });
    if (!isMarkDownTitle) {
        return res.send({ code: 1 })
    } else {
        let info = readMarkDown(isMarkDownTitle.mdArticle);
        res.send({ ...info, articleImg: isMarkDownTitle.img });
    }
})
//修改文章
router.post("/alterArticle", async (req, res) => {
    let rootData = req.body
    let oldData = await articleDB.findById({ _id: rootData._id });
    //如果查询出来的结果与提交的结果一样,说明没有改变
    if (JSON.stringify(rootData) === JSON.stringify(oldData)) {
        return res.send({ code: 2 });
    }
    let isTitle = await articleDB.findOne({ title: rootData.title });


    //如果没有找到该标题,或者找到该标题并且该标题的id与要修改的数据是同一个id,说明是同一条数据,这两个情况都可以全改
    if (!isTitle || (isTitle && isTitle._id == rootData._id)) {
        //rootdata里面id不会改变,所以就算直接...rootdata改变后的id还是原来的id
        await articleDB.findByIdAndUpdate({ _id: rootData._id }, { ...rootData });

        //如果上传的分类与旧数据库的分类不同,那么旧分类文章数量-1,新分类文章数量+1
        if (JSON.stringify(oldData.key) !== JSON.stringify(rootData.key)) {
            await classifyDB.findByIdAndUpdate({ _id: oldData.key }, { $inc: { quantity: -1 } });
            await classifyDB.findByIdAndUpdate({ _id: rootData.key }, { $inc: { quantity: 1 } });
        }

        let newData = await articleDB.findById({ _id: rootData._id }).populate("key");
        //如果修改了图片,那么就把旧图片删除
        if (rootData.img !== oldData.img) {
            removeFiles('./public' + oldData.img);
        }
        //如果上传了新文档,把旧文档删除
        if (rootData.mdArticle !== oldData.mdArticle) {
            removeFiles('./public' + oldData.mdArticle);
        }
        return res.send({
            code: 0,
            newData
        })

        //如果找到存在该标题的数据,并且与将要改的数据不是同一条
    } else {
        //如果上传了图片,那么就把旧图片删除
        if (rootData.img !== oldData.img) {
            removeFiles('./public' + rootData.img);
        }
        //如果上传了文档,就把旧文档删除
        if (rootData.mdArticle !== oldData.mdArticle) {
            removeFiles('./public' + rootData.mdArticle);
        }
        res.send({
            code: 1
        })
    }
})
//删除文章
router.post('/deleteArticle', async (req, res) => {
    let { _id, mdArticle, img, key } = req.body;
    await articleDB.findByIdAndDelete({ _id });
    removeFiles('./public' + mdArticle)
    removeFiles('./public' + img)
    //让所属分类文章数量-1
    await classifyDB.findByIdAndUpdate({ _id: key._id }, { $inc: { quantity: -1 } });
    let newData = (await articleDB.find().populate("key")).reverse();
    let articleTotal = newData.length;//返回当前全部文章数量
    res.send({
        code: 0,
        newData,
        articleTotal
    })
})
//改写markdown内容
router.post("/rewriteMarkDown", async (req, res) => {
    let { title, content } = req.body;
    let data = await articleDB.findOne({ title });
    if (data) {
        let path = "./public" + data.mdArticle;
        fs.writeFile(path, content, { flag: 'w' }, (err) => {
            if (err) {
                res.send({ code: 1, err: err.path });
            } else {
                res.send({ code: 0 });
            }
        })
    }
})
//筛选文章
router.post("/screenArticle", async (req, res) => {
    let { _id } = req.body;
    let articleInfo = (await articleDB.find({ key: _id }).populate("key")).reverse();
    let articleTotal = (await classifyDB.findById({ _id })).quantity;
    res.send({ code: 0, articleInfo, articleTotal });
})
module.exports = router;