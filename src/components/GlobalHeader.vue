<template>
  <div id="globalHeader" class="h-full flex items-center justify-between px-6">
    <!-- Logo区域 -->
    <RouterLink to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
      <img alt="logo" class="logo w-10 h-10 rounded-lg" src="../assets/logo.png" />
      <div class="title text-2xl font-bold bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent">
        屿图
      </div>
    </RouterLink>

    <!-- 导航菜单 -->
    <div class="flex-1 flex justify-center">
      <a-menu
        v-model:selectedKeys="current"
        :items="originItems"
        mode="horizontal"
        class="bg-transparent border-none"
        @click="doMenuClick"
      />
    </div>

    <!-- 用户登录状态 -->
    <div class="user-login-status">
      <div v-if="loginUserStore.loginUser.id" class="flex items-center space-x-3">
        <a-dropdown :overlay-style="{ borderRadius: '12px' }">
          <a-button type="text" class="flex items-center space-x-2 !px-3 !py-2 glass-container">
            <a-avatar 
              :src="loginUserStore.loginUser.userAvatar" 
              size="small"
              class="border-2 border-glass-border"
            />
            <span class="text-text-primary font-medium">
              {{ loginUserStore.loginUser.userName ?? '无名' }}
            </span>
          </a-button>
          <template #overlay>
            <a-menu class="glass-container border border-glass-border">
              <a-menu-item class="!rounded-lg !mx-2 !my-1">
                <router-link to="/my_space" class="flex items-center space-x-2 text-text-primary hover:text-primary-blue">
                  <UserOutlined />
                  <span>我的空间</span>
                </router-link>
              </a-menu-item>
              <a-menu-divider class="!my-1" />
              <a-menu-item 
                @click="doLogout" 
                class="!rounded-lg !mx-2 !my-1 text-red-500 hover:!bg-red-50"
              >
                <LogoutOutlined />
                <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>

      <div v-else>
        <a-button 
          type="primary" 
          href="/user/login"
          class="!rounded-lg !px-6 !h-10 glass-container border border-glass-border bg-gradient-to-r from-primary-blue to-dark-blue hover:from-primary-blue-hover hover:to-primary-blue"
        >
          登录
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'
import { HomeOutlined, LogoutOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userLogoutUsingPost } from '@/api/userController.ts'

const loginUserStore = useLoginUserStore()

// 菜单列表
const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/add_picture',
    icon: () => h(UploadOutlined),
    label: '上传图片',
    title: '上传图片',
  },
  {
    key: '/about',
    label: '关于',
    title: '关于',
  },
  {
    key: 'others',
    label: h('a', { href: 'https://blog.alank.top/', target: '_blank' }, '博客'),
    title: '博客',
  },
]

const router = useRouter()
// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

// 用户注销
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  console.log(res)
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    message.error('退出登录失败，' + res.data.message)
  }
}
</script>

<style scoped>
#globalHeader {
  height: 64px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.logo {
  height: 40px;
  border-radius: 8px;
}

/* 自定义菜单样式 */
:deep(.ant-menu-horizontal) {
  border-bottom: none !important;
  background: transparent !important;
}

:deep(.ant-menu-item) {
  border-radius: 8px;
  margin: 0 8px !important;
  padding: 8px 16px !important;
  transition: all 0.3s ease;
}

:deep(.ant-menu-item-selected) {
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--dark-blue) 100%) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

:deep(.ant-menu-item:hover) {
  background: rgba(24, 144, 255, 0.1) !important;
  color: var(--primary-blue) !important;
}

/* 用户下拉菜单样式 */
:deep(.ant-dropdown-menu) {
  padding: 8px !important;
}

:deep(.ant-dropdown-menu-item) {
  border-radius: 8px;
  margin: 2px 0 !important;
}

:deep(.ant-dropdown-menu-item:hover) {
  background: rgba(24, 144, 255, 0.1) !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  #globalHeader {
    padding: 0 16px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .logo {
    height: 32px;
  }
  
  :deep(.ant-menu-item) {
    margin: 0 4px !important;
    padding: 6px 12px !important;
    font-size: 14px;
  }
}
</style>
