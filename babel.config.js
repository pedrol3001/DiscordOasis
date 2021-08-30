const tsconfig = require('./tsconfig.json');

module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@error': './src/error/*',
          '@interfaces': './src/interfaces/',
          '@oasis': './src/oasis/',
          '@commands': './src/oasis/commands/',
          '@plugins': './src/oasis/plugins/',
        },
      },
    ],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
  ],
};
