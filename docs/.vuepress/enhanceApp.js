import Vue from 'vue';
import './public/index.css';
import moment from 'moment';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// import integrateGitment from './util/Gitment';
// import hljs from 'highlight.js'
// import 'highlight.js/styles/color-brewer.css' 
//样式文件,这里我选的是sublime样式，文件里面还有其他样式可供选择

// Vue.directive('highlight',function (el) {
//   let blocks = el.querySelectorAll('pre code');
//       blocks.forEach((block)=>{
//       hljs.highlightBlock(block)
//   })
// })
export default ({
    Vue, // VuePress 正在使用的 Vue 构造函数
    options, // 附加到根实例的一些选项
    router, // 当前应用的路由实例
    siteData // 站点元数据
}) => {
    // ...做一些其他的应用级别的优化
    Vue.use(Element);
    // Vue.use(moment);
    try {
      // 生成静态页时在node中执行，没有document对象
      // document && integrateGitment(router)
    } catch (e) {
      console.error(e.message)
    }
}