---
title: 
date: 2019-04-09
keys:
 - '123456'
---

<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item timestamp="2019/1/12" placement="top" type="primary" icon="el-icon-more">
        <el-card shadow="hover"s>
          <div class="item" @click="showModule('React')">
            <span class="p">React</span>
              <i class="el-icon-loading"></i>
          </div>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2019/8/3" placement="top" color='#0bbd87'>
        <el-card shadow="hover">
          <div class="item" @click="showModule('Webpack')">
            <span class="p">Webpack</span>
              <i class="el-icon-loading"></i>
          </div>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2019/7/1" placement="top" color='#0bbd87'>
        <el-card shadow="hover">
          <div class="item" @click="showModule('Vue')">
            <span class="p">Vue</span>
              <i class="el-icon-loading"></i>
          </div>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2019/10/1" placement="top" color='#0bbd87'>
        <el-card shadow="hover">
          <div class="item" @click="showModule('Node')">
            <span class="p">Node</span>
              <i class="el-icon-loading"></i>
          </div>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2018/6/2" placement="top">
        <el-card shadow="hover">
          <div class="item" @click="showModule('JS基础')">
            <span class="p">JS基础</span>
            <i class="el-icon-loading"></i>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
  <el-drawer
    title="我是标题"
    direction = "ltr"
    :visible.sync="drawer"
    :with-header="false">
    <div class="content-left">
      <h1>{{value}}</h1>
      <span>还未开发完成....</span>
    </div>
  </el-drawer>
</template>

<script>
  export default {
    data() {
      return {
        drawer: false,
        value: ''
      };
    },
    methods: {
      showModule(e){
        this.drawer = true;
        this.value = e;
      }
    }
  };
</script>

<style>
.item{
  cursor: pointer;
}

.content-left {
  width: 100%;
  height: 100%;
  background-size: 25px 25px;
  background-repeat: repeat;
  background-image: linear-gradient(to bottom, #e6f6fd 0, #e6f6fd 1px, transparent 1px), linear-gradient(to right, #e6f6fd 0, #e6f6fd 1px, transparent 1px);
  padding: 10px;
  box-sizing: border-box;
}
</style>
