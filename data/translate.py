import six
from google.cloud import translate_v2 as translate
from html import unescape

def translate_text(target, text, client):
    """Translates text into the target language.

    Target must be an ISO 639-1 language code.
    See https://g.co/cloud/translate/v2/translate-reference#supported_languages
    """

    if isinstance(text, six.binary_type):
        text = text.decode("utf-8")

    # Text can also be a sequence of strings, in which case this method
    # will return a sequence of results for each text.
    result = client.translate(text, target_language=target)

    # print(u"Text: {}".format(result["input"]))
    # print(u"Translation: {}".format(result["translatedText"]))
    # print(u"Detected source language: {}".format(result["detectedSourceLanguage"]))
    return unescape(result['translatedText'])

def is_chinese(text, client):
    """Detects the text's language."""

    # Text can also be a sequence of strings, in which case this method
    # will return a sequence of results for each text.
    result = client.detect_language(text)
    return result["language"] == "zh-CN" or result["language"] == "zh-TW"

translate_client = translate.Client()

translate_text('en', '''\u5373\u5c06\u5347\u5165\u521d\u4e00\u768412\u5c81\u5c11\u5e74\u5c1a\u8fdb\uff0c\u56e0\u4e3a\u4e00\u6b21\u5076\u7136\u7684\u673a\u4f1a\u6fc0\u53d1\u4e86\u5bf9\u4e8e\u51b0\u7403\u7684\u6781\u5927\u70ed\u60c5\uff0c\u5e76\u51b3\u5b9a\u52a0\u5165\u65cb\u98ce\u51b0\u7403\u4ff1\u4e50\u90e8\u5b66\u4e60\u6253\u51b0\u7403\u3002\u5728\u65cb\u98ce\u51b0\u7403\u4ff1\u4e50\u90e8\u65b0\u6765\u7684\u6797\u6559\u7ec3\u7684\u6709\u610f\u5386\u7ec3\u4e0b\uff0c\u5c1a\u8fdb\u9010\u6e10\u4ece\u61f5\u61c2\u65e0\u77e5\u3001\u9047\u4e8b\u4e09\u5206\u949f\u70ed\u5ea6\u7684\u83bd\u649e\u5c0f\u5b50\uff0c\u6210\u957f\u4e3a\u4e00\u540d\u79ef\u6781\u5411\u4e0a\u3001\u575a\u6bc5\u6267\u7740\u7684\u6709\u7740\u6781\u5f3a\u96c6\u4f53\u8363\u8a89\u611f\u7684\u9752\u6625\u5c11\u5e74\u3002\u5c1a\u8fdb\u4e0e\u961f\u53cb\u4eec\u4e00\u8d77\u6c72\u53d6\u5bf9\u624b\u957f\u5904\uff0c\u575a\u5b9a\u81ea\u6211\u68a6\u60f3\uff0c\u611f\u53d7\u5965\u8fd0\u7684\u7cbe\u795e\u529b\u91cf\uff0c\u6700\u7ec8\u6536\u83b7\u53cb\u60c5\uff0c\u51dd\u805a\u56e2\u9b42\uff0c\u4f7f\u5f97\u65cb\u98ce\u961f\u6210\u957f\u4e3a\u4e00\u652f\u594b\u52c7\u987d\u5f3a\u3001\u56e2\u7ed3\u534f\u4f5c\u7684\u961f\u4f0d\u3002''', translate_client)
print(is_chinese('追風', translate_client))