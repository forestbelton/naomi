import fs from 'fs'
import path from 'path'

const scriptPath = path.join(__dirname, 'commands')
const commandScripts = fs.readdirSync(scriptPath, 'utf8')
    .filter(name => name !== '.' && name !== '..' && name !== 'Command.js')
    .filter(name => /\.js$/.test(name))

export default commandScripts.map(script => {
    const path = scriptPath + '/' + script
    return require(path)
})
