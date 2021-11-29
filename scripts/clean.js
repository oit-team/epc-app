const fs = require('fs/promises')

// 删除上次打包的文件
fs.unlink('epc-app.zip').then(res => {
  console.log('删除成功')
}).catch(() => {
  console.log('文件不存在或已删除')
})
