import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import * as process from "process";
import { AppModule } from "./app.module";
import { ExceptionsLoggerFilter } from "./infrastructure/exceptions/exceptionsLogger.filter";

async function start() {
    const PORT = process.env.PORT || 5001;
    const app = await NestFactory.create(AppModule, {
        logger: ["error", "warn"],
        // Опция для Frontend
        // В Axios цепляются куки, сообщаем по какому адресу наш фронтент
        cors: {
            credentials: true,
            origin: "http://localhost:3000",
        },
    });
    app.setGlobalPrefix("/api");
    app.use(cookieParser());
    // app.use(morgan("combined"));

    // ВСЕГДА ПОСЛЕДНИЙ! Перехватчик ошибок
    app.useGlobalFilters(new ExceptionsLoggerFilter());

    // Настройка документации
    const config = new DocumentBuilder()
        .setTitle("ОТ и ТБ")
        .setDescription("Лысенков Виктор")
        .setVersion("1.0.0")
        .addTag("REST API")
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/api/docs", app, document);

    await app.listen(PORT, () => console.log(`Server started on port=${PORT}`));
}

start();
