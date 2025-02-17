listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_disable = 1
  # tls_cert_file = "/vault/certs/vault.crt"
  # tls_key_file  = "/vault/certs/vault.key"
}
api_addr = "http://localhost:8200"

cluster_addr = "http://localhost:8201"


storage "file" {
  path = "/vault/data"
}

ui = true
