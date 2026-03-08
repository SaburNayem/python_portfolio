from django.shortcuts import render


def home(request):
    context = {
        "name": "Md Nayem Hossen",
        "email": "mdsabur9991@gmail.com",
    }
    return render(request, "index.html", context)
