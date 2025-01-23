import requests

response = requests.get("https://emailvalidation.abstractapi.com/v1/?api_key=cbf5ddecec564695a7449eb08b611809&email=mohamed.ouahab1999@gmail.com")
print(response.status_code)
print(response.content)