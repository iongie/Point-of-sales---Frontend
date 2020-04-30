// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  url: "http://localhost:3000",
  image: "http://localhost:3000/image/",
  dataOffline: "http://localhost:3000/data-offline/",
  dbOffline: "app",
  tokenCrypto: "c95735c55411e26134f1887d7e953675a0555849256704629aa8dce51b1db9b3064dab52988e520e29fab14b868ca512515bcf072274f325a12fcf5fd87d1e6d",
};
