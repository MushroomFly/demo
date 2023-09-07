<template>
    <div>
        <div class="icons" @click="handleScrollTop">
            <!-- 需要显示的icon图标 -->
            <img src="@/assets/icon/feiji/feiji.png" alt="" class="icon">
        </div>
    </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from "vue"
let scrollTop = ref('') // 距顶部距离
let visiable = ref("-50px") // 是否显示组件
let done = false // 是否停止帧函数
let timer = 0;//节流
onMounted(() => {
    //监听滚动事件
    window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
    //删除滚动事件
    window.removeEventListener('scroll', handleScroll)
})
// 检测距离
let handleScroll = () => {
    //0.5秒触发一次
    if (timer == 0) {
        timer = setTimeout(() => {
            scrollTop.value =
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop
                // 看当前页面位置是否大于500，如果大于就显示回到顶部组件,不大于就隐藏
            scrollTop.value > 500 ? (visiable.value = "20px") : (visiable.value = "-50px")
            timer = 0;
        }, 500)
    }
}
// 返回顶部
let handleScrollTop = () => {
    window.requestAnimationFrame(step)
}
// 动画帧函数
function step() {
    scrollTop.value <= 0 ? (done = true) : (done = false)
    window.scrollTo({
        top: (scrollTop.value -= 20)
    })
    if (!done) {
        window.requestAnimationFrame(step)
    }
}
</script>
<style scoped>
.icons {
    position: fixed;
    bottom: 20px;
    width: 2rem;
    z-index: 9999;
    height: 2rem;
    padding: 0.5rem;
    box-shadow: 0px 3px 3px rgb(133, 133, 133);
    background-image: linear-gradient(to top, #fad0c4 0%, #fad0c4 1%, #ffd1ff 100%);
    border-radius: 50%;
    cursor: pointer;
    right: v-bind(visiable);
    transition: .6s;
    animation: zi 1s;
    animation-timing-function: linear;
    animation-direction: alternate;
    animation-iteration-count: infinite;
}


@keyframes zi {
    0% {
        background-image: linear-gradient(to top, #fad0c4 0%, #fad0c4 1%, #ffd1ff 100%);
    }

    10% {
        background-image: linear-gradient(to top, #FACBBE 0%, #FACCC0 1%, #FFCCFF 100%);
    }

    20% {
        background-image: linear-gradient(to top, #FAC5B8 0%, #FAC7BC 1%, #FEC6FF 100%);
    }

    30% {
        background-image: linear-gradient(to top, #FABFB1 0%, #FAC3B5 1%, #FDC1FF 100%);
    }

    40% {
        background-image: linear-gradient(to top, #FAB8AA 0%, #FABDB0 1%, #FCBAFF 100%);
    }

    50% {
        background-image: linear-gradient(to top, #FAB4A4 0%, #FABAA9 1%, #FBB3FF 100%);
    }

    60% {
        background-image: linear-gradient(to top, #FAAF9D 0%, #FAB4A2 1%, #F9ABFF 100%);
    }

    70% {
        background-image: linear-gradient(to top, #FAAB98 0%, #FAB29C 1%, #F8A5FF 100%);
    }

    80% {
        background-image: linear-gradient(to top, #FAA791 0%, #FAAD97 1%, #F8A0FF 100%);
    }

    90% {
        background-image: linear-gradient(to top, #FAA18A 0%, #FAA891 1%, #F599FF 100%);
    }

    100% {
        background-image: linear-gradient(to top, #FA9C83 0%, #FAA289 1%, #F492FF 100%);
    }
}

.icon {
    position: absolute;
    left: 8px;
    top: 8px;
    width: 60%;
    height: 60%;
}
</style>