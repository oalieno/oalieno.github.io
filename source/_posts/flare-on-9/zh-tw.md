---
title: "【Writeups】Flare-on 9"
date: 2022-11-12
thumbnail: /images/flare-on-9.png
categories:
- [資安, writeups]
tags:
- flare
- flare-on
- security
- reverse
- reverse engineering
- ctf
- writeups
---

{% img /images/flare-on-9.png 'flare-on 9 completed!!!' %}

## 01 - Flaredle

```js
const CORRECT_GUESS = 57;
let rightGuessString = WORDS[CORRECT_GUESS];
if (guessString === rightGuessString) {
    let flag = rightGuessString + '@flare-on.com';
    ...
}
```

flag 就是 `WORDS[57]`

## 02 - Pixel Poker

```c
if (x == 0x52414c46 % 741 && y == 0x6e4f2d45 % 641) {
    # print flag
    ...
}
```

點選 `(95, 313)` 這個格子就會噴出 flag 如下

{% img /images/02-flag.png 500 'flare-on challenge 02 flag' %}

## 03 - Magic 8 Ball

按 `LLURULDUL` 方向鍵
然後在下面輸入 `gimme flag pls?` 就會噴出 flag 如下

{% img /images/03-flag.png 500 'flare-on challenge 03 flag' %}

## 04 - darn_mice

```c
for (int i = 0; i < 10; i++) {
    void *ptr = malloc(0x1000);
    *ptr = payload[i] + input[i];
    (void(*)())(ptr)();
}
```

每個 byte 都會被當成 1-byte shellcode 呼叫，只有全部都是 `0xc3` 也就是 ret 才不會 crash

flag 是 `i_w0uld_l1k3_to_RETurn_this_joke@flare-on.com`

## 05 - T8

這題給了一隻 PE 執行檔和一包 pcap

程式一開始會有個 anti-debug，判斷時間是滿月的時候才能執行
他有一個函式是在計算月亮的週期 OwO

pcap 裡面有兩個 requests 兩個 response
總之動態追一下可以發現他計算 request 內容的邏輯
基本上他就是用 RC4 加密，他產的 key 是 `FO9` 加上 0 到 65535 之間隨機一個數字，比如 `FO91234`，做 md5 的結果
所以爆搜一下就可以解出封包的內容，爆搜程式碼如下，要注意 wide string 的轉換 O_O

```python
import hashlib
from base64 import *
from Crypto.Cipher import ARC4

def to_wide(x):
    return b''.join([bytes([i, 0]) for i in x])

def check_wide(x):
    for i, j in enumerate(x):
        if i % 2 == 1 and j != 0:
            return False
    return True

def gen_key(x):
    return to_wide(hashlib.md5(to_wide(x)).hexdigest().encode())

def rc4(key, m):
    return ARC4.new(key).encrypt(m)

enc_req = b64decode("ydN8BXq16RE=")
enc_res = b64decode("TdQdBRa1nxGU06dbB27E7SQ7TJ2+cd7zstLXRQcLbmh2nTvDm1p5IfT/Cu0JxShk6tHQBRWwPlo9zA1dISfslkLgGDs41WK12ibWIflqLE4Yq3OYIEnLNjwVHrjL2U4Lu3ms+HQc4nfMWXPgcOHb4fhokk93/AJd5GTuC5z+4YsmgRh1Z90yinLBKB+fmGUyagT6gon/KHmJdvAOQ8nAnl8K/0XG+8zYQbZRwgY6tHvvpfyn9OXCyuct5/cOi8KWgALvVHQWafrp8qB/JtT+t5zmnezQlp3zPL4sj2CJfcUTK5copbZCyHexVD4jJN+LezJEtrDXP1DJNg==")

for i in range(256 * 256):
    key = gen_key(b'FO9' + str(i).encode())
    dec_req = rc4(key, enc_req)
    if check_wide(dec_req):
        dec_res = rc4(key, enc_res)
        break

print(dec_req)
print(dec_res)
```

然後解出第一個封包的內容之後，裡面的內容是用 `,` 分開的如下

