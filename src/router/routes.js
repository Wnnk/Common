import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";


export const routes = [
  {
    path: "/",
    name: "upLoad",
    component: () => import("@/views/Upload/index.vue"),
    meta: { keepAlive: true }
  },
  {
    path: "/Echart",
    name: "Echart",
    component: () => import("@/views/Echart/index.vue"),
    meta: { keepAlive: false }
  },
  {
    path:"/FormItem",
    name: "FormItem",
    component: () => import("@/views/FromItem/index.vue")
  }
];
