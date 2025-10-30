FROM postgres:18.0-alpine3.22

ARG USER
ARG PWD
ARG NAME

ENV POSTGRES_USER=$USER
ENV POSTGRES_PASSWORD=$PWD
ENV POSTGRES_DB=$NAME

COPY schema.sql /tmp/schema.sql
RUN sed -e "s/\${POSTGRES_USER}/${POSTGRES_USER}/g" /tmp/schema.sql > /docker-entrypoint-initdb.d/schema.sql
