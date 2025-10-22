const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";

const log = (message: string) => process.stdout.write(`${GREEN}[LOG] ${RESET}${message}\n`);

log.info = (message: string) => process.stdout.write(`${YELLOW}[INFO] ${RESET}${message}\n`);
log.error = (message: string) => process.stderr.write(`${RED}[ERROR] ${RESET}${message}\n`);
log.db = (message: string) => process.stdout.write(`${BLUE}[DB] ${RESET}${message}\n`);

log.log = log;
export default log;
