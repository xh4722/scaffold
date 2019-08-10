const child_process = require('child_process')
const fs = require('fs-extra')

fs.emptyDirSync('dist')
child_process.execSync('func-service build')
fs.ensureDirSync('dist/src')
fs.moveSync('dist/bin.js', 'dist/src/bin.js')
fs.moveSync('dist/index.js', 'dist/src/index.js')
fs.copySync('static', 'dist/static')
