<template>
  <div id="globalSider" v-if="loginUserStore.loginUser.id" class="h-full">
    <a-layout-sider
      class="sider glass-container !h-full !border-r !border-glass-border"
      width="200"
      breakpoint="lg"
    >
      <div class="p-4">
        <a-menu
          mode="inline"
          v-model:selectedKeys="current"
          :items="menuItems"
          class="bg-transparent border-none"
          @click="doMenuClick"
        />
      </div>
    </a-layout-sider>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, ref, watchEffect } from 'vue'
import {
  PictureOutlined,
  UserOutlined,
  TeamOutlined,
  CloudOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import checkAccess from '@/access/checkAccess.ts'
import { SPACE_TYPE_ENUM } from '@/constants/space.ts'
import { listMyTeamSpaceUsingPost } from '@/api/spaceUserController.ts'
import { message } from 'ant-design-vue'

const loginUserStore = useLoginUserStore()

// 固定的菜单列表
const fixedMenuItems = [
  {
    key: '/',
    label: '公共图库',
    icon: () => h(PictureOutlined),
  },
  {
    key: '/my_space',
    label: '我的空间',
    icon: () => h(UserOutlined),
  },
  {
    key: '/add_space?type=' + SPACE_TYPE_ENUM.TEAM,
    label: '创建团队',
    icon: () => h(TeamOutlined),
  },
]

// 管理类菜单
const adminMenus = [
  {
    key: '/admin/pictureManage',
    label: '图片管理',
    icon: () => h(PictureOutlined),
  },
  {
    key: '/admin/spaceManage',
    label: '空间管理',
    icon: () => h(CloudOutlined),
  },
  {
    key: '/admin/userManage',
    label: '用户管理',
    icon: () => h(TeamOutlined),
  },
]

// 菜单列表
const teamSpaceList = ref<API.SpaceUserVO[]>([])
const menuItems = computed(() => {
  const menuList = [...fixedMenuItems]

  // 添加团队空间分组
  if (teamSpaceList.value.length > 0) {
    const teamSpaceSubMenus = teamSpaceList.value.map((spaceUser) => {
      const space = spaceUser.space
      return {
        key: '/space/' + spaceUser.spaceId,
        label: space?.spaceName,
      }
    })

    const teamSpaceMenuGroup = {
      type: 'group',
      label: '我的团队',
      key: 'teamSpace',
      children: teamSpaceSubMenus,
    }
    menuList.push(teamSpaceMenuGroup)
  }

  // 添加系统管理分组（需要权限校验）
  const filteredAdminMenus = adminMenus.filter((menu) => {
    const routeItem = menuToRouteItem(menu)
    if (!routeItem || routeItem.meta?.hideInMenu) return false
    return checkAccess(loginUserStore.loginUser, routeItem.meta?.access as string)
  })

  if (filteredAdminMenus.length > 0) {
    const adminMenuGroup = {
      type: 'group',
      label: '系统管理',
      key: 'systemManagement',
      children: filteredAdminMenus.map((menu) => ({
        ...menu,
        icon: menu.icon || (() => h(SettingOutlined)), // 默认使用设置图标
      })),
    }
    menuList.push(adminMenuGroup)
  }

  return menuList
})

const menuToRouteItem = (menu: any) => {
  const route = router.getRoutes().find((route) => route.path === menu.key)
  if (route) {
    return {
      ...menu,
      meta: route.meta, // 从路由配置中提取 meta 信息
    }
  }
  return null
}

// 加载团队空间列表
const fetchTeamSpaceList = async () => {
  const res = await listMyTeamSpaceUsingPost()
  if (res.data.code === 0 && res.data.data) {
    teamSpaceList.value = res.data.data
  } else {
    message.error('加载我的团队空间失败，' + res.data.message)
  }
}

/**
 * 监听变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  // 登录才加载
  if (loginUserStore.loginUser.id) {
    fetchTeamSpaceList()
  }
})

const router = useRouter()

// 当前选中菜单
const current = ref<string[]>([])

// 当前选中菜单
router.afterEach((to, from, failure) => {
  // 获取当前路由路径
  let currentPath = to.path

  // 处理我的空间和团队空间的路由匹配
  if (currentPath.startsWith('/space/')) {
    current.value = ['/my_space'] // 将空间页面映射到我的空间菜单项
  }
  // 处理创建团队页面的路由匹配
  else if (currentPath === '/add_space') {
    current.value = ['/add_space?type=' + SPACE_TYPE_ENUM.TEAM]
  } else {
    current.value = [currentPath]
  }
})

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}
</script>

<style scoped>
#globalSider {
  height: calc(100vh - 64px);
}

/* 自定义菜单样式 */
:deep(.ant-menu-inline) {
  border-right: none !important;
  background: transparent !important;
}

:deep(.ant-menu-item) {
  border-radius: 8px !important;
  margin: 4px 0 !important;
  height: 40px !important;
  line-height: 40px !important;
  transition: all 0.3s ease !important;
}

:deep(.ant-menu-item-selected) {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.2) 0%,
    rgba(147, 51, 234, 0.2) 100%
  ) !important;
  color: rgb(59, 130, 246) !important;
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow:
    0 4px 15px rgba(59, 130, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8) !important;
}

:deep(.ant-menu-item:hover) {
  background: rgba(24, 144, 255, 0.1) !important;
  color: var(--primary-blue) !important;
}

:deep(.ant-menu-item-group-title) {
  color: var(--text-secondary) !important;
  font-weight: 600 !important;
  margin-top: 16px !important;
  margin-bottom: 8px !important;
  padding-left: 16px !important;
  font-size: 14px !important;
}

:deep(.ant-menu-item-group-list) {
  margin: 0 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  #globalSider {
    height: calc(100vh - 56px);
  }

  :deep(.ant-menu-item) {
    margin: 2px 0 !important;
    height: 36px !important;
    line-height: 36px !important;
    font-size: 14px !important;
  }
}
</style>
