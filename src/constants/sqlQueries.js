const dropAllTables = `
    DROP TABLE search_results;
    DROP TABLE reports;
    DROP TABLE users;
`;

const createTables = `
    CREATE TABLE IF NOT EXISTS "users" (
      id SERIAL PRIMARY KEY,
      username VARCHAR(20) NOT NULL,
      password VARCHAR(60) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "reports" (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      createdDate TIMESTAMP NOT NULL,
      userId INT REFERENCES users(id) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "search_results" (
      id SERIAL PRIMARY KEY,
      keyword VARCHAR NOT NULL,
      status VARCHAR(20) NOT NULL,
      totalSearchResults VARCHAR(70),
      totalLinks INT,
      totalAdwordsAdvertisers INT,
      htmlCode TEXT,
      reportId INT REFERENCES reports(id) NOT NULL
    );
`;

const initTablesQuery = `
    ${dropAllTables}
    ${createTables}
`;

module.exports = {
  createTables,
  initTablesQuery,
};
