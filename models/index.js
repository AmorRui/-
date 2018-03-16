const path = require('path')
const glob = require('glob')
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  database: 'myshop',
  username: 'root',
  password: ''
})

glob.sync('*.js',{ cwd:__dirname})
  .filter( item => item !== 'index.js')
  .forEach (item => {
    const model =  sequelize.import( path.join(__dirname,item ))
    exports [model.nyame] = model 
  })
