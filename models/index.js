const path = require('path')
// 自动匹配路径
const glob = require('glob')
// ORM 框架
const Sequelize = require('sequelize')

const config = require('../config')

const defaultOptions = {
  define: {
    timestamps: false
  }
}
const sequelize = new Sequelize(Object.assign({},defaultOptions,config.database))

glob.sync('*.js', { cwd: __dirname })
  .filter(item => item !== 'index.js')
  .forEach(item => {
    const model = sequelize.import(path.join(__dirname, item))
    exports[model.name] = model
  })
  