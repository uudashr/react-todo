const CracoSwcPlugin = require('craco-swc');

module.exports = {
  plugins: [
    {
      plugin: CracoSwcPlugin,
      options: {
        swcLoaderOptions: {
          jsc: {
            externalHelpers: true,
            target: 'es5',
            parser: {
              syntax: 'ecmascript',
              jsx: true,
              dynamicImport: true,
              exportDefaultFrom: true,
            },
          },
        },
      },
    },
  ],
};