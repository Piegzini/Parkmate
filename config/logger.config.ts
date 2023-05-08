import { format, createLogger, transports } from 'winston';

const consoleFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = createLogger({
  level: 'info',
  format: consoleFormat,
  transports: [new transports.Console()],
});

if (process.env.NODE_ENV === 'PROD') {
  logger.add(
    new transports.File({
      format: format.json(),
      level: 'info',
      filename: './logs/app.log',
    })
  );

  logger.add(
    new transports.File({
      format: format.json(),
      level: 'error',
      filename: './logs/errors.log',
    })
  );
}

export default logger;
