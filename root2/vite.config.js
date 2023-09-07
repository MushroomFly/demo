import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// import path from 'path';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import fs from 'fs';
const pathResolve = (pathStr) => {
  return resolve(__dirname, pathStr)
}
export default defineConfig(({ mode, command }) => {
  const optimizeDepsElementPlusIncludes = ["element-plus/es", '@vuemap/vue-amap/es']
  fs.readdirSync("node_modules/element-plus/es/components").map((dirname) => {
    fs.access(
      `node_modules/element-plus/es/components/${dirname}/style/css.mjs`,
      (err) => {
        if (!err) {
          optimizeDepsElementPlusIncludes.push(
            `element-plus/es/components/${dirname}/style/css`
          )
        }
      }
    )
  })
  return {
    base: "./",
    optimizeDeps: {
      include: optimizeDepsElementPlusIncludes,
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的svg图标文件夹，即需要识别的svg都应该放在这个文件夹下
        iconDirs: [pathResolve('./src/assets/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    resolve: {
      alias: {
        //__dirname 可以用来动态获取当前文件所属目录的绝对路径
        //resolve解析路由,返回一个以相对于当前的工作目录的绝对路径。
        '@': resolve(__dirname, 'src'),//@:当前文件绝对路径/src
      }
    },
    server: {
      host: "0.0.0.0",
      proxy: {
        '/api': {
          target: 'http://localhost:8085',//这里填入你要请求的接口的前缀
          changeOrigin: true,//虚拟的站点需要更管origin
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/musicApi': {
          target: "https://api.moeyao.cn/meting",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/musicApi/, '')
        }
      }
    },
  }
})
