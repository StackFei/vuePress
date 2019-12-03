<template>
  <div class="demo">
    <h2>测试组件文档模板</h2>
    <p>测试组件描述</p>
    <h3>测试组件功能名字</h3>
    <p>测试组件功能描述</p>
    <div class="component-wrapper">
      <div class="component-wrapper-demo">
        组件展示位置
      </div>
      <div class="code-content" v-highlight style="height: 0;">
        <div class="code-content-height">
          <!-- <div class="code-user-desc">
            组件描述说明
          </div> -->
          <pre><code class="vue">{{codeStr}}</code></pre>
        </div>
      </div>
      <div class="lock-code" @click="showCode(0)" ref="xxx">
        <!-- <w-icon class="icon-down" :name="isShow[0] === false ? 'down' : 'up'"></w-icon> -->
        <span class="lock-code-word">{{isShow[0] === false ? '显示代码' : '隐藏代码'}}</span>
      </div>
    </div>


    <h3>attributes</h3>
    <p>组件参数说明后期扩展</p>
  </div>
</template>

<script>
//   import WIcon from '../../../src/icon/icon'
  import mixin from '../mixin'
  export default {
    name: 'demo',
    mixins: [mixin],
    components: {
    //   WIcon,
    },
    data() {
      return {
        codeStr: `
          <g-button>默认按钮</g-button>
           <g-button>默认按钮</g-button>
            <g-button>默认按钮</g-button>
             <g-button>默认按钮</g-button>
              <g-button>默认按钮</g-button>
               <g-button>默认按钮</g-button>
                <g-button>默认按钮</g-button>
        `.replace(/^\s*/gm, '').trim(),
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>