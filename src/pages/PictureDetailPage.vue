<template>
  <div class="pictureDetailPage min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 图片展示区 -->
        <div class="lg:col-span-2">
          <div class="glass-container rounded-2xl shadow-xl p-6">
            <div class="text-center mb-4">
              <h2 class="text-2xl font-bold bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent">
                图片预览
              </h2>
            </div>
            <div class="flex justify-center">
              <a-image 
                style="max-height: 600px; object-fit: contain" 
                :src="picture.previewUrl"
                class="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        <!-- 图片信息区 -->
        <div class="lg:col-span-1">
          <div class="glass-container rounded-2xl shadow-xl p-6">
            <div class="text-center mb-6">
              <h2 class="text-2xl font-bold bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent">
                图片信息
              </h2>
            </div>
            
            <div class="space-y-4">
              <!-- 作者信息 -->
              <div class="author-info glass-container rounded-xl p-4">
                <div class="flex items-center space-x-3">
                  <a-avatar :size="40" :src="picture.user?.userAvatar" class="border-2 border-white shadow-sm" />
                  <div>
                    <div class="font-semibold text-text-primary">{{ picture.user?.userName }}</div>
                    <div class="text-sm text-text-secondary">作者</div>
                  </div>
                </div>
              </div>

              <!-- 基本信息 -->
              <div class="info-grid grid grid-cols-2 gap-3">
                <div class="info-item">
                  <div class="text-sm text-text-secondary">名称</div>
                  <div class="font-medium text-text-primary">{{ picture.name ?? '未命名' }}</div>
                </div>
                <div class="info-item">
                  <div class="text-sm text-text-secondary">分类</div>
                  <div class="font-medium text-text-primary">{{ picture.category ?? '默认' }}</div>
                </div>
                <div class="info-item">
                  <div class="text-sm text-text-secondary">格式</div>
                  <div class="font-medium text-text-primary">{{ picture.picFormat ?? '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="text-sm text-text-secondary">大小</div>
                  <div class="font-medium text-text-primary">{{ formatSize(picture.picSize) }}</div>
                </div>
              </div>

              <!-- 尺寸信息 -->
              <div class="dimensions-info glass-container rounded-xl p-4">
                <div class="text-center mb-2">
                  <div class="text-sm text-text-secondary">图片尺寸</div>
                </div>
                <div class="flex justify-between items-center">
                  <div class="text-center">
                    <div class="text-lg font-bold text-primary-blue">{{ picture.picWidth ?? '-' }}</div>
                    <div class="text-xs text-text-secondary">宽度</div>
                  </div>
                  <div class="text-text-tertiary">×</div>
                  <div class="text-center">
                    <div class="text-lg font-bold text-primary-blue">{{ picture.picHeight ?? '-' }}</div>
                    <div class="text-xs text-text-secondary">高度</div>
                  </div>
                  <div class="text-text-tertiary">=</div>
                  <div class="text-center">
                    <div class="text-lg font-bold text-primary-blue">{{ picture.picScale ?? '-' }}</div>
                    <div class="text-xs text-text-secondary">宽高比</div>
                  </div>
                </div>
              </div>

              <!-- 标签 -->
              <div class="tags-section">
                <div class="text-sm text-text-secondary mb-2">标签</div>
                <div class="flex flex-wrap gap-2">
                  <a-tag 
                    v-for="tag in picture.tags" 
                    :key="tag"
                    class="!rounded-full !px-3 !py-1 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300"
                  >
                    {{ tag }}
                  </a-tag>
                </div>
              </div>

              <!-- 简介 -->
              <div class="introduction-section">
                <div class="text-sm text-text-secondary mb-2">简介</div>
                <div class="glass-container rounded-xl p-3">
                  <p class="text-text-primary leading-relaxed">{{ picture.introduction ?? '暂无简介' }}</p>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons mt-6 space-y-3">
              <a-button 
                v-if="canEdit" 
                type="default" 
                @click="doEdit"
                class="w-full !rounded-lg !h-12 selected-bg"
                size="large"
              >
                <template #icon>
                  <EditOutlined />
                </template>
                编辑图片
              </a-button>
              <a-button 
                v-if="canDelete" 
                danger 
                @click="doDelete"
                class="w-full !rounded-lg !h-12 selected-bg"
                size="large"
              >
                <template #icon>
                  <DeleteOutlined />
                </template>
                删除图片
              </a-button>
              <a-button 
                type="primary" 
                @click="doDownload"
                class="w-full !rounded-lg !h-12 core-btn-primary"
                size="large"
              >
                <template #icon>
                  <DownloadOutlined />
                </template>
                原图下载
              </a-button>
              <a-button 
                type="primary" 
                ghost 
                @click="doShare"
                class="w-full !rounded-lg !h-12 selected-bg"
                size="large"
              >
                <template #icon>
                  <share-alt-outlined />
                </template>
                分享图片
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ShareModal ref="shareModalRef" :link="shareLink" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { deletePictureUsingPost, getPictureVoByIdUsingGet } from '@/api/pictureController.ts'
import { DeleteOutlined, EditOutlined, DownloadOutlined, ShareAltOutlined} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { downloadImage, formatSize } from '@/utils'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
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
      spaceId: picture.value.spaceId
    }
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
const doShare = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  if (shareModalRef.value) {
    shareModalRef.value.openModal()
  }
}
</script>

<style scoped>
.pictureDetailPage {
  min-height: 100vh;
}

.glass-container {
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
}

.author-info {
  background: linear-gradient(135deg, var(--glass-bg-light) 0%, var(--glass-bg) 100%);
}

.dimensions-info {
  background: linear-gradient(135deg, var(--glass-bg-light) 0%, var(--glass-bg) 100%);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  background: var(--glass-bg-light);
  border-radius: 8px;
  padding: 8px 12px;
  border: 1px solid var(--glass-border);
}

.tags-section .ant-tag {
  margin: 0;
}

.introduction-section .glass-container {
  background: var(--glass-bg-light);
}

.action-buttons .ant-btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-buttons .ant-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 自定义图片样式 */
:deep(.ant-image) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.ant-image-img) {
  border-radius: 12px;
}

:deep(.ant-avatar) {
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .pictureDetailPage {
    padding: 16px;
  }
  
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .pictureDetailPage {
    padding: 12px;
  }
  
  .glass-container {
    padding: 16px !important;
  }
  
  .action-buttons .ant-btn {
    height: 44px !important;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .pictureDetailPage {
    padding: 8px;
  }
  
  .glass-container {
    padding: 12px !important;
  }
  
  .info-grid {
    gap: 8px;
  }
  
  .info-item {
    padding: 6px 8px;
  }
  
  .action-buttons .ant-btn {
    height: 40px !important;
    font-size: 13px;
  }
}
</style>
