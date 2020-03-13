import './public/index.css'
import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//样式文件,这里我选的是sublime样式，文件里面还有其他样式可供选择
export default ({
    Vue, // VuePress 正在使用的 Vue 构造函数
    options, // 附加到根实例的一些选项
    router, // 当前应用的路由实例
    siteData // 站点元数据
}) => {
    // ...做一些其他的应用级别的优化
    Vue.use(Element)
}