---
title: "【CTF Writeups】VolgaCTF Quals 2020 - F-Hash"
date: 2020-05-04
categories:
- [資安, writeups]
tags:
- ctf
- security
- writeups
- reverse
- gdb
- frida
---

這題給了一個 x86-64 ELF Executable，直接跑下去跑不出來，一直卡在那裡，逆向一下會發現 `13B0` 這個函式是一個遞迴函式，他的虛擬碼大概長下面這樣，會一直遞迴呼叫前兩層的答案，很明顯的有很多重複的子問題，這時候就是要用 Dynamic Programming 的思路來把算過的答案記下來就不會跑那麼久了，所以這題就是要優化這個函式，把程式跑完就會印出 flag。

```python
def _13B0(depth, a, b):
    ...
    r1 = _13B0(depth - 1, a, b)
    r2 = _13B0(depth - 2, a, b)
    ...
```

以下提供三種解法，讀者可以跟著練習一下。

## Rewrite Function with Python

最直覺的方法就是把 IDA decompile 出來的 code 搬到 python 上重寫一下，沒什麼技術，這是我在賽中用的方法，但就是要注意一下型態的問題，比如兩個 unsigned int 相乘可能 overflow 在 python 裡面要 `mod (1 << 32)`，更多細節請看下面的程式碼。

```python solve-rewrite.py
#!/usr/bin/env python3

table = [0]
for i in range(26):
    table += [i * 10 + 1 + (0xf6 << 120)] * 10

def bitcountsum(a, b):
    a %= (1 << 64)
    b %= (1 << 64)
    return bin(a).count('1') + bin(b).count('1')

def calc(a, b, depth = 256):
    ans = [0]
    ans.append((bitcountsum(a, b), 0, 0))
    ans.append((bitcountsum(a ^ 1, b), 0, 1))

    for i in range(3, depth + 1):
        v15, v16 = ans[i - 1], ans[i - 2]
        v13 = ((v15[0] + v15[1] * (1 << 64)) + (v16[0] + v16[1] * (1 << 64)) + bitcountsum((v15[2] + v16[2]) ^ a, b)) % (1 << 128)
        v14 = table[i]
        while True:
            if (v14 >> 64) > (v13 >> 64):
                break
            if (v14 >> 64) == (v13 >> 64):
                if v14 % (1 << 64) >= v13 % (1 << 64):
                    break
            k = max(1, (v13 >> 64) // (v14 >> 64))
            v13 = (v13 - k * v14) % (1 << 128)
        ans.append((v13 % (1 << 64), (v13 >> 64), (v15[2] + v16[2]) % (1 << 64)))
    return ans

al = [0x6369757120656854, 0x706d756a20786f66, 0x20797a616c206568, 0]
bl = [0x206e776f7262206b, 0x74207265766f2073, 0x80676f64, 0x2b]

for a, b in zip(al, bl):
    print(list(map(hex, calc(a, b)[256])))
```

## GDB

另一個方法是我在賽後看 [別人](https://pastebin.com/Dj6wteXk) 用的，在 gdb 寫 python 去 hook `13B0` 的開頭和結尾，在開頭判斷這組參數有沒有出現過了，跑過就把參數的 `depth` 設成 1 也就是 base case 讓他不要再往下遞迴了，而因為同一組函式的 `Start, End` Hook 沒辦法共享資訊，所以需要維護一個 `state` 來放目前的參數，在結尾的時候一樣是看這組參數有沒有出現過，有就把答案寫上去，沒有就把答案存起來下次就不會再跑一次了。

```python solve-gdb.py
import gdb

def register(name):
    return int(gdb.parse_and_eval(name))

def read(address, size):
    inf = gdb.inferiors()[0]
    return inf.read_memory(address, size).tobytes()

def write(address, buf):
    inf = gdb.inferiors()[0]
    inf.write_memory(address, buf)

memory = {}
state = []

class Start(gdb.Breakpoint):
    def __init__(self, location):
        super(Start, self).__init__(spec = location, type = gdb.BP_BREAKPOINT, internal = False, temporary = False)
    def stop(self):
        state.append((register('$rdi'), register('$rsi'), register('$rdx'), register('$rcx')))
        if memory.get(state[-1][1:]) is not None:
            gdb.execute('set $rsi = 1')

class End(gdb.Breakpoint):
    def __init__(self, location):
        super(End, self).__init__(spec = location, type = gdb.BP_BREAKPOINT, internal = False, temporary = False)
    def stop(self):
        global state
        buf, h = state[-1][0], state[-1][1:]
        if memory.get(h) is None:
            memory[h] = (read(buf, 8), read(buf + 8, 8), read(buf + 16, 8))
        else:
            write(buf, memory[h][0])
            write(buf + 8, memory[h][1])
            write(buf + 16, memory[h][2])
        state = state[:-1]

Start(f'*{0x0000555555554000 + 0x13b0}')
End(f'*{0x0000555555554000 + 0x1424}')
```

`gdb f-hash` 之後，在 gdb 裡面執行 `source solve-gdb.py` 就可以跑上面的程式碼了
或是也可以在執行 gdb 的時候就載入 `gdb -x solve-gdb.py f-hash`

## Frida

這個方法也是我賽後看 [別人](https://sectt.github.io/writeups/Volga20/f-hash/README) 用的，frida 真的是好東西，之前剛好有研究一點 frida，第一次用在比賽中，基本上跟前一個解法一樣去 hook 函式的開頭和結尾，不過 frida 又更方便了，請看下面程式碼。

```javascript solve-frida.js
var base = ptr(Process.enumerateModulesSync()[0].base)
var recursive_func_ptr = base.add(0x13b0)

var mem = {}
Interceptor.attach(recursive_func_ptr, {
    onEnter: function (args) {
        this.buf = args[0]
        this.hash = args[1] + '-' + args[2] + '-' + args[3]
        if (mem[this.hash] !== undefined) {
            args[1] = ptr(1)
        }
    },
    onLeave: function (retval) {
        if (mem[this.hash] === undefined) {
            mem[this.hash] = [this.buf.readU64(), this.buf.add(8).readU64(), this.buf.add(16).readU64()]
        } else {
            this.buf.writeU64(mem[this.hash][0])
            this.buf.add(8).writeU64(mem[this.hash][1])
            this.buf.add(16).writeU64(mem[this.hash][2])
        }
    }
})
```

最後執行 `frida --no-pause --runtime=v8 -l solve-frida.js ./f-hash` 就可以了

## Flag

```
VolgaCTF{16011432ba16efc8dcf779477985b3b9}
```

---

1. https://github.com/OAlienO/CTF/tree/master/2020/VolgaCTF/F-Hash
2. https://pastebin.com/Dj6wteXk
3. https://sectt.github.io/writeups/Volga20/f-hash/README
