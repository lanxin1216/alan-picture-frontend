<template>
  <div class="pictureDetailPage bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100 py-8">
    <div class="max-w-7xl px-6">
      <!-- 主体左右布局 -->
      <div class="picture-layout">
        <!-- 图片展示区 -->
        <div class="picture-view">
          <div class="image-wrapper">
            <a-image
              :src="picture.previewUrl"
              alt="图片预览"
              class="main-image"
              style="max-height: 600px; object-fit: contain"
            />
          </div>
        </div>

        <!-- 图片信息区 -->
        <div class="picture-info glass-container">
          <h3>图片信息</h3>

          <div>
            <!-- 作者 -->
            <div class="author-info">
              <a-avatar :size="48" :src="picture.user?.userAvatar" />
              <div>
                <div class="author-name">{{ picture.user?.userName || '匿名用户' }}</div>
                <div class="author-role">作者</div>
              </div>
            </div>
            <a-descriptions bordered :column="2" size="small" class="rounded-lg shadow-sm p-4">
              <a-descriptions-item label="名称">
                {{ picture.name ?? '未命名' }}
              </a-descriptions-item>

              <a-descriptions-item label="分类">
                {{ picture.category ?? '默认' }}
              </a-descriptions-item>

              <a-descriptions-item label="格式">
                {{ picture.picFormat ?? '-' }}
              </a-descriptions-item>

              <a-descriptions-item label="大小">
                {{ formatSize(picture.picSize) }}
              </a-descriptions-item>
              <a-descriptions-item label="标签" :span="2">
                <a-tag
                  v-for="tag in picture.tags"
                  :key="tag"
                  class="!rounded-full !px-3 !py-1 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300"
                >
                  {{ tag }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="简介" :span="2">
                {{ picture.introduction ?? '暂无简介' }}
              </a-descriptions-item>
            </a-descriptions>

            <!-- 尺寸 -->
            <div class="dimension-box">
              <div class="dimension-title">图片尺寸</div>
              <div class="dimension-values">
                <div class="dim-item">
                  <div class="dim-value">{{ picture.picWidth ?? '-' }}</div>
                  <div class="dim-label">宽度</div>
                </div>
                <div class="dim-symbol">×</div>
                <div class="dim-item">
                  <div class="dim-value">{{ picture.picHeight ?? '-' }}</div>
                  <div class="dim-label">高度</div>
                </div>
                <div class="dim-symbol">=</div>
                <div class="dim-item">
                  <div class="dim-value">{{ picture.picScale ?? '-' }}</div>
                  <div class="dim-label">宽高比</div>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="actions">
              <a-divider  style="margin: 8px"/>
              <div class="action-group primary-actions">
                <a-button
                  type="primary"
                  @click="doDownload"
                  class="custom-btn-dark-style"
                  size="large"
                >
                  <DownloadOutlined />
                  原图下载
                </a-button>
                <a-button type="primary" ghost @click="doShare" size="large">
                  <ShareAltOutlined />
                  分享图片
                </a-button>
              </div>
              <div class="action-group secondary-actions">
                <a-button
                  v-if="canEdit"
                  type="default"
                  @click="doEdit"
                  class="custom-btn-light-style"
                  size="large"
                >
                  <EditOutlined />
                  编辑图片
                </a-button>
                <a-button v-if="canDelete" danger @click="doDelete" class="action-btn" size="large">
                  <DeleteOutlined />
                  删除图片
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ShareModal ref="shareModalRef" :link="shareLink" title="分享图片" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  DeleteOutlined,
  EditOutlined,
  DownloadOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue'
import { deletePictureUsingPost, getPictureVoByIdUsingGet } from '@/api/pictureController'
import { downloadImage, formatSize } from '@/utils'
import router from '@/router'
import { SPACE_PERMISSION_ENUM } from '@/constants/space.ts'
import ShareModal from '@/components/ShareModal.vue'

const props = defineProps<{
  id: string | number
}>()
const picture = ref<API.PictureVO>({})

// 通用权限检查函数
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (picture.value.permissionList ?? []).includes(permission)
  })
}

// 定义权限检查
const canEdit = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDelete = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)

/**
 * 获取图片详情
 */
const fetchPictureDetail = async () => {
  try {
    const res = await getPictureVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('获取图片详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取图片详情失败：' + e.message)
  }
}

onMounted(() => {
  fetchPictureDetail()
})

// /**
//  * 权限判断
//  */
// const loginUserStore = useLoginUserStore()
// // 是否具有编辑权限
// const canEdit = computed(() => {
//   const loginUser = loginUserStore.loginUser
//   // 未登录不可编辑
//   if (!loginUser.id) {
//     return false
//   }
//   // 仅本人或管理员可编辑
//   const user = picture.value.user || {}
//   return loginUser.id === user.id || loginUser.userRole === 'admin'
// })

/**
 * 编辑
 */
const doEdit = () => {
  router.push({
    path: '/add_picture',
    query: {
      id: picture.value.id,
      spaceId: picture.value.spaceId,
    },
  })
}

/**
 * 删除
 */
const doDelete = async () => {
  const id = picture.value.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
  } else {
    message.error('删除失败')
  }
}

/**
 * 下载
 */
const doDownload = () => {
  downloadImage(picture.value.url)
}

// ---------- 分享 ----------
// 分享弹窗引用
const shareModalRef = ref()
// 分享链接
const shareLink = ref<string>()

// 分享
const doShare = (e: Event) => {
  e.stopPropagation()
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  if (shareModalRef.value) {
    shareModalRef.value.openModal()
  }
}
</script>

<style scoped>
.picture-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.glass-container {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.picture-view {
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-image {
  border-radius: 12px;
  max-width: 100%;
  height: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 信息区样式 */
.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 12px;
}

.author-name {
  font-weight: 600;
  color: #333;
}

.author-role {
  font-size: 13px;
  color: #888;
}

/* 操作按钮 */
.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px;
}

.action-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-actions {
  order: 1;
}

.secondary-actions {
  order: 2;
}

.action-group > .ant-btn {
  flex: 1;
  min-width: 120px;
}

/* 尺寸信息 */
.dimension-box {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}

.dimension-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
}

.dimension-values {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.dim-item {
  text-align: center;
}

.dim-value {
  color: #1677ff;
  font-weight: 600;
}

.dim-label {
  font-size: 12px;
  color: #777;
}

.dim-symbol {
  color: #999;
  font-weight: bold;
}

/* 响应式 */
@media (max-width: 1024px) {
  .picture-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .action-group {
    flex-direction: column;
  }

  .action-group > .ant-btn {
    width: 100%;
  }
}
</style>
