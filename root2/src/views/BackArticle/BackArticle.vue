<template>
    <div>
        <div class="screen">
            <h2>筛选</h2>
            <div class="tag-box">
                <div @click="filtrate(`all`)" class="tag">全部</div>
                <div v-for="(item, index) in classifyInfo" :key="item._id" :style="{
                    'color': tagIndex == index ? `white` : item.color,
                    'borderColor': tagIndex == index ? `orangered` : item.color,
                    'background': tagIndex == index ? `orangered` : ``
                }" @click="filtrate(item, index)" ref="tag" class="tag">{{ item.title }}</div>
            </div>
        </div>
        <el-button type="primary" @click="openDialog" class="createArticle" v-if="!isScreen">创建文章</el-button>
        <div>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="des" label="描述" />
                <el-table-column label="所属分类">
                    <template #default="{ row }">
                        <div>{{ row.key?.title }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template #default="{ row }">
                        <div>{{ formatTime(row.date) }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="是否推荐">
                    <template #default="{ row }">
                        <el-switch v-model="row.recommend" class="mt-2" style="margin-left: 24px" inline-prompt disabled />
                    </template>
                </el-table-column>
                <el-table-column label="封面">
                    <template #default="{ row }">
                        <el-image style="width: 100px; height: 100px" :src="`/api` + row.img" fit="cover" />
                    </template>
                </el-table-column>
                <el-table-column label="md文档">
                    <template #default="{ row }">
                        <el-button size="small" @click="lookMarkDownFn(row)">查看markdown文档</el-button>
                        <el-button size="small" @click="openAlterMarkDown(row)">修改markdown文档</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" :index="alterIndex">
                    <template #default="{ row, $index }">
                        <el-button size="small" @click="openAlterLoading(row, $index)">修改</el-button>
                        <el-button size="small" type="danger" @click="deleteArticleFn(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-model="dialogVisible" :title="articleTitle" width="40%" :before-close="closeDialog">
            <template #footer>
                <!-- 表单 -->
                <el-form label-width="100px" :model="articleData" style="max-width: 460px" :rules="rules" ref="formRef">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="articleData.title" />
                    </el-form-item>
                    <el-form-item label="描述" prop="des">
                        <el-input v-model="articleData.des" type="textarea" />
                    </el-form-item>
                    <el-form-item label="分类" prop="key">
                        <el-select v-model="articleData.key" placeholder="请选择分类">
                            <el-option :label="item.title" :value="item._id" v-for="item in classifyInfo" :key="item._id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否推荐" prop="title">
                        <el-switch v-model="articleData.recommend" />
                    </el-form-item>
                    <el-form-item label="文件与图片">
                        <el-upload class="upload-demo upload" :auto-upload="false" v-model:file-list="fileList"
                            ref="uploadRef" list-type="picture" :limit="2" :multiple="true">
                            <el-button type="primary">上传</el-button>
                            <template #tip>
                                <div class="el-upload__tip">
                                    注:最多两个文件,一个图片,一个markdown文档
                                </div>
                                <div style="display: flex;justify-content: space-around;width: 65%;" v-if="isAlterArticle">
                                    当前分类的图片信息:
                                    <el-image style="width: 100px; height: 100px" :src="`/api` + articleData.img"
                                        fit="cover" :preview-src-list="[`/api` + articleData.img]" />
                                </div>
                                <div>
                                    上传分类的图片与文档信息:
                                </div>
                            </template>
                        </el-upload>
                    </el-form-item>
                    <!-- 提交取消按钮 -->
                    <el-form-item>
                        <el-button type="primary" @click="submitArticle(formRef)">提交</el-button>
                        <el-button @click="closeDialog">取消</el-button>
                    </el-form-item>
                </el-form>
            </template>
        </el-dialog>
        <el-drawer v-model="drawer" :title="drawerTtile" size="60%" :before-close="closeDrawer">
            <div v-if="isAlterMarkDown">
                <el-button type="primary" @click="alterMarkDown">确认</el-button>
                <el-button @click="closeDrawer">取消</el-button>
            </div>
            <!-- 修改md文档 -->
            <v-md-editor v-model="alterMdData" height="400px" v-if="isAlterMarkDown"></v-md-editor>
            <!-- 展示md文档 -->
            <v-md-preview :text="showMarkDown" v-else></v-md-preview>
        </el-drawer>
        <div class="demo-pagination-block pagebox">
            <el-pagination v-model:current-page="currentPageData.currentPage" v-model:page-size="currentPageData.pageSize"
                :page-sizes="[10, 15, 20, 25]" :background="true" layout="sizes, prev, pager, next" :total="articleTotal"
                class="page" @size-change="page" @current-change="page" />
        </div>
    </div>
</template>
<script setup>
import { reactive, ref } from "vue"
import { articleImgMd, createArticle, articleClassify, gainArticle, lookMarkDown, alterArticle, deleteArticle, rewriteMarkDown, screenArticle } from "@/require/index.js"
import { formatTime } from "@/hooks/formatTime.js"
import { loadingStore } from '@/stores/loadingStore.js'
let loading = loadingStore();
let { vanishLoading } = loading;
//对话框依赖值
let dialogVisible = ref(false);
//获取表单节点
let formRef = ref(null);
//获取上传节点
let uploadRef = ref(null);
//上传列表
let fileList = ref([]);
//是否在筛选中
let isScreen = ref(false);
//存储筛选key
let screenKey = ref("")
//获取tag节点
let tag = ref([]);
//上一个筛选的tag下标
let tagIndex = ref(null);
//分类信息
let classifyInfo = ref([]);
//全部文章
let articleAll = reactive([]);
//表单数据
let articleData = ref({ title: "", des: "", img: "", _id: "", key: "", mdArticle: "", recommend: false });
//表格数据
let tableData = reactive([]);
// articleAll.slice((currentPageData.currentPage - 1) * currentPageData.pageSize, currentPageData.pageSize * currentPageData.currentPage)
//当前的页面以及页面展示数量
let currentPageData = reactive({ pageSize: 10, currentPage: 1 });
//文章总数量
let articleTotal = ref(0);
//要修改的文章下标
let alterIndex = ref(0);
//是否修改文章
let isAlterArticle = ref(false);
//抽屉依赖值
let drawer = ref(false);
//对话框标题
let articleTitle = ref(isAlterArticle.value ? "修改文章" : "创建文章");
//抽屉标题
let drawerTtile = ref("");
//存储要展示的md文档的数据
let showMarkDown = ref("");
//存储要修改的md文档数据
let alterMdData = ref("");
//是否修改markdown文档
let isAlterMarkDown = ref(false);
// 表单验证规则
let rules = {
    title: [{ required: true, message: '请输入标题' }],
    des: [{ required: true, message: "请输入描述" }],
    key: [{ required: true, message: "请选择分类" }]
}
//查看是否为图片的正则
let strRegex = /(jpg|png|gif|bmp|jpeg)$/;



//打开对话框
let openDialog = async () => {
    dialogVisible.value = true;
}
//关闭对话框
let closeDialog = () => {
    dialogVisible.value = false;
    formRef.value.resetFields()
    articleData.value = { title: "", des: "", img: "", _id: "", key: "", mdArticle: false };
    uploadRef.value.clearFiles()
    isAlterArticle.value = false
}
//提交
let submitArticle = (formEl) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            //如果没有上传文件并且在修改阶段
            if (!fileList.value?.length && isAlterArticle.value) {
                let { data } = await alterArticle(articleData.value);
                alterCode(data)
                //如果没有上传文件或者上传文件<2并且在创建阶段
            } else if (fileList.value?.length < 2 && !isAlterArticle.value) {
                ElMessage.error('必须上传图片与markdown文档')
                return closeDialog()
                //如果上传文件
            } else {
                uploadingFile();
            }
        } else {
            return ElMessage.error('请输入标题,描述以及选择分类')
        }
    })
}
//创建阶段上传图片与md文档,先上传文件,再创建文章
let uploadingFile = async () => {
    //第一份文件的后缀
    let oneSuffix = fileList.value[0].name.split(".")[1].toLowerCase();
    //第二份文件的后缀
    let twoSuffix = fileList.value[1]?.name.split(".")[1].toLowerCase();
    //如果上传的文件两份都是图片,或两份都是md则弹出报错弹窗
    if ((strRegex.test(oneSuffix) && strRegex.test(twoSuffix)) || (oneSuffix == twoSuffix)) {
        closeDialog();
        return ElMessage.error(`不能上传两份一样的文件:${oneSuffix},${twoSuffix}`);
    }

    //为了一次性提交完,需要创建一个表单对象,然后将要上传的文件的信息放入表单对象,随后自己写接口请求数据
    let formData = new FormData()
    fileList.value.forEach((file) => {
        formData.append('file', file.raw)
    })
    let { data } = await articleImgMd(formData);
    let articleSrc = data;
    if (data.code) {
        ElMessage.error('未知错误');
    } else {
        ElMessage.success('上传成功');
        //判断是否在修改阶段
        if (isAlterArticle.value) {
            let { data } = await alterArticle(
                {
                    ...articleData.value,
                    img: articleSrc.img ? articleSrc.img : articleData.value.img,
                    mdArticle: articleSrc.mdArticle ? articleSrc.mdArticle : articleData.value.mdArticle,
                }
            );
            alterCode(data)
        } else {
            let { data } = await createArticle({ ...articleData.value, articleSrc });
            if (data.code) {
                ElMessage.error('已存在该文章');
            } else {
                ElMessage.success("创建成功");
                articleTotal.value += 1;
                articleAll.unshift(data.result);
                tableData.length = 0;
                tableData.push(...articleAll.slice((currentPageData.currentPage - 1) * currentPageData.pageSize, currentPageData.pageSize * currentPageData.currentPage))
            }
            closeDialog();
        }
    }
}
//初始化
let initialize = async () => {
    let time = 0;
    setTimeout(() => { time++ }, 1000)
    let classifyData = await articleClassify();
    if (classifyData.data.code) {
        return ElMessage.error('未创建分类,请先创建分类');
    } else {
        classifyInfo.value = classifyData.data.classifyInfo;
        let { data } = await gainArticle()
        articleAll.push(...data.articleInfo)
        articleTotal.value = data.articleTotal;
        tableData.push(...articleAll.slice((currentPageData.currentPage - 1) * currentPageData.pageSize, currentPageData.pageSize * currentPageData.currentPage))
        setTimeout(() => {
            loading.value = false
        }, 500)
    }
    vanishLoading(false, time);
}
//修改文章
let openAlterLoading = (row, index) => {
    isAlterArticle.value = true;
    alterIndex.value = index;
    let obj = {}
    //方便与后端article转换成字符串比较，以及select选项
    for (let item in row) {
        if (item == "key" && row.key) {
            obj[item] = row[item]._id;
        } else {
            obj[item] = row[item]
        }
    }
    articleData.value = obj;
    openDialog();
}
//修改统一code
let alterCode = (data) => {
    switch (data.code) {
        case 0:
            //如果修改后的分类与当前筛选中的分类一样,那么就替换
            if (data.newData.key._id == screenKey.value && isScreen.value) {
                tableData.splice(alterIndex.value, 1, data.newData);
            }
            //如果不在筛选中
            else if (!isScreen.value) {
                tableData.splice(alterIndex.value, 1, data.newData);
                //如果在筛选中,并且修改后的分类与筛选中不一样,那么就删除
            } else {
                tableData.splice(alterIndex.value, 1,);
            }
            ElMessage.success('修改成功')
            break;
        case 1:
            ElMessage.error('标题重复')
            break;
        case 2:
            ElMessage.error('至少修改一项')
            break;
    }
    closeDialog();
}
//查看md文档
let lookMarkDownFn = async (row) => {
    requireMarkDown(row);
}
//打开修改md文档界面
let openAlterMarkDown = async (row) => {
    isAlterMarkDown.value = true;
    requireMarkDown(row)
}
//统一获取markdown文档数据
let requireMarkDown = async (row) => {
    let { data } = await lookMarkDown({ markDownTitle: row.title });
    if (data.code) {
        return ElMessage.error("路径错误,当前路径:" + data.errorInfo.path)
    } else {
        if (isAlterMarkDown.value) {
            alterMdData.value = data.markDownInfo;
        } else {
            showMarkDown.value = data.markDownInfo;
        }
        drawerTtile.value = row.title;
        drawer.value = true;
    }
}
//修改markdown页面
let alterMarkDown = async () => {
    let { data } = await rewriteMarkDown({ title: drawerTtile.value, content: alterMdData.value });
    if (data.code) {
        return ElMessage.error("路径错误,当前路径:" + data.err)
    } else {
        ElMessage.success("修改成功")
    }
    closeDrawer();
}
//关闭抽屉
let closeDrawer = () => {
    isAlterMarkDown.value = false;
    drawer.value = false
}
//删除文章
let deleteArticleFn = async (row) => {
    let { data } = await deleteArticle({ ...row, ...currentPageData })
    if (!data.code) {
        ElMessage.success('删除成功');
        articleAll.length = 0;
        articleAll.push(...data.newData);
        articleTotal.value = data.articleTotal;
        tableData.length = 0;
        tableData.push(...articleAll.slice((currentPageData.currentPage - 1) * currentPageData.pageSize, currentPageData.pageSize * currentPageData.currentPage))
    }
}
//筛选
let filtrate = async (item, index) => {
    //如果点击筛选外的tag,那么就记录他的下标
    if (item !== "all") {
        tagIndex.value = index;
    }

    //只要是点了筛选标签,那都从第一页开始筛选
    currentPageData.currentPage = 1;
    if (item == "all") {
        //当点击全部,取消筛选状态
        isScreen.value = false
        tagIndex.value = null;
        tableData.length = 0;
        articleAll.length = 0;
        return initialize();
    }
    isScreen.value = true;
    screenKey.value = item._id;
    let { data } = await screenArticle({ _id: item._id, ...currentPageData })
    if (!data.code) {
        ElMessage.success('筛选成功');
        tableData.length = 0;
        articleAll.length = 0;
        articleAll.push(...data.articleInfo);
        tableData.push(...articleAll.slice((currentPageData.currentPage - 1) * currentPageData.pageSize, currentPageData.pageSize * currentPageData.currentPage))
        articleTotal.value = data.articleTotal;
    }
}
//分页
let page = () => {
    tableData.length = 0;
    tableData.push(...articleAll.slice((currentPageData.currentPage - 1) * currentPageData.pageSize, currentPageData.pageSize * currentPageData.currentPage))
}
initialize();
</script>
<style lang="scss" scoped>
@import "./BackArticle.scss";
</style>