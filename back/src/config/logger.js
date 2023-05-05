const {createLogger, transports, format}= require("winston");
const { combine, timestamp, label, printf, simple, colorize} = format;

const printFormat = printf(({ timestamp, label, level, message }) => {
    return `${timestamp} [${level}] : ${message}`;
  });

const printLogFormat = {
    file: combine(
    label({
        label: "백엔드",

    }),
    // colorize(), 
    timestamp({
        format: "YYYY-MM-DD HH:mm:dd",
      }),
    printFormat
    ),
    console: combine(
        colorize(), //
        simple()
    )
};

const opts = {
    file: new transports.File({
        filename: "access.log",
        dirname: "./logs",
        level: "info",
        format: printLogFormat.file,
    }),
    console: new transports.Console({
        level: "info",
        format: printLogFormat.console,
        // .format.colorize()
     }),
};
// winston으로 로그 만들기
// winston안에 있는 createLogger사용 
const logger = createLogger({
    transports: [opts.file],
});
// 실제 서비스 중인 서버와 개발 서버를 나눌 수 있다.
// Node_ENV로 실제 서버와 개발 서버 이용
if (process.env.NODE_ENV !== "production"){
    logger.add(opts.console);
} 
module.exports = logger;

// 콘솔을 보는 이유 개발을 빠르게 하기 위해
// 날짜는 콘솔에 찍을 필요없음