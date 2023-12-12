const fs = require('node:fs/promises')
const path = require('path')

const assets = [
  'brazil-states.svg',
  'municipalities-map.svg',
  'sp-state-municipalities.svg',
  'world-map.svg',
]
async function pack() {
  try {
    for (let index = 0; index < assets.length; index++) {
      const assetPath = assets[index];
      const data = await fs.readFile(path.join(__dirname, '..', 'assets', assetPath), { encoding: 'utf8' })
      const moduleToExport = "export default `" + data + "`"
      console.log('len', index, data.length)
      fs.writeFile(path.join(__dirname, '..', 'src', 'maps', assetPath + '.js'), moduleToExport, { encoding: 'utf8' })
    }
  } catch (err) {
    console.log(err)
  }
}

pack()