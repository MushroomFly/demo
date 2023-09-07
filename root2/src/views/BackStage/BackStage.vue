<template>
    <div class="box">
        <el-form :model="form" class="form">
            <h1>后台管理</h1>
            <el-form-item label="账号:">
                <el-input v-model="form.userName" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="密码:">
                <el-input v-model="form.password" type="password" placeholder="请输入密码" :show-password="true" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup>
import { reactive } from "vue";
import { backLogin, voluntarily } from "@/require/index.js"
import { useRouter } from "vue-router";
import { loadingStore } from '@/stores/loadingStore.js'
let loading = loadingStore();
let { vanishLoading } = loading;
vanishLoading(false,0)
//表单所依赖的数据
let form = reactive({ userName: "", password: "" });
let router = useRouter();
// 自动登录
if (localStorage.getItem("userInfo")) {
    voluntarily().then(({ data }) => {
        if (!data.code) {
            ElMessage.success('登陆成功')
            router.replace({ path: "/backUser" })
        } else {
            ElMessage.error('token失效')
        }
    })
}
// 登录按钮
let onSubmit = async () => {
    if (!form.userName || !form.password) {
        return ElMessage.error('账户或密码不能为空')
    }
    let { data } = await backLogin(form);
    if (!data.code) {
        localStorage.setItem('userInfo', data.newUserInfo)
        ElMessage.success('登陆成功')
        router.replace({ path: "/backUser" })
    }else{
        ElMessage.error('账号或密码错误')
    }
}
</script>
<style scoped>
.box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    border: 2px solid #ccc;

}

.form {
    position: relative;
    width: 80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}
</style>