import { AES, enc, mode, pad } from 'crypto-js'

const KEY = 'F7FA3CB95EFDB120'

export default {
  encrypt(text) {
    const keyParsed = enc.Utf8.parse(KEY)
    const textParsed = enc.Utf8.parse(text)
    const encrypted = AES.encrypt(textParsed, keyParsed, {
      mode: mode.ECB,
      padding: pad.Pkcs7,
    })
    return encrypted.toString()
  },
}
