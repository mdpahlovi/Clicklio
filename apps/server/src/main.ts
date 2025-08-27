import { ConsoleLogger, ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
    const logger = new ConsoleLogger({
        logLevels: ["warn", "error", "log", "debug", "verbose", "fatal"],
        prefix: "Clicklio",
        timestamp: true,
    });

    const app = await NestFactory.create(AppModule, { logger });
    const configService = app.get(ConfigService);

    // Security
    app.use(helmet());

    // CORS
    app.enableCors({
        origin: configService.get<string>("origin")?.split(","),
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: "*",
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // API versioning
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "1",
    });

    // Global prefix
    const apiPrefix = configService.get<string>("apiPrefix");
    app.setGlobalPrefix(apiPrefix || "api/v1");

    // Port
    const port = configService.get<number>("port");
    await app.listen(port || 4000);

    logger.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
