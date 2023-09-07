let express = require("express");
let router = express.Router();
// 获取分类数据库
let classifyDB = require("../../schema/backClassify")
// 创建分类
router.post('/createClassify', async (req, res) => {
    let { title, des, color } = req.body;
    let isTitle = await classifyDB.findOne({ title });
    if (isTitle) return res.send({ code: 1 })
    let data = await classifyDB.create({ title, des, color, date: new Date() * 1 });
    res.send({
        code: 0,
        classify: data,
    })

})
//获取分类
router.get("/gainClassify", async (req, res) => {
    let { pageSize, currentPage } = req.query;
    let classifyData = await classifyDB.find();
    let classifyTotal = classifyData.length;//拿取分类数量
    classifyData = classifyData.splice((currentPage - 1) * pageSize, pageSize);//裁剪分类,返回限制的大小的数据
    res.send({
        classifyData,
        classifyTotal
    })
})
//修改分类
router.post("/alterClassify", async (req, res) => {
    let rootData = req.body
    //isrepetition(是否修改)存储的修改前的数据
    let isrepetition = await classifyDB.findById({ _id: rootData._id });
    // 如果查询出来的结果与提交的结果一样,说明没有改变
    if (JSON.stringify(isrepetition) == JSON.stringify(rootData)) {
        return res.send({
            code: 2
        })
    }
    let isTitle = await classifyDB.findOne({ title: rootData.title });


    //如果没有找到该标题,或者找到该标题并且该标题的id与要修改的数据是同一个id,说明是同一条数据,这两个情况都可以全改
    if (!isTitle || (isTitle && isTitle._id == rootData._id)) {
        //rootdata里面id不会改变,所以就算直接...rootdata改变后的id还是原来的id
        await classifyDB.findByIdAndUpdate({ _id: rootData._id }, { ...rootData });
        let newData = await classifyDB.findById({ _id: rootData._id });
        return res.send({
            code: 0,
            newData
        })
        //如果找到存在该标题的数据,并且与将要改的数据不是同一条
    } else {
        res.send({
            code: 1
        })
    }
})
// 删除分类
router.post("/deleteClassify", async (req, res) => {
    let { _id, pageSize, currentPage } = req.body;
    await classifyDB.deleteOne({ _id });
    let newData = await classifyDB.find();
    let total = newData.length;
    newData = newData.splice((currentPage - 1) * pageSize, pageSize);
    res.send({
        code: 0,
        newData,
        total,
    })
})
//分类分页
router.get("/classifyPage", async (req, res) => {
    let { pageSize, currentPage } = req.query;
    //limit是单次读取数据总量,skip是跳过多少数据
    let pageData = await classifyDB.find({}, {}, { limit: pageSize, skip: (currentPage - 1) * pageSize, sort: { date: 1 } })
    res.send({
        code: 0,
        pageData,
    })
})
module.exports = router;