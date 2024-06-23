import { type Template } from '.'


export default (template: () => Template) => {
  template()
    .table()
    .column('name')
    .bind('_name')
    .width(100)
    .column('description')
    .build()
    .search()
    .input('name')
    .bind('_name')
    .input('description')
    .bind('des')
    .select('os')
    .build()








}
