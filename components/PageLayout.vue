<!--
  页面布局容器
  - 桌面端：左侧侧边栏 + 右侧内容区
  - 移动端：顶部导航栏 + 内容（保持现有行为）

  用法：
  <PageLayout currentPage="index" title="首页">
    <view>页面内容</view>
    <template #header-right>按钮</template>
  </PageLayout>
-->
<template>
  <view class="page-layout" :class="{ 'has-sidebar': isDesktop }">
    <!-- 全站背景：铺满整个视口（含侧栏底下），侧栏半透明才能透出插画 -->
    <view class="page-bg" />
    <view class="page-veil" />

    <!-- 桌面端侧边栏（可折叠） -->
    <DesktopSidebar :currentPage="currentPage" :collapsed="sidebarCollapsed" />

    <!-- 主内容区 -->
    <view class="page-main" :class="{ 'with-sidebar': isDesktop, 'is-collapsed': isDesktop && sidebarCollapsed }">

      <!-- 移动端：顶部导航栏 -->
      <PageHeader v-if="!isDesktop" :title="title" :showBack="showBack">
        <template v-if="$slots['header-right']" #right>
          <slot name="header-right" />
        </template>
      </PageHeader>

      <!-- 桌面端：简化面包屑头部（淡蓝天空 + 循环飘动的云） -->
      <view v-if="isDesktop" class="desktop-topbar">
        <!-- 天空层：纯装饰，不吃点击 -->
        <view class="topbar-sky">
          <view class="cloud-wrap w1"><image class="cloud" src="/static/icons/cloud.svg" mode="aspectFit" /></view>
          <view class="cloud-wrap w2"><image class="cloud" src="/static/icons/cloud.svg" mode="aspectFit" /></view>
          <view class="cloud-wrap w3"><image class="cloud" src="/static/icons/cloud.svg" mode="aspectFit" /></view>
          <view class="cloud-wrap w4"><image class="cloud" src="/static/icons/cloud.svg" mode="aspectFit" /></view>
          <view class="cloud-wrap w5"><image class="cloud" src="/static/icons/cloud.svg" mode="aspectFit" /></view>
          <view class="cloud-wrap w6"><image class="cloud" src="/static/icons/cloud.svg" mode="aspectFit" /></view>
        </view>
        <view class="topbar-left">
          <!-- 侧栏折叠开关 -->
          <view class="sidebar-toggle" @tap="toggleSidebar">
            <view class="toggle-bar" />
            <view class="toggle-bar" />
            <view class="toggle-bar" />
          </view>
          <text class="topbar-title">{{ title }}</text>
        </view>
        <view class="topbar-actions">
          <slot name="header-right" />
        </view>
      </view>

      <!-- 页面内容 -->
      <view class="page-body">
        <AnimatedBg v-if="!isDesktop" />
        <slot />
      </view>
    </view>

    <!-- 花瓣飘落层：只做平移，不旋转 -->
    <view class="petal-layer">
      <view v-for="p in petals" :key="p.id" class="petal" :style="p.style" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { isDesktop } from '@/common/js/device.js'
import { sidebarCollapsed, toggleSidebar } from '@/common/js/sidebar.js'
import DesktopSidebar from './DesktopSidebar.vue'
import PageHeader from './PageHeader.vue'
import AnimatedBg from './AnimatedBg.vue'

defineProps({
  currentPage: { type: String, default: 'index' },
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: true }
})

/* 约 40 片：近景小而清晰，远景更小更虚（景深） */
const petals = ref(
  Array.from({ length: 40 }, (_, i) => {
    const near = i < 22
    const size = near ? 10 + Math.random() * 10 : 5 + Math.random() * 5
    return {
      id: i,
      style: [
        `--x:${(Math.random() * 100).toFixed(2)}vw`,
        `--s:${size.toFixed(1)}px`,
        `--o:${(near ? 0.65 + Math.random() * 0.3 : 0.35 + Math.random() * 0.3).toFixed(2)}`,
        `--d:${(near ? 16 + Math.random() * 10 : 22 + Math.random() * 12).toFixed(1)}s`,
        `--delay:${(-Math.random() * 30).toFixed(1)}s`,
        `--dx:${(-16 + Math.random() * 32).toFixed(1)}vw`,
        `--r:${Math.round(-180 + Math.random() * 360)}deg`,
        `--b:${(near ? 0 : 0.6 + Math.random() * 1.1).toFixed(2)}px`,
      ].join(';'),
    }
  })
)
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  position: relative;
}

/* ---- 主内容区 ---- */
.page-main {
  flex: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

/* 背景图与薄纱：绝对铺满主内容区，不参与布局 */
.page-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-image: url('/static/bg/bg-v2-2x.webp');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  background-color: #a9c9f0;
  /* 提饱和 + 轻微加对比，让蓝色更接近原图的鲜艳度 */
  filter: saturate(1.3) contrast(1.05) brightness(1.02);
  z-index: 0;
}
.page-veil {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  /* 只留一点点亮度过渡，避免洗灰 */
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 30%);
  z-index: 0;
  pointer-events: none;
}

.page-main.with-sidebar {
  margin-left: 240px;
  transition: margin-left 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 侧栏收起后内容铺满 */
.page-main.with-sidebar.is-collapsed {
  margin-left: 0;
}

/* ---- 桌面端顶部栏：天空 ---- */
.desktop-topbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px 16px;
  position: sticky;
  top: 0;
  z-index: 50;
  background: linear-gradient(
      180deg,
      rgba(143, 186, 247, 0.78) 0%,
      rgba(109, 160, 241, 0.74) 55%,
      rgba(95, 148, 234, 0.8) 100%
    );
  backdrop-filter: blur(16px) saturate(1.15);
  -webkit-backdrop-filter: blur(16px) saturate(1.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  overflow: hidden;
}
.topbar-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 1;
  min-width: 0;
}

