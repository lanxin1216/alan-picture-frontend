<template>
  <div id="userLoginPage" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100 p-4">
    <div class="login-container glass-container rounded-2xl shadow-xl max-w-md w-full">
      <!-- Logo和标题 -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <img alt="logo" class="w-16 h-16 rounded-xl" src="@/assets/logo.png" />
        </div>
        <h2 class="title text-3xl font-bold bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent mb-2">
          屿图 - 用户登录
        </h2>
        <div class="desc text-text-secondary text-sm">—— 发现与分享你的光影岛屿 ——</div>
      </div>

      <!-- 登录表单 -->
      <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit" class="space-y-4">
        <a-form-item
          name="email"
          :rules="[
            { required: true, message: '请输入登录邮箱' },
          ]"
          class="!mb-4"
        >
          <a-input 
            v-model:value="formState.email" 
            placeholder="请输入登录邮箱" 
            size="large"
            class="!rounded-lg !h-12"
          >
            <template #prefix>
              <UserOutlined class="text-text-tertiary" />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item
          name="userPassword"
          :rules="[
            { required: true, message: '请输入密码' },
            { min: 8, message: '密码不能小于 8 位' },
          ]"
          class="!mb-4"
        >
          <a-input-password 
            v-model:value="formState.userPassword" 
            placeholder="请输入密码" 
            size="large"
            class="!rounded-lg !h-12"
          >
            <template #prefix>
              <LockOutlined class="text-text-tertiary" />
            </template>
          </a-input-password>
        </a-form-item>
        
        <div class="tips text-center text-text-secondary text-sm mb-4">
          没有账号？
          <RouterLink to="/user/register" class="text-primary-blue hover:underline font-medium">
            去注册
          </RouterLink>
        </div>
        
        <a-form-item class="!mb-0">
          <a-button 
            type="primary" 
            html-type="submit" 
            size="large"
            class="w-full !rounded-lg !h-12 text-lg font-medium bg-gradient-to-r from-primary-blue to-dark-blue hover:from-primary-blue-hover hover:to-primary-blue transition-all duration-300 hover:scale-105"
            :loading="loading"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
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

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  loading.value = true
  try {
    const res = await userLoginUsingPost(values)
    // 登录成功，把登录态保存到全局状态中
    if (res.data.code === 0 && res.data.data) {
      await loginUserStore.fetchLoginUser()
      message.success('登录成功')
      router.push({
        path: '/',
        replace: true,
      })
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
#userLoginPage {
  min-height: 100vh;
}

.login-container {
  padding: 40px 32px;
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
}

.title {
  text-align: center;
  font-weight: bold;
}

.desc {
  text-align: center;
  margin-bottom: 0;
}

.tips {
  margin-bottom: 0;
  text-align: center;
}

/* 自定义表单样式 */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-input),
:deep(.ant-input-password) {
  border-radius: 8px !important;
  border: 1px solid var(--glass-border) !important;
  background: var(--glass-bg-light) !important;
  backdrop-filter: blur(5px) !important;
  padding: 12px !important;
}

:deep(.ant-input:focus),
:deep(.ant-input-password:focus) {
  border-color: var(--primary-blue) !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

:deep(.ant-input-password .ant-input) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

:deep(.ant-btn) {
  border-radius: 8px !important;
  border: none !important;
  height: 48px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    padding: 32px 24px;
    margin: 0 16px;
  }
  
  .title {
    font-size: 24px;
  }
  
  :deep(.ant-input),
  :deep(.ant-input-password) {
    padding: 10px !important;
  }
  
  :deep(.ant-btn) {
    height: 44px !important;
    font-size: 15px !important;
  }
}
</style>
