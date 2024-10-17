const { STAGE } = process.env;
const appConfig = {
  appName: 'List Users',
  dbCredSecret: 'db/mysql/dev',
  stage: STAGE,
};

export { appConfig };
