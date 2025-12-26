# AI NEWS NAVIGATION

一个基于 Vue 3 开发的 AI 公益站点导航系统，采用独特的 **Newsprint (报纸风格)** UI 设计。

![Production](https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel)
![Vue](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)

## ✨ 特性

- **报纸风格 UI**: 深度定制的 Newsprint 视觉体验，包含网格布局、硬阴影、新闻纸纹理及精选字体排版。
- **站点管理**: 
  - 支持手动添加、编辑和删除 AI 站点。
  - 智能 Favicon 获取，内置多级备用方案（Google, DuckDuckGo, 本地默认图标）。
  - 自动区分主站与福利站，保持卡片布局整齐。
- **数据安全**:
  - 数据完全存储在浏览器本地 (`localStorage`)。
  - 支持 JSON 格式的数据导入与导出。
  - 提供一键清空数据的安全操作。
- **自动化脚本**: 内置脚本编辑器，支持编写和保存自定义 JavaScript 自动化逻辑。
- **统一交互体验**: 
  - 自定义消息通知系统，告别原生 `alert`。
  - 统一的确认对话框，确保操作安全。
- **响应式设计**: 完美适配桌面端与移动端。

## 🛠️ 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **图标**: Iconify (MDI, Material Symbols)
- **加密**: Crypto-JS (用于敏感数据处理)
- **样式**: Vanilla CSS (CSS Variables, Grid, Flexbox)

## 🚀 快速开始

### 本地开发

1. **克隆仓库**:
   ```bash
   git clone <repository-url>
   cd AINavigationSite
   ```

2. **安装依赖**:
   ```bash
   npm install
   ```

3. **启动开发服务器**:
   ```bash
   npm run dev
   ```

4. **访问**: 打开浏览器访问 `http://localhost:5173`。

### 生产构建

```bash
npm run build
```
构建产物将生成在 `dist` 目录中。

## 🌐 部署方式

### Vercel 部署 (推荐)

本项目已完美适配 Vercel，支持一键部署：

1. **安装 Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **执行部署**:
   ```bash
   vercel --prod
   ```

或者，您可以将代码推送到 GitHub，并在 Vercel 控制台中关联该仓库，即可实现自动化流水线部署。

### 静态托管

由于本项目是纯前端应用，您可以将 `dist` 目录下的内容托管至任何静态服务器，如 Nginx, GitHub Pages 或 Netlify。

## 📄 许可证

© 2025 AI NEWS. 版权所有。
