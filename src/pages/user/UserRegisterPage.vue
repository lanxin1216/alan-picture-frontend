<template>
  <div id="userRegisterPage">
    <div class="login-container">
      <h2 class="title">屿图 - 用户注册</h2>
      <div class="desc">—— 发现与分享你的光影岛屿 ——</div>
      <a-form
        :model="formState"
        name="basic"
        label-align="left"
        autocomplete="off"
        @finish="handleSubmit"
      >
        <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
          <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item name="email" :rules="[
          { required: true, message: '请输入邮箱地址' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]">
          <a-input v-model:value="formState.email" placeholder="请输入邮箱地址" />
        </a-form-item>
        <a-form-item name="verificationCode" :rules="[{ required: true, message: '请输入验证码' }]">
          <div class="verification-code-container">
            <a-input
              v-model:value="formState.verificationCode"
              placeholder="请输入邮箱验证码"
              class="verification-code-input"
            />
            <a-button
              type="primary"
              :disabled="countdown > 0 || !isValidEmail"
              @click="handleSendVerificationCode"
              class="verification-code-btn"
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
        >
          <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item
          name="checkPassword"
          :rules="[
            { required: true, message: '请输入确认密码' },
            { min: 8, message: '确认密码不能小于 8 位' },
          ]"
        >
          <a-input-password v-model:value="formState.checkPassword" placeholder="请再次输入密码" />
        </a-form-item>
        <div class="tips">
          已有账号？
          <RouterLink to="/user/login">去登录</RouterLink>
        </div>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">注册</a-button>
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

const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  email: '',
  userPassword: '',
  checkPassword: '',
  verificationCode: '',
})

const countdown = ref(0)
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
  max-width: 360px;
  margin: 0 auto;
}

.login-container {
  padding: 32px 24px;
}

.title {
  text-align: center;
  font-weight: bold;
  margin-bottom: 16px;
}

.desc {
  text-align: center;
  color: #bbb;
  margin-bottom: 32px;
}

.tips {
  margin-bottom: 16px;
  color: #bbb;
  font-size: 13px;
  text-align: right;
}

.verification-code-container {
  display: flex;
  gap: 8px;
}

.verification-code-input {
  flex: 1;
}

.verification-code-btn {
  white-space: nowrap;
}
</style>
