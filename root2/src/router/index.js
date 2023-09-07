import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: "/",//网站首页
        component: () => import("@/views/Home/Home.vue"),
        redirect: "/article",
        children: [
            {
                path: "article",//展示文章
                name: "首页",
                component: () => import("@/views/Article/Article.vue"),
            }, 
            {
                path: "article/:id",//展示文章内容
                name:"内容",
                component: () => import("@/views/ArticleContent/ArticleContent.vue"),
            }
        ]
    },
    {
        path: "/categories",//网站分类
        component: () => import("@/views/Home/Home.vue"),
        redirect: "/categories/label",
        children: [{
            path: "label/:id?",
            name: "分类",
            component: () => import("@/views/Categories/Categories.vue"),
        }]
    },
    {
        path: "/music",//网站音乐
        component: () => import("@/views/Home/Home.vue"),
        redirect: "/music/musicList",
        children: [{
            path: "musicList",
            name: "音乐列表",
            component: () => import("@/views/MusicList/MusicList.vue")
        }]
    },
    {
        path: "/pigeonhole",//网站归档
        component: () => import("@/views/Home/Home.vue"),
        redirect:"/pigeonhole/time",
        children:[{
            path:"time",
            name:"归档",
            component:()=>import("@/views/Time/Time.vue"),
        }]
    },
    {
        path: "/about",//关于
        component: () => import("@/views/Home/Home.vue"),
        redirect: "/about/personage",
        children: [{
            path: "personage",
            name: "关于",
            component: () => import("@/views/Personage/Personage.vue")
        }]
    },
    {
        path:'/search',//搜索
        component:() => import("@/views/Home/Home.vue"),
        children:[{
            path:'v/:id?',
            name:"搜索",
            component:()=>import("@/views/Search/Search.vue")
        }]
    },
    {
        path: "/error",//错误
        name:"页面错误",
        component: () => import("@/views/Error/Error.vue"),
    },
    {
        path: "/backStage",//后台管理页面的登陆页面
        name:"登陆页面",
        component: () => import("@/views/BackStage/BackStage.vue")
    },
    {
        path: "/backUser",//后台管理页面的用户页面
        component: () => import("@/views/BackHome/BackHome.vue"),
        redirect: "/backUser/user",
        children: [
            {
                path: "user",//后台用户
                name:"后台用户",
                component: () => import("@/views/BackUser/BackUser.vue"),
            },
            {
                path: "personalData",//个人资料
                name:"个人资料",
                component: () => import("@/views/PersonalData/PersonalData.vue")
            }
        ]
    },
    {
        path: "/articleClassify",//后台管理页面的文章页面
        component: () => import("@/views/BackHome/BackHome.vue"),
        redirect: "/articleClassify/backClassify",//重定项到子路由后台分类身上
        children: [
            {
                path: "backClassify",//后台分类
                name:"后台分类",
                component: () => import("@/views/BackClassify/BackClassify.vue"),
            },
            {
                path: "backArticle",//文章管理
                name:"文章管理",
                component: () => import("@/views/BackArticle/BackArticle.vue")
            }
        ]
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
