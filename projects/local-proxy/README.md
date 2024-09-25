# KevChat Local Proxy

This project is just a container to run locally so you can map `local.kev.chat` & `local.api.kev.chat` in your hosts file. Then the config `app-config` endpoint can return those names from the `.env.local` file locally & we can pass in env vars on the deployed container.

You must add the following lines to your hosts file to make this proxy work -

```
127.0.0.1 local.kev.chat
127.0.0.1 local.api.kev.chat
```
