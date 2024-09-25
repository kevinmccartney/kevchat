terraform {
  required_version = "~> 1.9.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.68.0"
    }
    mongodbatlas = {
      source = "mongodb/mongodbatlas"
      version = "~> 1.20.0"
    }
  }

  backend "s3" {
    bucket         = "kevchat-tfstate"
    key            = "terraform.tfstate"
    region         = "us-east-2"
    encrypt        = true
    dynamodb_table = "kevchat_tf_lock"
  }
}

provider "aws" {
  default_tags {
    tags = {
      Environment = "dev"
      Project     = "KevChat"
    }
  }
}

provider "mongodbatlas" {
  public_key = var.mongodbatlas_public_key
  private_key  = var.mongodbatlas_private_key
}

variable "mongodbatlas_public_key" {
  type = string
  sensitive = true
  nullable = false
}

variable "mongodbatlas_private_key" {
  type = string
  sensitive = true
  nullable = false
}