```
\xe5\x07\t\x00\x03\x00\x0f\x00\r\x00%\x00\x03\x00b\x02
\x00\xdc\x07\n\x00\x06\x00\r\x00\r\x00%\x00\t\x00*\x03
\x00\xe1\x07\x0c\x00\x04\x00\x07\x00\r\x00%\x00$\x00\xe5\x00
\x00\xe0\x07\x05\x00\x05\x00\x06\x00\r\x00%\x00\x0b\x00&\x00
\x00\xe2\x07\n\x00\x01\x00\x08\x00\r\x00%\x00\x1f\x00E\x03
\x00\xe6\x07\x03\x00\x02\x00\x01\x00\r\x00%\x002\x00\xda\x00
\x00\xde\x07\x07\x00\x02\x00\x16\x00\r\x00%\x006\x00\xd1\x02
\x00\xde\x07\x05\x00\x03\x00\x0e\x00\r\x00%\x00\x01\x00\xe8\x00
\x00\xda\x07\x04\x00\x01\x00\x05\x00\r\x00%\x00:\x00\x0b\x00
\x00\xdd\x07\n\x00\x04\x00\x03\x00\r\x00%\x00\x16\x00\x16\x03
\x00\xde\x07\x01\x00\x02\x00\x0e\x00\r\x00%\x00\x10\x00\xc9\x00
\x00\xdc\x07\x0c\x00\x01\x00\n\x00\r\x00%\x000\x00\x0c\x02
\x00\xe6\x07\x02\x00\x01\x00\x1c\x00\r\x00%\x00"\x00K\x01
\x00\xe6\x07\t\x00\x05\x00\t\x00\r\x00%\x00!\x00m\x01
```

每行都是代表某年某月某日，然後算一下是陰曆幾號，再把那個數字對到 `a-z0-9` 就可以組出 flag 了，大概吧 O3O?
反正後來我覺得好麻煩，就直接把解出來的封包內容倒回去 debugger，flag 就掉出來了 O_O

flag 是 `i_s33_you_m00n@flare-on.com`

