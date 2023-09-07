<template>
    <div class="count-wrapper">
        <SvgIcon  name="error" class="svg"></SvgIcon>
        <h2 class="h2">没有该{{ route.query.errorMsg }}</h2>
        <span class="count-text">页面将在{{ second }}秒后跳至<span class="title">首页</span></span>
        <div @click="jumpNow" class="return">立即跳转</div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { loadingStore } from '@/stores/loadingStore.js'
let router = useRouter();
let loading = loadingStore();
let route=useRoute();
let { vanishLoading } = loading;
//倒数秒
let second = ref(6);
let timer = null;
let countFn = (second) => {
    let time=0;
    setTimeout(()=>{time++; vanishLoading(false, time);},1000)
    timer = setInterval(() => {
        second.value = second.value - 1;
        if (second.value === 0) {
            clearInterval(timer);
            router.push("/");
        }
    }, 1000);
};
//立即跳转
let jumpNow = () => {
    clearInterval(timer);
    router.push("/");
}
countFn(second);
</script>
<style scoped>
.count-wrapper {
    position: fixed;
    left: 50%;
    top: 43%;
    width: 300px;
    height: 300px;
    transform: translate(-50%, -50%);
    text-align: center;
}
.svg{
    height: 250px;
}
.h2 {
    margin-top: 20px;
    font-size: 26px;
}

.count-txt {
    margin-top: 20px;
}

.title {
    Text-decoration: underline;
}

.return {
    width: 100px;
    height: 40px;
    background-color: #304156;
    border-radius: 20px;
    margin: 20px auto;
    line-height: 40px;
    color: #fff;
    font-size: 14px;
    cursor: pointer
}
</style>