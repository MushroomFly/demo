import { require } from "./require.js"
import axios from "axios"
let path = "/api"
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    let token = localStorage.getItem("userInfo");
    token && (config.headers["authorization"] = token);
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

//后台登录
export const backLogin = (data) => require("post", path + "/backLogin/send", data)
//后台自动登录
export const voluntarily=()=>require("get",path+"/backLogin/voluntarily")
//创建分类
export const createClassify=(data)=>require("post",path+"/backClassify/createClassify",data);
//获取分类
export const gainClassify=(data)=>require("get",path+"/backClassify/gainClassify",data);
//修改分类
export const alterClassify=(data)=>require("post",path+"/backClassify/alterClassify",data);
//删除分类
export const deleteClassify=(data)=>require("post",path+"/backClassify/deleteClassify",data)
//分类分页
export const classifyPage=(data)=>require("get",path+"/backClassify/classifyPage",data)
//文章图片与md文档的放置
export const articleImgMd=(data)=>require("post",path+"/article/ImgAndArticle",data);
//创建文章
export const createArticle=(data)=>require("post",path+"/article/createArticle",data);
//在文章中获取分类
export const articleClassify=()=>require("get",path+"/article/articleClassify");
//获取文章
export const gainArticle=(data)=>require("get",path+"/article/gainArticle",data);
//查看md文档
export const lookMarkDown=(data)=>require("get",path+"/article/lookMarkDown",data);
//修改文章
export const alterArticle=(data)=>require("post",path+"/article/alterArticle",data);
//删除文章
export const deleteArticle=(data)=>require("post",path+"/article/deleteArticle",data);
//筛选文章
export const screenArticle=(data)=>require("post",path+"article/screenArticle",data);
//改写markdown文档
export const rewriteMarkDown=(data)=>require("post",path+"/article/rewriteMarkDown",data);
//创建个人资料
export const createPersonal=(data)=>require("post",path+"/personalData/createPersonal",data);
//获取个人资料
export const gainPersonal=()=>require("get",path+"/personalData/gainPersonal");
//修改个人资料
export const alterPersonal=(data)=>require("post",path+"/personalData/alterPersonal",data);
//放置图片
export const placePersonalPhoto=(data)=>require("post",path+"/personalData/placePersonalPhoto",data);
//增加图片
export const addPhoto=(data)=>require("post",path+"/personalData/addPhoto",data)
//删除图片
export const deletePhoto=(data)=>require("get",path+"/personalData/deletePhoto",data);
//删除个人资料
export const deletePersonal=(data)=>require("get",path+"/personalData/deletePersonal",data);
//获取首页文章
export const recommendArticle=(data)=>require("get",path+"/showArticle/recommendArticle",data);
//获取md文档数据
export const readMarkDown=(data)=>require("get",path+"/showArticle/readMarkDown",data);
//获取个人资料
export const requirePersonal=()=>require('get',path+"/personalShow/requirePersonal");
//获取个人资料内的文章与分类数据
export const requireData=()=>require('get',path+"/personalShow/requireData");
//获取分类页面分类数据
export const getCategories=()=>require('get',path+"/categories/getCategories");
//获取分类页面文章数据
export const getArticle=(data)=>require("get",path+"/categories/getArticle",data);
//获取归档文章数据
export const timeRequire=()=>require("get",path+"/time/timeRequire");
//搜索
export const searchResult=(data)=>require("get",path+"/search/searchResult",data);