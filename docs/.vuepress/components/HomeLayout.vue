<template>
<body class="container">
  <div class="letter pink">🍇</div>
  <div class="letter blue">🛬</div>
  <div class="letter green">🍍</div>
  <div class="letter yellow">🍌</div>
</body>
</template>

<script>
export default {};
</script>

<style lang="stylus">
.container {
  display: grid;
  grid-gap: 20px 20px;
  grid-auto-flow: row dense;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
}

.letter {
  font-size: 5vh;
  line-height: 1;
  padding: 5vh 10vh 7vh;
  color: #fff;
  font-weight: bold;
  box-shadow: 4vh 4vh 0 rgba(255, 255, 255, 0.2) inset, -4vh -4vh 0 rgba(0, 0, 0, 0.07) inset, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  text-shadow: 2vh 2vh 0 rgba(0, 0, 0, 0.3);
  animation-name: fun;
  animation-duration: 2.5s;
  animation-iteration-count: infinite;
  position: relative;
}

.pink {
  background-color: #8764b8;
}

.blue {
  background-color: #029bd4;
  animation-delay: 0.15s;
}

.green {
  background-color: #90b203;
  animation-delay: 0.3s;
}

.yellow {
  background-color: #ffdb00;
  animation-delay: 0.45s;
}
</style>
