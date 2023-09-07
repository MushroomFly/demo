<template>
  <div>
    <LoadingBird class="bird" v-show="loading" />
    <router-view></router-view>
    <BackTop></BackTop>
  </div>
</template>
<script setup>
import { nextTick, onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router";
import LoadingBird from "@/components/Loading/Loading.vue";
import BackTop from "@/components/BackTop/BackTop.vue"
import { loadingStore } from '@/stores/loadingStore.js'
import { storeToRefs } from "pinia"
import { record } from "@/hooks/history.js"
let store = loadingStore();//仓库
const { loading, opacity } = storeToRefs(store)//仓库data数据
let { showLoading } = store;
let route = useRoute()
let content = ref(false);
let one = 0;
watch(() => [route.matched, route.fullPath], ([newmatched, newfullpath], [oldmatched, oldfullpath]) => {
  if (newmatched && oldmatched && newmatched[1] !== oldmatched[1]) {
    if (newmatched && newmatched[1]?.name == '内容' && one) {
      record(oldfullpath, document.documentElement.scrollTop);
    }
    showLoading(true, 1)
    content.value = false;
  }
  one++;
  let isHome = newfullpath.split("?")[1];
  if (newmatched[1]?.name == '首页' && (!isHome || isHome == 'currentPage=1')) {
    window.scrollTo({ top: 0, behavior: "instant" });
  } else if (newmatched[1]?.name == '首页') {
    window.scrollTo({ top: 800, behavior: "instant" });
  } else {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
})
</script>
<style  scoped >
.bird {
  opacity: v-bind(opacity);
  transition: .5s;
}


.scrollbar {
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
