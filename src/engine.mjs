import * as fs from 'node:fs'
import * as path from 'node:path'
import config from './config.mjs'
import Handlebars from 'handlebars'
import _ from 'lodash'
import * as changeCase from 'change-case'
import * as util from 'node:util'
import { Template } from './index.mjs'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendSearchKeys = ['input', 'select']
const frontendKeys = [...frontendSearchKeys, 'column']

const templatePath = path.join(__dirname, config.templatePath)


const main = () => {
  const options = {
    exec: {
      type: 'string',
      short: 'e'
    }
  }
  const { values } = util.parseArgs({ options })
  // if (!fs.existsSync(values.exec)) {
  //   throw new Error('需要传入执行的文件 -e script.js')
  // }
  import(values['exec']).then((m) => {
    const fn = m.default
    const data = fn((name) => {
      return new Template(name)
    })
    if (!data) {
      return
    }
    const { namespace, data: templateData } = data
    const shapedData = _.groupBy(templateData, (d) => {
      if (frontendSearchKeys.includes(d.type)) {
        return 'search'
      }
      return d.type
    })
    const allPath = namespace.split('/')
    const dirs = allPath.slice(0, -1).join('/')


    if (shapedData['search'] || frontendKeys.some(k => shapedData[k])) {
      const frontendPath = path.join(config.frontendPath, 'modules', dirs, 'views', allPath.at(-1))
      if (!fs.existsSync(frontendPath)) {
        fs.mkdirSync(frontendPath, { recursive: true })
      }
      const result = Handlebars.compile(fs.readFileSync(path.join(templatePath, 'vue.hbs'), { encoding: 'utf8' }))(shapedData)
      console.log(shapedData)
      fs.writeFileSync(path.join(frontendPath, 'index.vue'), result)
    }
  })
}

main()

