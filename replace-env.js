const fs = require('fs');
const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `
export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL}', 
  facebook_token: '${process.env.API_FACE}',
};
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log(`Output generated at ${targetPath} ${process.env.API_URL}`);
  }
});