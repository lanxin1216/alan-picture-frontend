<template>
  <div id="userRegisterPage" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100 p-4">
    <div class="login-container glass-container rounded-2xl shadow-xl max-w-md w-full">
      <!-- Logo和标题 -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <img alt="logo" class="w-16 h-16 rounded-xl" src="@/assets/logo.png" />
        </div>
        <h2 class="title text-3xl font-bold bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent mb-2">
          屿图 - 用户注册
        </h2>
        <div class="desc text-text-secondary text-sm">—— 发现与分享你的光影岛屿 ——</div>
      </div>

      <!-- 注册表单 -->
      <a-form
        :model="formState"
        name="basic"
        label-align="left"
        autocomplete="off"
        @finish="handleSubmit"
        class="space-y-4"
      >
        <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]" class="!mb-4">
          <a-input 
            v-model:value="formState.userAccount" 
            placeholder="请输入账号" 
            size="large"
            class="!rounded-lg !h-12"
          >
            <template #prefix>
              <UserOutlined class="text-text-tertiary" />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item name="email" :rules="[
          { required: true, message: '请输入邮箱地址' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]" class="!mb-4">
          <a-input 
            v-model:value="formState.email" 
            placeholder="请输入邮箱地址" 
            size="large"
            class="!rounded-lg !h-12"
          >
            <template #prefix>
              <MailOutlined class="text-text-tertiary" />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item name="verificationCode" :rules="[{ required: true, message: '请输入验证码' }]" class="!mb-4">
          <div class="verification-code-container">
            <a-input
              v-model:value="formState.verificationCode"
              placeholder="请输入邮箱验证码"
              size="large"
              class="verification-code-input !rounded-lg !h-12"
            >
              <template #prefix>
                <SafetyCertificateOutlined class="text-text-tertiary" />
              </template>
            </a-input>
            <a-button
              type="primary"
              :disabled="countdown > 0 || !isValidEmail"
              @click="handleSendVerificationCode"
              class="verification-code-btn !rounded-lg !h-12 core-btn-primary"
              :loading="sendingCode"
            >
              {{ countdown > 0 ? `${countdown}秒后重发` : '获取验证码' }}
            </a-button>
          </div>
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
        
        <a-form-item
          name="checkPassword"
          :rules="[
            { required: true, message: '请输入确认密码' },
            { min: 8, message: '确认密码不能小于 8 位' },
          ]"
          class="!mb-4"
        >
          <a-input-password 
            v-model:value="formState.checkPassword" 
            placeholder="请再次输入密码" 
            size="large"
            class="!rounded-lg !h-12"
          >
            <template #prefix>
              <LockOutlined class="text-text-tertiary" />
            </template>
          </a-input-password>
        </a-form-item>
        
        <div class="tips text-center text-text-secondary text-sm mb-4">
          已有账号？
          <RouterLink to="/user/login" class="text-primary-blue hover:underline font-medium">
            去登录
          </RouterLink>
        </div>
        
        <a-form-item class="!mb-0">
          <a-button 
            type="primary" 
            html-type="submit" 
            size="large"
            class="w-full !rounded-lg !h-12 text-lg font-medium core-btn-primary transition-all duration-300 hover:scale-105"
            :loading="loading"
          >
            注册
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { userRegisterEmailVerificationUsingPost, userRegisterUsingPost } from '@/api/userController.ts'
import { UserOutlined, MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'

const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  email: '',
  userPassword: '',
  checkPassword: '',
  verificationCode: '',
})

const countdown = ref(0)
const loading = ref(false)
const sendingCode = ref(false)
let countdownTimer: number | null = null

const router = useRouter()

// 验证邮箱格式
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(<string>formState.email)
})

/**
 * 发送验证码
 */
const handleSendVerificationCode = async () => {
  if (!isValidEmail.value) {
    message.error('请输入有效的邮箱地址')
    return
  }

  sendingCode.value = true
  try {
    const res = await userRegisterEmailVerificationUsingPost({ email: formState.email })
    if (res.data.code === 0 && res.data.data) {
      message.success('验证码发送成功，请查收邮件')
      startCountdown()
    } else {
      message.error(res.data.message)
    }
  } catch (error) {
    message.error('验证码发送失败，请稍后重试')
    console.error('发送验证码失败:', error)
  } finally {
    sendingCode.value = false
  }
}

/**
 * 开始倒计时
 */
const startCountdown = () => {
  countdown.value = 60
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }
  }, 1000)
}

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: any) => {
  // 判断两次输入的密码是否一致
  if (formState.userPassword !== formState.checkPassword) {
    message.error('二次输入的密码不一致')
    return
  }

  // 验证验证码是否为空
  if (!formState.verificationCode) {
    message.error('请输入验证码')
    return
  }

  loading.value = true
  try {
    const res = await userRegisterUsingPost(values)
    // 注册成功，跳转到登录页面
    if (res.data.code === 0 && res.data.data) {
      message.success('注册成功')
      router.push({
        path: '/user/login',
        replace: true,
      })
    } else {
      message.error('注册失败，' + res.data.message)
    }
  } catch (error) {
    message.error('注册失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 组件卸载时清除定时器
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
#userRegisterPage {
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

.verification-code-container {
  display: flex;
  gap: 12px;
}

.verification-code-input {
  flex: 1;
}

.verification-code-btn {
  white-space: nowrap;
  min-width: 120px;
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

:deep(.ant-btn[disabled]) {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

/* 核心按钮样式 */
.core-btn-primary {
  background: var(--core-btn-gradient) !important;
  border: none !important;
  box-shadow: var(--core-btn-shadow) !important;
  color: white !important;
}

.core-btn-primary:hover {
  background: var(--core-btn-gradient-hover) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4) !important;
}

/* 选中效果样式 */
.selected-effect {
  background: var(--selected-bg-gradient) !important;
  color: var(--selected-text-color) !important;
  border: 1px solid var(--selected-border-color) !important;
  box-shadow: var(--selected-shadow) !important;
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
  
  .verification-code-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .verification-code-btn {
    width: 100%;
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
