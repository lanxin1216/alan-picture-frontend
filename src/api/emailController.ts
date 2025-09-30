// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** userEmailVerification POST /api/email/verification */
export async function userEmailVerificationUsingPost(
  body: API.EmailVerificationRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/email/verification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
