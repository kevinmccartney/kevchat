resource "aws_cognito_user_pool" "kevchat" {
  name = "kevchat"
  # should I auto-verify phone or email?
  # auto_verified_attributes = ["email"]
  deletion_protection = "ACTIVE"

  # email_verification_message = ""
  # email_email_verification_message =  ""

  # password_policy {}

  # lambda_config {}

  # email_configuration {}

  # account_recovery_setting {}

  # admin_create_user_config {}

  # username_configuration {}

  # verification_message_template {}
}

resource "aws_cognito_user_pool_domain" "kevchat" {
  domain       = "kevchat"
  user_pool_id = aws_cognito_user_pool.kevchat.id
}

# add logout URL and redirects
resource "aws_cognito_user_pool_client" "client" {
  name = "kevchat_client"

  user_pool_id                         = aws_cognito_user_pool.kevchat.id
  generate_secret                      = true
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid"]
  supported_identity_providers         = ["COGNITO"]
  callback_urls                        = ["https://app.kev.chat/oauth2/idpresponse", "https://api.kev.chat/oauth2/idpresponse"]
}
