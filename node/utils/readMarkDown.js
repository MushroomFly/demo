let fs = require('fs');
exports.readMarkDown = (markDownSrc) => {
    //要读取的md文档的路径
    let path = "./public" + markDownSrc
    try {
        let data=fs.readFileSync(path,"utf-8");
        return {code:0,markDownInfo:data}
    } catch (error) {
        return {code:1,errorInfo:error}
    }
}