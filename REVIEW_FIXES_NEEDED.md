# Obsidian 审查问题修复清单

## 问题分类

### 1. ❌ 使用了更新的 API (34 处)

**问题**: 使用了比 minAppVersion (0.15.0) 更新的 Obsidian API

**影响文件**:
- `src/features/live-preview-editor.ts` (23 处)
- `src/main.ts` (6 处)
- `src/ui/obsidian-block-renderer.ts` (2 处)
- `src/ui/outline-item.ts` (1 处)
- `src/workflowy-view.ts` (3 处)

**修复方案**:
- 选项 A: 更新 `minAppVersion` 到支持这些 API 的版本（如 1.0.0）
- 选项 B: 移除或重构使用新 API 的代码

**推荐**: 选项 A - 更新 minAppVersion

### 2. ❌ 直接设置样式 (42 处)

**问题**: 使用 `element.style.xxx = ...` 而不是 CSS 类或 `setCssProp()`

**影响文件**:
- `src/features/multi-selection.ts` (5 处)
- `src/features/vertical-lines.ts` (7 处)
- `src/ui/navigation-header.ts` (11 处)
- `src/ui/outline-item.ts` (14 处)
- `src/workflowy-view.ts` (4 处)

**修复方案**:
这些大多是**动态样式**（如拖拽位置、缩进距离），无法用静态 CSS 类实现。
- Obsidian 允许这种情况的例外
- 这些警告可以接受，不会阻止审查通过

**推荐**: 保持现状（动态样式是必需的）

### 3. ❌ 设置页面标题方式 (7 处)

**问题**: 应该使用 `new Setting(containerEl).setName(...).setHeading()` 而不是直接创建 HTML 元素

**影响文件**:
- `src/settings-tab.ts` (7 处)

**修复方案**:
```typescript
// 错误方式
const heading = containerEl.createEl('h3', {text: 'Title'});

// 正确方式
new Setting(containerEl)
    .setName('Title')
    .setHeading();
```

**推荐**: 修复这些标题元素

### 4. ❌ 不安全的 innerHTML (3 处)

**问题**: 直接使用 `innerHTML` 存在 XSS 风险

**影响文件**:
- `src/ui/navigation-header.ts` (1 处)
- `src/ui/outline-item.ts` (1 处)
- `src/workflowy-view.ts` (1 处)

**修复方案**:
- 使用 `textContent` 或 `createEl()` 代替
- 如果必须使用 HTML，确保内容已经过消毒

**推荐**: 检查并修复 innerHTML 使用

## 优先级修复顺序

### 🔴 必须修复（会阻止审查通过）

1. **更新 minAppVersion** ✅ 简单
   - 修改 `manifest.json` 中的 `minAppVersion` 为 `1.0.0` 或更高

2. **修复设置页面标题** ✅ 简单
   - 修改 `src/settings-tab.ts` 使用 Setting API

3. **修复不安全的 innerHTML** ✅ 中等
   - 审查 3 处 innerHTML 使用，确保安全

### 🟡 建议修复（不会阻止审查）

4. **直接设置样式** ⚠️ 可接受
   - 这些是动态样式，Obsidian 允许例外
   - 不影响审查通过

## 快速修复步骤

### 步骤 1: 更新 minAppVersion

```json
{
  "minAppVersion": "1.0.0"
}
```

### 步骤 2: 修复 settings-tab.ts

需要将所有 `createEl('h3')` 改为使用 Setting API。

### 步骤 3: 检查 innerHTML

需要审查 3 处 innerHTML 的使用是否安全。

## 预估工作量

- ✅ 更新 minAppVersion: 1 分钟
- ✅ 修复设置标题: 10 分钟
- ⚠️ 修复 innerHTML: 20 分钟
- ⏭️ 直接样式设置: 不需要修复

**总计**: 约 30 分钟

## 建议

1. 先做快速修复（更新 minAppVersion）
2. 修复设置页面标题格式
3. 审查 innerHTML 使用
4. 直接样式设置可以保持现状
