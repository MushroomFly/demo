let mongoose=require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/vue_vite_website',{
    //防止警告信息的两条配置
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("链接成功");
}).catch(()=>{
    console.log("连接失败");
})