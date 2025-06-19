import fs from 'fs';
import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerConfig from "../main/config/SwaggerConfig";

fs.writeFileSync('./swagger.json', JSON.stringify(SwaggerConfig, null, 2));
console.log('✅ Swagger spec generated!');
