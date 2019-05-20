FROM postgres:10.7

ENV POSTGRES_USER=retraced
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=retraced

## Insert fixtures
COPY ./fixtures.sql /docker-entrypoint-initdb.d/

