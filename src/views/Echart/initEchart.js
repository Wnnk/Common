// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { LineChart } from 'echarts/charts';
/* 标题，提示框，直角坐标系，数据集，内置数据转换器组件 */
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  DataZoomComponent 
} from 'echarts/components'
/* 标签自动布局，全局过渡动画 */
import { LabelLayout, UniversalTransition } from 'echarts/features';
/* 引入Canvas渲染器，必须步骤 */
import { CanvasRenderer } from 'echarts/renderers';
/* 注册组件 */
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
  DataZoomComponent
])

import { onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { da } from 'element-plus/es/locales.mjs';


const option = {
  xAxis: {
    type: 'time',
    // boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value',
    // boundaryGap: [0, '100%']
  },
  dataZoom: [
    {
      type: "inside", // 滑块类型 值有slider和inside
      xAxisIndex: [0],
      start: 0,
      end: 10,
      minSpan: 0, // 用于限制窗口大小的最小值（百分比值），取值范围是 0 ~ 100。
      maxSpan: 10,
    },
    {
      start: 0,
      end: 10,
    }
   
  ],
  series: [{
    name: 'value',
    type: 'line',
    smooth: true,
    symbol: 'none',
    areaStyle: {},
   
  }],
  dataset: {
    dimensions: ['time', 'value'],
    source: [

    ]
  },
};

/* 初始化图表 */
export const initChart = async (elId) => {
  let chart = echarts.init(document.getElementById(`${elId}`));
  let data = [];
  for (let start = 0; start < 20000; start+=5000) {
    let end = start + 5000;
    const chunkData  =  await getEchartData(start, end);
    data.push(...chunkData)
    // option.series[0].data = data;
    option.dataset.source = data;
  }
  chart.setOption(option);
  resizeChart(chart);
  console.log(option)

  return chart;
}

/* resize */
export const resizeChart = (chart) => {
  const resizeHandler = () => {
    chart.resize();
  }
  window.addEventListener('resize', resizeHandler)
}

const getEchartData = async (start = 0, end = 100) => {
  const res = await axios({
    url: `http://localhost:3000/api/getEchart`,
    method:'get',
    params: {
      start,
      end
    }
  })
  if(res.data.code === 200) {
  //  return res.data.data.map(item => [item.time, item.value])
  return res.data.data
  }
 
}


/* 取消监听 */
onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
})