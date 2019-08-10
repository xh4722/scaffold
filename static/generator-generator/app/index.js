'use strict'
const path = require('path')
const Generator = require('yeoman-generator')
const _ = require('lodash')
const fs = require('fs-extra')

function makeGeneratorName(name) {
  name = _.kebabCase(name)
  name = name.indexOf('generator-') === 0 ? name : 'generator-' + name
  return name
}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.argument('name', {
      type: String,
      required: true,
      description: 'Generator name',
    })

    this.options.name = makeGeneratorName(this.options.name)
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.options.name) {
      this.log(
        'Your generator must be inside a folder named ' +
          this.options.name +
          '\n' +
          "I'll automatically create this folder."
      )
      fs.ensureDirSync(this.options.name)
      this.destinationRoot(this.destinationPath(this.options.name))
    }

    this.composeWith(require.resolve('../subgenerator'), {
      arguments: ['app'],
    })
  }
}
