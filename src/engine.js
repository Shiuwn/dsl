"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ejs = require("ejs");
var fs = require("node:fs");
var path = require("node:path");
var config_1 = require("./config");
var templatePath = path.join(__dirname, config_1.default.templatePath);
var main = function () {
    var frontendTpl = path.join(templatePath, 'vue.ejs');
    var tpl = fs.readFileSync(frontendTpl, { encoding: 'utf8' });
    var render = ejs.compile(tpl);
    console.log(render({ search: [1], table: [] }));
};
main();
