SHELL := /bin/bash

deploy_front_door:
	aws s3 cp projects/front-door/out s3://kev.chat/ --recursive
# this one requires you to add the aws_account_id. i've read that it's not sensitive, but some people say it is,
# so erring on the side of caution here
docker_ecr_login:
	aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin ${KEVCHAT_AWS_ACCOUNT_ID}.dkr.ecr.us-east-2.amazonaws.com
docker_push_client:
	IMAGE=$$(cat compose.yaml | yq ".services.kevchat_client.image") && \
	docker tag $$IMAGE "$${KEVCHAT_AWS_ACCOUNT_ID}.dkr.ecr.us-east-2.amazonaws.com/$${IMAGE}" && \
	docker push "$${KEVCHAT_AWS_ACCOUNT_ID}.dkr.ecr.us-east-2.amazonaws.com/$${IMAGE}"
docker_push_api:
	IMAGE=$$(cat compose.yaml | yq ".services.kevchat_api.image") && \
	docker tag $$IMAGE "$${KEVCHAT_AWS_ACCOUNT_ID}.dkr.ecr.us-east-2.amazonaws.com/$${IMAGE}" && \
	docker push "$${KEVCHAT_AWS_ACCOUNT_ID}.dkr.ecr.us-east-2.amazonaws.com/$${IMAGE}"