resource "aws_route53_record" "kevchat_api" {
  zone_id = aws_route53_zone.kevchat.zone_id
  name    = "api.kev.chat"
  type    = "A"

  alias {
    evaluate_target_health = true
    name                   = aws_lb.kevchat.dns_name
    zone_id                = aws_lb.kevchat.zone_id
  }
}

resource "aws_cloudwatch_log_group" "kevchat_api" {
  name = "/ecs/kevchat_api"
}

resource "aws_ecr_repository" "kevchat_api" {
  name                 = "kevchat_api"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

data "aws_ecr_image" "kevchat_api" {
  repository_name = "kevchat_api"
  image_tag       = "0.3.0"
}

resource "aws_ecs_task_definition" "kevchat_api" {
  network_mode = "awsvpc"
  container_definitions = jsonencode([
    {
      name      = "kevchat_api"
      image     = "${aws_ecr_repository.kevchat_api.repository_url}:${data.aws_ecr_image.kevchat_api.image_tag}"
      essential = true
      portMappings = [
        {
          appProtocol   = "http"
          containerPort = 5000
          hostPort      = 5000
          name          = "kevchat_api_5000_http"
          protocol      = "tcp"
        }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-create-group  = "true"
          awslogs-group         = "/ecs/kevchat_api"
          awslogs-region        = "us-east-2"
          awslogs-stream-prefix = "ecs"
          max-buffer-size       = "25m"
          mode                  = "non-blocking"
        }
        secretOptions = []
      }
    }
  ])
  requires_compatibilities = [
    "FARGATE",
  ]
  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }

  memory             = "1024"
  cpu                = "512"
  family             = "kevchat_api"
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  skip_destroy       = false
}

resource "aws_ecs_service" "kevchat_api" {
  name            = "kevchat_api"
  desired_count   = 1
  task_definition = "${aws_ecs_task_definition.kevchat_api.family}:${aws_ecs_task_definition.kevchat_api.revision}"
  cluster         = aws_ecs_cluster.kevchat.arn
  launch_type     = "FARGATE"

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  network_configuration {
    assign_public_ip = true # want to take these IPs private ASAP
    security_groups = [
      aws_security_group.kevchat_backend.id
    ]
    subnets = [
      aws_default_subnet.us_east_2a.id,
      aws_default_subnet.us_east_2b.id,
      aws_default_subnet.us_east_2c.id,
    ]
  }

  load_balancer {
    container_name   = "kevchat_api"
    container_port   = 5000
    target_group_arn = aws_lb_target_group.kevchat_api.arn
  }
}
