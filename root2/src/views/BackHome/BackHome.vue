<template>
    <div>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" background-color="#545c64"
            text-color="#fff" active-text-color="#ffd04b" :router="true">
            <BackMenuBar v-for="item in backNavBar" :key="item.path" :route="item"></BackMenuBar>
            <div class="flex-grow" />
            <div class="font">{{ userData ? userData.userName : "" }}</div>
        </el-menu>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>
<script setup>
import { voluntarily } from "@/require/index.js"
import { useRoute, useRouter } from "vue-router";
// 后台菜单数据
import { backNavBar } from "@/hooks/index.js"
//后台菜单导航条
import BackMenuBar from "@/components/BackMenuBar/BackMenuBar.vue";
import { computed, ref } from "vue";
let router = useRouter()
let route = useRoute();
// 菜单项随着路由的变化而激活为对应的路由的菜单项
let activeIndex = computed(() => {
    return route.path
});
// 用户数据
let userData = ref();
// 初始化
let initialize = async () => {
    let { data } = await voluntarily();
    // 如果token不对则返回初始页面
    if (data.code) {
        ElMessage.error('token失效')
        router.push('/backStage')
    } else {
        userData.value = data.dataExist
    }
}
// 如果本地存储有token值那么就去初始化,否则返回登陆页面
if (localStorage.getItem("userInfo")) {
    initialize()
} else {
    ElMessage.error('请登录')
    router.push('/backStage')
}
</script>
<style scoped>
.font {
    font-size: 20px;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translate(0%, -50%);
}

* {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>