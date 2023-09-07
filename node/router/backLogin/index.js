let express = require("express");
let router = express.Router();
let backUserDB = require("../../schema/backUser.js")
// encryption加密,decodeFn解密
let { encryption, decode } = require("../../mange/plugin/token.js")
//登录
router.post("/send", async (req, res) => {
    let { userName, password } = req.body;
    let userinfo = await backUserDB.findOne({ userName });
    if (!userinfo) return res.send({ code: 1 })
    if (userinfo.password !== password) return res.send({ code: 1 })
    // name:"token"是加密方式
    let newUserInfo = encryption({ name: "token", value: userinfo });
    res.send({ code: 0, newUserInfo });
})
//自动登录
router.get("/voluntarily", async (req, res) => {
    let decodeData = decode(req.headers["authorization"]);
    // 如果过期,或格式不对就返回1表示出错
    if (decodeData == 4) return res.send({ code: 1 });
    let dataExist = await backUserDB.findById({ _id: decodeData.value._id });
    // 如果该token在本数据库上没有,返回1表示出错
    if (!dataExist) return res.send({ code: 1 });
    // 即没有过期或格式不对,也存在于数据库返回解密数据
    res.send({ code: 0, dataExist })
})
module.exports = router;