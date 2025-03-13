<template>
  <div class="Upload">
    <div class="Upload-container" 
      @click="touchInputEvent"
      @dragover.prevent="dragoverEvent"
      @dragleave.prevent="dragleaveEvent"
      @drop.prevent="dropEvent"
    >
      <el-icon class="el-icon--upload" size="50"><upload-filled /></el-icon>
      <input
        type="file"
        class="Upload-input"
        ref="fileInput"
        @change="fileChange"
        multiple
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { notification } from "@/utils/notification";

const router = useRouter();
/* 上传文件input */
const fileInput = ref(null);
/* 上传文件池 */
const filePool = ref([]);

/** 
 * @description: 监听文件上传
  */
const fileChange = () => {
  if(filePool.value.length > 0) {
    const files = Array.from(fileInput.value.files);
    filePool.value = [...filePool.value, ...files]
    return;
  }
  const file = fileInput.value.files[0];
  if (fileInput.value.files.length === 1) {
    chooseUserFile(file);
  } else if( fileInput.value.files.length > 1) {
    /* 获取除了第一个文件之外的其他文件 */
    const otherFiles = Array.from(fileInput.value.files).slice(1);
    filePool.value = [...filePool.value,...otherFiles];
    chooseUserFile(file);
  }
 
}

/** 
 * @description: 上传用户文件
 * @param {File} file
  */
const chooseUserFile = async (file) => {
  if (!file) return;
  try {
    const worker = new Worker(new URL("./worker.js", import.meta.url));
    worker.postMessage({
      file,
    });
   
    worker.onmessage = (event) => {
      if(event.data.code === 200) {
        worker.terminate();
        notification('上传成功', '文件上传成功，点击查看','success', () => { router.push({ name: 'upLoad' });}, 'onClick')
        continueUpload();
      } else if(event.data.code === 400) {
        worker.terminate();
        notification('上传失败', '文件上传失败, 点击查看', 'error', () => { router.push({ name: 'upLoad' });}, 'onClick')
        continueUpload();
      }
    };
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

/** 
 * @description: 监听拖拽上传文件到上传区域
  */
const dragoverEvent = (event) => {
  event.target.classList.add("dragover");
}
/** 
 * @description: 监听拖拽上传文件离开
  */
const dragleaveEvent = (event) => {
  event.target.classList.remove("dragover");
}
/** 
 * @description: 监听拖拽上传文件
  */
const dropEvent = (event) => {
  event.target.classList.remove("dragover");
  if(filePool.value.length > 0) {
    const files = Array.from(event.dataTransfer.files);
    filePool.value = [...filePool.value, ...files]
    return;
  }
  const file = event.dataTransfer.files[0];
  if (event.dataTransfer.files.length === 1) {
    chooseUserFile(file);
  } else if( event.dataTransfer.files.length > 1) {
    const otherFiles = Array.from(event.dataTransfer.files).slice(1);
    filePool.value = [...filePool.value,...otherFiles];
    chooseUserFile(file);
  }
}

/** 
 * @description: 文件池未空时，继续上传
*/
const continueUpload = () => {
  if(filePool.value.length > 0) {
    const file = filePool.value.shift();
    chooseUserFile(file)
  }
}

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
