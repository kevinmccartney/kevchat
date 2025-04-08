# TODO

## Backlog

### V1

- [ ] Can I use a middleware/session to manage the cancel link (on login)?
  - [ ] Add signup and cancel link to login
- [ ] Splash page link should be login
- [ ] Mobile cleanup
  - [ ] Tear out all that prose BS, just wing it on type sizes
- [ ] Set up rooms on backend & UI
- [ ] Consolidate dockerfiles

- [ ] Write more validation for user create endpoint
- [ ] Use Nest logger for all logging
- [ ] UIState API (saves what the user was looking at last, among other things)

- [ ] Create dev token tool (if cookie exists, print it on page, if not redirect to login (add dev token tool to redirect URLs))
- [ ] Finish writing user API
- [ ] Implement at least once delivery for WebSocket messages
- [ ] Add more validation around user_upsert kafka handler API (validate the input)
- [ ] Allow login with email
- [ ] Write UI user profile
- [ ] Use Redis or memcache instead of mongo for IDP sessions
- [ ] Implement PKCE for OIDC on IDP server
- [ ] Figure out handling of nginx errors (backend unreachable due to compile error 502 bad gateway)
- [ ] Figure out a way to create an initial session for the user after signup
- [ ] Fix web app debugging
- [ ] Use npm ci in prod docker images
- [ ] Scan docker container/optimize size
- [ ] Is there a better way to do env vars for next?
- [ ] Make HMR work on local domains
- [ ] Eslint sort imports into groups
- [ ] Write ADRs
- [ ] Draw Arch Diagrams
- [ ] Switch favicon for light mode
- [ ] CI/CD pipeline
- [ ] Tests (ESP E2E for IDP)
- [ ] Can I get XXS'd/other security vuln with the idp signin query params? (the answer is almost definitely yes)

### V2

- [ ] Notifications
- [ ] Write config abstraction layer for NestJS APIs
- [ ] Write stuff for email confirmation of Cognito accounts
- [ ] Rework AWS CLI credentials (that terraform will use) to not use long-term credentials (API keys)
- [ ] Go through Terraform resources to see if I need to add any non-default properties
- [ ] Set up private connectivity for Mongo Atlas
- [ ] Add Mongo Atlas IP allow lists to TF (?)
- [ ] Use private IPs for ECS services (set up VPC gateway for ECR)
- [ ] Clean up AWS user & group policy assignments for the kevops user
- [ ] Automate docker tagging with versions from package.json
- [ ] Look into gitbook

### Tech Debt

- [ ] Add link to NextJS issue re inspect port & patch

## Done

- [x] List of convos
- [x] Make commit
- [x] Write chat websocket API
- [x] Self-host socket UI
- [x] Set up DNS for kafka UI, websocket client
- [x] Front door => login (add signup link to login page)
- [x] Set up volume for Mongo data
- [x] Write user sync to API DB (kafka events)
- [x] Check commit quality tooling
- [x] Get a commit together
- [x] Build stylesheet as a part of IDP docker build
- [x] Review files
- [x] Go through package.json files to see what might be unneeded
- [x] Variablize mongo init
- [x] Use env vars in docker-compose
- [x] Check return values of IDP UserService
- [x] Remove users module from API
  - [x] Client side validation
- [x] Continue kick tires on IDP stuff to see what needs firmed up
- [x] GET interaction/UI42rwzfDMy0089-74-z6/abort 404
- [x] Implement 405 for idp
- [x] GET /interaction/{uid} 404
- [x] Invalid creds kills login
- [x] Stop sign out from signout confirm screen when user clicks cancel
- [x] Set up auth error pages in app
- [x] Fix CSS layout :(
- [x] Clear kevchat_access_token cookie on logout
- [x] Put app behind auth
- [x] Fix nginx unauthenticated responses
- [x] Dockerize client
- [x] Initialize AWS TF workspace
- [x] Deploy client
- [x] Configure DNS
- [x] Get a record in terraform, remove foreign references, redirect HTTP => HTTPS
- [x] Clean up security groups
- [x] Deploy API
- [x] Add LB listener rules
- [x] Rename security groups
- [x] Split TF into modules
- [x] Call healthz from client
- [x] Deploy
- [x] Figure out ALB auth
- [x] Put API behind auth
- [x] Write front door
- [x] Deploy front door
- [x] Write landing page
- [x] Refine ALB auth
- [x] Allow logout
- [x] Deploy mongo atlas
- [x] Make sure I can debug
- [x] VS Code setup
- [x] Check linting setup
- [x] Prettier
- [x] Husky
- [x] Commit health
- [x] TF format/lint hooks & (VS Code integration)
- [x] Write docker compose for local env
- [x] Figure out idp & api user Mongo perms
- [x] Create user endpoint
- [x] Move oidc to use Mongo db users
- [x] Style OIDC pages
