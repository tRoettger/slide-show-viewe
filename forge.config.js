module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: [ 'win32', 'win64' ],
      config: {
        ignore: [
          "cfg/*", "experiments/*"
        ]
      }
    }
  ],
};
