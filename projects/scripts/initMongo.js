// can we make this into env vars for the docker compose service to provide?
const dbs = [
  {
    dbName: process.env.DB_IDP_NAME,
    user: {
      username: process.env.DB_IDP_USERNAME,
      password: process.env.DB_IDP_PASSWORD,
    },
  },
  {
    dbName: process.env.DB_APP_NAME,
    user: {
      username: process.env.DB_API_USERNAME,
      password: process.env.DB_API_PASSWORD,
    },
  },
];

const initDb = (dbConfig) => {
  let user = db.getSiblingDB(dbConfig.dbName).getUser(dbConfig.user.username);

  if (!user) {
    print(
      `Creating user '${dbConfig.user.username}' in db '${dbConfig.dbName}'...`
    );
    db.getSiblingDB(dbConfig.dbName).createUser({
      user: dbConfig.user.username,
      pwd: dbConfig.user.password,
      roles: [{ role: "readWrite", db: dbConfig.dbName }],
    });
  } else {
    print(
      `User '${dbConfig.user.username}' already exists in db '${dbConfig.dbName}'.`
    );
  }

  // initializing the database and & a collection so that other clients can connect to it
  // TODO: this may be unnecessary?
  let root = db.getSiblingDB(dbConfig.dbName).createCollection("root");
  if (!root) {
    print(`Creating collection 'root' in db '${dbConfig.dbName}'...`);
    db.getSiblingDB(dbConfig.dbName).createCollection("root");
  } else {
    print(`Collection 'root' already exists in db '${dbConfig.dbName}'.`);
  }
};

dbs.forEach((dbName) => {
  try {
    // initialize the db
    initDb(dbName);
  } catch (e) {
    print(`Failed to initialize database '${dbName}': ${e}`);
  }
});
