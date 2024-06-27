/**
 * @typedef {import('./index.mjs').Template} Template
 */
/**
 * @param {(string) => Template} template
 */
export default (template) => {
  return template('base/test/template')
    .table()
    .column('name')
    .bind('_name')
    .width(100)
    .column('description')
    .end()
    .search()
    .input('name')
    .bind('_name')
    .input('description')
    .bind('des')
    .select('os')
    .options([{ label: 'Windows', value: 'windows' }, { label: 'Linux', value: 'linux' }])
    .end()
    .controller()
    .get('/page')
    .query('pageNo')
    .end()
    .build()

}
