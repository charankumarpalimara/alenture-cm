#!/usr/bin/env node

// CSS Verification Script
// This script checks if the built CSS contains all required custom styles

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying CSS build...\n');

// Find the CSS file in build directory
const buildDir = path.join(__dirname, 'build', 'static', 'css');
const cssFiles = fs.readdirSync(buildDir).filter(file => file.endsWith('.css'));

if (cssFiles.length === 0) {
    console.log('❌ No CSS files found in build directory!');
    process.exit(1);
}

const cssFile = path.join(buildDir, cssFiles[0]);
const cssContent = fs.readFileSync(cssFile, 'utf8');

// Required CSS classes and styles
const requiredStyles = [
    'custom-ant-table-header',
    'custom-row',
    'ctp-root',
    'ctp-inner',
    'ctp-left',
    'ctp-right',
    'ctp-label',
    'ctp-select',
    'ctp-range',
    'ctp-buttons',
    'ctp-btn'
];

console.log('📋 Checking for required CSS classes:');
let allFound = true;

requiredStyles.forEach(style => {
    if (cssContent.includes(style)) {
        console.log(`✅ ${style}`);
    } else {
        console.log(`❌ ${style} - MISSING!`);
        allFound = false;
    }
});

console.log('\n🎨 Checking for specific style properties:');

const styleChecks = [
    { name: 'Table header gradient', pattern: /background:linear-gradient.*#0a0a3d.*#5050d4/ },
    { name: 'Table row hover effect', pattern: /\.custom-row:hover td.*background:#e3e8ff/ },
    { name: 'Pagination container', pattern: /\.ctp-root.*background:#fff/ },
    { name: 'Pagination buttons', pattern: /\.ctp-btn.*cursor:pointer/ }
];

styleChecks.forEach(check => {
    if (check.pattern.test(cssContent)) {
        console.log(`✅ ${check.name}`);
    } else {
        console.log(`❌ ${check.name} - MISSING!`);
        allFound = false;
    }
});

console.log('\n📊 CSS File Info:');
console.log(`File: ${cssFile}`);
console.log(`Size: ${(fs.statSync(cssFile).size / 1024).toFixed(2)} KB`);

if (allFound) {
    console.log('\n🎉 All CSS styles are properly built!');
    console.log('💡 If styles are not showing on server:');
    console.log('   1. Check if server is serving the latest build');
    console.log('   2. Clear browser cache (Ctrl+F5)');
    console.log('   3. Check server cache settings');
    console.log('   4. Verify CSS file is being loaded in browser dev tools');
} else {
    console.log('\n❌ Some CSS styles are missing from the build!');
    console.log('💡 Try running: npm run build');
    process.exit(1);
}
