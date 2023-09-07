exports.time = (time) => {
    //为什么要/1?,因为传过来的值有可能是字符,字符不能转换成日期,需要/1强制类型转换成数值
    let date = new Date(time / 1),
        year = date.getFullYear(),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2)
    return `${year}-${month}-${day} `
}