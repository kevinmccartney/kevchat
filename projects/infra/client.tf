resource "aws_route53_record" "kevchat_client" {
  zone_id = aws_route53_zone.kevchat.zone_id
  name    = "kev.chat"
  type    = "A"

  alias {
    evaluate_target_health = true
    name                   = aws_lb.kevchat.dns_name
    zone_id                = aws_lb.kevchat.zone_id
  }
}

resource "aws_cloudwatch_log_group" "kevchat_client" {
  name = "/ecs/kevchat_client"
}

resource "aws_ecr_repository" "kevchat_client" {
  name                 = "kevchat_client"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

data "aws_ecr_image" "kevchat_client" {
  repository_name = "kevchat_client"
  image_tag       = "0.2.0"
}

resource "aws_ecs_task_definition" "kevchat_client" {
  network_mode = "awsvpc"
  container_definitions = jsonencode([
    {
      name      = "kevchat_client"
      image     = "${aws_ecr_repository.kevchat_client.repository_url}:${data.aws_ecr_image.kevchat_client.image_tag}"
      essential = true
      portMappings = [
        {
          appProtocol   = "http"
          containerPort = 3000
          hostPort      = 3000
          name          = "kevchat_client_3000_http"
          protocol      = "tcp"
        }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-create-group  = "true"
          awslogs-group         = "/ecs/kevchat_client"
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

  memory             = "4096"
  cpu                = "1024"
  family             = "kevchat_client"
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  skip_destroy       = false
}

resource "aws_ecs_service" "kevchat_client" {
  name            = "kevchat_client"
  desired_count   = 1
  task_definition = "${aws_ecs_task_definition.kevchat_client.family}:${aws_ecs_task_definition.kevchat_client.revision}"
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
    container_name   = "kevchat_client"
    container_port   = 3000
    target_group_arn = aws_lb_target_group.kevchat_client.arn
  }
}
