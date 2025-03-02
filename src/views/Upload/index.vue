<template>
  <div class="Upload">
    <div class="Upload-container" @click="touchInputEvent">
      <el-icon class="el-icon--upload" size="50"><upload-filled /></el-icon>
      <input
        type="file"
        class="Upload-input"
        ref="fileInput"
        @change="chooseUserFile"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const fileInput = ref(null);

const chooseUserFile = async () => {
  const len = fileInput.value.files.length;
  if (len > 1) {
    return;
  }
  const file = fileInput.value.files[0];
  try {
    const worker = new Worker(new URL("./worker.js", import.meta.url));
    worker.postMessage({
      file,
    });
  } catch (error) {
    console.error("Worker error:", error);
  }
};

/**
 * @description: 触发上传文件input
 */
const touchInputEvent = () => {
  fileInput.value.click();
};
</script>

<style lang="scss" scoped>
.Upload {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 5px;
}
.Upload-container {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.Upload-input {
  display: none;
}
</style>