[看 code 點我](https://github.com/oalieno/CTF/tree/master/flare-on/9/05)

## 06 - à la mode

這題乍看之下是 .NET 程式
但用 dnspy 翻了一下發現沒什麼東西
在逛 PEBear 的時候就看到了 .NET Header 裡面的 Flags 寫了 Native EntryPoint

{% img /images/06-pe-bear.png 'flare-on challenge 06 pe bear result' %}

咦?難道這是隻普通的 dll
直接抄起我的 IDA Pro 和 x64dbg
咻咻咻，一陣亂跳，看到了一些 pipe 的東西，再多翻一下就翻到某個地方長得很像是在 decode flag 的地方，還有出現 `MyV0ic3` 字串
難道是要 create pipe 然後傳這個字串，好像很麻煩，我直接手起刀落把 cmp 的另一個變數一樣改成 `MyV0ic3`，再按了幾下 step over，登登，flag 就出現在 memory 了

{% img /images/06-flag.png 'flare-on challenge 06 flag' %}

flag 是 `M1x3d_M0dE_4_l1f3@flare-on.com`

p.s. 解這題的時候剛好要出門吃飯，原本想說只是先看一下題目，沒想到 flag 就自己掉出來了xD

## 07 - anode

這隻程式是用 node.js 寫的，是用 [nexe](https://github.com/nexe/nexe) 這個東西打包的
用文字編輯器打開看一下就會發現檔案最後面有 js 原始碼

js 原始碼裡面有一大堆的 switch case
主要的邏輯就是把你的輸入 -> 做一連串的 add, sub, xor 的操作 -> 檢查跟某個值是不是一樣的，是的話你的輸入就是 flag

我們可以直接去改最後的 js 原始碼，只要讓整個檔案的大小不變就不會噴 error，他執行的時候應該是直接抓一個固定的 offset?
加了一行 `require("a.js")`，這樣我就可以直接跑我自己的 js
簡單測試了一下，發現 node.js 被改過了，random 的輸出不 random，其他一些運算也被改過
正常來說是要比對一下原版的 node.js 和這個改過的 node.js 差在哪裡
但是我覺得好麻煩，我直接用 visual studio code 的超強 replace 功能把那一大串的 add 換成 sub，sub 換成 add，然後當做字串推到一個陣列
接著把陣列倒過來，拿去 `eval` 就可以 flag 了 OwO

```js
...

/* 原本
case 1071664271:
        if (Math.random() < 0.5) {
          b[17] += b[0] + b[35] + b[12] + b[42] + b[14] + b[3] + 8;
          b[17] &= 0xFF;
        } else {
          b[18] ^= (b[20] + b[23] + b[6] + b[12] + b[4] + b[25] + Math.floor(Math.random() * 256)) & 0xFF;
        }
        state = 175099911;
        continue;
*/

// 處理過
case 1071664271:
        if (Math.random() < 0.5) {
          commands.push(`b[17] -= b[0] + b[35] + b[12] + b[42] + b[14] + b[3] + 8`);
          commands.push(`b[17] &= 0xFF`);
        } else {
          commands.push(`b[18] ^= (b[20] + b[23] + b[6] + b[12] + b[4] + b[25] + ${Math.floor(Math.random() * 256))} & 0xFF`);
        }
        state = 175099911;
        continue;

...

var b = [106, 196, 106, 178, 174, 102, 31, 91, 66, 255, 86, 196, 74, 139, 219, 166, 106, 4, 211, 68, 227, 72, 156, 38, 239, 153, 223, 225, 73, 171, 51, 4, 234, 50, 207, 82, 18, 111, 180, 212, 81, 189, 73, 76];
commands.reverse().forEach(command => eval(command));
console.log(b)
```

flag 是 `n0t_ju5t_A_j4vaSCriP7_ch4l1eng3@flare-on.com`

p.s. 雖然 flag 說 `not just a javascript challenge`，但是我完全把他當作 javascript 來解了，抱歉了xD

## 08 - backdoor

這題被大家說是全部裡面最難的，我覺得是蠻麻煩的，找不到地方偷吃步，或是其實有但我不知道xD (可以偷偷告訴我 O_O)

這隻是 .NET 的程式，dnspy 打開會看到一堆的 try except
一開始跑下去都會進到 except 裡面
因為他是在 except 裡面去建出一個 `DynamicMethod`，再把正確的 IL code 塞進去跑
但如果你直接把動態跑的時候看到的那段 IL code 抓下來塞回去檔案裡面，會發現還是錯的
因為他有一段是在做 `dynamicILInfo.GetTokenFor`，是在把外面世界的 metadata token 換成 dynamicILInfo 世界中的 metadata token，所以不能直接把那個 IL 複製出來，要複製再早一點還沒有換掉的，然後把正確的 metadata token 放上去
這邊我因為沒有找到好方法 (對 .NET 不熟 QQ)，所以是用 dyspy 動態跑，手動複製出 IL code 和 metadata token，然後寫個 python script 去改原本的執行檔，最後可以正常的 decompile 所有函式

接著看到了一些 powershell command `$(ping -n 1 10.10.21.201 | findstr /i ttl) -eq $null;` 拿去 google 了一下就找到了這篇 [APT34 targets Jordan Government using new Saitama backdoor](https://www.malwarebytes.com/blog/threat-intelligence/2022/05/apt34-targets-jordan-government-using-new-saitama-backdoor)
長得一模一樣，這題就是從這隻惡意程式改的

其中在處理不同的 task 的部分有發現一些在做比較字串的程式碼
感覺跟 flag 有關，就仔細看了一下，發現他是要依照某個順序把每一個 task 都跑過一次，就會去印 flag
他印 flag 的地方是從 PE 的 `5aeb2b97` 這個 section 抓資料出來，然後拿去解，中間還會跟 stacktrace 的字串攪在一起，十分的噁心
後來受不了，沒有可以偷吃步的地方，還是乖乖地寫了一個 dns server 跟程式互動，按照步驟去發 task id，執行完之後就噴出 flag 了

{% img /images/08-flag.png 'flare-on challenge 08 flag' %}

flag 是 `W3_4re_Kn0wn_f0r_b31ng_Dyn4m1c@flare-on.com`

[看 code 點我](https://github.com/oalieno/CTF/tree/master/flare-on/9/08)

## 09 - encryptor

這隻是一個 Ransomware，標準的用 Symmetric Encryption 做加密，再用 Asymmetric Encryption 加密 Symmetric Encryption 的 key
很快就可以看出他有做 chacha20
但是一直找不到他用什麼 Asymmetric Encryption，一直在想是什麼複雜的加密演算法，一開始懷疑是 ECC，後來又再猜 NTRU
我看那個迴圈感覺很像是在做快速冪，在想是哪個演算法會做快速冪，不會是 RSA 吧他寫的那麼複雜，到底是哪個，等等難道真的是 RSA
後來測試一下，發現真的是 RSA，因為他在做大數的運算所以看起來很複雜，那些函式就只是在做加法乘法模運算而已 Orz

反正他就是把檔案做 chacha20 加密，加密用的 key 再用 RSA 做加密
RSA 加密之前先用 `e=0x10001` 去算出對應的 `d`，然後加密是直接 `m^d % n`
等於我們直接用 `c^e % n` 去解密就好

flag 是 `R$A_$16n1n6_15_0pp0$17e_0f_3ncryp710n@flare-on.com`

## 10 - Nur geträumt

這題是 m68k 的程式，非常古老的東西，要古董 Mac 電腦才跑得起來
不過我們只要照著提示去用 [Mini vMac](https://www.gryphel.com/c/minivmac/) 就可以跑起來了
稍微互動一下就可以發現它其實就是在做 xor encryption，就是會把你輸入的 key 重複貼上直到跟被加密的內容等長，然後做 xor

所以重點就是，要輸入什麼 key?
已知最後面一定是 `@flare-on.com` 所以可以先解出 key 的最後 13 bytes 是 ` du etwas Zei`
然後搭配他在程式裡面塞的一堆提示，就可以找到這首歌 [NENA | 99 Luftballons [1983] [Offizielles HD Musikvideo]](https://www.youtube.com/watch?v=Fpu5a0Bl8eY)
google 一下他的歌詞就會發現第一句歌詞就是 key ...
有幾個不是英文字母的在裡面，不過 flag 都是英文，猜一下也還好

{% img /images/10-flag.png 'flare-on challenge 10 flag' %}

flag 是 `Dann_singe_ich_ein_Lied_fur_dich@flare-on.com`

p.s. 這題最麻煩的步驟是把 encrypted flag 複製出來...

## 11 - The challenge that shall not be named.

這題是用 python 寫的，用 [pyinstaller](https://github.com/pyinstaller/pyinstaller) 打包成 exe
所以起手先用 [pyinstxtractor](https://github.com/extremecoders-re/pyinstxtractor) 解出原始的 pyc (版本是 3.7.0)
然後再用 [python-decompile3](https://github.com/rocky/python-decompile3) 解回原本的 python source code
接著就會發現他有用 [pyarmor](https://github.com/dashingsoft/pyarmor) 做混淆

直接用 python 去跑解出來的 `.py` 檔案，會發現它噴了一個錯誤，而且有 stacktrace，位置是在本地的 crypt 函式庫
裡面有用到 linux 平台才有的東西，有點古怪
我就直接去改那個 `crypt.py`，把 `import _crypt` 註解掉，然後就會發現他去呼叫 `crypt` 的時候找不到 `_crypt`，因為我們沒有 import 他
可以直接讓他 `return None`，接著就又看到他去呼叫 `ARC4`，一樣直接改他

```python
def ARC4(x):
    print('arc4', x)
    class A:
        def encrypt(self, y):
            print('arc4.encrypt', y)
            return b''
    return A()
```

然後 flag 就被我們印出來了xD

{% img /images/11-flag.png 'flare-on challenge 11 flag' %}

flag 是 `Pyth0n_Prot3ction_tuRn3d_Up_t0_11@flare-on.com`
