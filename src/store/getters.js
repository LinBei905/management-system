const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  allowRoutes: state => state.user.allowRoutes,
  constantRoutes: state => state.user.constantRoutes,
  allRoutes: state => [...state.user.constantRoutes, ...state.user.allowRoutes],
}
export default getters
