# vault/config.hcl

ui = true

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1
}

storage "file" {
  path = "/vault/file"
}

disable_mlock = true  # Nécessaire en mode dev
