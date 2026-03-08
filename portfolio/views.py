from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.http import require_POST

from .forms import ContactMessageForm
from .models import (
    BlogPost,
    Certificate,
    Education,
    Experience,
    Project,
    Service,
    Testimonial,
)


def _build_context(form=None):
    return {
        "name": "Nayem Hossen",
        "title": "Flutter Mobile App Developer",
        "email": "mdsabur9991@gmail.com",
        "phone": "+880 1000-000000",
        "location": "Dhaka, Bangladesh",
        "projects": Project.objects.filter(featured=True)[:6],
        "blogs": BlogPost.objects.filter(published=True)[:3],
        "experiences": Experience.objects.all()[:6],
        "educations": Education.objects.all()[:4],
        "services": Service.objects.all()[:6],
        "certificates": Certificate.objects.all()[:6],
        "testimonials": Testimonial.objects.all()[:6],
        "contact_form": form or ContactMessageForm(),
    }


def home(request):
    return render(request, "index.html", _build_context())


@require_POST
def contact_submit(request):
    form = ContactMessageForm(request.POST)
    if form.is_valid():
        form.save()
        return redirect("home")
    return render(request, "index.html", _build_context(form=form), status=400)


def api_portfolio(request):
    data = {
        "projects": list(
            Project.objects.filter(featured=True).values(
                "title", "slug", "description", "technologies", "github_url", "live_demo_url", "image_url"
            )
        ),
        "blogs": list(BlogPost.objects.filter(published=True).values("title", "slug", "excerpt", "created_at")),
        "services": list(Service.objects.values("title", "description")),
        "testimonials": list(Testimonial.objects.values("client_name", "title", "feedback", "rating")),
    }
    return JsonResponse(data)
