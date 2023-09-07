let express = require("express");
let router = express.Router();
let upload = require("../../middle/multer/personalData.js");
let personalDataDB = require("../../schema/personalData.js");
// 删除多余文件
let { removeFiles } = require("../../utils/removeFiles.js")
//获取个人资料
router.get("/gainPersonal", async (req, res) => {
    let data = await personalDataDB.find();
    if (data) return res.send({ code: 0, data })
    res.send({ code: 1 })
})
//放置个人资料图片
router.post("/placePersonalImg", upload.single("file"), async (req, res) => {
    res.send({ code: 0, url: req.file.path.split("public")[1] });
})
//创建个人资料
router.post("/createPersonal", async (req, res) => {
    let data = req.body;
    let isExist = await personalDataDB.findOne({ name: data.name });
    if (isExist) {
        removeFiles("./public" + data.headPortrait);
        return res.send({ code: 1 })
    }
    let newdata = await personalDataDB.create({ ...data, date: new Date() * 1 });
    res.send({
        code: 0,
        newdata
    })
})
//修改个人资料
router.post("/alterPersonal", async (req, res) => {
    let rootData = req.body;
    let oldData = await personalDataDB.findById({ _id: rootData._id });
    //如果查询出来的结果与提交的结果一样,说明没有改变
    if (JSON.stringify(rootData) === JSON.stringify(oldData)) {
        return res.send({ code: 2 });
    }
    let isName = await personalDataDB.findOne({ name: rootData.name });
    //如果没有找到该名称,或者找到该名称并且该名称的id与要修改的数据是同一个id,说明是同一条数据,这两个情况都可以全改
    if (!isName || (isName && isName._id == rootData._id)) {
        await personalDataDB.findByIdAndUpdate({ _id: rootData._id }, { ...rootData });
        let newdata = await personalDataDB.findById({ _id: rootData._id });
        //如果上传的头像与旧数据的头像地址不同,那么删除旧头像地址
        if (rootData.headPortrait !== oldData.headPortrait) {
            removeFiles("./public" + oldData.headPortrait);
        }
        res.send({ code: 0, newdata });
        //如果找到存在该标题的数据,并且与将要改的数据不是同一条
    } else {
        removeFiles("./public" + rootData.headPortrait);
        res.send({
            code: 1
        })
    }
})
//删除个人资料
router.get("/deletePersonal", async (req, res) => {
    let { name, headPortrait, photoList } = req.query;
    await personalDataDB.findOneAndDelete({ name });
    removeFiles("./public" + headPortrait);
    photoList.forEach(item => {
        removeFiles("./public" + item);
    })
    let newdata = await personalDataDB.find();
    res.send({ code: 0, newdata });
})
//放置图片
router.post("/placePersonalPhoto", upload.array("file"), async (req, res) => {
    try {
        let arrPhoto = [];
        req.files.forEach(item => {
            arrPhoto.push(item.path.split("public")[1])
        })
        res.send({ code: 0, arrPhoto })
    } catch (error) {
        res.send({ code: 2 });
    }
})
//增加图片
router.post("/addPhoto", async (req, res) => {
    let { photoList, PhotoData } = req.body;
    await personalDataDB.findByIdAndUpdate({ _id: PhotoData._id }, {
        //$push追加数据
        $push: {
            photo: { $each: [...photoList] }
        }
    })
    let newdata = await personalDataDB.findById({ _id: PhotoData._id });
    res.send({ code: 0, newdata });
})
//删除图片
router.get("/deletePhoto", async (req, res) => {
    let { _id, url } = req.query;
    //$pull删除数组中符合条件的元素
    await personalDataDB.findByIdAndUpdate({ _id }, { $pull: { photo: url } });
    removeFiles("./public" + url);
    let newdata = await personalDataDB.findById({ _id });
    res.send({
        newdata,
        code: 0
    })
})
module.exports = router;