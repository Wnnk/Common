import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router/index";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./src/styles/index.css"
import * as ElementPlusIcons from "@element-plus/icons-vue";

const app = createApp(App);
for (const [key, value] of Object.entries(ElementPlusIcons)) {
  app.component(key, value);
}
app.use(ElementPlus);
app.use(router);
app.mount("#app");
