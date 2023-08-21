module.exports = {
    development: {
        dialect: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "123456",
        database: "certificates_dev",
    },
    production: {
        dialect: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "123456",
        database: "certificates",
    },
};
