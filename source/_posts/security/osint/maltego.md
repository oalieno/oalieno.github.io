---
title: "[小工具] Maltego"
date: 2020-07-31 00:29:25
categories:
- [security, osint]
tags:
- security
- osint
---

Maltego 是用來自動化情資蒐集的工具。

## 基本介紹

一開始就按 Creat a new graph 新增一個工作的圖層，就可以在上面畫出關係圖。

Entities 是基本物件，有很多種類型比如 Company, Organization, Domain, Website, ...，每個物件都有幾個屬性欄位，假設你拿到某個人的手機號碼，那可以從旁邊 Entity Palette 拖曳一個 Phone Number 到右邊空白處。

Transforms 就是一個可以重複使用的函式，比如已經有了手機號碼，那就去某個網站上爬手機號碼對應的國家之類的，把這個爬的步驟寫成一個 transform，就可以自動化去從已知的資料生更多相關的資料。Local Transform 是自己寫的函式，也有別人寫好的在 Transform Hub 上面。

## Local Transforms

跟著官方文件 [maltego docs](https://docs.maltego.com/support/solutions/articles/15000017605-local-transforms-example-) 做就可以大概了解怎麼用 python 去寫 Local Transforms 了。

```
pip install maltego-trx
maltego-trx start new_project
```

先安裝 python 套件，再用 `maltego-trx` 去初始化一個 project

```python transforms/TaxIDToCompany.py
import json
import requests
from maltego_trx.entities import Person
from maltego_trx.transform import DiscoverableTransform

class TaxIDToCompany(DiscoverableTransform):
    @classmethod
    def create_entities(cls, request, response):
        taxid = request.Properties['properties.taxid']
        r = requests.get(f'http://company.g0v.ronny.tw/api/show/{taxid}')
        result = json.loads(r.text)
        response.addEntity('maltego.Company', result['data']['公司名稱'])
```

主要就是繼承 `DiscoverableTransform` 然後填寫 `create_entities` 這個函式，request 裡面就有執行 transform 的那個 entity 的資訊，然後這裡是用統一編號 ( TaxID ) 去找公司名稱，然後新增一個公司的 Entity。
原本沒有 TaxID 這個 Entity 要先去 New Entity Type 新增一個 TaxID。
`company.g0v.ronny.tw` 回傳的資訊有很多，可以把那些資訊都加進來，可是我就懶。

寫完之後要把 Local Transform 加進去，有幾個欄位要注意，
1. Input entity type : 要填這個 transform 要對哪一種 entity 做操作
2. Command : 我們是用 python api 所以要填 python 的 PATH，在 linux 上可以用 `which python` 找
3. Parameters : 填 `project.py local TaxIDToCompany`，`project.py` 是初始化 project 完會產生的腳本，`local` 指的就是 Local Transform，`TaxIDToCompany` 是你 transform 的名字，就是那個檔名的部分吧
4. Working directory: Project 的路徑，就是要有 `project.py` 的那個地方

最後按下 Run 跑完 transform 之後，就會自動新增一個 Company 的 Entity。

{% img /images/maltego-result.png 'maltego result' %}