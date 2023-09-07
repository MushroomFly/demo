<template>
    <!-- 判断是否存在子元素,不存在就直接创建菜单项 -->
    <el-menu-item v-if="!route.children" :index="route.path">{{ route.title }}</el-menu-item>
    <!-- 存在就创建菜单 -->
    <el-sub-menu v-else :index="route.path">
        <template #title>{{ route.title }}</template>
        <!-- 创建菜单后,里面的菜单项就是当前菜单的子元素 -->
        <!-- route.path+item.path路径拼接,让符合要求的菜单的路径与他的子元素拼接 -->
        <el-menu-item v-for="item in route.children" :key="item.path" :index="route.path + item.path">{{ item.title
        }}</el-menu-item>
    </el-sub-menu>
</template>
<script setup>
// 接收父组件传过来的参数
const props = defineProps({
    route: {
        //数组项
        type: Object,
        required: true,
    },
});
</script>
<style scoped>
* {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>