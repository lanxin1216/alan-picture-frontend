<template>
  <div class="picture-list">
    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <!-- 单张图片 -->
          <a-card
            hoverable
            @click="doClickPicture(picture)"
            class="glass-container !border !border-glass-border !rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <template #cover>
              <img
                style="height: 200px; object-fit: cover; width: 100%"
                :alt="picture.name"
                :src="picture.thumbnailUrl ?? picture.url"
                loading="lazy"
                class="transition-transform duration-300 hover:scale-110"
              />
            </template>
            <a-card-meta :title="picture.name" class="p-3">
              <template #description>
                <div class="flex flex-wrap gap-1 mt-2">
                  <a-tag
                    color="blue"
                    class="!rounded-lg !border !border-blue-200 !bg-blue-50 !text-blue-600 selected-bg"
                  >
                    {{ picture.category ?? '默认' }}
                  </a-tag>
                  <a-tag
                    v-for="tag in picture.tags"
                    :key="tag"
                    class="!rounded-lg !border !border-gray-200 !bg-gray-50 !text-gray-600 selected-bg"
                  >
                    {{ tag }}
                  </a-tag>
                </div>
              </template>
            </a-card-meta>
            <template v-if="showOp" #actions>
              <div class="flex justify-around p-2">
                <search-outlined
                  @click="(e) => doSearch(picture, e)"
                  class="text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
                />
                <share-alt-outlined
                  @click="(e) => doShare(picture, e)"
                  class="text-green-500 hover:text-green-700 cursor-pointer transition-colors"
                />
                <edit-outlined
                  v-if="canEdit"
                  @click="(e) => doEdit(picture, e)"
                  class="text-orange-500 hover:text-orange-700 cursor-pointer transition-colors"
                />
                <delete-outlined
                  v-if="canDelete"
                  @click="(e) => doDelete(picture, e)"
                  class="text-red-500 hover:text-red-700 cursor-pointer transition-colors"
                />
              </div>
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>

  <ShareModal ref="shareModalRef" :link="shareLink" title="分享图片" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue'
import { deletePictureUsingPost } from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import ShareModal from '@/components/ShareModal.vue'
import { ref } from 'vue'

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

// 跳转至图片详情
const router = useRouter()
const doClickPicture = (picture: API.Picture) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}

// ---------- 编辑 ----------
const doEdit = (picture, e) => {
  e.stopPropagation()
  router.push({
    path: '/add_picture',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

// ---------- 删除 ----------
const doDelete = async (picture, e) => {
  e.stopPropagation()
  const id = picture.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    // 让外层刷新
    props.onReload?.()
  } else {
    message.error('删除失败')
  }
}

// ---------- 搜索 ----------
const doSearch = (picture, e) => {
  e.stopPropagation()
  window.open(`/search_picture?pictureId=${picture.id}`)
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
.picture-list {
  width: 100%;
}

/* 自定义卡片样式 */
:deep(.ant-card-body) {
  padding: 12px !important;
}

:deep(.ant-card-meta-title) {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: var(--text-primary) !important;
  margin-bottom: 8px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.ant-card-meta-description) {
  margin-top: 0 !important;
}

/* 自定义标签样式 */
:deep(.ant-tag) {
  margin: 2px !important;
  font-size: 12px !important;
  border-radius: 6px !important;
  padding: 2px 6px !important;
}

/* 自定义列表样式 */
:deep(.ant-list-grid .ant-col > .ant-list-item) {
  padding: 0 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.ant-card-body) {
    padding: 8px !important;
  }

  :deep(.ant-card-meta-title) {
    font-size: 13px !important;
  }

  :deep(.ant-tag) {
    font-size: 11px !important;
    padding: 1px 4px !important;
  }
}

@media (max-width: 480px) {
  .picture-list {
    padding: 0 8px;
  }
}
</style>
