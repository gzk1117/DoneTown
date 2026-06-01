# DoneTown

DoneTown 是一款童话绘本风的游戏化效率工具 Demo。它把现实待办、任务拆解、打卡记录和小镇养成结合在一起：用户完成现实任务后获得资源，用资源陪伴小鸡成长、筑巢，并在时光画册里留下自己的回响记录。

## APK 下载

当前 debug 测试包：

[下载 DoneTown-debug.apk](https://github.com/gzk1117/DoneTown/raw/refs/heads/codex/apk-build-pipeline/release/DoneTown-debug.apk)

如果链接暂时不可用，也可以到 GitHub Actions 页面下载最新构建产物：

[DoneTown APK 构建工作流](https://github.com/gzk1117/DoneTown/actions/workflows/build-debug-apk.yml)

如果仓库保持私有，下载链接只对有仓库访问权限的账号可用。要发给没有权限的朋友，需要把仓库设为公开、给对方添加访问权限，或直接发送 APK 文件。

安装说明：

- 安卓手机需要允许安装未知来源应用。
- 如果通过电脑安装，需要开启开发者选项和 USB 调试。
- 当前 APK 是 debug 测试包，适合内部体验和朋友试用，不是应用商店正式签名包。

## 核心创意

DoneTown 的核心理念是“把努力变成一个会被看见的小镇”。传统待办工具通常只告诉用户还剩多少任务，DoneTown 更强调温柔反馈和积累感：每一次完成、记录和推进，都会转化成金币、建材、记忆碎片、小鸡成长和家园变化。

产品希望解决三个问题：

- 任务压力过大时，用户需要的是拆解和鼓励，而不是惩罚。
- 日常努力往往很快被遗忘，需要一个能回看的手账式空间。
- 效率工具可以不只是冷冰冰的列表，也可以有生命感、陪伴感和轻量游戏目标。

## 主要功能

### 任务系统

- 支持学习、工作、健康、生活四类任务。
- 支持简单、中等、困难三档难度，并根据难度发放奖励。
- 首页只显示当前未完成任务，降低噪音。
- 任务卡片显示分类、难度、奖励和完成进度。
- 支持放弃任务，不扣除资源，保留温和退路。

### 进度型任务

- 支持短期限时任务，可设置起止时间。
- 支持短期达标任务，可选择设置截止时间。
- 支持长期任务，可设置截止日期和时刻。
- 支持计数任务，可设置总目标数量，并通过滑条或输入实时更新进度。
- 前三类任务可拆解为子任务，并设置子任务权重；完成子任务后总进度同步推进。

### 回响打卡

- 点击完成任务时，不会立刻结算，而是打开“回响打卡”弹窗。
- 快捷打卡会直接结算基础金币。
- 深度记录会保存感想到时光画册，并给予双倍金币和记忆碎片奖励。
- 历史记录以时间轴方式展示，可删除。

### 今日小镇

- 小镇场景使用森林背景和透明素材小鸡。
- 小鸡孵化后可以在森林里移动。
- 点击森林位置，小鸡会走过去；移动时显示侧面状态，到达后显示正面状态。
- 点击小鸡会冒爱心动画，表达陪伴反馈。
- 筑巢功能会根据家园等级展示不同等级的巢穴。
- 限时任务超时一天后切换阴天，超时两天后切换雨天。

### 资源与成长

- 用户完成任务获得金币和建材。
- 深度记录获得记忆碎片。
- 金币可用于宠物成长。
- 金币和建材可用于筑巢。
- 所有数据使用浏览器 localStorage 本地保存。

## 技术栈

- React
- TypeScript
- Vite
- TailwindCSS
- Zustand
- Capacitor Android
- localStorage 本地持久化

## 本地开发

安装依赖：

```powershell
npm install
```

启动 Web 开发环境：

```powershell
npm run dev
```

构建 Web：

```powershell
npm run build
```

代码检查：

```powershell
npm run lint
```

## Android APK

生成 debug APK：

```powershell
npm run apk:debug
```

生成后的文件位置：

```text
dist-apk\DoneTown-debug.apk
```

连接安卓手机并安装：

```powershell
npm run apk:install
```

重新构建后安装：

```powershell
npm run apk:install -- -Build
```

GitHub Actions 会在 `main`、`codex/**` 分支 push、PR 到 `main` 以及手动触发时构建 APK，并上传名为 `DoneTown-debug-apk` 的构建产物。

## 当前状态

DoneTown 目前是可运行 Demo，已完成 Web 端核心体验、Android debug APK 打包流程，并通过真机安装验证。后续正式发布还需要补充 release 签名、版本号策略、后端账号体系和云端同步。
