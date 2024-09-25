# TODO

- [x] VS Code setup
- [x] Check linting setup
- [x] Prettier
- [x] Husky
- [x] Commit health
- [ ] Write ADRs
- [ ] Write features
- [ ] Draw Arch Diagrams
- [ ] Write Code
- [ ] Infra

## DevEx/Tech Debt

- [x] TF format/lint hooks & (VS Code integration)
- [ ] Use private IPs for ECS services (set up VPC gateway for ECR)
- [ ] Eslint sort imports into groups
- [ ] Rework AWS CLI credentials (that terraform will use) to not use long-term credentials (API keys)
- [ ] CI/CD pipeline
- [ ] Use npm ci in docker images
- [ ] Clean up user & group policy assignments for the kevops user
- [ ] Automate docker tagging with versions from package.json
- [ ] Go through Terraform resources to see if I need to add any non-default properties
- [ ] Scan docker container/optimize size
- [ ] Do I need to be pointing to the dualstack ALB domains for the A records? (it does this when you configure thru the UI)

## Tasks

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
- [ ] Deploy front door
- [ ] Write profile API
- [ ] Write chat websocket API
- [ ] Refine ALB auth
- [ ] Write landing page
- [ ] Write stuff for email confirmation
- [ ] Fix CSS layout :(
- [ ] Switch favicon for light mode
- [ ] Custom OAuth auth page
