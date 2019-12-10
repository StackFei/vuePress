<template>
<div>
  <!-- <button @click="grantedPermission">弹出消息</button> -->
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
          <div class="container">
              <div class="container-child1">
                  <div class="container-child1-child1"></div>
                  <div class="container-child1-child2"></div>
                  <div class="container-child1-child3">
                      ...
                  </div>
              </div>
          </div>
        `.replace(/^\s*/gm, '').trim(),
      }
    },
     created() {
        // 判断浏览器是否支持Notification
        if (window.Notification) {
            switch (Notification.permission) {
                case 'default':
                    this.defaultPermission();
                    break;
                case 'granted':
                    this.grantedPermission();
                    break;
                case 'denied':
                    console.log('用户拒绝该网站消息通知');
                    break;
            }
        } else {
            console.log('暂不支持消息通知');
        }
    },
    methods: {
        /**
         * [defaultPermission 当用户拒绝消息通知时，可以询问用户是否开启消息通知]
         * @version  [1.0]
         */
        defaultPermission() {
            Notification.requestPermission().then(permission => {
                switch (permission) {
                    case 'default':  
                        break;
                    case 'granted':
                        this.grantedPermission();
                        break;
                    case 'denied':
                        console.log('还是拒绝了该网站消息通知');
                        break;
                }
            });
        },
        /**
         * [grantedPermission 运行消息通知状态，可以向发起消息通知]
         */
        grantedPermission() {
            const title = '这是测试自定义消息模板';
            const options = {
                body: '这是测试自定义消息模板',
                dir: 'auto',
                icon: 'http://cdn.duitang.com/uploads/item/201410/21/20141021130151_ndsC4.jpeg'
            };
            const notification = new Notification(title, options);
            notification.onclick = e => {
                console.log(1);
            }
            notification.onclose = e => {
                console.log(2);
            }
            notification.onshow = e => {
                console.log(3);
            }
            notification.onerror = e => {
                console.log(4);
            }
        }
    }
  }
</script>

<style lang="scss" scoped>

</style>