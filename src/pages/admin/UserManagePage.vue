<template>
  <div id="userManagePage" class="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100 p-6">
    <div class="glass-container rounded-2xl shadow-xl p-6">
      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent">
          用户管理
        </h1>
        <p class="text-text-secondary mt-2">管理系统用户账号和权限</p>
      </div>

      <!-- 搜索区域 -->
      <div class="search-area glass-container rounded-xl p-6 mb-6">
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
            <a-button 
              type="primary" 
              html-type="submit"
              class="!rounded-lg !h-10 bg-gradient-to-r from-primary-blue to-dark-blue hover:from-primary-blue-hover hover:to-primary-blue"
            >
              搜索
            </a-button>
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
              <a-image 
                :src="record.userAvatar" 
                :width="60" 
                class="rounded-lg shadow-sm"
              />
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
              <span class="text-text-secondary">{{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
            <template v-else-if="column.key === 'action'">
              <a-button 
                danger 
                @click="doDelete(record.id)"
                class="!rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              >
                删除
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
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
#userManagePage {
  min-height: 100vh;
}

.glass-container {
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
}

.search-area {
  margin-bottom: 24px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
}

.custom-table {
  border-radius: 12px;
  overflow: hidden;
}

/* 自定义表格样式 */
:deep(.custom-table .ant-table) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.custom-table .ant-table-thead > tr > th) {
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--dark-blue) 100%) !important;
  color: white !important;
  font-weight: 600 !important;
  border-bottom: 1px solid var(--glass-border) !important;
}

:deep(.custom-table .ant-table-tbody > tr > td) {
  background: var(--glass-bg-light) !important;
  border-bottom: 1px solid var(--glass-border) !important;
}

:deep(.custom-table .ant-table-tbody > tr:hover > td) {
  background: var(--glass-bg-hover) !important;
}

:deep(.custom-table .ant-pagination-item) {
  border-radius: 8px !important;
  border: 1px solid var(--glass-border) !important;
  background: var(--glass-bg-light) !important;
}

:deep(.custom-table .ant-pagination-item-active) {
  background: linear-gradient(135deg, var(--primary-blue) 0%, var(--dark-blue) 100%) !important;
  border-color: var(--primary-blue) !important;
}

:deep(.custom-table .ant-pagination-item a) {
  color: var(--text-primary) !important;
}

:deep(.custom-table .ant-pagination-item-active a) {
  color: white !important;
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
  
  :deep(.ant-form-item) {
    margin-bottom: 0 !important;
    width: 100%;
  }
  
  :deep(.ant-input),
  :deep(.ant-btn) {
    width: 100% !important;
  }
}

@media (max-width: 480px) {
  #userManagePage {
    padding: 12px;
  }
  
  .glass-container {
    padding: 12px !important;
  }
  
  :deep(.custom-table .ant-table) {
    font-size: 14px;
  }
  
  :deep(.custom-table .ant-table-thead > tr > th) {
    font-size: 13px;
    padding: 8px 4px;
  }
  
  :deep(.custom-table .ant-table-tbody > tr > td) {
    padding: 8px 4px;
  }
}
</style>
