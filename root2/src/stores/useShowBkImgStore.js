import { defineStore } from "pinia";
//第一个参数必须是全局唯一值
export const useShowBkImgStore = defineStore("ShowBkgImg", {
    state: () => ({ bkgImgSrc: "" }),
    actions: {
        alterShowBkImg(data) {
            //如果当前路径不是markdown文章那就把值设为""
            if (data == "")
                this.bkgImgSrc = "";
            else
            //如果当前路径是markdown文章,那么就把markdown文章的图片路径处理并赋值
                this.bkgImgSrc = "/api" + data.split("\\").join("/");
        },
    },
})