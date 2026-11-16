# AI 面试助手 · 前端

面向校招 / 实习场景的 AI 模拟面试平台前端，基于 **uni-app + Vue 3**，以 H5（桌面端）为主，兼容移动端布局。

## 功能

| 模块 | 说明 |
|---|---|
| 工作台 | 三步引导（上传简历 → 面试配置 → 开始面试）、数据概览、常见面试题预览 |
| 简历管理 | 上传、列表、结构化详情（教育 / 经历 / 技能 / 项目）、重新解析 |
| 面试 | 配置 CRUD（风格 / 难度 / 技能 / 语言）、创建会话、实时问答、历史记录 |
| 评估 | 总分与多维评分、逐题点评、提升建议、报告再生成 |
| 语音反馈 | 流畅度 / 发音 / 语速 / 填充词统计与趋势 |
| 技能成长 | 技能雷达、历史趋势、成长报告、薄弱点建议 |
| 系统管理 | 用户列表与角色授权（基于菜单权限码的侧边栏过滤） |
| 个人资料 | 资料查看与修改 |

## 技术栈

- **框架**：uni-app（Vue 3 `<script setup>`），HBuilderX 运行
- **样式**：手写 CSS，玻璃拟态 + 天空蓝主题；`common/css/design-system.css` 为全局设计系统（颜色变量、`.glass-card`、`.resp-grid`、`.hide-*` 等）
- **接口层**：`api/` 下按服务拆分，`api/request.js` 统一封装 `uni.request`；`mock/index.js` 提供按接口粒度的本地假数据开关
- **接口契约**：`docs/API_CONTRACT.md`（与后端实际返回对齐，改页面前先看它）

## 目录

```
api/            接口封装（auth / user / resume / interview / evaluation / feedback / growth / admin）
common/         公共工具（设备判断、侧栏状态、侧栏背景配置）与全局样式
components/     布局与通用组件（PageLayout / DesktopSidebar / PageHeader / GlassCard ...）
docs/           接口契约文档
mock/           本地假数据
pages/          页面（按业务分目录）
static/         静态资源（图标、背景图）
```

## 运行

1. 用 **HBuilderX** 打开本项目根目录；
2. 「运行 → 运行到浏览器」，默认起在 `http://localhost:5173`；
3. 后端网关地址在 `api/config.js` 里配置（默认 `http://localhost:10010`）；
4. 纯前端预览（不连后端）：把 `mock/index.js` 里的 `USE_MOCK` 打开。

## 说明

- 项目当前运行在 uni-app 的 Web 运行时下，`view` 默认 `flex-direction: column` 且默认 `overflow: hidden`，写样式时需要显式声明横向排列、并避免依赖子元素溢出父级。
- 字体：标题 Zen Maru Gothic，正文回落到系统圆体（Yuanti SC / 幼圆），字重只用 400 / 700 两档。