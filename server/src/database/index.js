const pgConfig = { 
    host: process.env.PGHOSTNAME,
    port: process.env.PGHPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSERNAME,
    password: process.env.PGPASSWORD,
    max: 10
}

const initOptions = { 

    connect(client, dc, useCount) {
        const cp = client.connectionParameters;
        console.log('Connected to database:', cp.database);
    }

};

const pgp = require('pg-promise')(initOptions);

const db = pgp(pgConfig);

module.exports = db;