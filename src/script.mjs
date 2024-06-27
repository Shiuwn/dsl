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
    .provide_service('BaseService')
    .get('page')
    .query('pageNo')
    .end()
    .service()
    .inject('ctx')
    .inject_entity('BaseTestEntity')
    .end()
    .entity()
    .column('badCase')
    .comment('溶剂中')
    .type('number')
    .end()
    .build()

}
