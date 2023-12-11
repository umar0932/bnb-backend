export const decryptBase64 = async (str: string) => {
  return await Buffer.from(str, 'base64').toString()
}
