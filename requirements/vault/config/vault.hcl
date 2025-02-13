listener "tcp" {
  address       = "localhost:8200"
}


storage "file" {
  path = "/vault/data"
}

ui = true
