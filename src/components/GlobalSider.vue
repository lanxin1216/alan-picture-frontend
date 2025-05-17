<template>
  <div id="globalSider" v-if="loginUserStore.loginUser.id">
    <a-layout-sider class="sider" width="200" breakpoint="lg">
      <a-menu
        mode="inline"
        v-model:selectedKeys="current"
        :items="menuItems"
        @click="doMenuClick"
      />
    </a-layout-sider>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { PictureOutlined, UserOutlined,TeamOutlined,CloudOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import checkAccess from '@/access/checkAccess.ts'

const loginUserStore = useLoginUserStore()

// 菜单列表
const menuItems = computed(() => {
  const baseMenus = [
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

  // 转换菜单项为路由项并校验权限
  const filteredAdminMenus = adminMenus.filter((menu) => {
    const routeItem = menuToRouteItem(menu)
    if (!routeItem || routeItem.meta?.hideInMenu) return false
    return checkAccess(loginUserStore.loginUser, routeItem.meta?.access as string)
  })

  return [...baseMenus, ...filteredAdminMenus]
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

const router = useRouter()

// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, failure) => {
  current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}
</script>

<style scoped>
#globalSider .ant-layout-sider {
  background: none;
}
</style>
