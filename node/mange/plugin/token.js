const jwt = require("jsonwebtoken")
let secretKey = "privatekey.key";//密钥
let date = { expiresIn: "3 days" }//时间
//加密
exports.encryption = (value) => {
    return jwt.sign(value, secretKey, date);
}
//解密
exports.decode = (value) => {
    try {
        // jwt.verify(value, secretKey)
        return jwt.verify(value, secretKey)
        //Token过期抛出错误
    } catch (error) {
        console.log(error)
        return 4
    }
}