-- Run as a PostgreSQL administrator while connected to the jpn database.
CREATE ROLE jpnrouser
    LOGIN
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    NOREPLICATION
    NOBYPASSRLS;

-- Prompts for the role password without placing it in this file or shell history.
\password jpnrouser

GRANT CONNECT ON DATABASE jpn TO jpnrouser;
GRANT USAGE ON SCHEMA practice TO jpnrouser;
GRANT SELECT ON ALL TABLES IN SCHEMA practice TO jpnrouser;

-- Tables created in practice by jpnuser will be readable by jpnrouser too.
ALTER DEFAULT PRIVILEGES FOR ROLE jpnuser IN SCHEMA practice
    GRANT SELECT ON TABLES TO jpnrouser;
