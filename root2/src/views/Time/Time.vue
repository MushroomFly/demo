<template>
    <div>
        <el-timeline>
            <el-timeline-item v-for="(index, name) in timeObj" :key="index" :timestamp="name" placement="top"
                class="card-list" ref="itemRef">
                <el-card class="card  index" v-for="data in index" :key="data._id" @click="goToPath(data)">
                    <h4 class="card-title">{{ data.title }}</h4>
                    <div class="card-date">
                        <SvgIcon class="card-svg" name="day"></SvgIcon>
                        <p>{{ formatTime(data.date) }}</p>
                    </div>
                </el-card>
                <div class="card-dot"></div>
            </el-timeline-item>
        </el-timeline>
        <div class="rightNavBar">
            <div v-for="(item, name, index) in timeObj" :key="item" @click="fn(index)" class="rightNavBar-title">{{ name }}</div>
        </div>
    </div>
</template>
<script setup>
import { loadingStore } from '@/stores/loadingStore.js'
import { timeRequire } from "@/require/index.js"
import { reactive, nextTick, onMounted, ref } from 'vue';
import { formatTime } from "@/hooks/formatTime"
import { useRoute, useRouter } from 'vue-router';
import { useListStore } from "@/stores/useListStore"
import { restoration } from "@/hooks/history.js"
import { scrollContent } from "@/hooks/scrollContent";
let store = useListStore();
let { alterList } = store;
let loading = loadingStore();
let { vanishLoading } = loading;
let timeObj = reactive({});
let router = useRouter();
let route = useRoute()
let time = 0;
let fn = (index) => {
    let doc = document.querySelectorAll(".card-list");
    let top = doc[index].offsetTop;
    window.scrollTo({ top: top, behavior: "smooth" });
}
onMounted(() => {
    document.addEventListener('scroll', scrollContent)
})
let init = async () => {
    setTimeout(() => { time++ }, 1000)
    let { data } = await timeRequire();
    for (let key in data.articleInfo) {
        timeObj[key] = data.articleInfo[key]
    }
    nextTick(() => {
        restoration(route.fullPath)
        let articleListArray = Array.from(document.getElementsByClassName('index'));
        alterList(articleListArray);
        scrollContent()
        vanishLoading(false, time);
    })
}
let goToPath = (item) => {
    router.push("/article/" + item.title);
}
init()
</script>
<style lang="scss" scoped>
@import "./Time.scss";
</style>