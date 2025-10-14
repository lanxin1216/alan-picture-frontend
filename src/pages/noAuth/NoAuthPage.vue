<template>
  <div id="noAuthPage" class="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100 flex items-center justify-center p-6">
    <div class="glass-container rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
      <!-- 图标 -->
      <div class="mb-6">
        <div class="w-24 h-24 mx-auto bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
          <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      
      <!-- 标题和描述 -->
      <h1 class="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-4">
        403 禁止访问
      </h1>
      <p class="text-text-secondary mb-6 leading-relaxed">
        抱歉，您没有权限访问此页面。请检查您的账户权限或联系管理员。
      </p>
      
      <!-- 返回首页按钮 -->
      <RouterLink 
        to="/" 
        class="inline-block core-btn-primary text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-md"
      >
        返回首页
      </RouterLink>
      
      <!-- 额外提示 -->
      <div class="mt-6 text-sm text-text-tertiary">
        <p>如果您认为这是一个错误，请联系系统管理员</p>
      </div>
    </div>
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
  min-height: 100vh;
}

.glass-container {
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
}

/* 响应式设计 */
@media (max-width: 768px) {
  #noAuthPage {
    padding: 16px;
  }
  
  .glass-container {
    padding: 24px !important;
  }
  
  h1 {
    font-size: 24px;
  }
  
  p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  #noAuthPage {
    padding: 12px;
  }
  
  .glass-container {
    padding: 20px !important;
  }
  
  h1 {
    font-size: 20px;
  }
  
  p {
    font-size: 13px;
  }
}
</style>
