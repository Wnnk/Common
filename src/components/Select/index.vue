<!-- 
 @description: 下拉组件 
-->

<template>
<div>
  <el-select v-model="selectValue" placeholder="选择">
    <el-option 
      v-for="item in data" 
      :key="item.id" 
      :label="item.label" 
      :value="item.value"
    >

    </el-option>
  </el-select>
</div>

</template>

<script setup lang="js">
import { ref } from 'vue'
const data = [
  {
    id:1,
    label:'test1',
    value:'test1'
  },
  {
    id:2,
    label:'test2',
    value:'test2'
  },
  {
    id:3,
    label:'test3',
   value:'test3'
  }
]

/* 0:初始化 1:通讯中 2:接收成功 3:error:通讯报错*/
const state = ref(0);
const selectValue = ref("")
const props = defineProps({
  lazy:Boolean,
})
</script>

<style lang='scss' scoped>
</style>