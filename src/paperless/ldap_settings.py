import ldap
from django_auth_ldap.config import LDAPSearch, GroupOfNamesType

# LDAP server URI
AUTH_LDAP_SERVER_URI = "ldap://ldap.forumsys.com:389"

# Bind DN and password for the read-only admin user
AUTH_LDAP_BIND_DN = "cn=read-only-admin,dc=example,dc=com"
AUTH_LDAP_BIND_PASSWORD = "password"

# User search configuration
AUTH_LDAP_USER_SEARCH = LDAPSearch(
    "dc=example,dc=com",  # Base DN
    ldap.SCOPE_SUBTREE,    # Search scope
    "(uid=%(user)s)"       # Search filter
)

# Optional: Map LDAP attributes to Django User model fields
AUTH_LDAP_USER_ATTR_MAP = {
    "first_name": "cn",
    "last_name": "",
    "email": "mail"
}

# Populate the Django user from the LDAP directory on login.
AUTH_LDAP_ALWAYS_UPDATE_USER = True

# Logging for LDAP operations
import logging
logger = logging.getLogger('django_auth_ldap')
logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.DEBUG)










# from django.conf import settings
# from django.contrib.auth.models import Group
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.contrib.auth import get_user_model


# @receiver(post_save, sender=get_user_model())
# def add_user_to_default_group(sender, instance, created, **kwargs):
#     if created:  # Only add the user to the group if the user is created
#         default_group_name = 'active_directory_users'  # Replace with your group name
#         try:
#             group = Group.objects.get(name=default_group_name)
#         except Group.DoesNotExist:
#             group = Group.objects.create(name=default_group_name)
        
#         instance.groups.add(group)
