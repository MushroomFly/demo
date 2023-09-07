let express = require("express");
let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("./mongoDB");
// 提供静态文件
app.use(express.static("./public"))
app.use('/', require("./router/index"));
app.listen('8085', () => {
    console.log("服务端已开启");
})