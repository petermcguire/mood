import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // registerGlobals(app);
  await app.listen(3100);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// export function registerGlobals(app: INestApplication) {
//   app.useGlobalInterceptors(
//     new ClassSerializerInterceptor(app.get(Reflector), {
//       strategy: 'excludeAll',
//       // excludeExtraneousValues: true,
//     }),
//   );
// }

bootstrap();
