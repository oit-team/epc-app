import { getRawType } from '@/utils/helper'

const storage = localStorage

export function setStorage(key, value, defer = false) {
  if (key === 'userUnread') return
  if (typeof key !== 'string') throw new TypeError('key必须是string类型，当前类型是：' + typeof key)
  const type = getRawType(value)
  const data = type === 'string' ? value : JSON.stringify({
    type,
    value,
  })

  // 是否将缓存任务置于堆栈底部
  if (defer)
    setTimeout(() => storage.setItem(key, data))
  else
    storage.setItem(key, data)
  console.debug(`[缓存] key: ${key}`, 'rawData:', value)
}

export function getStorage(key, defaultValue) {
  const data = storage.getItem(key)
  if (typeof data !== 'string') return defaultValue
  try {
    const object = JSON.parse(data)
    if (object.type === 'Date') return new Date(object.value)
    else return object.value
  } catch (e) {
    return data
  }
}

export function clearStorage() { storage.clear() }

export function removeStorage(key) { storage.removeItem(key) }

export default {
  getItem: getStorage,
  setItem: setStorage,
  removeItem: removeStorage,
  clear: clearStorage,
}
