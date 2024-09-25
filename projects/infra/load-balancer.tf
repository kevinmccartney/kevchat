resource "aws_lb" "kevchat" {
  name               = "kevchat"
  internal           = false
  load_balancer_type = "application"
  subnets = [
    aws_default_subnet.us_east_2a.id,
    aws_default_subnet.us_east_2b.id,
    aws_default_subnet.us_east_2c.id
  ]
  security_groups = [aws_security_group.kevchat_lb.id]
}

resource "aws_lb_target_group" "kevchat_client" {
  name        = "kevchat-client"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_default_vpc.default.id
  target_type = "ip"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_target_group" "kevchat_api" {
  name        = "kevchat-api"
  port        = 5000
  protocol    = "HTTP"
  vpc_id      = aws_default_vpc.default.id
  target_type = "ip"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.kevchat.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.kevchat.arn

  default_action {
    type = "authenticate-cognito"

    authenticate_cognito {
      user_pool_arn       = aws_cognito_user_pool.kevchat.arn
      user_pool_client_id = aws_cognito_user_pool_client.client.id
      user_pool_domain    = aws_cognito_user_pool_domain.kevchat.domain
    }
  }

  default_action {
    type = "forward"

    forward {
      stickiness {
        duration = 3600
        enabled  = false
      }
      target_group {
        arn    = aws_lb_target_group.kevchat_client.arn
        weight = 1
      }
    }
  }
}


resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.kevchat.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      status_code = "HTTP_301"
      port        = "443"
      protocol    = "HTTPS"
    }
  }
}

# add listener rules
resource "aws_lb_listener_rule" "kevchat_api" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 1

  action {
    type = "authenticate-cognito"

    authenticate_cognito {
      user_pool_arn       = aws_cognito_user_pool.kevchat.arn
      user_pool_client_id = aws_cognito_user_pool_client.client.id
      user_pool_domain    = aws_cognito_user_pool_domain.kevchat.domain
    }
  }

  action {
    type = "forward"

    forward {
      stickiness {
        duration = 3600
      }

      target_group {
        arn = aws_lb_target_group.kevchat_api.arn
      }
    }
  }

  condition {
    host_header {
      values = ["api.kev.chat"]
    }
  }
}
