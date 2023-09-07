//展示页面的菜单数据
export const navBarData = [
    { title: "首页", path: "/", icon: "home" },
    { title: "分类", path: "/categories", icon: "class" },
    { title: "音乐", path: "/music", icon: "music" },
    { title: "归档", path: "/pigeonhole", icon:"time"},
    { title: "关于", path: "/about", icon: "person" },
]
//后台管理页面的菜单数据
export const backNavBar = [
    {
        title: "用户", path: "/backUser",
        children: [
            { title: "管理用户", path: "/user" },
            { title: "个人资料", path: "/personalData" }
        ]
    },
    {
        title: "文章与分类", path: "/articleClassify",
        children: [
            { title: "分类", path: "/backClassify" },
            { title: "文章", path: "/backArticle" }
        ]
    },
]