/**
 * 左侧导航栏背景配置
 * ============================================================
 * 换背景只改这个文件，不用动 DesktopSidebar.vue。
 *
 * type = 'stars'    → 星空蓝 + 流星拖尾（当前）
 * type = 'gradient' → 只有深蓝渐变，不要流星
 */
export const sidebarBackground = {
  // 'stars' | 'gradient'
  type: 'stars',

  // 从背景图提取的最蓝一档 #6DA0F1，做成半透明，让插画从栏底透上来
  base: 'linear-gradient(180deg, rgba(131, 177, 245, 0.8) 0%, rgba(109, 160, 241, 0.78) 52%, rgba(92, 146, 233, 0.84) 100%)',

  // 流星整体浓淡 0~1
  meteorOpacity: 0.9,

  // 是否铺一层细碎星点（增加纵深）
  starfield: true,
}

export default sidebarBackground