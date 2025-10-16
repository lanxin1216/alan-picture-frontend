<template>
  <div id="globalHeader" class="h-full flex items-center justify-between px-6">
    <!-- Logo区域 -->
    <div class="flex items-center space-x-4">
      <RouterLink to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
        <img alt="logo" class="logo w-10 h-10 rounded-xl" src="../assets/logo.png" />
        <div
          class="title text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text p-2.5"
        >
          屿图
        </div>
      </RouterLink>

      <!-- 导航菜单 - 移动到左侧 -->
      <div class="flex ml-6">
        <a-menu
          v-model:selectedKeys="current"
          :items="originItems"
          mode="horizontal"
          class="glass-menu"
          @click="doMenuClick"
        />
      </div>
    </div>

    <!-- 用户登录状态 -->
    <div class="user-login-status">
      <div v-if="loginUserStore.loginUser.id" class="flex items-center space-x-3">
        <ASpace size="middle">
          <a-avatar :src="loginUserStore.loginUser.userAvatar" size="large" />
          <span>
            {{ loginUserStore.loginUser.userName ?? '无名' }}
          </span>
          <a-dropdown :overlay-style="{ borderRadius: '16px' }" arrow>
            <BarsOutlined style="font-size: 24px" />
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <router-link to="/my_space">
                    <UserOutlined />
                    我的空间
                  </router-link>
                </a-menu-item>
                <a-menu-item @click="doLogout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </ASpace>
      </div>

      <div v-else>
        <a-button
          type="primary"
          href="/user/login"
          class="!rounded-xl !px-6 !h-10 glass-login-btn text-white font-medium shadow-lg hover:shadow-xl transition-all"
        >
          登录
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'
import {
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
  UploadOutlined,
  BarsOutlined,
} from '@ant-design/icons-vue'
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
  background: transparent;
  padding: 0 24px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  padding: 0 10px;
}

.logo {
  height: 60px;
  border-radius: 12px;
}

.glass-login-btn {
  backdrop-filter: blur(12px);
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.9) 0%,
    rgba(147, 51, 234, 0.9) 100%
  ) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  transition: all 0.3s ease;
}

.glass-login-btn:hover {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 1) 0%,
    rgba(147, 51, 234, 1) 100%
  ) !important;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
}

.glass-menu-item {
  border-radius: 10px !important;
  margin: 2px 4px !important;
  transition: all 0.2s ease;
}

.glass-menu-item:hover {
  background: rgba(59, 130, 246, 0.1) !important;
}

/* 自定义菜单样式 */
:deep(.glass-menu.ant-menu-horizontal) {
  border-bottom: none !important;
  background: transparent !important;
  line-height: 1;
}

:deep(.glass-menu .ant-menu-item) {
  border-radius: 12px;
  margin: 0 6px !important;
  padding: 10px 20px !important;
  transition: all 0.3s ease;
  font-weight: 500;
  backdrop-filter: blur(8px);
  border: 1px solid transparent;
}

:deep(.glass-menu .ant-menu-item-selected) {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.2) 0%,
    rgba(147, 51, 234, 0.2) 100%
  ) !important;
  color: rgb(59, 130, 246) !important;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow:
    0 4px 15px rgba(59, 130, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

:deep(.glass-menu .ant-menu-item:hover) {
  background: rgba(255, 255, 255, 0.5) !important;
  color: rgb(59, 130, 246) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.glass-menu .ant-menu-item .anticon) {
  color: rgba(75, 85, 99, 0.8) !important;
  font-size: 16px;
}

:deep(.glass-menu .ant-menu-item-selected .anticon) {
  color: rgb(59, 130, 246) !important;
}

:deep(.glass-menu .ant-menu-item a) {
  color: inherit !important;
}

/* 用户下拉菜单样式 */
:deep(.ant-dropdown-menu) {
  padding: 12px 8px !important;
}

:deep(.ant-dropdown-menu-item) {
  border-radius: 10px;
  margin: 2px 0 !important;
  padding: 10px 16px !important;
  transition: all 0.2s ease;
}

:deep(.ant-dropdown-menu-item:hover) {
  background: rgba(59, 130, 246, 0.1) !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  #globalHeader {
    padding: 0 16px;
    height: 60px;
  }

  .title {
    font-size: 20px;
  }

  .logo {
    height: 32px;
  }

  :deep(.glass-menu .ant-menu-item) {
    margin: 0 4px !important;
    padding: 8px 12px !important;
    font-size: 14px;
  }
}

@media (max-width: 640px) {
  #globalHeader {
    padding: 0 12px;
  }

  .title {
    display: none;
  }

  :deep(.glass-menu .ant-menu-item) {
    padding: 6px 10px !important;
    font-size: 13px;
  }
}
</style>
