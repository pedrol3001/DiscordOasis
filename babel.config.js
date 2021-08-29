const tsconfig = require('./tsconfig.json');

module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@error': './src/oasis/shared/error/',
          '@config': './src/oasis/config/',
          '@interfaces': './src/oasis/interfaces/',
          '@plugin': './src/oasis/shared/infra/discord/plugins/',
          '@discord': './src/oasis/shared/infra/discord/',
          '@command': './src/oasis/shared/infra/discord/command/',
          '@database': './src/oasis/shared/infra/database/',
          '@repositories': './src/oasis/repositories/',
          '@guilds_repo': './src/oasis/repositories/guild/',
          '@plugins_repo': './src/oasis/repositories/plugin/',
        },
      },
    ],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
  ],
};
