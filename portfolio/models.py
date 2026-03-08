from django.db import models


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Project(TimestampedModel):
    title = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    technologies = models.CharField(max_length=220)
    github_url = models.URLField(blank=True)
    live_demo_url = models.URLField(blank=True)
    image_url = models.URLField(blank=True)
    featured = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.title


class BlogPost(TimestampedModel):
    title = models.CharField(max_length=160)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField()
    content = models.TextField(blank=True)
    published = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Experience(TimestampedModel):
    role = models.CharField(max_length=140)
    company = models.CharField(max_length=140)
    period = models.CharField(max_length=80)
    details = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return f"{self.role} @ {self.company}"


class Education(TimestampedModel):
    degree = models.CharField(max_length=140)
    institution = models.CharField(max_length=140)
    period = models.CharField(max_length=80)
    details = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.degree


class Service(TimestampedModel):
    title = models.CharField(max_length=100)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.title


class Certificate(TimestampedModel):
    name = models.CharField(max_length=160)
    issuer = models.CharField(max_length=120)
    issue_year = models.CharField(max_length=20)
    credential_url = models.URLField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class Testimonial(TimestampedModel):
    client_name = models.CharField(max_length=120)
    title = models.CharField(max_length=140)
    feedback = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.client_name


class ContactMessage(TimestampedModel):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.email})"
