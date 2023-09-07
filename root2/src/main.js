import { createApp } from 'vue'
import router from "./router"
import App from './App.vue'
//全局组件svgicon
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
//引入图片懒加载插件
import Lazyload from "vue3-lazyload";
//pinia仓库
import { createPinia } from 'pinia'
// 预览组件以及样式
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// VuePress主题以及样式（这里也可以选择github主题）
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import 'virtual:svg-icons-register'
// Prism
import Prism from 'prismjs';
// highlightjs
import hljs from 'highlight.js';
// 代码高亮
import 'prismjs/components/prism-json';
// 选择使用主题
VMdPreview.use(vuepressTheme, {
    Prism,
});
VMdEditor.use(githubTheme, {
    Hljs: hljs,
});
const app = createApp(App)
const pinia = createPinia()
app.component(SvgIcon);
app.use(router).use(VMdPreview).use(pinia).use(VMdEditor).use(Lazyload, {
    loading: "/default.png",//可以指定加载中的图像
    error: "/err.png",//可以指定加载失败的图像
}).mount('#app')
