"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const SwaggerConfig_1 = __importDefault(require("../main/config/SwaggerConfig"));
const spec = (0, swagger_jsdoc_1.default)(SwaggerConfig_1.default);
fs_1.default.writeFileSync('./swagger.json', JSON.stringify(spec, null, 2));
console.log('✅ Swagger spec generated!');
