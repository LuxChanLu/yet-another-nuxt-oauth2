 // Load .nuxt/middleware.js and add module middlewares
import Middleware from './middleware'

<% _.forEach(options.middlewares, function(middleware, name) { %>Middleware['<%- name %>'] = require('./<%- middleware %>').default
<% }); %>
