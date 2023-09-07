<template>
    <div>
        <!-- 按钮 -->
        <el-button type="primary" @click="openDialog" class="createClassify">创建分类</el-button>
        <div>
            <!-- 表格 -->
            <el-table :data="tableData" stripe style="width: 100%" class="table">
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="des" label="描述" />
                <el-table-column label="颜色">
                    <template #default="{ row }">
                        <div class="color" :style="{ 'background': row.color }"></div>{{ row.color }}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template #default="{ row }">
                        <div>{{ formatTime(row.date) }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="quantity" label="所属文章数量" />
                <el-table-column label="操作" :index="alterIndex">
                    <template #default="{ row, $index }">
                        <el-button size="small" @click="openAlterLoading(row, $index)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteClass(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 对话框 -->
        <el-dialog v-model="dialogVisible" :title="isAlter ? `修改分类` : `创建分类`" width="40%" :before-close="cancel">
            <template #footer>
                <!-- 表单 -->
                <el-form label-width="100px" :model="classifyData" style="max-width: 460px" :rules="rules" ref="formRef">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="classifyData.title" />
                    </el-form-item>
                    <el-form-item label="描述" prop="des">
                        <el-input v-model="classifyData.des" />
                    </el-form-item>
                    <el-form-item label="色彩">
                        <span class="demonstration">请选择标签颜色:</span>
                        <el-color-picker v-model="classifyData.color" />
                    </el-form-item>
                    <!-- 提交取消按钮 -->
                    <el-form-item>
                        <el-button type="primary" @click="submitForm(formRef)">提交</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </el-dialog>
        <div class="demo-pagination-block pagebox">
            <el-pagination v-model:current-page="currentPageData.currentPage" v-model:page-size="currentPageData.pageSize"
                :page-sizes="[10, 15, 20, 25]" :background="true" layout="sizes, prev, pager, next" :total="classifyTotal"
                @size-change="handleCurrentChange" @current-change="handleCurrentChange" class="page" />
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import { createClassify, gainClassify, alterClassify, deleteClassify, classifyPage } from "@/require/index.js"
import { formatTime } from "@/hooks/formatTime.js"
import { loadingStore } from '@/stores/loadingStore.js'
let loading = loadingStore();
let { vanishLoading } = loading;
// 表格数据
let tableData = ref([]);
// 分类数据
let classifyData = ref({ title: "", des: "", color: "" });
//要修改的数据的下标
let alterIndex = ref(0);
//分类总数量
let classifyTotal = ref(0);
// 是否打开对话框
let dialogVisible = ref(false);
// 获取表单节点
let formRef = ref()
//是否打开修改
let isAlter = ref(false);
//当前的页面以及页面展示数量
let currentPageData = ref({ pageSize: 10, currentPage: 1 });
// 表单验证规则
let rules = {
    title: [{ required: true, message: '请输入标题' }],
    des: [{ required: true, message: "请输入描述" }]
}


// 打开对话框
let openDialog = () => {
    dialogVisible.value = true;
}
//关闭对话框
let cancel = () => {
    dialogVisible.value = false;//关闭对话框
    formRef.value.resetFields()//重置表单属性
    //设置初始值
    /*作用:resetFields方法是将表单重置为form组件dom刚渲染时的初始值,而直接点击修改会让dom刚渲染的初始值为修改传过来的值,这样就算重置表单,前往创建
    的时候,依旧是刚开始修改传过来的值的原因*/
    classifyData.value = { title: "", des: "", _id: "" }
    isAlter.value = false;//关闭修改
}
//初始化页面数据
let initialize = async () => {
    let time=0;
    setTimeout(()=>{time++},1000)
    let { data } = await gainClassify(currentPageData.value);
    classifyTotal.value = data.classifyTotal;
    tableData.value = data.classifyData;
    vanishLoading(false,time)
}
//确认
let submitForm = (formEl) => {
    if (!formEl) return
    // formEl是拿到的表单节点,这个节点的validate函数用来验证是否满足表单规则
    formEl.validate(async (valid) => {
        if (valid) {
            //如果在修改阶段
            if (isAlter.value) {
                let { data } = await alterClassify(classifyData.value);
                switch (data.code) {
                    case 0:
                        tableData.value.splice(alterIndex.value, 1, data.newData);
                        ElMessage.success('修改成功');
                        break;
                    case 1:
                        ElMessage.error('标题重复')
                        break;
                    case 2:
                        ElMessage.error('至少修改一项')
                        break;
                }
                cancel();
            } else {
                let { data } = await createClassify(classifyData.value);
                if (data.code) {
                    ElMessage.error('重复分类');
                    cancel();
                } else {
                    //创建成功总数量+1
                    classifyTotal.value += 1;
                    ElMessage.success('分类创建成功');
                    // 如果当前展示的数据小于10条,那么就把创建的数据添加到末尾
                    if (tableData.value.length < currentPageData.value.pageSize)
                        tableData.value.push(data.classify);
                    cancel();
                }
            }
        } else {
            ElMessage.error('请输入标题或描述')
            return false
        }
    })
}
// 修改分类
let openAlterLoading = (row, index) => {
    alterIndex.value = index;
    isAlter.value = true;
    openDialog();
    classifyData.value = { ...row };
}
//删除分类
let deleteClass = async (row) => {
    let { data } = await deleteClassify({ ...row, ...currentPageData.value });
    if (!data.code) {
        tableData.value = data.newData;
        classifyTotal.value = data.total;
        ElMessage.success('删除成功');
    }
}
//分页
let handleCurrentChange = async () => {
    let { data } = await classifyPage(currentPageData.value);
    if (!data.code) {
        ElMessage.success('切换成功');
        tableData.value = data.pageData;
    }
}

initialize()
</script>
<style lang="scss" scoped>
.el-dialog {
    .el-dialog__header {
        padding: 0px;
    }
}

.createClassify {
    position: relative;
    right: 0px;
    width: 100px;
    height: 30px;
    float: right;
}

.color {
    width: 20px;
    height: 20px;
}


.pagebox {
    margin-top: 20px;

    .page {
        justify-content: center;
    }
}
</style>