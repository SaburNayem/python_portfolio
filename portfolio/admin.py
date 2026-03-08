from django.contrib import admin

from .models import (
    BlogPost,
    Certificate,
    ContactMessage,
    Education,
    Experience,
    Project,
    Service,
    Testimonial,
)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "featured", "order", "created_at")
    list_filter = ("featured",)
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "technologies")


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "published", "created_at")
    list_filter = ("published",)
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "excerpt")


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("role", "company", "period", "order")


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ("degree", "institution", "period", "order")


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "order")


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ("name", "issuer", "issue_year")


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("client_name", "title", "rating", "created_at")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at")
    search_fields = ("name", "email", "message")
