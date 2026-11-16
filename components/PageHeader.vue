<!--
  页面头部组件 - 液态玻璃导航栏
  条件编译：H5 无状态栏占位，APP-PLUS 有状态栏
-->
<template>
  <view class="page-header">
    <!-- 天空层：淡蓝天空 + 循环飘动的云（纯装饰） -->
    <view class="topbar-sky">
      <view class="cloud-wrap w1"><image class="cloud" src="/static/icons/cloud.svg" mode="aspectFit" /></view>
      <view class="cloud-wrap w2"><image class="cloud" src="/static/icons/cloud.svg" mode="aspectFit" /></view>
      <view class="cloud-wrap w3"><image class="cloud" src="/static/icons/cloud.svg" mode="aspectFit" /></view>
      <view class="cloud-wrap w4"><image class="cloud" src="/static/icons/cloud.svg" mode="aspectFit" /></view>
    </view>

    <!-- 状态栏占位（仅 APP 端） -->
    <!-- #ifdef APP-PLUS -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }" />
    <!-- #endif -->

    <view class="header-inner">
      <view class="nav-bar">
        <view class="nav-left" @tap="goBack">
          <view v-if="showBack" class="back-btn">
            <text class="back-icon">←</text>
          </view>
          <view v-else class="nav-placeholder" />
        </view>
        <view class="nav-center">
          <text class="nav-title">{{ title }}</text>
        </view>
        <view class="nav-right">
          <slot name="right" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: true }
})

// 系统信息（仅在 APP 端有意义）
// #ifdef APP-PLUS
const sysInfo = uni.getSystemInfoSync()
const statusBarHeight = computed(() => sysInfo.statusBarHeight || 0)
// #endif

function goBack() {
  if (props.showBack) {
    uni.navigateBack({ delta: 1 })
  }
}
</script>

<style scoped>
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
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

/* ---- 天空层 & 云 ---- */
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

/* 云分为「外层漂移 + 内层呼吸」两层，互不干扰 transform */
.cloud-wrap {
  position: absolute;
  animation-name: cloud-drift;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* 远近层次：小淡糊 → 大实快 */
.cloud-wrap.w1 {
  top: 0;
  transform: scale(0.55);
  opacity: 0.35;
  animation-duration: 150s;
  animation-delay: -18s;
}
.cloud-wrap.w2 {
  top: 26px;
  transform: scale(0.78);
  opacity: 0.55;
  animation-duration: 96s;
  animation-delay: -40s;
}
.cloud-wrap.w3 {
  top: 4px;
  transform: scale(1);
  opacity: 0.8;
  animation-duration: 56s;
  animation-delay: -16s;
}
.cloud-wrap.w4 {
  top: 18px;
  transform: scale(1.15);
  opacity: 0.92;
  animation-duration: 40s;
  animation-delay: -6s;
}

/* 云体：用一个 SVG 图块，不依赖「子元素溢出」（uvue 默认 overflow: hidden 会裁掉圆顶） */
.cloud {
  width: 36px;
  height: 20px;
  animation: cloud-bob 8s ease-in-out infinite alternate;
}

.w1 .cloud,
.w2 .cloud {
  filter: blur(1.2px);
}
.w3 .cloud {
  filter: blur(0.6px);
}

.w2 .cloud { animation-duration: 12s; animation-delay: -3s; }
.w3 .cloud { animation-duration: 8.5s; animation-delay: -2s; }
.w4 .cloud { animation-duration: 6.5s; animation-delay: -4s; }

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
    transform: translateY(-1px);
  }
  to {
    transform: translateY(1px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cloud-wrap {
    animation: none;
    left: 30%;
  }
  .cloud {
    animation: none;
  }
}

.status-bar {
  width: 100%;
}

.header-inner {
  width: 100%;
  position: relative;
  z-index: 1;
}

@media (min-width: 768px) {
  .header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
  }
}

.nav-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 24rpx;
  position: relative;
}

@media (min-width: 768px) {
  .nav-bar {
    padding: 0;
  }
}

.nav-left {
  width: 80rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.nav-right {
  width: 80rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.nav-placeholder {
  width: 32rpx;
}

.nav-center {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #334866;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.55);
  white-space: nowrap;
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.2s;
}

.back-btn:active {
  transform: scale(0.9);
  background: rgba(255, 255, 255, 0.8);
}

.back-icon {
  font-size: 32rpx;
  color: #7c5cfc;
  font-weight: 700;
}
</style>
