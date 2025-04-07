# KevChat Proxy

This project acts as a reverse proxy to all the other services. It also validates JWT for the app & api using the idp service.

You must add the following lines to your hosts file to make this proxy work -

```
127.0.0.1 local.kev.chat
127.0.0.1 local.api.kev.chat
127.0.0.1 local.app.kev.chat
127.0.0.1 local.idp.kev.chat
127.0.0.1 local.kafka-ui.kev.chat
127.0.0.1 local.socketio-admin.kev.chat
```

You will also need to update generate a local SSL cert -

```sh
openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout certs/local.kev.chat.key \
  -out certs/local.kev.chat.crt \
  -days 365 \
  -subj "/C=US/ST=Local/L=Local/O=Local/CN=local.kev.chat" \
  -reqexts SAN -extensions SAN \
  -config san.conf
```

Then trust the cert -

```sh
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain certs/local.kev.chat.crt
```

If you ever want to inspect the cert -

```sh
openssl x509 -in certs/local.kev.chat.crt -text -noout
```
