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
import { computed, h, ref, watchEffect } from 'vue'
import { PictureOutlined, UserOutlined, TeamOutlined, CloudOutlined, SettingOutlined } from '@ant-design/icons-vue'
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
      children: filteredAdminMenus.map(menu => ({
        ...menu,
        icon: menu.icon || (() => h(SettingOutlined)) // 默认使用设置图标
      }))
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
// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, failure) => {
  current.value = [to.path]
})

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}
</script>

<style scoped>
#globalSider .ant-layout-sider {
  background: none;
}
</style>
