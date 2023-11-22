import { hashSync, compareSync, genSaltSync } from 'bcrypt'

import { decryptBase64 } from './helper'
import { RegEx } from './Regex'

export function encodePassword(pwd: string) {
  const SALT = genSaltSync()
  const decodeBase64Pwd = decryptBase64(pwd)
  return hashSync(decodeBase64Pwd, SALT)
}

export function comparePassword(pwd: string, dbPwd: string) {
  const decodeBase64Pwd = decryptBase64(pwd)
  return compareSync(decodeBase64Pwd, dbPwd)
}

export function isValidPassword(pwd: string) {
  const decodeBase64Pwd = decryptBase64(pwd) || ''
  const pwdRegex = new RegExp(RegEx.PWD)
  return pwd && pwdRegex.test(decodeBase64Pwd)
}

export function isValidPasswordWithoutRegex(pwd: string) {
  const decodeBase64Pwd = decryptBase64(pwd) || ''
  return pwd && decodeBase64Pwd
}
