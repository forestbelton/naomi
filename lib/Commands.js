const fs = require('fs')
const path = require('path')

const scriptPath = path.join(__dirname, 'commands')
const commandScripts = fs.readdirSync(scriptPath, 'utf8')
    .filter(name => name !== '.' && name !== '..' && name !== 'Command.js')

module.exports = commandScripts.map(script => {
    const path = scriptPath + '/' + script
    return require(path)
})