/* 折叠开关 */
.sidebar-toggle {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.75);
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.9);
}
.sidebar-toggle:active {
  transform: scale(0.93);
}
.toggle-bar {
  width: 14px;
  height: 2px;
  border-radius: 2px;
  background: #1b3a6b;
}

.topbar-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: #334866;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.55);
  position: relative;
  z-index: 1;
}
.topbar-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

/* ---- 天空层 ---- */
.topbar-sky {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* 云分为「外层漂移 + 内层呼吸」两层，互不干扰 transform。
   用 bottom 定位 + 以底边为缩放原点，保证圆顶向上长的时候不会被顶栏裁掉 */
.cloud-wrap {
  position: absolute;
  bottom: 0;
  transform-origin: 50% 100%;
  animation: cloud-drift linear infinite;
}

/* 远景：小、淡、糊、极慢 */
.cloud-wrap.w1 {
  bottom: 34px;
  transform: scale(0.5);
  opacity: 0.4;
  animation-duration: 168s;
  animation-delay: -22s;
}
.cloud-wrap.w2 {
  bottom: 10px;
  transform: scale(0.44);
  opacity: 0.32;
  animation-duration: 212s;
  animation-delay: -96s;
}
/* 中景 */
.cloud-wrap.w3 {
  bottom: 20px;
  transform: scale(0.78);
  opacity: 0.6;
  animation-duration: 118s;
  animation-delay: -48s;
}
.cloud-wrap.w4 {
  bottom: 2px;
  transform: scale(0.95);
  opacity: 0.74;
  animation-duration: 76s;
  animation-delay: -30s;
}
/* 近景：大、实、快 */
.cloud-wrap.w5 {
  bottom: 12px;
  transform: scale(1.02);
  opacity: 0.86;
  animation-duration: 52s;
  animation-delay: -14s;
}
.cloud-wrap.w6 {
  bottom: 4px;
  transform: scale(1.22);
  opacity: 0.95;
  animation-duration: 38s;
  animation-delay: -5s;
}

/* 云体：用一个 SVG 图块，不依赖「子元素溢出」（uvue 默认 overflow: hidden 会裁掉圆顶） */
.cloud {
  width: 58px;
  height: 32px;
  animation: cloud-bob 9s ease-in-out infinite alternate;
}

/* 越远越糊，拉开景深 */
.w1 .cloud,
.w2 .cloud {
  filter: blur(1.8px);
}
.w3 .cloud {
  filter: blur(1.1px);
}
.w4 .cloud {
  filter: blur(0.7px);
}
.w5 .cloud {
  filter: blur(0.7px);
}

/* 每朵云的呼吸节奏错开 */
.w2 .cloud { animation-duration: 13s; animation-delay: -4s; }
.w3 .cloud { animation-duration: 11s; animation-delay: -2s; }
.w5 .cloud { animation-duration: 7.5s; animation-delay: -3s; }
.w6 .cloud { animation-duration: 6.5s; animation-delay: -5s; }

@keyframes cloud-drift {
  from {
    left: -18%;
  }
  to {
    left: 110%;
  }
}

@keyframes cloud-bob {
  from {
    transform: translateY(-1.5px);
  }
  to {
    transform: translateY(1.5px);
  }
}

/* 尊重系统「减少动效」设置 */
@media (prefers-reduced-motion: reduce) {
  .cloud-wrap {
    animation: none;
    left: 30%;
  }
  .cloud {
    animation: none;
  }
}

/* ---- 页面内容 ---- */
.page-body {
  flex: 1;
  padding: 0;
  position: relative;
  z-index: 1;
  animation: pageFadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.page-main.with-sidebar .page-body {
  padding: 22px 32px 40px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

@keyframes pageFadeInUp {
  from { opacity: 0; transform: translateY(16rpx); }
  to { opacity: 1; transform: translateY(0); }
}

/* ---- 花瓣飘落（薄片状，有虚有实，不旋转） ---- */
.petal-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none; /* 不影响页面点击 */
  z-index: 5;
}

.petal {
  position: absolute;
  top: -10vh;
  left: var(--x);
  width: var(--s);
  height: calc(var(--s) * 1.55);
  /* 一头宽一头尖的薄片，像图里那种细碎花瓣 */
  border-radius: 92% 8% 78% 22% / 88% 14% 74% 26%;
  background: linear-gradient(
    150deg,
    rgba(233, 245, 255, 1) 0%,
    rgba(182, 213, 250, 1) 46%,
    rgba(138, 180, 240, 1) 100%
  );
  box-shadow: inset -1px -1px 2px rgba(255, 255, 255, 0.85),
    0 1px 3px rgba(70, 120, 190, 0.22);
  opacity: var(--o);
  /* 景深：远景虚化 */
  filter: blur(var(--b));
  animation: petal-fall var(--d) linear var(--delay) infinite;
  will-change: transform;
}

/* 每一帧都带着自己的固定角度 —— 朝向不同，但全程不转 */
@keyframes petal-fall {
  0% {
    transform: translate3d(0, -10vh, 0) rotate(var(--r));
  }
  50% {
    transform: translate3d(calc(var(--dx) * 0.55), 46vh, 0) rotate(var(--r));
  }
  100% {
    transform: translate3d(var(--dx), 104vh, 0) rotate(var(--r));
  }
}

@media (prefers-reduced-motion: reduce) {
  .petal { animation: none; display: none; }
}
</style>
