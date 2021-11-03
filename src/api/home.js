import { post } from './index'
import API_SERVICE from './API_SERVICE'

export function getBhdCount() {
  return post(API_SERVICE.WARNING + '/alarm/getBhdCount')
}
