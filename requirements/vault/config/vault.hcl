listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1
}

api_addr = "http://localhost:8200"

storage "file" {
  path = "/vault/data"
}

ui = true
