<template>
    <div class="categories-bigBox">
        <div class="categories-box">
            <div class="categories-title">
                <SvgIcon name="ArticleClassification" class="categories-title-svg"></SvgIcon> 文章分类
            </div>
            <div class="categories-list">
                <div v-for="item in categoriesList" :key="item._id"
                    :class="item.title == route.params.id ? `categories-pitchon categories` : `categories`"
                    :style="{ 'borderColor': item.color }" @click="skip(item.title)">
                    <span :class="item.title == route.params.id ? `categories-text-pitchon` : `categories-text`">{{
                        item.title
                    }}</span>
                    <span class="categories-total">{{ item.quantity }}</span>
                </div>
            </div>
        </div>
        <div>
            <div class="article-list">
                <div class="article  index" v-for="item in articleList" :key="item.title" @click="lookArticle(item)">
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
            <div class="pagination" v-if="total > 1 && route.params.id ? true : false">
                <div @click="cutPage(-1)" :class="leftColor">
                    <SvgIcon class="pagination-left" name="left"></SvgIcon>
                </div>
                <span>{{ currentPageData.currentPage }}/{{ total }}</span>
                <div @click="cutPage(1)" :class="rightGray">
                    <SvgIcon class="pagination-right" name="right"></SvgIcon>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { getCategories, getArticle } from "@/require/index.js"
import { computed, reactive, ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { scrollContent } from "@/hooks/scrollContent";
import { useRoute, useRouter } from "vue-router";
import { formatTime } from "@/hooks/formatTime"
import { useListStore } from "@/stores/useListStore"
import { loadingStore } from '@/stores/loadingStore.js'
import { restoration } from "@/hooks/history.js"
let loading = loadingStore();
let { vanishLoading } = loading;
let categoriesList = reactive([]);
let router = useRouter();
let store = useListStore();
let route = useRoute();
let { alterList } = store;
//是否点击
let click = 0;
//当前的页面以及页面展示数量
let currentPageData = reactive({ pageSize: 12, currentPage: 1 });
//全部文章
let articleTotal = reactive([]);
//文章总页数
let total = ref(0);
//节点数组
let articleListArray = [];
//左按钮颜色
let leftColor = computed(() => currentPageData.currentPage == 1 ? "leftGray" : "")
//右按钮颜色
let rightGray = computed(() => currentPageData.currentPage == total.value ? "rightGray" : "")
//页面展示文章
let articleList = computed(() => articleTotal.slice((currentPageData.currentPage - 1) * currentPageData.pageSize, currentPageData.currentPage * currentPageData.pageSize))
onMounted(() => {
    document.addEventListener('scroll', scrollContent)
})
onUnmounted(() => {
    document.removeEventListener('scroll', scrollContent)
})
//定时器动画
let time = 0;
//初始化
let init = async () => {
    time = 0
    setTimeout(() => { time++ }, 1000)
    let { data } = await getCategories();
    categoriesList.push(...data.categoriesData)
    if (route.query.currentPage) {
        currentPageData.currentPage = route.query.currentPage * 1
    }
    //如果route.params.id有值,说明是直接跳转进来的,没有就关闭动画
    if (route.params.id) {
        getArticleList(1)
    } else {
        vanishLoading(false, time);
    }
}
//跳转分类
let skip = async (title) => {
    if (title == route.params.id) return
    router.push(`/categories/label/` + title);
}
//筛选文章数据
let getArticleList = async (number) => {
    let { data } = await getArticle({ title: route.params.id })
    if (data.code) {
        return router.push({path:"/error",query:{errorMsg:"标签"}})
    } else {
        total.value = Math.ceil(data.total / currentPageData.pageSize);
        articleTotal.push(...data.articleList);
        nextTick(() => {
            restoration(route.fullPath)
            getArticleNode()
        })
        //说明是直接跳转进来,则关闭动画
        if (number) {
            vanishLoading(false, time);
        }
    }
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
    await router.push(`/categories/label/${route.params.id}?currentPage=${currentPageData.currentPage}`)
    nextTick(() => {
        getArticleNode()
    })
    click = 0;
}
//获取文章节点 
let getArticleNode = async () => {
    articleListArray = Array.from(document.getElementsByClassName('index'));
    alterList(articleListArray);
    scrollContent();
}
let pageFn = (newpage) => {
    if (newpage)
        currentPageData.currentPage = newpage * 1;
    else
        currentPageData.currentPage = 1;
}
watch(() => [route.params.id, route.query.currentPage], ([newid, newpage], [oldid, oldpage]) => {
    if (route.name !== '分类') return
    if (!Boolean(newid)) { articleTotal.length = 0; total.value = 0; return; }
    if (newid !== oldid) {
        articleTotal.length = 0;
        total.value = 0;
        pageFn(newpage)
        getArticleList();
    } else if (newid === oldid && !click) {
        pageFn(newpage)
        nextTick(() => {
            getArticleNode()
        })
    }
})
init()
</script>
<style lang="scss" scoped>
@import "./Categories.scss";
</style>