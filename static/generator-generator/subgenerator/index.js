'use strict'
const path = require('path')
const Generator = require('yeoman-generator')
const superb = require('superb')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.argument('name', {
      type: String,
      required: true,
      description: 'Generator name',
    })
  }

  writing() {
    const generatorName = this.options.name

    this.fs.copyTpl(
      this.templatePath('index.js'),
      this.destinationPath(path.join(this.options.name, 'index.js')),
      {
        // Escape apostrophes from superb to not conflict with JS strings
        superb: superb().replace("'", "\\'"),
        generatorName,
      }
    )

    this.fs.copy(
      this.templatePath('templates/**'),
      this.destinationPath(path.join(this.options.name, 'templates'))
    )
  }
}
