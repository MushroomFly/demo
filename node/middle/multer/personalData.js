let multer = require("multer");
let path = require("path");
const storage = multer.diskStorage({
    // 存储地址
    destination(req, file, cb) {
        // 拿取文件后缀名
        let suffix = (path.extname(file.originalname)).toLowerCase()
        // 查看是否为图片的正则
        let strRegex = /\.(jpg|png|gif|bmp|jpeg)$/;
        if (strRegex.test(suffix)) {
            cb(null, path.join(__dirname, '../../public/personalDataImg'));
        }
    },
    // 文件名
    filename(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

module.exports = multer({ storage });
