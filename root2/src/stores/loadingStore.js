import { defineStore } from "pinia";
//第一个参数必须是全局唯一值
export const loadingStore = defineStore("loading", {
    state: () => ({ loading: true, opacity: 1, time1: 0, time2: 0 }),
    actions: {
        vanishLoading(boolean, time) {
            //加载时间大于一秒透明度变为0,0.3秒后加载动画隐藏,反之小于一秒,则1秒后透明度为0，0.3秒后加载动画隐藏
            if (time < 1) {
                this.time1 = setTimeout(() => {
                    this.opacity = 0;
                    this.time2 = setTimeout(() => {
                        this.loading = boolean;
                    }, 300)
                }, 1000)
            } else {
                this.opacity = 0;
                this.time1 = setTimeout(() => {
                    this.loading = boolean;
                }, 300)
            }
        },
        showLoading(boolean, opacity) {
            //每次开启加载动画前,先关闭上一次动画的定时器
            clearTimeout(this.time1);
            clearTimeout(this.time2);
            this.loading = boolean;
            this.opacity = opacity;
        }
    },
})