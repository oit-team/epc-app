const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)

const icons = req.keys().map(item => item.replace(/.*\/(.+?)\.svg/, '$1'))

export default icons
