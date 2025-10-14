<template>
  <div class="spaceDetailPage space-y-6">
    <!-- 空间信息头部 -->
    <div class="glass-container p-6 rounded-xl">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-text-primary mb-1">
            {{ space.spaceName }}（{{ SPACE_TYPE_MAP[space.spaceType] }}）
          </h2>
          <p class="text-text-secondary text-sm">空间ID: {{ id }}</p>
        </div>
        <a-space size="middle">
          <a-tooltip
            :title="`占用空间 ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`"
          >
            <a-progress
              type="circle"
              :percent="((space.totalSize * 100) / space.maxSize).toFixed(1)"
              :size="48"
              stroke-color="#1890ff"
              class="custom-progress"
            />
          </a-tooltip>
          <a-button
            v-if="canUploadPicture"
            type="primary"
            :href="`/add_picture?spaceId=${id}`"
            target="_blank"
            class="!rounded-lg core-btn-primary"
          >
            + 创建图片
          </a-button>
          <a-button 
            :icon="h(EditOutlined)" 
            @click="doBatchEdit"
            class="!rounded-lg glass-container !border !border-glass-border"
          >
            批量编辑
          </a-button>
          <a-button
            v-if="canManageSpaceUser && SPACE_TYPE_ENUM.TEAM == space.spaceType"
            type="primary"
            ghost
            :icon="h(TeamOutlined)"
            :href="`/spaceUserManage/${id}`"
            target="_blank"
            class="!rounded-lg selected-bg"
          >
            成员管理
          </a-button>
          <a-button
            v-if="canManageSpaceUser"
            type="primary"
            ghost
            :icon="h(BarChartOutlined)"
            :href="`/space_analyze?spaceId=${id}`"
            target="_blank"
            class="!rounded-lg selected-bg"
          >
            空间分析
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 搜索表单 -->
    <div class="glass-container p-6 rounded-xl">
      <PictureSearchForm :onSearch="onSearch" />
    </div>

    <!-- 图片列表 -->
    <div class="glass-container p-6 rounded-xl">
      <PictureList
        :dataList="dataList"
        showOp
        :onReload="fetchData"
        :loading="loading"
        :canEdit="canEditPicture"
        :canDelete="canDeletePicture"
      />
    </div>

    <!-- 分页 -->
    <div class="glass-container p-4 rounded-xl flex justify-center">
      <a-pagination
        v-model:current="searchParams.current"
        v-model:pageSize="searchParams.pageSize"
        :total="total"
        :show-total="() => `图片总数 ${total} / ${space.maxCount}`"
        @change="onPageChange"
        class="custom-pagination"
        show-size-changer
        show-quick-jumper
      />
    </div>
  </div>

  <BatchEditPictureModal
    ref="batchEditPictureModalRef"
    :spaceId="id"
    :pictureList="dataList"
    :onSuccess="onBatchEditPictureSuccess"
  />
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue'
import { getSpaceVoByIdUsingGet } from '@/api/spaceController.ts'
import { message } from 'ant-design-vue'
import { BarChartOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons-vue'
import { downloadImage, formatSize } from '@/utils'
import { listPictureVoByPageUsingPost } from '@/api/pictureController.ts'
import PictureList from '@/components/PictureList.vue'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import { SPACE_PERMISSION_ENUM, SPACE_TYPE_ENUM, SPACE_TYPE_MAP } from '../constants/space.ts'
import BatchEditPictureModal from '@/components/BatchEditPictureModal.vue'

const props = defineProps<{
  id: string | number
}>()
const space = ref<API.SpaceVO>({})

// 通用权限检查函数
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (space.value.permissionList ?? []).includes(permission)
  })
}

// 定义权限检查
const canManageSpaceUser = createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE)
const canUploadPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_UPLOAD)
const canEditPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDeletePicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)

// ---------- 获取空间详情 ----------
const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取空间详情失败：' + e.message)
  }
}

onMounted(() => {
  fetchSpaceDetail()
})

// 数据
const dataList = ref([])
const total = ref(0)
const loading = ref(true)

// 搜索条件
const searchParams = ref<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const onPageChange = (page, pageSize) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  fetchData()
}

// 搜索
const onSearch = (newSearchParams: API.PictureQueryRequest) => {
  searchParams.value = {
    ...searchParams.value,
    ...newSearchParams,
    current: 1,
  }
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    spaceId: props.id,
    ...searchParams.value,
  }
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

// 批量编辑弹窗引用
const batchEditPictureModalRef = ref()

// 批量编辑成功后，刷新数据
const onBatchEditPictureSuccess = () => {
  fetchData()
}
// 打开批量编辑弹窗
const doBatchEdit = () => {
  if (batchEditPictureModalRef.value) {
    batchEditPictureModalRef.value.openModal()
  }
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

// 监听空间id变化
watch(
  () => props.id,
  (newSpaceId) => {
    fetchSpaceDetail()
    fetchData()
  },
)
</script>

<style scoped>
.spaceDetailPage {
  min-height: calc(100vh - 8rem);
}

/* 自定义进度条样式 */
:deep(.custom-progress .ant-progress-text) {
  color: var(--text-primary) !important;
  font-weight: 600 !important;
}

/* 自定义分页样式 */
:deep(.custom-pagination .ant-pagination-item) {
  border-radius: 8px !important;
  border: 1px solid var(--glass-border) !important;
  background: var(--glass-bg-light) !important;
}

:deep(.custom-pagination .ant-pagination-item-active) {
  background: var(--selected-bg) !important;
  border-color: var(--primary-blue) !important;
}

:deep(.custom-pagination .ant-pagination-item a) {
  color: var(--text-primary) !important;
}

:deep(.custom-pagination .ant-pagination-item-active a) {
  color: white !important;
}

:deep(.custom-pagination .ant-pagination-prev, .custom-pagination .ant-pagination-next) {
  border-radius: 8px !important;
  border: 1px solid var(--glass-border) !important;
  background: var(--glass-bg-light) !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .spaceDetailPage {
    padding: 0 8px;
  }
  
  .glass-container {
    padding: 16px !important;
  }
  
  :deep(.flex.justify-between.items-center) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  :deep(a-space) {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .glass-container {
    padding: 12px !important;
  }
  
  :deep(a-space) {
    gap: 8px !important;
  }
  
  :deep(a-button) {
    font-size: 14px !important;
    padding: 4px 8px !important;
  }
}
</style>
