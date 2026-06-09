// 快速修复所有 element.style.xxx 为 setCssProps
const fs = require('fs');
const path = require('path');

const files = [
    'src/features/multi-selection.ts',
    'src/features/vertical-lines.ts',
    'src/ui/navigation-header.ts',
    'src/ui/outline-item.ts',
    'src/workflowy-view.ts'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 替换 element.style.property = value; 为 element.setCssProps({'property': value});
    // 处理单行样式设置
    content = content.replace(
        /(\w+)\.style\.(\w+)\s*=\s*([^;]+);/g,
        (match, el, prop, val) => {
            // 转换驼峰命名为连字符命名
            const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${el}.setCssProps({'${cssProp}': ${val}});`;
        }
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${file}`);
});

console.log('All style fixes completed!');
