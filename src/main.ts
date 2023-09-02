import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as process from "process";
import { AppModule } from "./app.module";

async function start() {
    const PORT = process.env.PORT || 5001;
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("/api");

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
