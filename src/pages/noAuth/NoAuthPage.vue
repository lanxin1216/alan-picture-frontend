<template>
  <div id="noAuthPage">
    <img :src="image" alt="403 Forbidden" />
    <div>抱歉，您无权访问该页面</div>
    <RouterLink to="/">返回首页</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const image = ref('src/assets/403.webp')
defineOptions({
  name: 'NoAuthPage',
})
</script>

<style scoped>
#noAuthPage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#noAuthPage img {
  width: 250px;
  height: 290px;
  margin-bottom: 20px;
}

#noAuthPage a {
  margin-top: 20px;
  color: #007bff;
  text-decoration: none;
}

#noAuthPage a:hover {
  text-decoration: underline;
}
</style>
