class Context {
  parent: Context | null;
  data: any[] = []
  constructor(parent: Context | null) {
    this.parent = parent
  }
  collect(data: UIData) {
    return this
  }
  end() {
    this.data.forEach((d) => {
      this.parent?.collect(d)
    })
    return this.parent as Template
  }
}

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

export class Template extends Context {
  data: any[] = []
  namespace: string
  constructor(namespace?: string) {
    super(null)
    this.namespace = (namespace || '').split('/').join('_')
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
  collect(data: any) {
    this.data.push(data)
    return this
  }
  build() {

  }

  service() {
    return new Service(this)
  }

  entity() {
    return new Entity(this)
  }

}

class Search extends Context {
  data: UIData[] = []
  input(name: string) {
    this.data.push({ type: 'input', label: name, bind: name })
    return this
  }
  select(name: string) {
    return this.input(name)
  }
  bind(value: string) {
    const last = this.data.pop()
    if (last) {
      last.bind = value
      this.data.push(last)
    }
    return this
  }
  options(data: SelectOption[]) {
    const last = this.data.pop()
    if (last?.type === 'select') {
      last.options = data
      this.data.push(last)
    }
    return this
  }
}

interface SelectOption {
  label: string;
  value: string | number;
}

class Table extends Context {
  data: UIData[] = []
  column(name: string) {
    this.data.push({ type: 'column', label: name, bind: name })
    return this
  }
  width(width: string | number) {
    const last = this.data.pop()
    if (last) {
      last.width = width
      this.data.push(last)
    }
    return this
  }
  bind(value: string) {
    const last = this.data.pop()
    if (last) {
      last.bind = value
      this.data.push(last)
    }
    return this
  }
}

class Controller extends Context {
  data: ControllerData[] = []
  static hasProvider(ctx: Controller) {
    return ctx.data.find(c => c.provide)
  }
  post(name: string) {
    this.data.push({ type: 'controller', method: 'post', name })
    return this
  }
  body(name: string) {
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
  query(name: string) {
    const last = this.data.pop()
    if (last && last.type === 'controller' && last.method === 'get') {
      if (!last.query) {
        last.query = []
      }
      last.body.push(name)
      this.data.push(last)
    }

    return this

  }

  get(name: string) {
    this.data.push({ type: 'controller', method: 'get', name })
    return this
  }
  shortcuts(names: string) {
    const api = names.split(',')
    let provided = Controller.hasProvider(this)
    if (!provided) {
      provided = { type: 'controller', method: '', provided: true, name: '' }
    }
    provided.api = api
    this.data.push(provided)
    return this
  }
  entity(name: string) {
    let provided = Controller.hasProvider(this)
    if (!provided) {
      provided = { type: 'controller', method: '', provided: true, name: '' }
    }
    provided.entity = name
    return this
  }
  service(name: string) {
    let provided = Controller.hasProvider(this)
    if (!provided) {
      provided = { type: 'controller', method: '', provided: true, name: '' }
    }
    provided.service = name
    return this
  }
}

class Service extends Context {
  data: ServiceData[] = []
  inject(name: string) {
    this.data.push({ type: 'service', inject: name })
    return this
  }
  entity(name: string) {
    this.data.push({ type: 'service', entity: name })
    return this
  }

}

class Entity extends Context {
  data: EntityData[] = []
  column(name: string, tsType?: string) {
    this.data.push({ type: 'entity', name, tsType })
    return this
  }
  comment(name: string) {
    const last = this.data.pop()
    if (last) {
      last.comment = name
      this.data.push(last)
    }
    return this
  }
}

