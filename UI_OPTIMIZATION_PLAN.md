# 前端UI优化设计方案

## 一、设计规范

### 1. 核心风格
- **Glassmorphism** (玻璃质感)
- 设计原则：高级感、简约、层次分明

### 2. 色彩体系
```css
:root {
    /* 蓝色系 - 主色调 */
    --primary-blue: #1890ff; /* 主蓝色 - 用于主要按钮、关键操作 */
    --primary-blue-hover: #40a9ff; /* 主蓝色悬停 */
    --light-blue: #e6f7ff; /* 淡蓝色 - 用于背景、高光 */
    --dark-blue: #0050b3; /* 深蓝色 - 用于文字、重要标识 */

    /* 中性色系 - 用于文本、背景、边框 */
    --text-primary: rgba(0, 0, 0, 0.85); /* 主要文字 */
    --text-secondary: rgba(0, 0, 0, 0.65); /* 次要文字 */
    --text-tertiary: rgba(0, 0, 0, 0.45); /* 辅助/禁用文字 */

    --bg-white: #ffffff; /* 纯白背景 */
    --bg-gray-1: #fafafa; /* 最浅灰背景 */
    --bg-gray-2: #f5f5f5; /* 浅灰背景 */
    --bg-gray-3: #f0f0f0; /* 标准灰背景 */

    --border-color-light: #d9d9d9; /* 浅色边框 */
    --border-color-base: #bae7ff; /* 基础边框色 (注入蓝色感) */

    /* 玻璃质感专用变量 */
    --glass-bg-light: rgba(255, 255, 255, 0.7); /* 亮色玻璃背景 */
    --glass-bg-dark: rgba(255, 255, 255, 0.15); /* 暗色玻璃背景 */
    --glass-border: rgba(255, 255, 255, 0.3); /* 玻璃边框 */
    --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15); /* 玻璃阴影 */
}
```

### 3. 视觉效果规范
- 背景模糊：
- 半透明容器：
- 微妙阴影：