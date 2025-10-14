<template>
  <div
    id="basicLayout"
    class="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100"
  >
    <a-layout class="min-h-screen">
      <!-- 固定头部 -->
      <a-layout-header class="header layout-glass-container fixed left-0 right-0 top-0 z-50 w-full">
        <GlobalHeader />
      </a-layout-header>

      <!-- 主要内容区域 -->
      <a-layout class="pt-[64px]">
        <!-- 固定侧边栏 -->
        <GlobalSider v-if="showSider" class="fixed left-0 bottom-0 z-40" />

        <!-- 可滚动内容区域 -->
        <a-layout-content class="overflow-auto" :class="{ 'ml-0': !showSider, 'ml-48': showSider }">
          <div class="layout-glass-container">
            <router-view />
          </div>

          <!-- 固定底部 -->
          <a-layout-footer class="footer layout-glass-container">
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
  overflow: hidden;
}

/* 布局组件通用效果*/
.layout-glass-container {
  background: transparent;
  backdrop-filter: blur(15px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  box-shadow: var(--glass-shadow);
}

#basicLayout :deep(.ant-layout) {
  background: transparent;
}

#basicLayout :deep(.ant-layout-header) {
  background: transparent;
  height: 64px;
  line-height: 64px;
  padding: 0;
}

/* 侧边栏固定 */
#basicLayout :deep(.ant-layout-sider) {
  height: 100%;
  background: transparent;
}

/* 中间滚动内容区域 */
#basicLayout :deep(.ant-layout-content) {
  position: relative;
  background: transparent;
  padding: 8px;
  transition: margin-left 0.3s ease;
  scrollbar-width: none;
  -ms-overflow-style: none;
  z-index: 1;
}

#basicLayout :deep(.ant-layout-content)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), transparent);
  pointer-events: none;
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
  background: transparent;
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--glass-border);
  text-align: center;
  padding: 16px 24px;
  margin-top: 8px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  #basicLayout :deep(.ant-layout-content.ml-48) {
    margin-left: 80px;
  }
}

@media (max-width: 992px) {
  #basicLayout :deep(.ant-layout-content.ml-48) {
    margin-left: 80px;
  }
}
</style>
