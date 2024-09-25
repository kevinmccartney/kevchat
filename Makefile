client_build:
	docker build -t kevchat_client:0.2.0 -f .\projects\client\Dockerfile .
client_run:
	docker run -p 3000:3000 kevchat_client:0.2.0
client_shell:
	docker run --rm -it --entrypoint sh kevchat_client:0.1.1
api_build:
	docker build -t kevchat_api:0.2.0 -f .\projects\api\Dockerfile .
api_run:
	docker run -p 5000:5000 kevchat_api:0.2.0
api_shell:
	docker run --rm -it --entrypoint sh kevchat_api:0.2.0
local_proxy_build:
	docker build -t kevchat_local_proxy:0.1.0 -f .\projects\local-proxy\Dockerfile .
local_proxy_run:
	docker run -p 80:80 kevchat_local_proxy:0.1.0
local_proxy_shell:
	docker run --rm -it --entrypoint sh kevchat_local_proxy:0.2.0
deploy_front_door:
	aws s3 cp projects/front-door/out s3://kev.chat/ --recursive
# this one requires you to add the aws_account_id. i've read that it's not sensitive, but some people say it is,
# so erring on the side of caution here
docker_ecr_login:
	aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin aws_account_id.dkr.ecr.us-east-2.amazonaws.com

