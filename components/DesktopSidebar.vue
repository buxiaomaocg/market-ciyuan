<!--
  桌面端侧边导航栏
  固定左侧240px，全屏高度，玻璃质感
-->
<template>
  <view v-if="isDesktop" class="desktop-sidebar" :class="{ collapsed }">
    <!-- 背景层：星空蓝 + 流星拖尾，由 common/js/sidebar-bg.js 控制 -->
    <view class="sidebar-bg">
      <view class="sidebar-bg-base" :style="{ background: bg.base }" />

      <!-- 细碎星点，撑一点纵深 -->
      <view v-if="bg.starfield" class="star-dots" />

      <!-- 流星：45° 斜向下落，头亮尾淡 -->
      <view
        v-if="bg.type === 'stars'"
        class="meteor-field"
        :style="{ opacity: bg.meteorOpacity }"
      >
        <view v-for="n in 10" :key="n" :class="['meteor', 'm' + n]">
          <view class="meteor-tail" />
          <view class="meteor-head" />
        </view>
      </view>
    </view>

    <!-- Logo 区域 -->
    <view class="sidebar-brand">
      <view class="brand-logo">
        <image class="brand-emoji" src="/static/icons/logo.svg" mode="aspectFit"></image>
      </view>
      <text class="brand-name">AI 面试助手</text>
    </view>

    <!-- 导航菜单 -->
    <view class="sidebar-nav">
      <view
        v-for="item in visibleNav"
        :key="item.key"
        class="nav-item"
        :class="{ active: currentPage === item.key }"
        @tap="navigateTo(item)"
      >
        <image class="nav-icon" :src="item.icon" mode="aspectFit"></image>
        <text class="nav-label">{{ item.label }}</text>
        <view v-if="currentPage === item.key" class="nav-indicator" />
      </view>
    </view>

    <!-- 底部分隔 + 用户区 -->
    <view class="sidebar-footer">
      <view class="sidebar-divider" />
      <view class="footer-user" @tap="goProfile">
        <image class="user-avatar" src="/static/icons/user.svg" mode="aspectFit"></image>
        <view class="user-info">
          <text class="user-name">{{ username || '用户' }}</text>
          <text class="user-sub">{{ roleName || '查看资料' }}</text>
        </view>
      </view>
      <view class="footer-logout" @tap="logout">
        <image class="logout-icon" src="/static/icons/logout.svg" mode="aspectFit"></image>
        <text class="logout-text">退出登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { isDesktop } from '@/common/js/device.js'
import { sidebarBackground } from '@/common/js/sidebar-bg.js'

// 背景配置：渐变 or 视频，改 common/js/sidebar-bg.js 即可
const bg = sidebarBackground

const props = defineProps({
  currentPage: { type: String, default: 'index' },
  collapsed: { type: Boolean, default: false }
})

const username = ref('')
const roleName = ref('')
// 苍穹权限模型：登录返回的菜单权限码，侧边栏按此过滤
const menus = ref([])

const navItems = [
  { key: 'index',       icon: '/static/icons/home.svg', label: '首页',       path: '/pages/index/index',                    perm: 'menu:index' },
  { key: 'resume',      icon: '/static/icons/resume.svg', label: '简历管理',    path: '/pages/resume/list',                     perm: 'menu:resume' },
  { key: 'config',      icon: '/static/icons/config.svg', label: '面试配置',    path: '/pages/interview/config-list',           perm: 'menu:interview' },
  { key: 'history',     icon: '/static/icons/history.svg', label: '面试记录',    path: '/pages/interview/session-history',       perm: 'menu:interview' },
  { key: 'evaluation',  icon: '/static/icons/evaluation.svg', label: '评估结果',    path: '/pages/evaluation/result',               perm: 'menu:evaluation' },
  { key: 'analytics',   icon: '/static/icons/speech.svg', label: '语音分析',    path: '/pages/feedback/analytics',              perm: 'menu:feedback' },
  { key: 'skills',      icon: '/static/icons/growth.svg', label: '技能成长',    path: '/pages/growth/skills',                   perm: 'menu:growth' },
  { key: 'reports',     icon: '/static/icons/report.svg', label: '成长报告',    path: '/pages/growth/report-list',              perm: 'menu:growth' },
  { key: 'admin',       icon: '/static/icons/admin.svg', label: '系统管理',    path: '/pages/admin/user-list',                 perm: 'menu:admin' },
  { key: 'profile',     icon: '/static/icons/profile.svg', label: '个人资料',    path: '/pages/user/profile',                    perm: '' },
]

