<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
document.addEventListener('DOMContentLoaded', setRem)
window.addEventListener('resize', setRem)
function setRem () {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  html.style.fontSize = fontSize + 'px'
}
export default {
  name: 'app'
}
</script>

<style lang="scss" scoped>
</style>
