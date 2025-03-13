<template>
<div class="echart-container" id="chart-main">
  
</div>

</template>

<script setup lang='js'>
import { ref, onMounted } from 'vue'
import { initChart } from './initEchart';

onMounted(() => {
  const cahrt = initChart('chart-main');
})

</script>

<style lang='scss' scoped>
.echart-container {
  width: 100%;
  height: 100%;
}
</style>