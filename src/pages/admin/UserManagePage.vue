<template>
  <div id="userManagePage">
    <!-- 搜索区域 -->
    <div class="search-area">
      <a-form layout="inline" :model="searchParams" @finish="doSearch" class="search-form">
        <a-form-item label="账号" class="!mb-4">
          <a-input
            v-model:value="searchParams.userAccount"
            placeholder="输入账号"
            allow-clear
            class="!rounded-lg !h-10"
          >
            <template #prefix>
              <UserOutlined class="text-text-tertiary" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="用户名" class="!mb-4">
          <a-input
            v-model:value="searchParams.userName"
            placeholder="输入用户名"
            allow-clear
            class="!rounded-lg !h-10"
          >
            <template #prefix>
              <UserOutlined class="text-text-tertiary" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item class="!mb-0">
          <a-button html-type="submit" class="custom-btn-light-style"> 搜索</a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 数据表单 -->
    <div class="glass-container rounded-xl p-4">
      <a-table
        :columns="columns"
        :data-source="dataList"
        :pagination="pagination"
        @change="doTableChange"
        class="custom-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'userAvatar'">
            <a-image :src="record.userAvatar" :width="60" class="rounded-lg shadow-sm" />
          </template>
          <template v-else-if="column.dataIndex === 'userRole'">
            <div v-if="record.userRole === 'admin'">
              <a-tag color="red" class="!rounded-full !px-3 !py-1">管理员</a-tag>
            </div>
            <div v-else>
              <a-tag color="blue" class="!rounded-full !px-3 !py-1">普通用户</a-tag>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'createTime'">
            <span class="text-text-secondary">{{
              dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
            }}</span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button danger @click="doDelete(record.id)" class="!rounded-lg danger-btn">
              删除
            </a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { deleteUserUsingPost, listUserVoByPageUsingPost } from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { UserOutlined } from '@ant-design/icons-vue'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 数据
const dataList = ref<API.UserVO[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
})

// 获取数据
const fetchData = async () => {
  const res = await listUserVoByPageUsingPost({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})

// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 获取数据
const doSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}

// 删除数据
const doDelete = async (id: number) => {
  if (!id) {
    return
  }
  const res = await deleteUserUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}
</script>

<style scoped>
.search-area {
  margin: 8px 24px 24px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  #userManagePage {
    padding: 16px;
  }

  .glass-container {
    padding: 16px !important;
  }

  .search-form {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  #userManagePage {
    padding: 12px;
  }

  .glass-container {
    padding: 12px !important;
  }
}
</style>
