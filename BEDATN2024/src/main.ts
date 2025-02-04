import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { RtmpService } from './rtmp/rtmp.service';
import { RtmpModule } from './rtmp/rtmp.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.setGlobalPrefix('api'); // Thiết lập tiền tố 'api' cho tất cả các route
  // app.enableVersioning({
  //   type: VersioningType.URI, // Cách versioning là thông qua URI
  //   prefix: 'v',               // Sử dụng 'v' làm tiền tố cho version
  // });
  app.listen(process.env.PORT ?? 3001);

  const app1 = await NestFactory.create(RtmpModule, { cors: true });

  const rtmpService = app1.get(RtmpService);
  rtmpService.createRtmpServer();
}
bootstrap();
