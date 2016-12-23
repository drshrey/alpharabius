import os
import sys
import json
import io
from pprint import pprint

# fLang => foreign language

def makeLangFile(langDict, fLang):
    print "Converting %s" % fLang
    fLangDict = []
    for word in langDict:
        engWord = word["English"]
        fWord = word[fLang]
        fLangKey = fLang.lower()

        addObj = { "english": engWord, fLangKey: fWord }
        fLangDict.append(addObj)
    with io.open('{}.json'.format(fLang.lower()), 'w', encoding='utf8') as json_file:
        data = json.dumps(fLangDict, ensure_ascii=False)
        # unicode(data) auto-decodes data to unicode if str
        json_file.write(unicode(data))

if __name__ == "__main__":  
    filename = sys.argv[1]    
    if filename is not None:
        print "Processing %s" % filename
        fLangArr = [ "Italian", "Romanian", "Catalan", "Latin",
                    "Dutch", "Danish", "Arabic", "Hebrew",
                    "Chinese", "Japanese", "Korean", "Kannada"]
        with open(filename) as langDataFile:    
            langData = json.load(langDataFile)
            for fLang in fLangArr:
                makeLangFile(langData, fLang)
        print "Finished processing!"
    else:
        print "No filename given betch!"
            