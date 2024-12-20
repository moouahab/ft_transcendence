from django.http import JsonResponse 

# Create your views here.
def get_user(request):
    return JsonResponse({"users": [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]})
