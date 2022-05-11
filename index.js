const http = require('http')
const {info,error} = require('./utils/logger');
const app = require('./app')
const config = require('./utils/config')

const server = http.createServer(app)

// const PORT = 3003

server.listen(config.PORT, () => {
  info(`Server running on port ${config.PORT}`);
})