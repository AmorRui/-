module.exports = {
  database: {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: '',
    database: 'newshop',
    operatorsAliases: false,
    logging: false
  },
  mail: {
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    name: '模拟京东',
    auth: {  user: 'rui282279244@qq.com', 
               pass: 'cmcbkahlrepmbjea' },
    connectionTimeout: 1000,
    greetingTimeout: 1000,
    socketTimeout: 2000,
    debug: process.env.NODE_ENV === 'development'
  }
}
