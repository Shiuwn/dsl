"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("node:fs");
var path = require("node:path");
var config_1 = require("./config");
var Handlebars = require("handlebars");
var templatePath = path.join(__dirname, config_1.default.templatePath);

var main = function () {
    var frontendTpl = path.join(templatePath, 'vue.hbs');
    var tpl = fs.readFileSync(frontendTpl, { encoding: 'utf8' });
    var render = Handlebars.compile(tpl);
    console.log(render({ search: [1], table: [] }));
};
main();
