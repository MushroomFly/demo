<template>
    <div class="homeBox">
        <MusicPlayer></MusicPlayer>
        <img src="/shangu.png" class="homeBox-bkg">
        <Show />
        <el-menu class="homeBox-navBar" :default-active="activeIndex" mode="horizontal" :ellipsis="false" text-color='#ccc'>
            <div class="mogu-svg" ref="searchRef">
                <svg class="icon" aria-hidden="true" @click="clickOpenSearch" font-size="30px">
                    <use xlink:href="#icon-toad"></use>
                </svg>
                <div class="mogu-svg-box">
                    <div class="mogu-svg-input">
                        <el-input v-model="search" @keydown="keydownSearch" @click="inputHistory" style="height: 24px;"
                            placeholder="请输入搜索项" />
                        <div class="search-svg-box">
                            <SvgIcon class="search-svg" @click="searchFn" name="search"></SvgIcon>
                        </div>
                    </div>
                    <div class="history">
                        <div v-for="item in history" :key="item" class="history-title" @click="historyClick(item)">
                            <SvgIcon class="history-svg" name="search"></SvgIcon>{{ item }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-grow" />
            <el-menu-item v-for="item in navBarData" :key="item.path" @click="goToPath(item.path)" :index="item.path"
                class="navBar-box">
                <SvgIcon class=" svgIcon" :name="item.icon"></SvgIcon>
                {{ item.title }}
            </el-menu-item>
        </el-menu>
        <div class=" appContent">
            <div class="contentBkg"></div>
            <router-view></router-view>
        </div>
    </div>
</template>
<script setup>
import { navBarData } from "@/hooks/index.js";
import Show from "@/components/Show/Show.vue"
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import "@/assets/icon/mogu/iconfont.js";
import MusicPlayer from "@/components/MusicPlayer/MusicPlayer.vue";
let route = useRoute();
let router = useRouter();
//时间戳
let timer = 0;
// 距顶部距离
let scrollTop = ref('none')
//导航栏背景颜色
let bkg = ref("")
//搜索框内容
let search = ref("")
//搜索框宽度
let searchWidth = ref("0%");
//搜索框节点
let searchRef = ref("");
//历史记录高度
let historyHeight = ref("0%")
//历史记录
let history = reactive(localStorage.getItem("history") ? localStorage.getItem("history").split(",") : []);
// 菜单项随着路由的变化而激活为对应的路由的菜单项
let activeIndex = computed(() => {
    if (route.matched[1].name == '内容') return
    //route.matched里面存放着当前以及父路由的路由信息
    return route.matched[0].path;
});
// 点击蘑菇图标后打开搜索框
let clickOpenSearch = async () => {
    searchWidth.value = '100%';
    document.addEventListener('mousedown', clickCloseSearch)
}
//点击其他区域搜索框关闭
let clickCloseSearch = (e) => {
    if (!searchRef.value.contains(e.target)) {
        inputText()
    }
}
//跳转路由
let goToPath = (path) => {
    //拿取session所有的键
    let sessionKeys = Object.keys(sessionStorage)
    let newpath = path.split("/")[1] ? path.split("/")[1] : 'article';
    //删除存储的定位信息(注:只删除点击的路由所属页面的定位信息其他的不删)
    for (let i = 0; i < sessionKeys.length; i++) {
        if (sessionKeys[i] == 'musicInfo')
            continue;
        //循环删除满足条件的会话
        else if (sessionKeys[i].split("/")[1] === newpath || sessionKeys[i].split("/")[1] === 'search') {
            sessionStorage.removeItem(sessionKeys[i]);
        }
    }
    router.push(path);

}
//检测是否回车搜索
let keydownSearch = (e) => {
    if (e.key == 'Enter') {
        searchFn()
    }
}
//本地记录5条搜索历史
let recordSearch = () => {
    if (!localStorage.getItem("history")) {
        localStorage.setItem("history", [search.value]);
    } else {
        let loaclHis = localStorage.getItem("history").split(",");
        let arrIndex = loaclHis.indexOf(search.value);
        if (arrIndex !== -1) {
            loaclHis.unshift(search.value); loaclHis.splice(arrIndex + 1, 1); localStorage.setItem("history", loaclHis);
        } else if (loaclHis.length < 5) {
            loaclHis.unshift(search.value); localStorage.setItem("history", loaclHis);
        } else {
            loaclHis.unshift(search.value), loaclHis.pop(); localStorage.setItem("history", loaclHis);
        }
    }
    history.length = 0;
    history.push(...localStorage.getItem("history").split(","))
}
//输入框复原
let inputText = () => {
    historyHeight.value = "0%"
    setTimeout(() => {
        searchWidth.value = '0%';
        document.removeEventListener('mousedown', clickCloseSearch)
        search.value = "";
    }, 300)
}
//输入框定位记录删除
let inputPosDe = () => {
    let sessionKeys = Object.keys(sessionStorage)
    for (let i = 0; i < sessionKeys.length; i++) {
        if (sessionKeys[i].split("/")[1] === 'search') {
            sessionStorage.removeItem(sessionKeys[i]);
        }
    }
}
//搜索函数
let searchFn = () => {
    inputPosDe();
    if (!search.value) return;
    router.push("/search/v/" + search.value);
    recordSearch()
    inputText()
}
//点击历史记录
let historyClick = (title) => {
    search.value = title;
    searchFn()
}
//点击展示历史记录
let inputHistory = () => {
    historyHeight.value = history.length * 100 + "%";
}
onMounted(() => {
    //监听滚动事件
    window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
    //删除滚动事件
    window.removeEventListener('scroll', handleScroll)
})
// 检测距离
let handleScroll = () => {
    //0.5秒触发一次
    if (timer == 0) {
        timer = setTimeout(() => {
            scrollTop.value =
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop
            scrollTop.value > 100 ? (bkg.value = "#5A75A8") : (bkg.value = "")
            timer = 0;
        }, 500)
    }
}
</script>
<style lang="scss" scoped>
@import './Home.scss';

.homeBox-navBar {
    background-color: v-bind(bkg);
    transition: .5s;
}

.mogu-svg {
    display: flex;
    align-items: center;

    .mogu-svg-box {
        position: relative;
        width: fit-content;

        .history {
            background-color: white;
            width: 100%;
            height: v-bind(historyHeight);
            position: absolute;
            top: 35px;
            transition: .3s;
            overflow: hidden;
            left: 10px;


            .history-title {
                color: #42b983;
                cursor: pointer;
                display: flex;
                align-items: center;
                margin-top:10px ;
                margin-left: 10px;
                .history-svg {
                    width: 18px;
                    height: 18px;
                    margin-right: 10px;
                }
            }
        }

        .mogu-svg-input {
            margin-top: 10px;
            width: v-bind(searchWidth);
            white-space: nowrap;
            overflow: hidden;
            transition: .5s;
            margin-left: 10px;
            display: flex;
            align-items: center;

            .search-svg-box {
                background-color: white;
                width: 24px;
                height: 24px;
                cursor: pointer;
                border-radius: 2px;
                position: relative;

                .search-svg {
                    width: 20px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    height: 20px;
                }
            }

        }
    }

}
</style>
