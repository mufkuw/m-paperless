

import os
import re
from django.conf import settings
from django.dispatch import receiver
from django.db import models

from documents.models import CustomField, CustomFieldInstance, Document


@receiver(models.signals.pre_save, sender=Document)
def update_document_content_for_location(sender, instance:Document, **kwargs):

    regex = r"\|\<\<Location(?:\s|\:)(.+?)\>\>\|"
    substr=""
    result = re.sub(regex, substr, instance.content, 0, re.MULTILINE) 

    fields = [item.id for item in CustomField.objects.filter(name__contains=settings.DOCUMENT_LOCATION_MARKER)]
    data = dict([(item.field.name,item.value) for item in CustomFieldInstance.objects.filter(document_id=instance.id, field_id__in=fields)])
    data['Document Type']=""
    if instance.document_type!=None :
        data['Document Type'] = instance.document_type.name
    
    if data["Document Type"]=="":
        instance.content=result
        return
    
    try:
        template = settings.DOCUMENT_LOCATION_FORMAT.format(**data)
    
        if template != "" :
            instance.content = result + "|<<Location : "+ template +">>|"
            return
        else:
            instance.content = result
            return
    except:
        instance.content = result
        