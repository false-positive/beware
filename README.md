<p align="center">
  <img width=256px src="./assets/hacker.svg" />
  <h1 align="center">Beware</h1>
  <p align="center">Online platform for learning operations security</p>
</p>

## What is Beware?

Beware is a web platform, which puts its users in the shoes of a hacker, who managed to get inside someone's computer. Their goal is to complete a series of tasks and collect data from the unlocked device.

Thinking from the perspective of an attacker teaches users about ways their personal information can get stolen and how to protect it, by following security best practices.

See [the presentation](./beware.pdf) for more details.

### Features

-   Courses that share a common theme
-   Computer simulations
-   Questions, that guide you through the course
-   Course summaries

## Built with

-   Typescript
-   Next.JS
-   Prisma
-   tRPC
-   Docker
-   Webtop
-   NextAuth
-   SASS

## Quick Start

To get it running, follow the steps below:

### Setup `.env`

```console
$ echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" > .env
```

If using [Ethereal Email](https://ethereal.email/):

```console
$ echo EMAIL_SERVER="smtp://<username>:<password>@smtp.ethereal.email:587/" >> .env
$ echo EMAIL_FROM=<username>@ethereal.email >> .env
```

(otherwise fill in the proper values accordingly)

### Generate SSL Certificates

**nevermind this sucks, to be docummented :(**

```console
$ mkdir -p data/domains
$ openssl req -x509 -sha256 -days 1825 -newkey rsa:2048 -keyout data/domains/root_ca.key -out data/domains/root_ca.crt
$ for subdomain in beware beware-machines; do echo "======= $subdomain <--"; echo "authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
subjectAltName = @alt_names
[alt_names]
DNS.1 = $subdomain.false-positive.dev" > data/domains/$subdomain.ext; openssl req -newkey rsa:2048 -keyout data/domains/$subdomain.key -out data/domains/$subdomain.csr; openssl x509 -req -CA data/domains/root_ca.crt -CAkey data/domains/root_ca.key -in data/domains/$subdomain.csr -out data/domains/$subdomain.crt -days 365 -CAcreateserial -extfile data/domains/$subdomain.ext; done
```

# License

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

See [LICENSE](./LICENSE) for more details.
