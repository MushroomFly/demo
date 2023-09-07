<template>
    <div class="articleBox">
        <div class="recommend-box" v-if="currentPageData.currentPage < 2">
            <h1>
                <SvgIcon name="recommend" class="recommend-svg"></SvgIcon> 推荐文章
            </h1>
            <el-carousel indicator-position="outside" class="recommend-list index" height="450px" :interval="3000"
                trigger="click">
                <el-carousel-item class="recommend" v-for="item in choicenessArticle" :key="item.title">
                    <img v-lazy="`/api` + item.img" class="image">
                    <div class="recommend-text">
                        <span>{{ item.key.title }}</span>
                        <div class="recommend-text-title">{{ item.title }}</div>
                        <div class="recommend-text-des">{{ item.des }}</div>
                        <br />
                        <el-button type="primary" round @click="lookArticle(item)">阅读更多 <SvgIcon class=" svgIcon"
                                name="eye"></SvgIcon>
                        </el-button>
                    </div>
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="article-box">
            <h1>
                <SvgIcon name="article" class="article-svg"></SvgIcon> 全部文章
            </h1>
            <div class="article-list">
                <div class="article  index" v-for="item in articleData" :key="item.title" @click="lookArticle(item)">
                    <div class="image-box">
                        <img v-lazy="`/api` + item.img" class="image">
                        <h2>{{ item.title }}</h2>
                    </div>
                    <div class="article-text">
                        <span>{{ item.des }}</span>
                        <div class="article-layout">
                            <div class="article-style">
                                <SvgIcon name="date" class="svg"></SvgIcon>
                                <div>{{ formatTime(item.date) }}</div>
                            </div>
                            <div class="article-style">
                                <SvgIcon name="label" class="svg"></SvgIcon>
                                <div>{{ item.key.title }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pagination">
            <div @click="cutPage(-1)" :class="leftColor">
                <SvgIcon class="pagination-left" name="left"></SvgIcon>
            </div>
            <span>{{ currentPageData.currentPage }}/{{ total }}</span>
            <div @click="cutPage(1)" :class="rightGray">
                <SvgIcon class="pagination-right" name="right"></SvgIcon>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { recommendArticle } from "@/require/index.js";
import { formatTime } from "@/hooks/formatTime"
import { scrollContent } from "@/hooks/scrollContent";
import { useListStore } from "@/stores/useListStore"
import { loadingStore } from '@/stores/loadingStore.js'
import { restoration } from "@/hooks/history.js"
let route = useRoute();
let router = useRouter();
let store = useListStore();
let loading = loadingStore();

let { alterList } = store;
//关闭加载动画
let { vanishLoading } = loading;
//当前的页面以及页面展示数量
let currentPageData = reactive({ pageSize: 12, currentPage: 1 });
//推荐文章数据
let choicenessArticle = ref();
//文章数据
let articleData = computed(() =>
    articleTotal.slice((currentPageData.currentPage - 1) * currentPageData.pageSize, currentPageData.currentPage * currentPageData.pageSize)
);
//文章总数
let articleTotal = reactive([]);
//文章总页数
let total = ref(0);
//左按钮颜色
let leftColor = computed(() => currentPageData.currentPage == 1 ? "leftGray" : "")
//右按钮颜色
let rightGray = computed(() => currentPageData.currentPage == total.value ? "rightGray" : "")
let time = 0;
//是否点击跳转
let click = 0;

//初始化
let initialize = async () => {
    setTimeout(() => { time++ }, 1000)
    //如果route.query.pageSize有值,说明是直接跳转进来的
    if (route.query.currentPage) {
        currentPageData.currentPage = route.query.currentPage * 1
    }
    let { data } = await recommendArticle(currentPageData);
    choicenessArticle.value = data.recommendData;
    articleTotal.push(...data.articleData);
    total.value = Math.ceil(data.total / currentPageData.pageSize);
    nextTick(() => {
        restoration(route.fullPath)
        getArticleNode()
        vanishLoading(false, time);
    })
}
//获取文章节点 
let getArticleNode = () => {
    let articleListArray = Array.from(document.getElementsByClassName('index'));
    alterList(articleListArray);
    scrollContent();
}
//查看文章
let lookArticle = (item) => {
    router.push("/article/" + item.title);
}
//切换页码
let cutPage = async (number) => {
    click = 1;
    if (currentPageData.currentPage == 1 && number == -1 || currentPageData.currentPage == total.value && number == 1) return;
    currentPageData.currentPage += number;
    await router.push(`/article?currentPage=${currentPageData.currentPage}`);
    // 每次点击左右按钮,需要重新给scrollContent赋值
    nextTick(() => {
        getArticleNode()
    })
    click = 0
}
watch(() => route.query.currentPage, (a) => {
    if (route.name !== '首页') return
    if (!click) {
        if (a) {
            currentPageData.currentPage = route.query.currentPage * 1
        } else {
            currentPageData.currentPage = 1;
        }
        nextTick(() => {
            getArticleNode()
        })
    }
})
onMounted(() => {
    document.addEventListener('scroll', scrollContent)
})
onUnmounted(() => {
    document.removeEventListener('scroll', scrollContent)
})
initialize()


</script>
<style lang="scss" scoped>
@import "./Article.scss";
</style>