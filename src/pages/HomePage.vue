<template>
  <div id="homepage" class="space-y-6">
    <!-- 搜索框 -->
    <div class="search-bar glass-container">
      <a-input-search
        placeholder="从图库中搜索"
        v-model:value="searchParams.searchText"
        enter-button="搜索"
        size="large"
        class="w-full custom-search-input"
        @search="doSearch"
      />
    </div>

    <!-- 分类 + 标签 -->
    <div>
      <a-tabs v-model:activeKey="selectedCategory" @change="doSearch" class="mb-4">
        <a-tab-pane key="all" tab="全部" />
        <a-tab-pane v-for="category in categoryList" :key="category" :tab="category" />
      </a-tabs>

      <div class="tag-bar">
        <span class="text-text-secondary font-medium mr-3">标签：</span>
        <a-space :size="[8, 8]" wrap>
          <a-checkable-tag
            v-for="(tag, index) in tagList"
            :key="tag"
            v-model:checked="selectedTagList[index]"
            class="transition-all duration-300 hover:scale-105"
            @change="doSearch"
          >
            {{ tag }}
          </a-checkable-tag>
        </a-space>
      </div>
    </div>

    <!-- 图片列表 -->
    <div class="p-6 rounded-xl">
      <PictureListMasonry :dataList="dataList" :loading="loading" />
    </div>

    <div ref="loadMoreRef" class="h-12"></div>
    <div v-if="loading" class="text-center py-6 text-gray-500">加载中...</div>
    <div v-if="noMore" class="text-center py-6 text-gray-400">没有更多内容了</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import {
  listPictureTagCategoryUsingGet,
  listPictureVoByPageUsingPost,
} from '@/api/pictureController.ts'
import PictureListMasonry from '@/components/PictureListMasonry.vue'

// 数据
const dataList = ref([])
const loading = ref(false)
const noMore = ref(false)

const loadMoreRef = ref<HTMLElement | null>(null)

// 分类和标签
const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagList = ref<string[]>([])

// 搜索条件（使用倒序，根据创建时间）
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 20,
  sortField: 'createTime',
  sortOrder: 'descend',
})

/**
 * 获取页面数据
 */
const fetchData = async () => {
  if (loading.value || noMore.value) return
  loading.value = true
  // 转换搜索参数
  const params = {
    ...searchParams,
    tags: [],
  }

  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  // 标签数据转换（因为组件中tag选中数组类似：[true, false, true]，而接口需要的是：['tag1', 'tag3']）
  selectedTagList.value.forEach((useTag, index) => {
    if (useTag) {
      params.tags.push(tagList.value[index])
    }
  })

  const res = await listPictureVoByPageUsingPost(params)
  loading.value = false
  if (!res.data.data) {
    message.error('加载失败：' + res.data.message)
    return
  }
  const records = res.data.data.records ?? []
  // 第一页重置
  if (searchParams.current === 1) {
    dataList.value = records
  } else {
    dataList.value.push(...records)
  }

  // 判断是否加载到底
  if (records.length < searchParams.pageSize) {
    noMore.value = true
  }
}

/** 滚动到底时自动触发加载更多 */
let observer: IntersectionObserver
const initObserver = () => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading.value && !noMore.value) {
      searchParams.current++
      fetchData()
    }
  })

  if (loadMoreRef.value) {
    observer.observe(loadMoreRef.value)
  }
}

// 页面加载时
onMounted(() => {
  fetchData()
  initObserver()
  getTagCategoryOptions()
})

/**
 * 搜索
 */
const doSearch = () => {
  searchParams.current = 1
  noMore.value = false
  dataList.value = []    // 建议清空，避免闪烁
  fetchData()

  // 关键：重新监听
  observer.disconnect()
  initObserver()
}


/**
 * 获取标签和分类选项
 */
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // 转换成下拉选项组件接受的格式
    categoryList.value = res.data.data.categoryList ?? []
    tagList.value = res.data.data.tagList ?? []
  } else {
    message.error('加载分类标签失败，' + res.data.message)
  }
}
</script>

<style scoped>
#homepage {
  min-height: calc(100vh - 8rem);
}

.search-bar {
  max-width: 600px;
  margin: 0 auto;
}

/* 自定义搜索框样式 */
:deep(.custom-search-input .ant-input-search-button) {
  border: none !important;
  background: var(--core-btn-light-bg) !important;
  color: var(--core-btn-light-text) !important;
  box-shadow: var(--core-btn-light-shadow) !important;
}

:deep(.custom-search-input .ant-input-search-button:hover) {
  background: var(--core-btn-light-hover) !important;
  color: var(--core-btn-light-text) !important;
  box-shadow: var(--core-btn-light-shadow) !important;
}

.tag-bar {
  margin-bottom: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-bar {
    max-width: 100%;
    padding: 16px !important;
  }

  .tag-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  :deep(.ant-space) {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  #homepage {
    padding: 8px;
  }

  .glass-container {
    padding: 12px !important;
  }
}
</style>
