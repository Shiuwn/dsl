class Context {
  parent: Context | null;
  constructor(parent: Context | null) {
    this.parent = parent
  }
  collect(data: UIData) {
    return this
  }
}

type UIType = 'input' | 'select' | 'column'
interface UIData {
  type: UIType
  label: string
  bind: string
  [key: string]: any
}

export class Template extends Context {
  data: any[] = []
  constructor() {
    super(null)
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

}

class Search extends Context {
  uis: UIData[] = []
  input(name: string) {
    this.uis.push({ type: 'input', label: name, bind: name })
    return this
  }
  select(name: string) {
    return this.input(name)
  }
  bind(value: string) {
    const last = this.uis.pop()
    if (last) {
      last.bind = value
      this.uis.push(last)
    }
    return this
  }
  options(data: SelectOption[]) {
    const last = this.uis.pop()
    if (last?.type === 'select') {
      last.options = data
      this.uis.push(last)
    }
    return this
  }
  build() {
    this.uis.forEach((d) => {
      this.parent?.collect(d)
    })
    return this.parent as Template
  }
}

class UI extends Context {
  name: string = ''
  value: string = ''
  bind(value: string) {
    this.value = value
    return this
  }
  label(name: string) {
    this.name = name
    this.value = name
    return this
  }
}

interface SelectOption {
  label: string;
  value: string | number;
}


class Table extends Context {
  uis: UIData[] = []
  column(name: string) {
    this.uis.push({ type: 'column', label: name, bind: name })
    return this
  }
  width(width: string | number) {
    const last = this.uis.pop()
    if (last) {
      last.width = width
      this.uis.push(last)
    }
    return this
  }
  bind(value: string) {
    const last = this.uis.pop()
    if (last) {
      last.bind = value
      this.uis.push(last)
    }
    return this
  }
  build() {
    this.uis.forEach(d => {
      this.parent?.collect(d)
    })
    return this.parent as Template
  }
}

class Controller extends Context {

}

