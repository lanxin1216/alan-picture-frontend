<template>
  <div class="masonry-layout">
    <!-- 瀑布流布局 -->
    <div
      class="masonry-container"
      ref="masonryContainer"
      :style="{ gridTemplateColumns: `repeat(auto-fill, minmax(${columnWidth}px, 1fr))` }"
    >
      <div
        v-for="(picture, index) in dataList"
        :key="picture.id"
        class="masonry-item"
        @click="doClickPicture(picture)"
      >
        <!-- 图片容器 -->
        <div class="image-container">
          <img
            :src="picture.thumbnailUrl || picture.url"
            :alt="picture.name"
            class="image-content"
            loading="lazy"
          />

          <!-- 悬停遮罩层 -->
          <div class="hover-overlay">
            <!-- 左上角：图片名称和标签 -->
            <div class="top-left-content">
              <div class="picture-name">{{ picture.name }}</div>
              <div class="tags-container">
                <span v-for="tag in picture.tags?.slice(0, 3)" :key="tag" class="tag">
                  {{ tag }}
                </span>
                <span v-if="(picture.tags?.length || 0) > 3" class="tag-more">
                  +{{ (picture.tags?.length || 0) - 3 }}
                </span>
              </div>
            </div>

            <!-- 左下角：用户信息 -->
            <div class="bottom-left-content">
              <div class="user-info" @click.stop="visitUserProfile(picture.user)">
                <a-avatar :src="picture.user?.userAvatar" :size="32" class="user-avatar" />
                <span class="user-name">{{ picture.user?.userName || '匿名用户' }}</span>
              </div>
            </div>

            <!-- 右下角：操作按钮 -->
            <div class="bottom-right-content">
              <a-tooltip title="分享">
                <a-button type="text" @click.stop="doShare(picture)" class="action-btn">
                  <template #icon>
                    <ShareAltOutlined />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="下载">
                <a-button type="text" @click.stop="doDownload(picture)" class="action-btn">
                  <template #icon>
                    <DownloadOutlined />
                  </template>
                </a-button>
              </a-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" />
    </div>

    <!-- 空状态 -->
    <div v-else-if="dataList.length === 0" class="empty-container">
      <a-empty description="暂无图片" />
    </div>

    <ShareModal ref="shareModalRef" :link="shareLink" title="分享图片" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ShareAltOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import ShareModal from '@/components/ShareModal.vue'

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
  canEdit?: boolean
  canDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
  canEdit: false,
  canDelete: false,
})

// 响应式数据
const masonryContainer = ref<HTMLElement>()
const shareModalRef = ref()
const shareLink = ref<string>()

// 计算列宽（根据容器宽度动态计算）
const columnWidth = computed(() => {
  if (!masonryContainer.value) return 280
  const containerWidth = masonryContainer.value.offsetWidth
  if (containerWidth >= 1920) return 320 // 大屏幕
  if (containerWidth >= 1200) return 280 // 桌面端
  if (containerWidth >= 768) return 240 // 平板
  return 180 // 手机
})

// 路由
const router = useRouter()

// 点击图片查看详情
const doClickPicture = (picture: API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}

// 访问用户主页
const visitUserProfile = (user: API.UserVO) => {
  if (user?.id) {
    router.push({
      path: `/user/${user.id}`,
    })
  }
}

// 分享图片
const doShare = (picture: API.PictureVO) => {
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  if (shareModalRef.value) {
    shareModalRef.value.openModal()
  }
}

// 下载缩略图
const doDownload = async (picture: API.PictureVO) => {
  try {
    const imageUrl = picture.thumbnailUrl || picture.url
    if (!imageUrl) {
      message.error('图片地址无效')
      return
    }

    // 创建下载链接
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${picture.name || 'image'}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    message.success('下载成功')
  } catch (error) {
    console.error('下载失败:', error)
    message.error('下载失败')
  }
}

// 响应式布局调整
const handleResize = () => {
  // 触发重新渲染
  nextTick(() => {
    // 这里可以添加 masonry 布局的逻辑
  })
}

// 生命周期
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.masonry-layout {
  width: 100%;
  position: relative;
}

/*Masonry 核心：使用 column-count 代替 grid ★ */
.masonry-container {
  column-count: 4; /* 默认四列 */
  column-gap: 16px;
  padding: 0 16px;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 16px;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.masonry-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

/* 下面内容全部保持不动： */
.image-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
}

.image-content {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.masonry-item:hover .image-content {
  transform: scale(1.05);
}

/* 悬停效果 */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 30%,
    rgba(0, 0, 0, 0.1) 70%,
    rgba(0, 0, 0, 0.4) 100%
  );
  opacity: 0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  color: white;
}

.masonry-item:hover .hover-overlay {
  opacity: 1;
}

.top-left-content {
  text-align: left;
}

.picture-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.tag-more {
  background: rgba(255, 255, 255, 0.7);
  color: #666;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.bottom-left-content {
  text-align: left;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.user-info:hover {
  opacity: 0.8;
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.bottom-right-content {
  text-align: right;
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

.action-btn {
  color: white !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 6px !important;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: scale(1.1);
}

/* loading / empty 保留 */
.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
}

/* ★ 响应式 column-count ★ */
@media (max-width: 1600px) {
  .masonry-container {
    column-count: 3;
  }
}

@media (max-width: 1024px) {
  .masonry-container {
    column-count: 2;
  }
}

@media (max-width: 640px) {
  .masonry-container {
    column-count: 1;
  }
}
</style>
