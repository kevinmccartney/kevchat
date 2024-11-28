output "user_password" {
  sensitive = true
  value     = mongodbatlas_database_user.db-user.password
}
output "atlas_cluster_connection_string" { value = mongodbatlas_advanced_cluster.kevchat.connection_strings.0.standard_srv }
output "project_name" { value = mongodbatlas_project.kevchat.name }
output "username" { value = mongodbatlas_database_user.db-user.username }
