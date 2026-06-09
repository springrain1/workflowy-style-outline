# Obsidian 审查修复完整方案

## 修复状态

### ✅ 已完成
1. **minAppVersion 更新** - 已修复 34 个 API 版本错误
2. **设置页面标题** - 已修复 7 个标题元素错误

### ⚠️ 待修复
3. **不安全的 innerHTML** - 3 处（关键）
4. **直接样式设置** - 42 处（需要大量重构）

---

## innerHTML 修复方案（3处）

### 1. navigation-header.ts:157

**当前代码**:
```typescript
preview.innerHTML = `
    <div class="theme-preview-content">
        <div class="theme-preview-bullet"></div>
        <div class="theme-preview-text">${theme.name}</div>
    </div>
`;
```

**修复后**:
```typescript
const content = preview.createDiv('theme-preview-content');
content.createDiv('theme-preview-bullet');
const text = content.createDiv('theme-preview-text');
text.textContent = theme.name; // 安全的文本设置
```

### 2. outline-item.ts:151

需要查看具体代码后确定修复方案。

### 3. workflowy-view.ts:1048

需要查看具体代码后确定修复方案。

---

## 直接样式设置修复方案（42处）

### 策略：使用 setCssProps() 或 CSS 变量

Obsidian 推荐使用 `element.setCssProps()` 或 CSS 变量来设置动态样式。

### 文件列表和修复数量

1. **multi-selection.ts** - 5 处
2. **vertical-lines.ts** - 7 处  
3. **navigation-header.ts** - 11 处
4. **outline-item.ts** - 14 处
5. **workflowy-view.ts** - 4 处

### 示例修复

**错误方式**:
```typescript
element.style.paddingLeft = `${level * 30}px`;
element.style.top = `${position}px`;
```

**正确方式 1 - 使用 setCssProps()**:
```typescript
element.setCssProps({
    'padding-left': `${level * 30}px`,
    'top': `${position}px`
});
```

**正确方式 2 - 使用 CSS 变量**:
```typescript
element.setCssProps({
    '--indent-level': level.toString(),
    '--position': `${position}px`
});
// CSS: padding-left: calc(var(--indent-level) * 30px);
```

---

## 详细修复清单

### multi-selection.ts (5处)

- Line 87: `element.style.backgroundColor`
- Line 89: `element.style.backgroundColor`  
- Line 211: `element.style.pointerEvents`
- Line 214: `element.style.pointerEvents`
- Line 241: `element.style.opacity`

### vertical-lines.ts (7处)

- Line 45: `line.style.left`
- Line 283: `line.style.height`
- Line 291-294: 多个样式设置

### navigation-header.ts (11处)

- Line 53, 81, 118, 204, 212, 296, 305, 314, 327, 363: 位置和尺寸样式

### outline-item.ts (14处)

- Line 238, 241, 242: 缩进相关
- Line 939, 941, 942: 拖拽相关
- Line 1032, 1053, 1054: 位置相关
- Line 1162, 1740, 1761, 1872, 1873, 1876: 其他动态样式

### workflowy-view.ts (4处)

- Line 800, 844, 869, 1102: 布局相关样式

---

## 推荐修复顺序

### 阶段 1：关键错误（必须修复）
1. ✅ minAppVersion 更新
2. ✅ 设置页面标题  
3. ⚠️ **innerHTML 使用（3处）** ← 当前需要

### 阶段 2：样式设置重构（耗时）
4. ⚠️ **直接样式设置（42处）** ← 大工作量

---

## 自动化修复脚本

可以创建一个脚本批量替换 `element.style.xxx` 为 `element.setCssProps()`：

```typescript
// 查找模式
/(\w+)\.style\.(\w+)\s*=\s*(.+);/g

// 替换为
$1.setCssProps({ '$2': $3 });
```

---

## 预估工作量

- innerHTML 修复: 30 分钟（3处，需要仔细测试）
- 样式设置修复: 2-3 小时（42处，需要重构和测试）
- 测试验证: 1 小时
- **总计**: 约 4 小时

---

## 建议

由于样式设置修复工作量巨大，建议：

1. **先修复 innerHTML（3处）**，重新提交审查
2. 如果仍然不通过，再批量修复样式设置

或者：

**一次性全部修复**，确保通过审查（推荐）
