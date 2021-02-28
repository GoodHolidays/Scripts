# 数据获取，更新模式追加
# charles
# ios.baertt.com


import json

YOUTH_ARTBODY = []
YOUTH_REDBODY = []
YOUTH_TIME = []
YOUTH_START = []
YOUTH_END = []
YOUTH_START_ALL = []
YOUTH_END_ALL = []
YOUTH = {'YOUTH_ARTBODY':YOUTH_ARTBODY,'YOUTH_REDBODY':YOUTH_REDBODY,'YOUTH_TIME':YOUTH_TIME,'YOUTH_START':YOUTH_START,'YOUTH_END':YOUTH_END}

with open('youth.json', 'r') as f:
    data = json.load(f)
    for d in data:
        # YOUTH_ARTBODY
        if d['path'] == '/v5/article/info/get.json':
            YOUTH_ARTBODY.append(d['query'])
        
        #YOUTH_REDBODY
        if d['path'] == '/v5/article/red_packet.json':
            YOUTH_REDBODY.append(d['request']['body']['text'])
            
        # YOUTH_TIME
        if d['path'] == '/v5/user/app_stay.json':
            YOUTH_TIME.append(d['request']['body']['text'])

        # YOUTH_START
        if d['path'] == '/v5/task/browse_start.json':
            YOUTH_START_ALL.append(d)

        # YOUTH_END
        if d['path'] == '/v5/task/browse_end.json':
            YOUTH_END_ALL.append(d)

str_score = "\"score\":0"
str_success = "\"success\":true"
for ye in YOUTH_END_ALL:
    if str_score not in ye['response']['body']['text'] and str_success in ye['response']['body']['text']:
        for ys in YOUTH_START_ALL:
            if ye['clientPort'] == ys['clientPort']:
                YOUTH_START.append(ys['request']['body']['text'])
                YOUTH_END.append(ye['request']['body']['text'])
try:
    for y in YOUTH:
        f = open(y, mode='a+', encoding='UTF-8')
        for t in YOUTH[y]:
            f.write(t+"&")

finally:
    if f:
        f.close()