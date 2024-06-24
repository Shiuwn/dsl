import * as fs from 'node:fs'
import * as path from 'node:path'
import config from './config'
import * as Handlebars from 'handlebars'
import * as _ from 'lodash'
import * as changeCase from 'change-case'
import { parseArgs } from 'node:util'


const templatePath = path.join(__dirname, config.templatePath)


const main = () => {
  const args = ['-e']
  const options = {
    exec: {
      type: 'string',
      short: 'e'
    }
  }
  const { values } = parseArgs({ args, options })
  if (!fs.existsSync(values.exec as string)) {
    throw new Error('需要传入执行的文件 -e script.js')
  }

  const frontendTpl = path.join(templatePath, 'vue.hbs')
  const tpl = fs.readFileSync(frontendTpl, { encoding: 'utf8' })
  const render = Handlebars.compile(tpl)
}

main()

