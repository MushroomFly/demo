<template>
  <div class="homeBox-top-bkg">
    <Leaf></Leaf>
    <div class="showTitleBox">
      <div class="title">{{ showName }}</div>
      <div class="typewriter">{{ text }}</div>
    </div>
    <div class="showTimeText">{{ timeText }}</div>
  </div>
</template>
<script setup>
import { useShowBkImgStore } from '@/stores/useShowBkImgStore.js'
import Leaf from "@/components/Leaf/Leaf.vue"
import { storeToRefs } from "pinia"
import { useRoute } from "vue-router"
import { computed, ref, watch } from "vue";
let text = ref("");//页面展示的文字
let timeText = ref("")//页面展示时间
const route = useRoute()
const textString =
  "在苦涩的悲伤中，我诅咒我的星辰.是它让我的爱恋如此崇高，而我却如此低贱.I curse my stars in bitter grief and woe. that made my love so high and me so low."; //需要显示在页面上的文本
let index = 0; //下标
let timer = 0; //定时器序号
let timer2 = 0;
let deleteIndex = -1; // 删除下标,从-1开始的原因是,下标0的字符串也要删除
let symbol = [".", "。"]; //句号,以句号作为分界线来删除与添加
let store = useShowBkImgStore();//仓库
const { bkgImgSrc } = storeToRefs(store)//仓库data数据


//展示名
let showName = computed(() => {
  //如果params.id里面有值,说明是动态路由,就把动态路由的名字传过去做展示标题,没有就是静态路由,把别名传过去即可
  if (route.params.id)
    return route.params.id
  else
    return route.name === "首页" ? "飞翔的蘑菇" : route.name
})
//除首页外展示的高度
let boxHight = computed(() => showName.value == "飞翔的蘑菇" ? "961px" : "403px");
//除首页外背景图的高度
let imgWidth = computed(() => showName.value == "飞翔的蘑菇" ? "100% 100%" : "100% auto");
//除文章外的背景图
let bkgImg = computed(() => bkgImgSrc.value ? `url(${bkgImgSrc.value})` : "url(/preview.png)");


// 打字机效果
let textFn = () => {
  if (!timer) {
    timer = setInterval(() => {
      // 当遍历到句号或末尾并且删除下标为0时,开始对删除下标赋值
      if ((symbol.includes(textString[index]) || index == textString.length) && deleteIndex == -1) {
        deleteIndex = text.value.length - 1;
        index = index === textString.length ? 0 : index + 1;// 判断是否达到末尾,如果达到末尾就从0开始循环
      }
      if (deleteIndex >= 0) {// 当删除下标有值时,说明当前下标index到达了逗号或末尾,这时需要开始删除
        text.value = text.value.slice(0, deleteIndex);
        deleteIndex--;
      } else {// 没有达到逗号或末尾时,给font字符串赋值再赋值给text字符串,并让下标+1
        text.value += textString[index];
        index++;
      }
    }, 500);
  }
};
//页面展示时间
let showTimeText = () => {
  if(!timer2){
    timer2 = setInterval(() => {
    var date = new Date();
    var hours = date.getHours();//小时
    var minute =parseInt(date.getMinutes()/10)?date.getMinutes():'0'+date.getMinutes() ;//分
    timeText.value = hours + ":" + minute;
  }, 1000)
  }
}
//监听route
watch(route, () => {
  //如果当前路由是/article,那么开启定时器
  if (route.path == "/article")
    return textFn()
  //如果当前路由不是/article那么就关闭定时器,并且让页面展示文字重回空,并且下标也为0
  else {
    clearInterval(timer)
    text.value = "";
    index = 0;
    deleteIndex = -1;
    timer = 0;
  }
})
//如果当前路由是首页
if (route.path == "/article") {
  textFn();
}
showTimeText()
</script>
<style lang="scss" scoped>
@import "./Show.scss";
.homeBox-top-bkg {
  position: relative;
  width: 100%;
  height: v-bind(boxHight);
  background: v-bind(bkgImg) no-repeat center center;
  background-size: v-bind(imgWidth);
  top: 0px;

  .showTimeText {
    position: absolute;
    right: 30px;
    top: 130px;
    font-size: 3em;
    color: #E3D6C7;
  }
}
</style>