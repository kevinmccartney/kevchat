resource "aws_default_subnet" "us_east_2a" {
  availability_zone = "us-east-2a"
  force_destroy     = false
}

resource "aws_default_subnet" "us_east_2b" {
  availability_zone = "us-east-2b"
  force_destroy     = false
}

resource "aws_default_subnet" "us_east_2c" {
  availability_zone = "us-east-2c"
  force_destroy     = false
}

resource "aws_security_group" "kevchat_lb" {
  description            = "Allows ingress for web traffic & general egress"
  revoke_rules_on_delete = false
  name                   = "kevchat_lb"
  vpc_id                 = aws_default_vpc.default.id

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = -1
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group" "kevchat_backend" {
  description            = "Allows ingress from the KevChat LB & general egress"
  revoke_rules_on_delete = false
  name                   = "kevchat_backend"
  vpc_id                 = aws_default_vpc.default.id

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = -1
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    from_port = 0
    to_port   = 65535
    protocol  = "tcp"
    security_groups = [
      aws_security_group.kevchat_lb.id,
    ]
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_default_vpc" "default" {}

resource "aws_route53_zone" "kevchat" {
  name    = "kev.chat"
  comment = "A chat ONLY 4 kevz!"
}

resource "aws_acm_certificate" "kevchat" {
  domain_name       = "kev.chat"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# allows access from ALB to s3 hosting front door
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_default_vpc.default.id
  service_name      = "com.amazonaws.us-east-2.s3"
  vpc_endpoint_type = "Interface"
  subnet_ids = [
    aws_default_subnet.us_east_2a.id,
    aws_default_subnet.us_east_2b.id,
    aws_default_subnet.us_east_2c.id
  ]
  security_group_ids = [aws_security_group.kevchat_backend.id]
}
