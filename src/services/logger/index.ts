import { createLogger, transports, config, format } from 'winston';

const logger = createLogger({
  levels: config.npm.levels,
  exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      handleRejections: true,
      format: format.prettyPrint(),
    }),
  );
}

export default logger;
