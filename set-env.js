const fs = require('fs');
const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
  production: true,
  openWeatherApiKey: '${process.env.NG_APP_OPENWEATHER_API_KEY}'
};
`;

fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.error(err);
  }
});
