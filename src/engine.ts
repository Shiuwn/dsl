import * as ejs from 'ejs'
import * as fs from 'node:fs'
import * as path from 'node:path'
import config from './config'

const templatePath = path.join(__dirname, config.templatePath)

const main = () => {

  const frontendTpl = path.join(templatePath, 'vue.ejs')
  const tpl = fs.readFileSync(frontendTpl, { encoding: 'utf8' })
  const render = ejs.compile(tpl)
  console.log(render({ search: [1], table: [] }))
}

main()