// 有菜单权限数据时按权限过滤；没有时（旧 token）回退显示全部，避免白屏
const visibleNav = computed(() => {
  const perms = menus.value
  if (!Array.isArray(perms) || perms.length === 0) return navItems
  return navItems.filter((item) => !item.perm || perms.includes(item.perm))
})

function navigateTo(item) {
  if (item.key === props.currentPage) return
  uni.navigateTo({ url: item.path })
}

function goProfile() {
  uni.navigateTo({ url: '/pages/user/profile' })
}

function logout() {
  ;['token', 'refreshToken', 'username', 'role', 'roleName', 'menus', 'permissions', 'dataScope', 'deptId']
    .forEach((k) => uni.removeStorageSync(k))
  uni.reLaunch({ url: '/pages/login/login' })
}

onMounted(() => {
  const stored = uni.getStorageSync('username')
  if (stored) username.value = stored
  const storedRole = uni.getStorageSync('roleName')
  if (storedRole) roleName.value = storedRole
  const storedMenus = uni.getStorageSync('menus')
  if (Array.isArray(storedMenus)) menus.value = storedMenus
})
</script>

<style scoped>
.desktop-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.04); /* 兜底色，真正显示的是下面的背景层 */
  border-right: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(18px) saturate(1.15);
  -webkit-backdrop-filter: blur(18px) saturate(1.15);
  display: flex;
  flex-direction: column;
  z-index: 200;
  overflow: hidden; /* 视频不溢出栏外 */
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

/* 收起：整条侧栏向左移出视口 */
.desktop-sidebar.collapsed {
  transform: translateX(-100%);
}

/* ---- 背景层：星空蓝 + 流星 ---- */
.sidebar-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.sidebar-bg-base {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 细碎星点 */
.star-dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(1px 1px at 18px 26px, rgba(255, 255, 255, 0.95), transparent),
    radial-gradient(1px 1px at 96px 74px, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1.4px 1.4px at 156px 132px, rgba(255, 255, 255, 0.95), transparent),
    radial-gradient(1px 1px at 54px 168px, rgba(255, 255, 255, 0.7), transparent),
    radial-gradient(1px 1px at 204px 196px, rgba(255, 255, 255, 0.85), transparent),
    radial-gradient(1px 1px at 132px 232px, rgba(255, 255, 255, 0.75), transparent);
  background-size: 260px 260px;
  opacity: 0.5;
  animation: star-twinkle 7s ease-in-out infinite alternate;
}

@keyframes star-twinkle {
  from { opacity: 0.55; }
  to   { opacity: 1; }
}

