# FlowBoard Web

FlowBoard 的 Vue 3 C 端应用。当前阶段提供中文国际化、路由、Pinia、Tailwind 设计令牌与可运行的启动页；认证和业务页面在 M3 实现。

## 技术栈

- Vue 3、TypeScript、Vite
- Vue Router、Pinia、vue-i18n
- Tailwind CSS、Radix Vue（后续接入无样式交互原语）

## 本地启动

```powershell
npm install
npm run dev
```

默认地址为 `http://localhost:5173`。复制 `.env.example` 为本地 `.env` 后，可设置 API 根路径。

## 验证构建

```powershell
npm run build
```

## 文档

共享设计与交付文档见 [flowboard-docs](https://github.com/ZaneLeoo/flowboard-docs)。
