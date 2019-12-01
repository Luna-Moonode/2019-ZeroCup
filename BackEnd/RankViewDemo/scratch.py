import requests
import re
m = 1
list = []
while m < 32:
    m = str(m)
    url = 'https://api.bilibili.com/pgc/season/index/result?season_version=-1&is_finish=-1&copyright=-1&season_status=-1&year=-1&style_id=-1&order=3&st=4&sort=0&page='+ m +'&season_type=4&pagesize=20&type=1'
    a = requests.get(url)
    a.encoding = 'utf-8'
    a = a.text

    b = re.findall('"list":\[.*?\]', a)[0]
    c = re.findall('"index_show":".*?"', b)
    d = re.findall('"title":".*?"', b)
    i = 0
    while i < len(c):
        e = c[i]
        e = e.replace('"index_show"', '更新进度')
        e = e.replace('"', '')
        f = d[i]
        f = f.replace('"title":', '')
        f = f.replace('"', '')
        h = {f:e}
        i +=1
        list.append(h)
    # for one in list:
    #     file.write(one)

    m = int(m)
    m += 1
print(list[0:10])
print(len(list))