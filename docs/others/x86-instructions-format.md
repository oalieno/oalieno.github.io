# x86 Instructions Format

[主要格式](http://www.c-jump.com/CIS77/CPU/x86/X77_0030_encoding_format.htm)

opcode 的 d = 0 代表 REG 是 source  
opcode 的 d = 1 代表 REG 是 destination

`mov ecx, eax` 有兩個 operand，一個是 `ecx`，另一個是 `eax`

一個用 REG 來形容其中一個 operand  
另一個用 MOD + R/M 來形容另一個 operand

[MOD-REG-R/M 查表](http://www.c-jump.com/CIS77/CPU/x86/X77_0090_addressing_modes.htm)

其中 MOD + R/M 有一種模式是 SIB 模式

[SIB 查表](http://www.c-jump.com/CIS77/CPU/x86/X77_0100_sib_byte_layout.htm)

## 相關資源

* http://www.c-jump.com/CIS77/CPU/x86/index.html
* https://en.wikibooks.org/wiki/X86_Assembly/Machine_Language_Conversion
* http://ref.x86asm.net/coder64.html
* http://www.mouseos.com/x64/index.html
