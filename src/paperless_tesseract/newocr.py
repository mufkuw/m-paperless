import unicodedata
import numpy as np
from paddleocr import PaddleOCR

SCORE_TRESH=0.600

def combine_and_replace(english_result, arabic_result):
    """Combines English and Arabic OCR results, replacing English characters in Arabic result.

    Args:
        english_result: OCR result for English.
        arabic_result: OCR result for Arabic.

    Returns:
        A combined result with English characters replaced.
    """

   
    line_tolorence=5
  
    for ar in arabic_result:
        ar_box = ar[0]
        for en in english_result:
            en_box=en[0]
            if ar_box[0][1]>=en_box[0][1]-line_tolorence and ar_box[0][1]<=en_box[0][1]+line_tolorence and ar_box[0][0]>=en_box[0][0]-line_tolorence and ar_box[0][0]<=en_box[0][0]+line_tolorence:
                if(ar[1][1]<=en[1][1]):
                    ar[1]=en[1]
  

def filter_by_score(result:list,score_tresh=SCORE_TRESH):
    return [item for item in result if item[1][1]>=score_tresh]
    

def is_arabic(char):
  """Determines if a character is Arabic.

  Args:
      char: The character to check.

  Returns:
      True if the character is Arabic, False otherwise.
  """

  return (unicodedata.name(char).startswith('ARABIC') and unicodedata.category(char) not in ['Nd','Nl','No']) or char==' '

def reverse_arabic_char(string):
    """Reverses all Arabic characters in a string except numbers.

    Args:
        string: The input string.

    Returns:
        The modified string with Arabic characters reversed except numbers.
    """

    result = ""
    for char in string:
        if char.isdigit() or (not is_arabic(char)):
            result += char
            #pass
        else:
            result = char + result
    return result


def ocr_images(images: list[np.ndarray], log=None) -> list:

    val = []

    # Initialize the PaddleOCR model
    ocr_en = PaddleOCR(use_angle_cls=True, lang='en')
    ocr_ar = PaddleOCR(use_angle_cls=True, lang='ar')
    
    for image in images:
        
        result = {
            'en': ocr_en.ocr(image, cls=True)[0],
            'ar': ocr_ar.ocr(image, cls=True)[0]
        }
        
        result['en'] = filter_by_score(result['en'],SCORE_TRESH*1.10)
        result['ar'] = filter_by_score(result['ar'],SCORE_TRESH)
        
        print("here")
        
        output=""
        y=0
        line_tolorence=6
        lines_ar=[]
        
        for item in result['ar']:
            item[1] = (reverse_arabic_char(item[1][0]),item[1][1])

        combine_and_replace(result["en"], result["ar"])

        for item in result['ar']:
            if(item[0][0][1]>=y+line_tolorence):
                y=item[0][0][1]
                lines_ar.append(output)
                output=""
            output = item[1][0]+"  " + output
            
        lines_ar.append(output)
                   
        t = (image,result["ar"],lines_ar)
        
        val = val + [t]
        
    return val

