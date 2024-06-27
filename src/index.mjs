class Context {
  parent = null;
  data = []
  constructor(parent) {
    this.parent = parent
  }
  collect(data) {
    return this
  }
  end() {
    this.data.forEach((d) => {
      this.parent?.collect(d)
    })
    return this.parent
  }
}
/*
type UIType = 'input' | 'select' | 'column'
interface UIData {
  type: UIType
  label: string
  bind: string
  [key: string]: any
}
interface ControllerData {
  type: 'controller'
  method: 'post' | 'get' | ''
  name: string
  provided?: boolean
  [key: string]: any
}

interface ServiceData {
  type: 'service'
  inject?: string
  entity?: string
  [key: string]: any
}

interface EntityData {
  type: 'entity'
  name: string
  comment?: string
  tsType?: string
  [key: string]: any
}

*/
export class Template extends Context {
  data = []
  namespace
  constructor(namespace) {
    super(null)
    this.namespace = namespace || ''
  }
  search() {
    return new Search(this)
  }
  table() {
    return new Table(this)
  }
  controller() {
    return new Controller(this)
  }
  collect(data) {
    this.data.push(data)
    return this
  }
  build() {
    return { namespace: this.namespace, data: this.data }
  }
  end() {
    return this
  }

  service() {
    return new Service(this)
  }

  entity() {
    return new Entity(this)
  }

}

class Search extends Context {
  data = []
  input(name) {
    this.data.push({ type: 'input', label: name, bind: name })
    return this
  }
  select(name) {
    this.data.push({ type: 'select', label: name, bind: name })
    return this

  }
  bind(value) {
    const last = this.data.pop()
    if (last) {
      last.bind = value
      this.data.push(last)
    }
    return this
  }
  options(data) {
    const last = this.data.pop()
    if (last?.type === 'select') {
      last.options = JSON.stringify(data, null, 2)
      this.data.push(last)
    }
    return this
  }
}

/*
interface SelectOption {
  label;
  value;
}
  */

class Table extends Context {
  data = []
  column(name) {
    this.data.push({ type: 'column', label: name, bind: name })
    return this
  }
  width(width) {
    const last = this.data.pop()
    if (last) {
      last.width = width
      this.data.push(last)
    }
    return this
  }
  bind(value) {
    const last = this.data.pop()
    if (last) {
      last.bind = value
      this.data.push(last)
    }
    return this
  }
}

class Controller extends Context {
  data = []
  static hasProvider(ctx) {
    return ctx.data.find(c => c.provide)
  }
  post(name) {
    this.data.push({ type: 'controller', method: 'post', name })
    return this
  }
  body(name) {
    const last = this.data.pop()
    if (last && last.type === 'controller' && last.method === 'post') {
      if (!last.body) {
        last.body = []
      }
      last.body.push(name)
      this.data.push(last)
    }

    return this
  }
  query(name) {
    const last = this.data.pop()
    if (last && last.type === 'controller' && last.method === 'get') {
      if (!last.query) {
        last.query = []
      }
      last.query.push(name)
      this.data.push(last)
    }

    return this

  }

  get(name) {
    this.data.push({ type: 'controller', method: 'get', name })
    return this
  }
  shortcuts(names) {
    const api = names.split(',')
    let provided = Controller.hasProvider(this)
    if (!provided) {
      provided = { type: 'controller', method: '', provided: true, name: '' }
    }
    provided.api = api
    this.data.push(provided)
    return this
  }
  entity(name) {
    let provided = Controller.hasProvider(this)
    if (!provided) {
      provided = { type: 'controller', method: '', provided: true, name: '' }
    }
    provided.entity = name
    return this
  }
  service(name) {
    let provided = Controller.hasProvider(this)
    if (!provided) {
      provided = { type: 'controller', method: '', provided: true, name: '' }
    }
    provided.service = name
    return this
  }
}

class Service extends Context {
  data = []
  inject(name) {
    this.data.push({ type: 'service', inject: name })
    return this
  }
  entity(name) {
    this.data.push({ type: 'service', entity: name })
    return this
  }

}

class Entity extends Context {
  data = []
  column(name, tsType) {
    this.data.push({ type: 'entity', name, tsType })
    return this
  }
  comment(name) {
    const last = this.data.pop()
    if (last) {
      last.comment = name
      this.data.push(last)
    }
    return this
  }
}

