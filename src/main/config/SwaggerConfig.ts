import swaggerJSDoc from 'swagger-jsdoc';

export default swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SMS API',
            version: '1.0.0',
            description: 'API documentation for the Stock Management System Application',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        servers: [
            {
                url: 'http://localhost:4000/api/v1',
            },{
                url: 'https://sms.alisdev.my.id/api/v1',
            },
        ],
    },
    apis: [
        './src/main/**/*.ts',
    ], // Path to the API docs
})