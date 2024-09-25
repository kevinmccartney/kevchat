resource "aws_service_discovery_http_namespace" "kevchat" {
  name = "kevchat"
}

resource "aws_ecs_cluster" "kevchat" {
  name = "kevchat"

  service_connect_defaults {
    namespace = aws_service_discovery_http_namespace.kevchat.arn
  }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2008-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })
}

# thought i needed these VPC endpoints, but the ECS deploy still failed when I had them :(
# back to the drawing board

# it's important to create these endpoints in order if you already have containers on the VPC
# https://docs.aws.amazon.com/AmazonECS/latest/developerguide/vpc-endpoints.html#ecs-setting-up-vpc-create
# resource "aws_vpc_endpoint" "ecs_agent" {
#   vpc_id            = aws_default_vpc.default.id
#   service_name      = "com.amazonaws.us-east-2.ecs-agent"
#   vpc_endpoint_type = "Interface"
# }

# resource "aws_vpc_endpoint" "ecs_telemetry" {
#   vpc_id            = aws_default_vpc.default.id
#   service_name      = "com.amazonaws.us-east-2.ecs-telemetry"
#   vpc_endpoint_type = "Interface"

#   depends_on = [aws_vpc_endpoint.ecs_agent]
# }

# resource "aws_vpc_endpoint" "ecs" {
#   vpc_id            = aws_default_vpc.default.id
#   service_name      = "com.amazonaws.us-east-2.ecs"
#   vpc_endpoint_type = "Interface"

#   depends_on = [aws_vpc_endpoint.ecs_telemetry]
# }
