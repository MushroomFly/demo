const fs = require("fs");
const path = require('path');
// filePath(当前文件或文件夹路径)
exports.removeFiles = (filePath) => {
    let stats = fs.statSync(filePath);
    // 判断是否是文件
    if (stats.isFile()) {
        // 删除文件
        fs.unlinkSync(filePath)
        // stats.isDirectory()判断stats是不是为文件夹
    } else if (stats.isDirectory()) {
        // fs.readdirSync:返回一个包含“指定目录下所有文件名称”的数组对象。
        let filesArr = fs.readdirSync(filePath);
        //递归删除该文件夹里面的文件
        filesArr.forEach(file => {
            // path.resolve把一个路径或路径片段的序列解析为一个绝对路径,相当于把filePath(当前文件夹的路径)与file(文件夹里面的文件或文件夹)拼接
            removeFiles(path.resolve(filePath, file));
        })
        // fs.rmdirSync()删除指定路径下的目录;
        fs.rmdirSync(filePath);
    }
}