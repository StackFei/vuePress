import Vue from 'vue';
import './public/index.css';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

export default ({
    Vue, // VuePress 正在使用的 Vue 构造函数
    options, // 附加到根实例的一些选项
    router, // 当前应用的路由实例
    siteData // 站点元数据
}) => {
    // ...做一些其他的应用级别的优化
    Vue.use(Element);
    // Vue.use(moment);
    const a = document.createElement('a')
    const i = document.createElement('i')
    a.setAttribute("class","flex");
    a.setAttribute("target","_blank");
    a.setAttribute("href","http://mac.pengyunfei.top");
    i.setAttribute("class","el-icon-edit");
    a.appendChild(i)
    document.body.appendChild(a)
    try {
      // 生成静态页时在node中执行，没有document对象
    } catch (e) {
      console.error(e.message)
    }
}