<template>
    <div>
        <div class="article-box" v-if="searchAll.length">
            <h1>
                <SvgIcon name="article" class="article-svg"></SvgIcon> 全部文章
            </h1>
            <div class="article-list">
                <div class="article  index" v-for="item in searchData" :key="item.title" @click="lookArticle(item)">
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
        <div class="null" v-if="!searchAll.length">
            没有该搜索项:“<span>{{ route.params.id }}</span>”,请换一个词进行搜索
        </div>
        <div class="pagination" v-if="total > 1 ? true : false">
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
import { loadingStore } from '@/stores/loadingStore.js'
import { useRoute, useRouter } from 'vue-router';
import { searchResult } from "@/require/index.js"
import { computed, reactive, ref, nextTick, onMounted, onUnmounted, watch } from 'vue';
import { formatTime } from "@/hooks/formatTime"
import { useListStore } from "@/stores/useListStore"
import { scrollContent } from "@/hooks/scrollContent";
import { restoration } from "@/hooks/history.js"
let store = useListStore();
let loading = loadingStore();
let { vanishLoading } = loading;
let route = useRoute();
let router = useRouter();
//文章总页数
let total = ref(0);
let { alterList } = store;
let click = 0;
let time = 0;
//当前的页面以及页面展示数量
let currentPageData = reactive({ pageSize: 12, currentPage: 1 });
//搜索出的数据
let searchAll = reactive([]);
//当前页面数据
let searchData = computed(() => {
    return searchAll.slice((currentPageData.currentPage - 1) * currentPageData.pageSize, currentPageData.currentPage * currentPageData.pageSize)
});
//左按钮颜色
let leftColor = computed(() => currentPageData.currentPage == 1 ? "leftGray" : "")
//右按钮颜色
let rightGray = computed(() => currentPageData.currentPage == total.value ? "rightGray" : "")

//初始化
let init = async (num) => {
    if (num) setTimeout(() => { time++ }, 1000);
    let searchTerms = route.params.id;
    if (route.query.currentPage && num) {
        currentPageData.currentPage = route.query.currentPage * 1
    }
    let { data } = await searchResult({ searchTerms: searchTerms })
    for (const key in data.searchResult) {
        searchAll.push(data.searchResult[key]);
    }
    total.value = Math.ceil(searchAll.length / currentPageData.pageSize);
    nextTick(() => {
        restoration(route.fullPath)
        getArticleNode();
        if (num) vanishLoading(false, time);
    })
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
    await router.push(`/search/v/${route.params.id}?currentPage=${currentPageData.currentPage}`);
    // 每次点击左右按钮,需要重新给scrollContent赋值
    nextTick(() => {
        getArticleNode()
        click = 0;
    })
}
//获取文章节点 
let getArticleNode = () => {
    let articleListArray = Array.from(document.getElementsByClassName('index'));
    alterList(articleListArray);
    scrollContent();
}
onMounted(() => {
    document.addEventListener('scroll', scrollContent)
})
onUnmounted(() => {
    document.removeEventListener('scroll', scrollContent)
})
//当前路由是否存在currentPage值
let pageFn = (newpage) => {
    if (newpage)
        currentPageData.currentPage = newpage * 1;
    else
        currentPageData.currentPage = 1;
}
watch(() => [route.params.id, route.query.currentPage], ([newid, newpage], [oldid, oldpage]) => {
    if (route.name !== '搜索') return
    if (newid !== oldid) {
        searchAll.length = 0;
        total.value = 0;
        pageFn(newpage)
        init();
    }
    if (newid === oldid && !click) {
        pageFn(newpage)
        nextTick(() => {
            getArticleNode()
        })
    }
})
init(1)
</script>
<style lang="scss" scoped> @import "./Search.scss";
</style>