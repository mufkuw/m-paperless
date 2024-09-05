from django.conf import settings
from django.contrib.auth.models import Group
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=User)
def add_user_to_default_group(sender, instance, created, **kwargs):
    print("facing error")
    if created:  # Only add the user to the group if the user was just created
        default_group_name = 'Active Directory Users'  # Replace with your group name
        group, created = Group.objects.get_or_create(name=default_group_name)
        instance.groups.add(group)
