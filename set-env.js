const fs = require('fs');
const targetPath = './src/environments/environment.prod.ts';

const apiKey = process.env.NG_APP_OPENWEATHER_API_KEY;

if (!apiKey) {
  console.error('ERROR: NG_APP_OPENWEATHER_API_KEY no está definida');
  process.exit(1);
}

const envConfigFile = `export const environment = {
  production: true,
  openWeatherApiKey: '${apiKey}'
};
`;

fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('✅ environment.prod.ts generado correctamente con API key');
});