/* 流星场：整体承担淡入淡出 */
.meteor-field {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/*
  流星 = 一条渐变尾巴 + 末端一颗星，全部装在 140×20 的盒子内，
  不依赖「子元素溢出父级」（uvue 默认 overflow: hidden，溢出会被裁掉）。
  旋转 45° 后向右下坠落。
*/
.meteor {
  position: absolute;
  width: 140px;
  height: 20px;
  transform: rotate(135deg);
  transform-origin: 100% 50%;
  animation: meteor-fall 6s linear infinite;
  will-change: transform, opacity;
}
.meteor-tail {
  position: absolute;
  left: 0;
  top: 8px;
  width: 128px;
  height: 4px;
  border-radius: 4px;
  /* 淡蓝尾迹：在浅蓝底上保持"清透"而不是白色划痕 */
  background: linear-gradient(
    90deg,
    rgba(120, 172, 232, 0) 0%,
    rgba(120, 172, 232, 0.22) 30%,
    rgba(120, 172, 232, 0.6) 75%,
    rgba(110, 165, 230, 0.8) 100%
  );
  box-shadow: 0 0 8px rgba(140, 190, 245, 0.5);
}
.meteor-head {
  position: absolute;
  right: 0;
  top: 2px;
  width: 16px;
  height: 16px;
  background: url('/static/icons/spark.svg') no-repeat center center;
  background-size: contain;
  opacity: 0.75;
  filter: drop-shadow(0 0 5px rgba(110, 165, 230, 0.95));
}

/* 十颗流星：放慢一倍多，飘得更"懒"；负延迟 = 打开就在半空中 */
.meteor.m1  { left: 90px;  top: -80px;  animation-duration: 8s;    animation-delay: -0.4s; }
.meteor.m2  { left: 130px; top: 20px;   animation-duration: 10.5s; animation-delay: -2.6s; }
.meteor.m3  { left: 70px;  top: 120px;  animation-duration: 9s;    animation-delay: -4.4s; }
.meteor.m4  { left: 150px; top: 220px;  animation-duration: 12s;   animation-delay: -5.8s; }
.meteor.m5  { left: 100px; top: 320px;  animation-duration: 14s;   animation-delay: -3.4s; }
.meteor.m6  { left: 170px; top: 420px;  animation-duration: 11s;   animation-delay: -1.2s; }
.meteor.m7  { left: 80px;  top: 520px;  animation-duration: 15s;   animation-delay: -7.1s; }
.meteor.m8  { left: 120px; top: 620px;  animation-duration: 10s;   animation-delay: -0.9s; }
.meteor.m9  { left: 160px; top: 720px;  animation-duration: 13s;   animation-delay: -4.9s; }
.meteor.m10 { left: 95px;  top: 820px;  animation-duration: 10.5s; animation-delay: -2.1s; }

/* 长短不一，避免看着像复制粘贴 */
.meteor.m2 .meteor-tail { width: 88px; }
.meteor.m4 .meteor-tail { width: 150px; }
.meteor.m6 .meteor-tail { width: 100px; }
.meteor.m8 .meteor-tail { width: 132px; }
.meteor.m9 .meteor-tail { width: 112px; }

@keyframes meteor-fall {
  0% {
    transform: translate3d(0, 0, 0) rotate(135deg);
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    transform: translate3d(-320px, 320px, 0) rotate(135deg);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .meteor,
  .star-dots {
    animation: none;
  }
}

/* ---- Brand ---- */
.sidebar-brand {
  position: relative;
  z-index: 1;
  padding: 28px 24px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}
.brand-logo {
  width: 84px;
  height: 84px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(160, 200, 240, 0.7);
  box-shadow: 0 8px 22px rgba(90, 140, 200, 0.18);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.brand-emoji { width: 60px; height: 60px; }
.brand-name {
  font-size: 17px;
  font-weight: 700;
  color: #334866;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
}

/* ---- Nav ---- */
.sidebar-nav {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 4px 12px;
  overflow-y: auto;
}
.nav-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 12px;
  margin-bottom: 4px;
  position: relative;
  transition: all 0.2s ease;
  cursor: pointer;
}
.nav-item:hover {
  background: rgba(255, 255, 255, 0.55);
}
.nav-item.active {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 14px rgba(90, 140, 200, 0.18);
}
.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  opacity: 0.62;
}
.nav-item.active .nav-icon {
  opacity: 1;
}
.nav-label {
  font-size: 14px;
  font-weight: 400;
  color: #334866;
}
.nav-item.active .nav-label {
  color: #1a63c8;
  font-weight: 400;
}
.nav-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: #2f7fd6;
  border-radius: 0 3px 3px 0;
}

/* ---- Footer ---- */
.sidebar-footer {
  position: relative;
  z-index: 1;
  padding: 12px 16px 20px;
}
.sidebar-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.5);
  margin-bottom: 12px;
}
.footer-user {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.footer-user:hover { background: rgba(255, 255, 255, 0.6); }
.user-avatar {
  width: 24px;
  height: 24px;
  opacity: 0.65;
}
.user-info { display: flex; flex-direction: column; }
.user-name { font-size: 13px; font-weight: 400; color: #334866; }
.user-sub { font-size: 11px; color: #2c5480; margin-top: 1px; }
.footer-logout {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  margin-top: 6px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.footer-logout:hover { background: rgba(255, 255, 255, 0.6); }
.logout-icon {
  width: 18px;
  height: 18px;
  opacity: 0.55;
}
.logout-text { font-size: 12px; color: #2c5480; }
</style>
