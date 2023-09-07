<template>
    <div id="ECharts">
        <div id="bar"></div>
        <div id="pie"></div>
    </div>
</template>
<script setup>
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';
import { requireData } from "@/require/index.js"
//分类数据
let classifyData = ref([]);
//文章日期
let articleDate = ref([]);
//文章当前日期数
let dateNumber = ref([]);
onMounted(() => {
    Object.defineProperty(document.getElementById('pie'), 'clientWidth', { get: function () { return 350; } })
    Object.defineProperty(document.getElementById('pie'), 'clientHeight', { get: function () { return 350; } })
    Object.defineProperty(document.getElementById('bar'), 'clientWidth', { get: function () { return 350; } })
    Object.defineProperty(document.getElementById('bar'), 'clientHeight', { get: function () { return 350; } })
    requireData().then(({ data }) => {
        classifyData.value = data.classifyData
        classifyData.value.forEach(item => {
            item.name = item.title;
            item.value = item.quantity;
        })
        articleDate.value = data.articleDate;
        dateNumber.value = data.dateNumber;
        charDom()
    });
})
let charDom = async () => {
    // 基于准备好的dom，初始化echarts实例
    let myChartPie = echarts.init(document.getElementById('pie'));
    let myChartBar = echarts.init(document.getElementById('bar'));
    // 绘制图表
    let pieoption = {
        title: {
            text: '文章分类统计图',
            x: 'center',
            y: 'top',
        },
        tooltip: {
            trigger: 'item',
            //a是标题,b是数据名,c是数据,d是数据百分比
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
            {
                name: '文章分类统计图',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: classifyData.value,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }

        ]
    };
    let baroption = {
        title: {
            text: '文章发布统计图',
            x: 'center',
            y: 'top',
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b} <br/><div style=`width:10px;height:10px;background-color: red;`></div> 文章篇数:{c}'
        },
        xAxis: {
            type: 'category',
            data: articleDate.value
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: dateNumber.value,
                type: 'line',
            }
        ]
    };
    myChartPie.setOption(pieoption);
    myChartBar.setOption(baroption)
}
</script>
<style scoped>
#ECharts {
    display: flex;
    justify-content: space-around;
}
</style>