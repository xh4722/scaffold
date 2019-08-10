import { Command, SubOptions, CommandArgsProvider } from 'func'
import yeoman from 'yeoman-environment'

@Command({ name: 'create' })
@SubOptions([
  {
    name: 'name',
    alias: 'n',
    description: 'scaffold name',
    type: String,
  },
  {
    name: 'desc',
    alias: 'd',
    description: 'scaffold description',
    type: String,
  },
  {
    name: 'command',
    alias: 'c',
    description: 'scaffold command',
    type: String,
  },
])
export class Create {
  constructor({ option }: CommandArgsProvider) {
    const env = yeoman.createEnv()

    env.register(require.resolve('@/static/generator-scaffold/app'), 'create')

    env.run(
      'create',
      {
        name: option.name,
        desc: option.desc,
        command: option.command,
      },
      () => {},
    )
  }
}
