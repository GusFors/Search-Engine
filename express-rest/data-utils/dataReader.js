const fs = require('fs')

const dataReader = {}

dataReader.getFile = (filePath) => {
  return fs.readFileSync(filePath, 'utf8')
}

dataReader.getDirFilePaths = (dirPath) => {
  return fs.readdirSync(dirPath)
}
module.exports = dataReader
