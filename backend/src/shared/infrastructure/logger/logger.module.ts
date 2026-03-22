import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        genReqId: (req: Request) => req.headers['x-correlation-id'] || uuidv4(),
        customAttributeKeys: {
          reqId: 'correlationId',
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { singleLine: true, translateTime: "SYS:standard" },
              }
            : undefined,
        autoLogging: true,
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class AppLoggerModule {}
