<template>
    <div>
        <el-button type="primary" @click="openDialog">创建个人资料</el-button>
        <div>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="age" label="年龄" />
                <el-table-column prop="email" label="邮箱" />
                <el-table-column prop="contactWay" label="联系方式" />
                <el-table-column label="头像">
                    <template #default="{ row }">
                        <el-image style="width: 100px; height: 100px" :src="`/api` + row.headPortrait" fit="cover" />
                    </template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template #default="{ row }">
                        <div>{{ formatTime(row.date) }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="特长">
                    <template #default="{ row }">
                        <el-button size="small" @click="lookStrongPoint(row)">查看特长</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="格言">
                    <template #default="{ row }">
                        <el-button size="small" @click="lookAphorism(row)">查看格言</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="照片">
                    <template #default="{ row }">
                        <el-button size="small" @click="alterImage(row, $index)">修改图片</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="是否显示">
                    <template #default="{ row }">
                        <el-switch v-model="row.show" class="mt-2" style="margin-left: 24px" inline-prompt />
                    </template>
                </el-table-column>
                <el-table-column label="操作" :index="alterIndex">
                    <template #default="{ row, $index }">
                        <el-button size="small" @click="openAlterLoading(row, $index)">修改</el-button>
                        <el-button size="small" type="danger" @click="deletePersonalFn(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-model="dialogVisible" :title="isAlter ? `修改个人资料` : `创建个人资料`" width="40%" :before-close="closeDialog">
            <el-form label-width="100px" :model="personalData" style="max-width: 460px" :rules="rules" ref="formRef">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="personalData.name" />
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="personalData.age" />
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload class="upload-demo upload" action="/api/personalData/placePersonalImg" :auto-upload="false"
                        v-model:file-list="fileList" ref="uploadRef" list-type="picture" :limit="1"
                        :on-success="uploadSuccess">
                        <el-button type="primary">上传</el-button>
                        <template #tip>
                            <div class="el-upload__tip">
                                注:jpg/png图片大小不超过500kb
                            </div>
                            <div style="display: flex;justify-content: space-around;width: 65%;" v-if="isAlter">
                                当前分类的图片信息:
                                <el-image style="width: 100px; height: 100px" :src="`/api` + personalData.headPortrait"
                                    fit="cover" :preview-src-list="[`/api` + personalData.headPortrait]" />
                            </div>
                            <div>
                                上传分类的图片信息:
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="是否展示">
                    <el-switch v-model="personalData.show" />
                </el-form-item>
                <el-form-item label="优点" prop="strongPoint">
                    <el-input v-model="personalData.strongPoint" type="textarea" />
                </el-form-item>
                <el-form-item label="格言" prop="aphorism">
                    <el-input v-model="personalData.aphorism" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="personalData.email" />
                </el-form-item>
                <el-form-item label="联系方式" prop="contactWay">
                    <el-input v-model="personalData.contactWay" />
                </el-form-item>
                <el-form-item>
                    <el-button @click="closeDialog">关闭</el-button>
                    <el-button type="primary" @click="submit(formRef)">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog v-model="pohotoDialong" width="40%" :before-close="closePhotoDialog">
            <el-upload v-model:file-list="PhotofileList" :auto-upload="false" ref="PhotouploadRef" list-type="picture"
                :multiple="true">
                <el-button type="primary">增加图片</el-button>
                <template #tip>
                    <el-button style="float: right;" type="primary" @click="addPhotoFn">提交</el-button>
                </template>
            </el-upload>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
                <div v-for="(item, index) in PhotoData.photo" :key="item" style="position: relative;">
                    <SvgIcon name="delete" class="delete-svg" @click="deletePhotoFn(item)"></SvgIcon>
                    <el-image style="width: 100px; height: 100px" :src="`/api` + item" :preview-src-list="[...photoListSrc]"
                        :initial-index="index" fit="contain" />
                </div>
            </div>
        </el-dialog>
        <el-drawer v-model="drawer" :title="drawerTtile" size="30%">
            <span>{{ drawerContent }}</span>
        </el-drawer>
    </div>
</template>
<script setup>
import { computed, ref } from "vue";
import { createPersonal, gainPersonal, alterPersonal, deletePersonal, placePersonalPhoto, addPhoto, deletePhoto } from "@/require/index.js"
import { formatTime } from "@/hooks/formatTime.js"
import { loadingStore } from '@/stores/loadingStore.js'
let loading = loadingStore();
let { vanishLoading } = loading;
//表单数据
let personalData = ref({ name: "", age: "", headPortrait: "", show: false, strongPoint: "", aphorism: "", email: "", contactWay: "" });
//查看是否为图片的正则
let strRegex = /(jpg|png|gif|bmp|jpeg)$/;
//表格数据
let tableData = ref([]);
// 表单验证规则
let rules = {
    name: [{ required: true, message: '请输入名称' }],
    age: [{ required: true, message: "请输入年龄" }],
    strongPoint: [{ required: true, message: "请输入特长" }],
    aphorism: [{ required: true, message: "请输入格言" }],
    email: [{ required: true, message: "请输入电子邮箱" }],
    contactWay: [{ required: true, message: "请输入联系方式" }]
}
//抽屉依赖值
let drawer = ref(false)
//抽屉标题
let drawerTtile = ref("");
//抽屉内容
let drawerContent = ref("")
//上传文件数量
let fileList = ref([]);
//控制对话框
let dialogVisible = ref(false)
//是否修改
let isAlter = ref(false);
//获取表单节点
let formRef = ref();
//获取上传节点
let uploadRef = ref();
//获取图片上传节点
let PhotouploadRef = ref(null);
//要修改的个人资料下标
let alterIndex = ref(0);
//控制照片对话框
let pohotoDialong = ref(false);
//照片上传列表
let PhotofileList = ref([]);
//存储照片信息
let PhotoData = ref({});
//照片数组地址
let photoListSrc = computed(() => {
    let src = [];
    PhotoData.value.photo.forEach(item => {
        src.push(`/api` + item);
    })
    return src
})

//初始化
let initialize = async () => {
    let time=0;
    setTimeout(()=>{time++},1000);
    let { data } = await gainPersonal();
    if (data) tableData.value = data.data;
    vanishLoading(false,time);
}
//关闭对话框
let closeDialog = () => {
    dialogVisible.value = false
    formRef.value.resetFields()
    personalData.value = { name: "", age: "", headPortrait: "", show: false, strongPoint: "", aphorism: "", email: "", contactWay: "" };
    uploadRef.value.clearFiles()
    isAlter.value = false
}
//提交
let submit = (formEl) => {
    if (!formEl) return
    // formEl是拿到的表单节点,这个节点的validate函数用来验证是否满足表单规则
    formEl.validate(async (valid) => {
        if (valid) {
            //如果没有上传并且在修改阶段
            if (!fileList.value?.length && isAlter.value) {
                let { data } = await alterPersonal(personalData.value);
                alterCode(data);
                closeDialog()
                //如果没有上传并且不在修改阶段
            } else if (!fileList.value?.length && !isAlter.value) {
                return ElMessage.error('必须上传头像')
            } else {
                uploadRef.value.submit()
            }
        } else {
            return ElMessage.error('请输入信息')
        }
    })
}
//打开对话框
let openDialog = () => {
    dialogVisible.value = true;
}
//成功上传触发的钩子
let uploadSuccess = async (value) => {
    if (!value.code) {
        ElMessage.success('提交成功')
        if (isAlter.value) {
            let { data } = await alterPersonal({ ...personalData.value, headPortrait: value.url });
            alterCode(data);
        } else {
            let { data } = await createPersonal({ ...personalData.value, headPortrait: value.url });
            if (data.code) {
                ElMessage.error('存在该个人资料')
            } else {
                ElMessage.success('创建成功')
                tableData.value.push(data.newdata);
            }
            closeDialog();
        }
    }
}
//修改统一code
let alterCode = (data) => {
    if (data.code == 2) {
        ElMessage.error('至少修改一项')
    } else if (data.code == 1) {
        ElMessage.error('标题重复')
    } else {
        tableData.value.splice(alterIndex.value, 1, data.newdata);
        ElMessage.success('修改成功')
    }
    closeDialog();
}
// 查看特长
let lookStrongPoint = (row) => {
    drawerContent.value = row.strongPoint;
    drawer.value = true;
    drawerTtile.value = "查看特长";
}
//查看格言
let lookAphorism = (row) => {
    drawerContent.value = row.aphorism;
    drawer.value = true;
    drawerTtile.value = "查看格言";
}
//打开修改对话框
let openAlterLoading = (row, index) => {
    alterIndex.value = index;
    isAlter.value = true;
    personalData.value = row;
    openDialog();
}
//删除个人资料
let deletePersonalFn = async (row) => {
    let { data } = await deletePersonal({ name: row.name, headPortrait: row.headPortrait, photoList: row.photo });
    if (!data.code) {
        ElMessage.success('删除成功');
        tableData.value = data.newdata;
    }
}
//修改图片
let alterImage = async (row, index) => {
    pohotoDialong.value = true;
    PhotoData.value = row;
    alterIndex.value = index;
}
//增加图片
let addPhotoFn = async () => {
    if (!PhotofileList.value[0]) {
        ElMessage.error("不能为空")
        return;
    }
    for (let i = 0; i < PhotofileList.value.length; i++) {
        if (!strRegex.test(PhotofileList.value[i].name.split(".")[1].toLowerCase())) {
            ElMessage.error("只能上传图片")
            return
        }
    }
    let formData = new FormData()
    PhotofileList.value.forEach((file) => {
        formData.append('file', file.raw)
    })
    placePersonalPhoto(formData).then(async ({ data }) => {
        if (!data.code) {
            addPhoto({ photoList: data.arrPhoto, PhotoData: PhotoData.value }).then(({ data }) => {
                if (!data.code) {
                    PhotoData.value.photo = data.newdata.photo
                    PhotouploadRef.value.clearFiles();
                    ElMessage.success("上传成功")
                }
            })
        } else {
            ElMessage.error("上传失败")
        }
    });
}
//删除图片
let deletePhotoFn = async (item) => {
    let { data } = await deletePhoto({ url: item, _id: PhotoData.value._id })
    if (!data.code) {
        ElMessage.success("删除成功");
        PhotoData.value.photo = data.newdata.photo
    }
}
//关闭修改图片对话框
let closePhotoDialog = () => {
    pohotoDialong.value = false;
    PhotouploadRef.value.clearFiles();
}
initialize()
</script>
<style lang="scss" scoped>
.upload {
    display: flex;
    flex-wrap: wrap;

    .el-upload__tip {
        margin-left: 20px;
    }
}

.delete-svg {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 23px;
    right: 3px;
    z-index: 9;
}
</style>