<template>
    <div>
        <div id='MusicList'></div>
        <div class="lookMore">
            <div @click="lookMore(1)" v-show="!loading">{{ text }}</div>
            <span class="loading" v-show="loading">
                <span class="loading-inner"></span>
            </span>
        </div>
    </div>
</template>
<script setup>
import axios from "axios"
import { onMounted, onBeforeUnmount, reactive, ref, watch } from "vue";
import 'APlayer/dist/APlayer.min.css';
import APlayer from 'APlayer';
import { useRoute } from "vue-router";
import { loadingStore } from '@/stores/loadingStore.js'
let store = loadingStore();//仓库
let { vanishLoading } = store;
let options = reactive({ audio: [], theme: '#FADFA3', lrcType: 1, listFolded: false, mini: false, listMaxHeight: 90 });
let MusicList = reactive([]);
let currentPageData = reactive({ pageSize: 10, currentPage: 1 });
let ap;
let loading = ref(false);
let text = ref("查看更多");
let isAll = ref(false);
let route = useRoute();
let musicTime = ref(0);
let musicIndex = ref(0);
let time = 0;
onMounted(() => {
    options.container = document.getElementById('MusicList');
})
onBeforeUnmount(() => {
    ap.destroy();
})
let init = async () => {
    setTimeout(() => { time++ }, 1000)
    let { data } = await axios({ method: `get`, url: '/musicApi/?type=playlist&id=4882838181' })
    MusicList.push(...data);
    if (sessionStorage.getItem("musicInfo")) {
        let musicInfo = sessionStorage.getItem("musicInfo").split("&");
        musicTime.value = musicInfo[0].split("=")[1];
        musicIndex.value = musicInfo[1].split("=")[1];
        currentPageData.pageSize = countTotal(musicIndex.value, 10);
    }
    lookMore();
}
let countTotal = (n, base) => {
    if (n == 0) return 10;
    const x = n % base
    return x > 0 ? n - x + base : n
}
//查看更多
let lookMore = async (number) => {
    if (isAll.value) return;
    if (number) {
        currentPageData.currentPage++;
        loading.value = true;
    }
    let list = MusicList.slice((currentPageData.currentPage - 1) * currentPageData.pageSize, currentPageData.currentPage * currentPageData.pageSize);
    for (let i = 0; i < list.length; i++) {
        list[i].lrc = (await axios({ method: "get", url: '/musicApi/?' + list[i].lrc.split("?")[1] })).data
    }
    if (number) {
        ap.list.add([...list]);
        loading.value = false
    }
    else {
        options.audio.push(...list);
        ap = new APlayer(options)
        if (musicTime.value) {
            ap.list.switch(musicIndex.value - 1);
            setTimeout(() => {
                ap.seek(musicTime.value);
            }, 600)
        }
        vanishLoading(false, time);
    }
    if (ap.list.audios.length == MusicList.length) {
        text.value = "全部歌曲已展示"
        isAll.value = true;
    }
}
//切换路由时记录当前歌曲信息
watch(route, () => {
    sessionStorage.setItem("musicInfo", `time=${ap.audio.currentTime}&index=${ap.list.index + 1}`);
})
init();
</script>
<style scoped>@import './MusicList.scss';</style>