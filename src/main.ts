import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1/rag');

  const config = new DocumentBuilder()
    .setTitle('Athena Neura Intelligence API')
    .setDescription('RAG-based question-answering API with vector embeddings and multi-agent support')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use('/api/v1/rag/openapi.json', (_req, res) => {
    res.json(document);
  });

  app.use('/api/v1/rag/scalar', (_req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Athena Neura Intelligence API</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <script id="api-reference" data-url="/api/v1/rag/openapi.json" data-configuration='{"theme":"purple"}'></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`);
  });

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();