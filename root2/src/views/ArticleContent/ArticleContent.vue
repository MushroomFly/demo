<template>
    <div>
        <!-- 展示md文档 -->
        <v-md-preview :text="showMarkDown"></v-md-preview>
    </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { readMarkDown } from "@/require/index.js"
import { onUnmounted, ref, watch } from "vue";
import { useShowBkImgStore } from '@/stores/useShowBkImgStore.js'
import { loadingStore } from '@/stores/loadingStore.js'
let loading = loadingStore();
let route = useRoute();
let router = useRouter();
//展示的markdown文档
let showMarkDown = ref("");
//仓库
let store = useShowBkImgStore();
//仓库的修改函数
const { alterShowBkImg } = store;
let { vanishLoading } = loading;
let initialize = async (title) => {
    let time = 0;
    setTimeout(() => { time++ }, 1000);
    let { data } = await readMarkDown({ markDownTitle: title });
    if (!data.code) {
        alterShowBkImg(data.articleImg);
        showMarkDown.value = data.markDownInfo;
        vanishLoading(false, time);
    } else {
        router.push({path:"/error",query:{errorMsg:"文章"}});
    }
}
onUnmounted(() => {
    alterShowBkImg("");
})
initialize(route.params.id)
</script>
<style scoped></style>