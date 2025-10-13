<template>
  <div id="basicLayout" class="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100">
    <a-layout class="min-h-screen bg-transparent">
      <!-- 头部 -->
      <a-layout-header class="header glass-container">
        <GlobalHeader />
      </a-layout-header>
      
      <!-- 主要内容区域 -->
      <a-layout>
        <!-- 侧边栏 -->
        <a-layout-sider v-if="showSider" class="sider glass-container" width="200">
          <GlobalSider />
        </a-layout-sider>
        
        <!-- 内容区域 -->
        <a-layout-content class="content" :class="{ 'ml-0': !showSider }">
          <div class="glass-container p-6 min-h-[calc(100vh-8rem)]">
            <router-view />
          </div>
        </a-layout-content>
      </a-layout>
      
      <!-- 底部 -->
      <a-layout-footer class="footer glass-container">
        <div class="text-center text-text-secondary py-2">
          <a href="https://github.com/lanxin1216" target="_blank" class="hover:text-primary-blue transition-colors">
            屿图 by @Alan
          </a>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSider from '@/components/GlobalSider.vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import ACCESS_ENUM from '@/access/accessEnum'
import { computed } from 'vue'

const loginUserStore = useLoginUserStore()

// 控制侧边栏显示 - 只有当用户已登录时才显示侧边栏
const showSider = computed(() => {
  return loginUserStore.loginUser?.userRole && 
         loginUserStore.loginUser.userRole !== ACCESS_ENUM.NOT_LOGIN
})
</script>

<style scoped>
#basicLayout {
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f8ff 50%, #f5f5f5 100%);
}

/* 确保Ant Design布局组件正确显示 */
#basicLayout :deep(.ant-layout) {
  background: transparent;
}

#basicLayout :deep(.ant-layout-header) {
  background: var(--glass-bg-light);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--glass-border);
  height: 64px;
  line-height: 64px;
  padding: 0 20px;
}

#basicLayout :deep(.ant-layout-sider) {
  background: var(--glass-bg-light) !important;
  backdrop-filter: blur(10px);
  border-right: 1px solid var(--glass-border);
  min-height: calc(100vh - 128px);
}

#basicLayout :deep(.ant-layout-content) {
  background: transparent;
  padding: 16px;
  min-height: calc(100vh - 128px);
  margin-left: 200px;
  transition: margin-left 0.3s ease;
}

#basicLayout :deep(.ant-layout-content.ml-0) {
  margin-left: 0;
}

#basicLayout :deep(.ant-layout-footer) {
  background: var(--glass-bg-light);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--glass-border);
  height: 64px;
  line-height: 64px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  #basicLayout :deep(.ant-layout-sider) {
    width: 180px !important;
  }
}

@media (max-width: 480px) {
  #basicLayout :deep(.ant-layout-sider) {
    width: 160px !important;
  }
}
</style>
