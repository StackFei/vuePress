<template>
<body class="container">
  <div class="letter pink">🍇</div>
  <div class="letter blue">🛬</div>
  <div class="letter green">🍍</div>
  <div class="letter yellow">🍌</div>
</body>

</template>

<script>
import axios from 'axios'
export default {
  data(){
    return {}
  },
  mounted(){
    this.getDate()
  },
  methods:{
      getDate(){
        axios.get('https://api.douban.com/v2/movie/subject/26266893?apikey=0b2bdeda43b5688921839c8ecb20399b').then(res=>{
          console.log(res)
        })
      }
  }
};
</script>

<style lang="stylus">

</style>
