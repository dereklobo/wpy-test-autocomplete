const path = require('path')
const storybook = require('@storybook/vue3')

storybook({
  mode: 'dev',
  port: 4004,
  configDir: path.resolve(__dirname, '../.storybook-vue'),
})
