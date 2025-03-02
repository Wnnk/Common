import SparkMD5 from "spark-md5";
import axios from "axios";

const url = "http://localhost:3000";

const chunkSize = 1024 * 1024 * 200; // 200MB
let pool = [];
self.onmessage = (e) => {
  const file = e.data.file;
  const hash = calculateFileMd5(file);
  pool = createFileChunks(file);
  processPool(hash);
};
self.onmessageerror = (e) => {
  console.log("worker onmessageerror", e);
};

/**
 * @description: 处理请求池中的任务
 * @param {String} hash 上传文件的MD5值
 **/
const processPool = (hash) => {
  while (pool.length > 0) {
    const { chunk, file } = pool.shift();
    uploadFileChunk(chunk, hash, chunk.index).then((res) => {
      if (res.status === 200) {
      }
    });
  }
};

/**
 * @description: 上传文件
 * @param {File} chunk 文件片段
 * @param {String} hash 上传文件的MD5值
 * @param {Number} index 片段索引
 **/
const uploadFileChunk = (chunk, hash, index) => {
  const formData = new FormData();
  formData.append("file", chunk);
  formData.append("hash", hash);
  formData.append("index", index);
  return axios.post(`${url}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * @description: 将文件切割成固定大小的块
 * @param {File} file 文件对象
 * @return {Array}
 */
const createFileChunks = (file) => {
  const fileChunks = [];
  /* 计算chunks数量 */
  const chunkCount = Math.ceil(file.size / chunkSize);
  for (let i = 0; i < chunkCount; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    fileChunks.push(chunk);
  }
  return fileChunks;
};

/**
 * @description: 计算文件MD5值
 * @param {File} file 文件对象
 * @return {Promise}
 */
const calculateFileMd5 = async (file) => {
  const spark = new SparkMD5.ArrayBuffer();
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = (e) => {
      spark.append(e.target.result);
      const hash = spark.end();
      resolve(hash);
    };
    fileReader.readAsArrayBuffer(file);
  });
};
