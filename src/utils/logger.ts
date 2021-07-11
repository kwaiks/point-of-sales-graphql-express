import {createLogger, transports, format} from "winston";
import dailyRotate from "winston-daily-rotate-file";
import fs from "fs";

const loggingDir = "logs";

if (!fs.existsSync(loggingDir)) {
    fs.mkdirSync(loggingDir);
}

const log = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    transports: [
        new (transports.Console)({
            format: format.combine(
                format.timestamp(),
                format.colorize(),
                format.simple()
              )
        }),
        new (dailyRotate)({
            dirname: loggingDir,
            filename: `application-%DATE%.log`,
            zippedArchive: true,
            datePattern: "YYYYMMDD",
            maxSize: "20m",
            maxFiles: "14d"
        }),
        new (dailyRotate)({
            level: "error",
            dirname: loggingDir,
            filename: `application-error-%DATE%.log`,
            zippedArchive: true,
            datePattern: "YYYYMMDD",
            maxSize: "20m",
            maxFiles: "14d"
        })        
    ],
    exitOnError: false
});

const accesslog = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new (dailyRotate)({
            dirname: loggingDir,
            filename: `access-%DATE%.log`,
            zippedArchive: true,
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d"
        }) 
    ],
    exitOnError: false
});

if (process.env.NODE_ENV !== 'production') {
    log.add(new transports.Console({
      format: format.simple(),
    }));
  }

export {log, accesslog};