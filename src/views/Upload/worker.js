import SparkMD5 from "spark-md5";
import axios from "axios";


const url = "http://localhost:3000";

const chunkSize = 1024 * 1024 * 200; // 200MB
let pool = [];
self.onmessage = async (e) => {
  const file = e.data.file;
  const hash = await calculateFileMd5(file);
  pool = await createFileChunks(file);
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
  const totalChunks = pool.length;

  pool.map(({ chunk, index, chunkName, fileName }) => {
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("hash", hash);
    formData.append("index", index);
    formData.append("chunkName", chunkName);
    formData.append("fileName", fileName);
    formData.append("totalChunks", totalChunks);
    axios.post(`${url}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      if (res.data.code === 207) {
        pool.splice(index, 1);
      }
      if (res.data.code === 200) {
        pool = [];
        self.postMessage({ code: 200, message: "上传成功" });
      }
    }).catch((err) => {
      alert(err);
    });
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
  const chunkList = fileChunks.map((chunk, index) => {
    return {
      chunk,
      size: chunk.size,
      chunkName: `${file.name}_${index}`,
      fileName: file.name,
      index
    }
  });
  return chunkList;
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
