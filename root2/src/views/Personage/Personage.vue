<template>
    <div class="personage-box">
        <div class="navigationBar" ref="navBar">
            <div class="total">
                <div class="total-text">
                    <div>{{ articleTotal }}</div>
                    <div>文章</div>
                </div>
                <div class="total-text">
                    <div>{{ classifyTotal }}</div>
                    <div>分类</div>
                </div>
            </div>
            <div class="avatar-box">
                <el-avatar ref="avatarDom" class="avatar" :size="160" fit="fill"
                    :src="personalData.headPortrait ? `/api` + personalData.headPortrait : ``" />
                <div>{{ personalData.name }}</div>
                <div>{{ personalData.aphorism }}</div>
            </div>
            <div class="contactWay">
                <SvgIcon name="qq" class="contactWay-svg"></SvgIcon>
                <SvgIcon name="weixin" class="contactWay-svg"></SvgIcon>
                <SvgIcon name="email" class="contactWay-svg"></SvgIcon>
            </div>
        </div>
        <div class="statistics">
            <div class="statistics-title index">
                <SvgIcon class="svg" name="chart"></SvgIcon>文章统计图
            </div>
            <div class="statistics-chart index">
                <Chart />
            </div>
        </div>
        <div class="skill-box">
            <div class="skill-title index">
                <SvgIcon class="svg" name="skill"></SvgIcon>我的技能
            </div>
            <div class="skill">
                <div v-for="(item, index) in personalData.strongPoint" :key="item" class="skill-content index">
                    <div class="progress-bar" :style="{ 'width': item.split(':')[1], 'background-image': color[index] }">{{
                        item.split(":")[0] }}</div>
                    <div class="percentage">{{ item.split(":")[1] }}</div>
                </div>
            </div>
        </div>
        <div class="photo-box">
            <div class="photo-title index">
                <SvgIcon class="svg" name="photoAlbum"></SvgIcon>相册
            </div>
            <div class="photo-imgList">
                <div v-for="item in personalData.photo" :key="item" class="photo-img index">
                    <img :src="`/api` + item" style="width: 100%; height: 100%;border-radius: 10px;">
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { requirePersonal } from "@/require/index.js"
import { computed, onMounted, ref, onUnmounted, nextTick, reactive } from "vue";
import Chart from "@/components/Chart/Chart.vue"
import { scrollContent } from "@/hooks/scrollContent.js"
import { useListStore } from "@/stores/useListStore"
import { loadingStore } from '@/stores/loadingStore.js'
let loading = loadingStore();
let { vanishLoading } = loading;
let store = useListStore();
let { alterList } = store;
//个人资料
let personalData = reactive({});
//文章总数
let articleTotal = ref(0);
//分类总数
let classifyTotal = ref(0);
//导航栏节点
let navBar = ref("");
//头像节点
let avatarDom = ref("")
//节点数组
let articleListArray = [];
//技能颜色
let color = [
    `linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)`,
    `linear-gradient(120deg, #f6d365 0%, #fda085 100%)`,
    `linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)`,
    `linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)`
];
//头像距离顶部高度
let marginTop = computed(() => {
    let style = window.getComputedStyle(navBar.value, null)
    let paddingT = parseFloat(style.getPropertyValue('padding-top'));
    return -avatarDom.value.size / 2 + -paddingT + "px"
})
//初始化
let initialize = async () => {
    let time = 0;
    setTimeout(() => { time++ }, 1000);
    let { data } = await requirePersonal();
    for (const key in data.personalData) {
        if (key == `strongPoint`) {
            personalData[key] = data.personalData[key].split(".");
        } else {
            personalData[key] = data.personalData[key];
        }
    }
    articleTotal.value = data.articleTotal
    classifyTotal.value = data.classifyTotal
    vanishLoading(false, time);
    nextTick(() => {
        //延迟获取dom节点
        articleListArray = Array.from(document.getElementsByClassName('index'));
        alterList(articleListArray);
    })
}
onMounted(() => {
    document.addEventListener('scroll', scrollContent)
})
onUnmounted(() => {
    document.removeEventListener('scroll', scrollContent)
})
initialize()
</script>
<style  lang="scss" scoped>
.personage-box {
    text-align: center;
    background-color: white;
    border-radius: 20px;
    padding-bottom: 20px;

    .svg {
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }

    .navigationBar {
        display: flex;
        width: 100%;
        justify-content: space-around;
        padding-top: 30px;

        .total {
            display: flex;

            .total-text {
                width: fit-content;
                margin-left: 65px;
                cursor: pointer;
            }

            .total-text>:nth-of-type(1) {
                color: #42B983;
                border-bottom: 1px solid black;
                font-weight: 600;
                font-size: 20px;
            }

            .total-text>:nth-of-type(2) {
                color: #919191;
                margin-top: 5px;
                font-size: 15px;
            }
        }

        .contactWay {
            display: flex;

            .contactWay-svg {
                width: 35px;
                height: 35px;
                margin-left: 30px;
                cursor: pointer;
            }
        }

        .avatar-box {
            color: #919191;

            .avatar {
                margin-top: v-bind(marginTop);
            }

            div {
                margin-top: 20px;
            }
        }

        .avatar-box>div:nth-of-type(1) {
            font-size: 20px;
            font-weight: 800;
            color: #666F7C;
        }

        .avatar-box>div:nth-of-type(2) {
            margin-top: 50px;
        }
    }

    .statistics {
        margin-top: 120px;
        width: 100%;

        .statistics-chart {
            margin-top: 100px;
        }

        .statistics-title {
            font-size: 30px;
            color: #666F7C;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .skill-box {
        margin-top: 60px;

        .skill-title {
            font-size: 30px;
            color: #666F7C;
            font-weight: 800;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .skill {
            flex-direction: row;
            margin: 50px auto;
            display: flex;
            flex-wrap: wrap;
            padding: 20px;
            justify-content: space-between;
            width: 75%;

            .skill-content {
                margin-top: 60px;
                background-color: #ccc;
                width: 400px;
                height: 30px;
                border-radius: 30px;
                line-height: 30px;
                position: relative;

                .progress-bar {
                    border-radius: 30px;
                    text-align: left;
                    text-indent: 1em;
                }

                .percentage {
                    position: absolute;
                    right: 15px;
                    top: 0px;
                }
            }
        }
    }

    .photo-box {
        margin-top: 60px;

        .photo-title {
            font-size: 30px;
            color: #666F7C;
            font-weight: 800;
            justify-content: center;
            align-items: center;
            display: flex;
        }

        .photo-imgList {
            padding: 10px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            width: 90%;
            margin: 60px auto;


            .photo-img {
                display: block;
                height: 200px;
                width: 330px;
                margin-left: 30px;
                margin-top: 30px;
            }
        }

    }
}

.index {
    opacity: 0;
    transition: .6s;
    transform: scale(0.6);
}</style>