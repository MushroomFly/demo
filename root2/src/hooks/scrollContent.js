import { useListStore } from "@/stores/useListStore"
import { storeToRefs } from "pinia"
let store = useListStore()
const { list } = storeToRefs(store)//仓库data数据
let timer = 0;


//是否达到窗口高度
let isElemVisible = (el) => {
    let rect = el.getBoundingClientRect();
    //window.innerHeight窗口浏览器高度,rect.top相对于视口的距离高度
    if (rect.top+100 < window.innerHeight&&rect.top!==0) {
        return true
    } else {
        return false
    }
}


//滚动内容展现
export const scrollContent = () => {
    if (timer == 0) {
        timer = setTimeout(() => {
            list.value.forEach((element) => {
                if (isElemVisible(element)) {
                    element.style.opacity = '1'
                    element.style.transform = 'scale(1)'
                } else {
                    element.style.opacity = '0'
                    element.style.transform = 'scale(0.6)'
                }
            })
            timer = 0;
        }, 400)
    }
}
