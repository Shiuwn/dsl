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

Handlebars.registerHelper('camelCase', function (aString) {
  return changeCase.camelCase(aString)
})
Handlebars.registerHelper('pascalCase', function (aString) {
  return changeCase.pascalCase(aString)
})
Handlebars.registerHelper('snackCase', function (aString) {
  return changeCase.snakeCase(aString)
})

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
    shapedData.namespace = namespace

    if (shapedData['search'] || frontendKeys.some(k => shapedData[k])) {
      const filepath = path.join(config.frontendPath, 'modules', allPath[0], 'views', allPath.slice(1).join('/'))
      if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath, { recursive: true })
      }
      const result = Handlebars.compile(fs.readFileSync(path.join(templatePath, 'vue.hbs'), { encoding: 'utf8' }))(shapedData)
      fs.writeFileSync(path.join(filepath, 'index.vue'), result)
    }

    if (shapedData['controller']) {
      const filepath = path.join(config.backendPath, allPath[0], 'controller', allPath.slice(1, -1).join('/'))
      const index = shapedData['controller'].findIndex(d => d.provided)
      if (index > -1) {
        const provided = shapedData['controller'][index]
        shapedData['controllerProvided'] = provided
        shapedData['controller'].splice(index, 1)
      }
      if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath, { recursive: true })
      }
      const result = Handlebars.compile(fs.readFileSync(path.join(templatePath, 'controller.hbs'), { encoding: 'utf8' }))(shapedData)
      fs.writeFileSync(path.join(filepath, allPath.at(-1) + '.ts'), result)
    }

    if (shapedData['service']) {
      const filepath = path.join(config.backendPath, allPath[0], 'service', allPath.slice(1, -1).join('/'))
      if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath, { recursive: true })
      }
      const result = Handlebars.compile(fs.readFileSync(path.join(templatePath, 'service.hbs'), { encoding: 'utf8' }))(shapedData)
      fs.writeFileSync(path.join(filepath, allPath.at(-1) + '.ts'), result)
    }

    if (shapedData['entity']) {
      const filepath = path.join(config.backendPath, allPath[0], 'entity', allPath.slice(1, -1).join('/'))
      if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath, { recursive: true })
      }
      const result = Handlebars.compile(fs.readFileSync(path.join(templatePath, 'entity.hbs'), { encoding: 'utf8' }))(shapedData)
      fs.writeFileSync(path.join(filepath, allPath.at(-1) + '.ts'), result)
    }
  })
}

main()

