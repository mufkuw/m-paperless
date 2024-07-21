
import logging
import re
from django.conf import settings
from django.dispatch import receiver
from django.db import models
from documents.signals import document_updated
from documents.models import CustomField, CustomFieldInstance, Document

logger = logging.getLogger("paperless.location.handlers")

@receiver(document_updated)
def update_document_content_for_location(sender, document:Document, **kwargs):

    instance=document
    
    #activating defence from infinite loop
    if not instance._post_save_flag:
        instance._post_save_flag = True
        
        logger.info("Post Save Operation Signal Processing ...")
        regex = r"\|\<\<Location(?:\s|\:)(.+?)\>\>\|"
        substr=""
        result = re.sub(regex, substr, instance.content, 0, re.MULTILINE) 

        # logger.info(result)
        
        regex = r"\{(.+?)\}"

        test_str = settings.DOCUMENT_LOCATION_MARKER
        data = dict([(match.group(1),'') for i,match in enumerate(list(re.finditer(regex, test_str, re.MULTILINE)),start=1)])
        
        fields = [item.id for item in CustomField.objects.filter(name__contains=settings.DOCUMENT_LOCATION_MARKER)]
        fields_data = dict([(item.field.name,item.value) for item in CustomFieldInstance.objects.filter(document_id=instance.id, field_id__in=fields)])
        data.update(fields_data)
        data['Document Type']=""
        
       
        if instance.document_type!=None :
            data['Document Type'] = instance.document_type.name
        
        if data["Document Type"]=="":
            instance.content=result
            instance.save() 
            instance._post_save_flag = False
            return
        
        logger.info(data)
        
        
        try:
            template = settings.DOCUMENT_LOCATION_FORMAT.format(**data)

            # logger.info(template)
       
            if template != "" :
                instance.content = result + "|<<Location : "+ template +">>|"
            else:
                instance.content = result
        except:
            instance.content = result


        # logger.info(instance.content)

        #saving
        instance.save()
        
        #done
        instance._post_save_flag = False
    else:
        # Reset the flag after the second save
        instance._post_save_flag = False



        