import { inspect } from 'node:util';

import { ConfigModule, ConfigService } from '@nestjs/config';
import safeStringify from 'fast-safe-stringify';
import { WinstonModuleAsyncOptions, WinstonModuleOptions } from 'nest-winston';
import { format, transports } from 'winston';

const globalFormat = (appName: string) => {
  const colorizer = format.colorize();
  colorizer.addColors({
    level_error: 'inverse red',
    level_warn: 'inverse yellow',
    level_info: 'inverse green',
    level_http: 'inverse green',
    level_verbose: 'inverse cyan',
    level_debug: 'inverse blue',
    level_silly: 'inverse magenta',
    msg_error: 'red',
    msg_warn: 'yellow',
    msg_info: 'green',
    msg_http: 'green',
    msg_verbose: 'cyan',
    msg_debug: 'blue',
    msg_silly: 'magenta',
    timestamp: 'inverse',
  });
  return format.combine(
    format.splat(),
    format.errors({ stack: true }),
    format.json(),
    format.timestamp({
      format: 'YYYY-MM-DD A HH:mm:ss',
    }),
    format.printf(({ timestamp, level, message, context, ...meta }) => {
      const isEmptyObject = meta.constructor === Object && Object.keys(meta).length === 0;

      const _formattedContext = colorizer.colorize(`msg_warn`, `[${context}]`);
      const formattedMeta = isEmptyObject
        ? ''
        : ` - ${inspect(JSON.parse(safeStringify(meta)), { colors: true, depth: null })}`;
      const formattedSpace = colorizer.colorize(`msg_${level}`, `[${appName}] ${process.pid} `);
      const formattedTimestamp = colorizer.colorize('timestamp', ` ${timestamp} `);
      const formattedLevel = colorizer.colorize(
        `msg_${level}`,
        ` ${level.toUpperCase().padEnd(7, ' ')} ${_formattedContext} `,
      );
      const formattedMessage = colorizer.colorize(`msg_${level}`, `${message}`);
      const rootFormattedMessage = `${formattedSpace}${formattedTimestamp}${formattedLevel}${formattedMessage}${formattedMeta}`;

      return rootFormattedMessage;
    }),
  );
};

const winstonConfigAsync: WinstonModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<WinstonModuleOptions> => ({
    level: configService.get<string>('common.nodeEnv') !== 'production' ? 'debug' : 'info',
    transports: [
      new transports.Console({
        stderrLevels: ['error'],
      }),
    ],
    format: globalFormat(configService.get<string>('common.appName')),
  }),
  inject: [ConfigService],
};

export default winstonConfigAsync;
