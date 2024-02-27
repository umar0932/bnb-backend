import { hash, compare, genSalt } from 'bcrypt'

import { decryptBase64 } from './helper'
import { RegEx } from './Regex'

export async function encodePassword(pwd: string) {
  const SALT = await genSalt()
  const decodeBase64Pwd = await decryptBase64(pwd)
  return await hash(decodeBase64Pwd, SALT)
}

export async function comparePassword(pwd: string, dbPwd: string) {
  const decodeBase64Pwd = await decryptBase64(pwd)
  return await compare(decodeBase64Pwd, dbPwd)
}

export async function isValidPassword(pwd: string) {
  const decodeBase64Pwd = (await decryptBase64(pwd)) || ''
  const pwdRegex = new RegExp(RegEx.PWD)
  return pwd && pwdRegex.test(decodeBase64Pwd)
}

export async function isValidPasswordWithoutRegex(pwd: string) {
  const decodeBase64Pwd = decryptBase64(pwd) || ''
  return pwd && decodeBase64Pwd
}
