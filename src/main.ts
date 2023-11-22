import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as process from "process";
import { AppModule } from "./app.module";
import { ExceptionsLoggerFilter } from "./infrastructure/exceptions/exceptionsLogger.filter";

async function start() {
    const PORT = process.env.PORT || 5001;
    const app = await NestFactory.create(AppModule, {
        // Опция для Frontend, иначе вылетает ошибка при авторизации и
        // возможно других запросах
        cors: true,
    });
    app.setGlobalPrefix("/api");
    app.useGlobalFilters(new ExceptionsLoggerFilter());

    // Настройка документации
    const config = new DocumentBuilder()
        .setTitle("Удостоверения BACKEND")
        .setDescription("Лысенков Виктор")
        .setVersion("1.0.0")
        .addTag("REST API")
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/api/docs", app, document);

    await app.listen(PORT, () => console.log(`Server started on port=${PORT}`));
}

start();
