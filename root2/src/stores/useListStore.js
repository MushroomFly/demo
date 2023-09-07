import { defineStore } from "pinia";
//第一个参数必须是全局唯一值
export const useListStore = defineStore("list", {
    state: () => ({ list: "" }),
    actions: {
        alterList(data) {
            this.list=data;
        },
    },
})