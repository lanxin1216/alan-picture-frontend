<template>
  <div id="userRegisterPage" class="flex items-center">
    <!-- 左侧Logo区域 -->
    <div class="text-center">
      <img alt="logo" class="w-12 h-12 rounded-xl" src="@/assets/logo.png" />
      <div class="desc text-gray-600">—— 屿图 · 发现与分享你的光影岛屿 ——</div>
    </div>

    <!-- 右侧注册表单 -->
    <div class="flex-1 flex justify-center">
      <div
        class="glass-form-container w-full p-10 rounded-2xl transition-all duration-300 hover:shadow-lg"
      >
        <h3 class="text-2xl font-semibold text-gray-800 mb-8 text-center">用户注册</h3>

        <a-form
          :model="formState"
          name="basic"
          autocomplete="off"
          @finish="handleSubmit"
          class="space-y-6"
        >
          <!-- 账号输入 -->
          <a-form-item
            name="userAccount"
            :rules="[{ required: true, message: '请输入账号' }]"
            class="!mb-0"
          >
            <a-input
              v-model:value="formState.userAccount"
              placeholder="请输入账号"
              size="large"
              class="glass-input !rounded-xl !h-12"
            >
              <template #prefix>
                <UserOutlined class="text-gray-400" />
              </template>
            </a-input>
          </a-form-item>

          <!-- 邮箱输入 -->
          <a-form-item
            name="email"
            :rules="[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]"
            class="!mb-0"
          >
            <a-input
              v-model:value="formState.email"
              placeholder="请输入邮箱地址"
              size="large"
              class="glass-input !rounded-xl !h-12"
            >
              <template #prefix>
                <MailOutlined class="text-gray-400" />
              </template>
            </a-input>
          </a-form-item>

          <!-- 验证码输入 -->
          <a-form-item
            name="verificationCode"
            :rules="[{ required: true, message: '请输入验证码' }]"
            class="!mb-0"
          >
            <div class="verification-code-container flex gap-3">
              <a-input
                v-model:value="formState.verificationCode"
                placeholder="请输入邮箱验证码"
                size="large"
                class="glass-input !rounded-xl !h-12 flex-1"
              >
                <template #prefix>
                  <SafetyCertificateOutlined class="text-gray-400" />
                </template>
              </a-input>
              <a-button
                type="primary"
                :disabled="countdown > 0 || !isValidEmail"
                  @click="handleSendVerificationCode"
                class="custom-btn-light-style"
                :loading="sendingCode"
              >
                {{ countdown > 0 ? `${countdown}秒后重发` : '获取验证码' }}
              </a-button>
            </div>
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

          <!-- 确认密码输入 -->
          <a-form-item
            name="checkPassword"
            :rules="[
              { required: true, message: '请输入确认密码' },
              { min: 8, message: '确认密码不能小于 8 位' },
            ]"
            class="!mb-0"
          >
            <a-input-password
              v-model:value="formState.checkPassword"
              placeholder="请再次输入密码"
              size="large"
              class="glass-input !rounded-xl !h-12"
            >
              <template #prefix>
                <LockOutlined class="text-gray-400" />
              </template>
            </a-input-password>
          </a-form-item>

          <!-- 登录提示 -->
          <div class="text-center text-gray-500 text-sm">
            已有账号？
            <RouterLink to="/user/login" class="text-primary-blue hover:underline font-medium">
              去登录
            </RouterLink>
          </div>

          <!-- 注册按钮 -->
          <a-form-item class="!mb-0">
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              class="w-full custom-btn-dark-style !rounded-xl !h-12 font-medium"
              :loading="loading"
            >
              注册
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  userRegisterEmailVerificationUsingPost,
  userRegisterUsingPost,
} from '@/api/userController.ts'
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons-vue'

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

/* 验证码容器 */
.verification-code-container {
  display: flex;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  #userRegisterPage {
    flex-direction: column;
    padding: 2rem;
  }

  .glass-form-container {
    width: 100%;
    max-width: 400px;
    padding: 2rem !important;
  }

  .verification-code-container {
    flex-direction: column;
    gap: 8px;
  }

  :deep(.custom-btn-dark-style) {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .glass-form-container {
    padding: 1.5rem !important;
  }

  :deep(.ant-input),
  :deep(.ant-input-password) {
    height: 44px !important;
  }

  :deep(.ant-btn) {
    height: 44px !important;
  }
}
</style>
