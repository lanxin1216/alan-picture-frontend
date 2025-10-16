<template>
  <div id="userLoginPage" class="flex items-center">
    <!-- 左侧Logo区域 -->
    <div class="text-center logo">
      <img alt="logo" class="w-12 h-12 rounded-xl" src="@/assets/logo.png" />
      <div class="desc text-gray-600">—— 屿图 · 发现与分享你的光影岛屿 ——</div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="flex-1 flex justify-center">
      <div
        class="glass-form-container w-full p-10 rounded-2xl transition-all duration-300 hover:shadow-lg"
      >
        <h3 class="text-2xl font-semibold text-gray-800 mb-8 text-center">用户登录</h3>

        <a-form
          :model="formState"
          name="basic"
          autocomplete="off"
          @finish="handleSubmit"
          class="space-y-6"
        >
          <!-- 邮箱输入 -->
          <a-form-item
            name="email"
            :rules="[{ required: true, message: '请输入登录邮箱' }]"
            class="!mb-0"
          >
            <a-input
              v-model:value="formState.email"
              placeholder="请输入登录邮箱"
              size="large"
              class="glass-input !rounded-xl !h-12"
            >
              <template #prefix>
                <UserOutlined class="text-gray-400" />
              </template>
            </a-input>
          </a-form-item>

          <!-- 密码输入 -->
          <a-form-item
            name="userPassword"
            :rules="[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码不能小于 8 位' },
            ]"
            class="!mb-0"
          >
            <a-input-password
              v-model:value="formState.userPassword"
              placeholder="请输入密码"
              size="large"
              class="glass-input !rounded-xl !h-12"
            >
              <template #prefix>
                <LockOutlined class="text-gray-400" />
              </template>
            </a-input-password>
          </a-form-item>

          <!-- 注册提示 -->
          <div class="text-center text-gray-500 text-sm">
            没有账号？
            <RouterLink to="/user/register" class="text-primary-blue hover:underline font-medium">
              去注册
            </RouterLink>
          </div>

          <!-- 登录按钮 -->
          <a-form-item class="!mb-0">
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              class="w-full custom-btn-dark-style !rounded-xl !h-12 font-medium"
              :loading="loading"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { message } from 'ant-design-vue'
import { userLoginUsingPost } from '@/api/userController.ts'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'

const formState = reactive<API.UserLoginRequest>({
  email: '',
  userPassword: '',
})

const loading = ref(false)
const router = useRouter()
const loginUserStore = useLoginUserStore()

const handleSubmit = async (values: any) => {
  loading.value = true
  try {
    const res = await userLoginUsingPost(values)
    if (res.data.code === 0 && res.data.data) {
      await loginUserStore.fetchLoginUser()
      message.success('登录成功')
      router.push({ path: '/', replace: true })
    } else {
      message.error('登录失败，' + res.data.message)
    }
  } catch (error) {
    message.error('登录失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.glass-form-container {
  width: 40%;
  background: transparent;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(15px);
  border: var(--glass-border);
  box-shadow: var(--glass-shadow);
  transition: all 0.3s ease;
  border-radius: 24px;
  padding: 24px;
}

.glass-form-container:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.6);
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  #userLoginPage {
    flex-direction: column;
    padding: 2rem;
  }

  .glass-form-container {
    width: 100%;
    max-width: 400px;
    padding: 2rem !important;
  }
}
</style>
