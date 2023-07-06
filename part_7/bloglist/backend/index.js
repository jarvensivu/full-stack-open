const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

const NODE_ENV = process.env.NODE_ENV || 'development'

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}. We are in ${NODE_ENV} mode.`)
})
