<template>
  <div
    id="basicLayout"
    class="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100"
  >
    <a-layout class="h-screen">
      <!-- 固定头部 -->
      <a-layout-header class="header fixed top-0 left-0 right-0 z-50 w-full">
        <GlobalHeader />
      </a-layout-header>

      <!-- 主要内容区域 -->
      <a-layout class="pt-[64px]"> <!-- 留出 header 高度 -->
        <!-- 固定侧边栏 -->
        <div v-if="showSider" class="fixed top-[64px] left-0 bottom-0 z-40">
          <GlobalSider />
        </div>

        <!-- 可滚动内容区域 -->
        <a-layout-content
          class="overflow-auto h-[calc(100vh-64px)]"
          :class="{ 'ml-0': !showSider, 'ml-48': showSider }"
        >
          <div class="content glass-container">
            <router-view />
          </div>

          <!-- 固定底部 -->
          <a-layout-footer class="footer glass-container">
            <a
              href="https://github.com/lanxin1216"
              target="_blank"
              class="hover:text-primary-blue transition-colors"
            >
              屿图 by @Alan
            </a>
          </a-layout-footer>
        </a-layout-content>
      </a-layout>
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
  return (
    loginUserStore.loginUser?.userRole &&
    loginUserStore.loginUser.userRole !== ACCESS_ENUM.NOT_LOGIN
  )
})
</script>

<style scoped>
#basicLayout {
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f8ff 50%, #f5f5f5 100%);
  overflow: hidden; /* 禁止全局滚动，只让中间区域滚动 */
}

/* 确保Ant Design布局组件正确显示 */
#basicLayout :deep(.ant-layout) {
  background: transparent;
}

/* 顶部固定玻璃头部 */
#basicLayout :deep(.ant-layout-header) {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--glass-border);
  height: 64px;
  line-height: 64px;
  padding: 0;
}

/* 侧边栏固定 */
#basicLayout :deep(.ant-layout-sider) {
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  border-right: 1px solid var(--glass-border);
}

/* 中间滚动内容区域 */
#basicLayout :deep(.ant-layout-content) {
  background: transparent;
  padding: 8px;
  transition: margin-left 0.3s ease;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

#basicLayout :deep(.ant-layout-content)::-webkit-scrollbar {
  display: none;
}

#basicLayout :deep(.ant-layout-content.ml-0) {
  margin-left: 0;
}

#basicLayout :deep(.ant-layout-content.ml-48) {
  margin-left: 180px;
}

/* 底部 */
#basicLayout :deep(.ant-layout-footer) {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--glass-border);
  text-align: center;
  padding: 16px 24px;
  margin-top: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  #basicLayout :deep(.ant-layout-content.ml-48) {
    margin-left: 180px;
  }
}

@media (max-width: 480px) {
  #basicLayout :deep(.ant-layout-content.ml-48) {
    margin-left: 160px;
  }
}
</style>
