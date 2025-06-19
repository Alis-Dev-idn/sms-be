import fs from 'fs';
import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerConfig from "../src/main/config/SwaggerConfig";

const spec = swaggerJSDoc(SwaggerConfig);
fs.writeFileSync('./swagger.json', JSON.stringify(spec, null, 2));
console.log('✅ Swagger spec generated!');
