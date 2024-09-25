resource "aws_route53_record" "kevchat_front_door" {
  zone_id = aws_route53_zone.kevchat.zone_id
  name    = "app.kev.chat"
  type    = "A"

  alias {
    evaluate_target_health = true
    name                   = aws_lb.kevchat.dns_name
    zone_id                = aws_lb.kevchat.zone_id
  }
}

resource "aws_s3_bucket" "kevchat_front_door" {
  bucket = "kev.chat"
}

resource "aws_s3_bucket_policy" "allow_access_from_lb" {
  bucket = aws_s3_bucket.kevchat_front_door.id
  policy = data.aws_iam_policy_document.allow_access_from_lb.json
}

data "aws_iam_policy_document" "allow_access_from_lb" {
  statement {
    sid = "Allow-access-from-lb"
    actions = [
      "s3:GetObject"
    ]

    principals {
      type        = "*"
      identifiers = ["*"]

    }

    resources = [
      "${aws_s3_bucket.kevchat_front_door.arn}/*",
      aws_s3_bucket.kevchat_front_door.arn,
    ]

    condition {
      test     = "StringEquals"
      variable = "aws:SourceVpce"
      values   = [aws_vpc_endpoint.s3.id]
    }
  }
}
