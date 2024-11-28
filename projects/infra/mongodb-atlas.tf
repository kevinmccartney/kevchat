# Create a Project
resource "mongodbatlas_project" "kevchat" {
  org_id = var.atlas_org_id
  name   = var.atlas_project_name
}

# Create a Database User
resource "mongodbatlas_database_user" "db-user" {
  username           = "user-1"
  password           = random_password.db-user-password.result
  project_id         = mongodbatlas_project.kevchat.id
  auth_database_name = "admin"
  roles {
    role_name     = "readWrite"
    database_name = "${var.atlas_project_name}-db"
  }
}

# Create a Database Password
resource "random_password" "db-user-password" {
  length           = 16
  special          = true
  override_special = "_%@"
}

# Create an Atlas Advanced Cluster 
resource "mongodbatlas_advanced_cluster" "kevchat" {
  project_id             = mongodbatlas_project.kevchat.id
  name                   = "${var.atlas_project_name}-cluster"
  cluster_type           = "REPLICASET"
  backup_enabled         = true
  mongo_db_major_version = var.mongodb_version
  replication_specs {
    region_configs {
      electable_specs {
        instance_size = var.cluster_instance_size_name
        node_count    = 3
      }
      analytics_specs {
        instance_size = var.cluster_instance_size_name
        node_count    = 1
      }
      priority      = 7
      provider_name = var.cloud_provider
      region_name   = var.atlas_region
    }
  }
}
