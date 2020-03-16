---
home: true
# heroImage: /img/logo.png
# bgImage: '/img/logo.png'
# faceImage: '/img/logo.png'
isShowTitleInHome: false
heroImageStyle: {
  maxHeight: '200px',
  display: block,
  margin: '6rem auto 1.5rem',
  borderRadius: '50%',
  boxShadow: '0 5px 18px rgba(0,0,0,0.2)'
}
heroText: "Simple notes"
# tagline: 风萧萧兮易水寒，脱发之路一去不复返
actionText: Check Me  →
actionLink: /FAQ/
features:
- title: Wiki - 求索
  details: 基于书签对知识点进行 整理，吸收，吐纳，归档。吾将上下而求索...
- title: Store - 仓库
  details: 展望云仓库而归纳整理，方便行事&培养习惯。鱼和熊掌我全都要...
- title: Thought - 随笔
  details: 寄蜉蝣于天地，渺沧海之一粟。细细琢磨吧，人生啊，有意思的很...
# footer: MIT Licensed | Copyright © 2019-present
---

<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>热门推荐</span>
    </div>
    <div v-for="(item, index) in list" :key="index" @click="go(item)" class="text item">
      <i class="el-icon-collection-tag"></i>
      <span class="dir">求索 /</span> 
      <span class="tit">{{ item.title }}</span>
  <!-- <div class="intro" v-if="item.excerpt" v-html="item.excerpt"></div> -->
    </div>
  </el-card>
  <div class="footer">
    <el-divider>
      <el-link :underline="false" href="http://www.beian.miit.gov.cn/" type="primary">鄂ICP备20003283号-1	</el-link>
    </el-divider>
  </div>
</template>

<script>
  export default {
    methods: {
      go(item) {
          location.href = item.path
      },
    },
    computed: {
        list () {
          let res = this.$site.pages
            .filter(item => item.regularPath.indexOf(".html") !== -1) //只显示内容页，不显示栏目首页
            .sort((a, b) => {
              const av = a.frontmatter.updateTime ? new Date(a.frontmatter.updateTime).valueOf() : 0
              const bv = b.frontmatter.updateTime ? new Date(b.frontmatter.updateTime).valueOf() : 0
              return bv - av //模糊比较，倒序排列，此处未对非预期日期格式作兼容处理
            })
            .filter((item, index) => index < 15) //显示最新15条
            .map(item => {
              item.dir = '/' + item.path.split('/')[1] + '/'
              return item
            })
            // console.log(res)
          return res
        },

        //栏目数组
        nav () {
          const n = this.$site.themeConfig.sidebar
          let res = {}
          for(let key in n) {
              res[key] = n[key][0].title
          }
          // console.log('::::',n)
          return res
        }
    },

    
};
</script>

<style>
  .text {
    font-size: 14px;
  }
  .item {
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }
  .item:hover {
    background: #f5f6f7;
    color:#2a8ff7;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card {
    max-width: 960px;
    margin: 0 auto;
  }
</style>
