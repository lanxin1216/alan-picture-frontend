<template>
  <div id="addPicturePage" class="max-w-4xl space-y-6">
    <!-- 标题区域 -->
    <div class="p-6 rounded-xl">
      <h2 class="text-2xl font-bold text-text-primary mb-2">
        {{ route.query?.id ? '修改图片' : '上传图片' }}
      </h2>
      <a-typography-paragraph v-if="spaceId" type="secondary" class="!mb-0">
        保存至空间：<a
          :href="`/space/${spaceId}`"
          target="_blank"
          class="text-primary-blue hover:underline"
          >{{ spaceId }}</a
        >
      </a-typography-paragraph>
    </div>

    <!-- 上传方式选择 -->
    <div class="rounded-xl">
      <a-tabs v-model:activeKey="uploadType" class="custom-tabs">
        <a-tab-pane key="file" tab="文件上传">
          <PictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
        </a-tab-pane>
        <a-tab-pane key="url" tab="URL 上传" force-render>
          <UrlPictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 图片编辑区域 -->
    <div v-if="picture" class="p-6 rounded-xl text-center">
      <div class="edit-bar">
        <a-space size="middle">
          <a-button
            :icon="h(EditOutlined)"
            @click="doEditPicture"
            class="custom-btn-light-style !border !border-glass-border !rounded-lg"
          >
            编辑图片
          </a-button>
          <a-button
            type="primary"
            :icon="h(FullscreenOutlined)"
            @click="doImagePainting"
            class="!rounded-lg custom-btn-dark-style"
          >
            AI 扩图
          </a-button>
        </a-space>
      </div>
      <ImageCropper
        ref="imageCropperRef"
        :imageUrl="picture?.url"
        :picture="picture"
        :spaceId="spaceId"
        :space="space"
        :onSuccess="onCropSuccess"
      />
      <ImageOutPainting
        ref="imageOutPaintingRef"
        :picture="picture"
        :spaceId="spaceId"
        :onSuccess="onImageOutPaintingSuccess"
      />
    </div>

    <!-- 图片信息表单 -->
    <div v-if="picture">
      <a-form layout="vertical" :model="pictureForm" @finish="handleSubmit">
        <a-form-item label="名称" name="name" class="!mb-4">
          <a-input v-model:value="pictureForm.name" placeholder="请输入名称" class="!rounded-lg" />
        </a-form-item>
        <a-form-item label="简介" name="introduction" class="!mb-4">
          <a-textarea
            v-model:value="pictureForm.introduction"
            placeholder="请输入简介"
            :rows="3"
            autoSize
            allowClear
            class="!rounded-lg"
          />
        </a-form-item>
        <a-form-item label="分类" name="category" class="!mb-4">
          <a-auto-complete
            v-model:value="pictureForm.category"
            :options="categoryOptions"
            placeholder="请输入分类"
            allowClear
            class="!rounded-lg"
          />
        </a-form-item>
        <a-form-item label="标签" name="tags" class="!mb-4">
          <a-select
            v-model:value="pictureForm.tags"
            :options="tagOptions"
            mode="tags"
            placeholder="请输入标签"
            allowClear
            class="!rounded-lg"
          />
        </a-form-item>

        <!-- 提交按钮 -->
        <a-form-item class="!mb-0">
          <a-button type="primary" html-type="submit" class=" w-full !rounded-lg custom-btn-dark-style">
            {{ route.query?.id ? '修改' : '保存' }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import { computed, h, onMounted, reactive, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  editPictureUsingPost,
  getPictureVoByIdUsingGet,
  listPictureTagCategoryUsingGet,
} from '@/api/pictureController.ts'
import { message } from 'ant-design-vue'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'
import ImageCropper from '@/components/ImageCropper.vue'
import { EditOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import ImageOutPainting from '@/components/ImageOutPainting.vue'
import { getSpaceVoByIdUsingGet } from '@/api/spaceController.ts'

// 表单信息变量
const picture = ref<API.PictureVO>()
const pictureForm = reactive<API.PictureEditRequest>({})

const router = useRouter()
const route = useRoute()
// 上传选择参数
const uploadType = ref<'file' | 'url'>('file')
// 空间 id
const spaceId = computed(() => {
  return route.query?.spaceId
})

// 接收子组件上传之后返回的参数
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

/**
 * 提交保存表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  const pictureId = picture.value?.id
  if (!pictureId) {
    return
  }
  const res = await editPictureUsingPost({
    id: pictureId,
    spaceId: spaceId.value,
    ...values,
  })
  if (res.data.code === 0 && res.data.data) {
    if (route.query?.id) {
      message.success('修改成功')
    } else {
      message.success('创建成功')
    }
    // 跳转到图片详情页
    await router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    if (route.query?.id) {
      message.error('修改失败，' + res.data.message)
    } else {
      message.error('创建失败，' + res.data.message)
    }
  }
}

// 标签和分类选项
const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])

/**
 * 获取标签和分类选项
 */
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // 转换成下拉选项组件接受的格式
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('加载选项失败，' + res.data.message)
  }
}

// 页面加载
onMounted(() => {
  getTagCategoryOptions()
  getOldPicture()
})

// 获取老数据
const getOldPicture = async () => {
  // 获取数据
  const id = route.query?.id
  if (id) {
    const res = await getPictureVoByIdUsingGet({
      id: id,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
    }
  }
}

// ------------------- 图片编辑 -------------------
// 图片编辑弹窗引用
const imageCropperRef = ref()

// 编辑图片
const doEditPicture = () => {
  if (imageCropperRef.value) {
    imageCropperRef.value.openModal()
  }
}

// 编辑成功事件
const onCropSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

// ------------------- AI 扩图 -------------------
// AI 扩图弹窗引用
const imageOutPaintingRef = ref()

// AI 扩图
const doImagePainting = () => {
  if (imageOutPaintingRef.value) {
    imageOutPaintingRef.value.openModal()
  }
}

// 编辑成功事件
const onImageOutPaintingSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

// ------------------- 获取空间信息 -------------------
const space = ref<API.SpaceVO>()

// 获取空间信息
const fetchSpace = async () => {
  // 获取数据
  if (spaceId.value) {
    const res = await getSpaceVoByIdUsingGet({
      id: spaceId.value,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    }
  }
}

watchEffect(() => {
  fetchSpace()
})
</script>

<style scoped>
#addPicturePage {
  padding: 20px;
}

.edit-bar {
  text-align: center;
  margin: 0;
}

/* 自定义表单样式 */
:deep(.ant-form-item-label > label) {
  color: var(--text-primary) !important;
  font-weight: 600 !important;
}

:deep(.ant-input),
:deep(.ant-input-password),
:deep(.ant-select-selector),
:deep(.ant-picker),
:deep(.ant-input-number) {
  border-radius: 8px !important;
  border: 1px solid var(--glass-border) !important;
  background: var(--glass-border) !important;
  backdrop-filter: blur(5px) !important;
}

:deep(.ant-input:focus),
:deep(.ant-input-password:focus),
:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-picker-focused) {
  border-color: var(--primary-blue) !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  #addPicturePage {
    padding: 16px;
    max-width: 100%;
  }

  .glass-container {
    padding: 16px !important;
  }
}

@media (max-width: 480px) {
  #addPicturePage {
    padding: 12px;
  }

  .glass-container {
    padding: 12px !important;
  }
}
</style>
