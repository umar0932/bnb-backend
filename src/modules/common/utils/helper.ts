export const decryptBase64 = async (str: string) => {
  return await Buffer.from(str, 'base64').toString()
}

export function generateOTP(): string {
  const otpLength = 4
  let otp: string

  do {
    otp = ''
    for (let i = 0; i < otpLength; i++) {
      otp += Math.floor(Math.random() * 10).toString()
    }
  } while (otp.startsWith('0'))

  return otp
}
