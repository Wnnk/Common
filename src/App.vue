<template>
  <div class="layout">
    <el-header class="header"></el-header>
    <el-container class="main-container">
      <el-aside>
        <LeftBar />
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-aside> </el-aside>
    </el-container>
  </div>
</template>

<script setup>
import LeftBar from "@/components/LeftBar/index.vue";
</script>

<style lang="css" scoped>
.layout {
  height: 100vh;
}
.header {
  height: 60px;
}
.main-container {
  height: calc(100vh - 60px);
}
</style>
