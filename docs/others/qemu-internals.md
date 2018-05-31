# QEMU Internals

被仿真的平台叫 guest

運行 qemu 的平台叫 host

QEMU 的運作原理簡略來說就是

把 guest 的代碼翻譯成 QEMU 的中介代碼 $\to$ 把 QEMU 的中介代碼翻譯成 host 的代碼

以下以 i386 為主

## prepare

分析大型系統的程式碼需要先準備好工具們幫助我們看代碼

1. vim ctags & cscope
2. gdb

## build

```
mkdir build
cd build
CFLAGS='-g3 -ggdb3 -gdwarf-4 -Og -Wno-error' ../configure && make
```

加上一些 debug 用的 flags 讓我們可以用 gdb 追 code

不加的話，gdb 執行的時候，代碼會跳來跳去，因為編譯器優化會讓代碼不一定照順序執行，而且會缺少 macro 資訊


#### 有問題的話

如果弄不成功沒有 macro 的資訊或代碼跳來跳去的話

1. `configure` 會產生 `config-host.mak`，可以直接改這裡面的 `CFLAGS` 試試
2. 砍掉整個 build 資料夾重來，讓他全部重編一次

## 主要流程

#### translate

##### 從 guest 的代碼產生 QEMU Intermediate Code

`main` $\to$ `cpu_loop` $\to$ `cpu_exec` $\to$ `tb_find` $\to$ `tb_gen_code` $\to$ `gen_intermediate_code` $\to$ `translator_loop` $\to$ `i386_tr_translate_insn` $\to$ `disas_insn`

##### 從 QEMU Intermediate Code 產生 host 的代碼

`main` $\to$ `cpu_loop` $\to$ `cpu_exec` $\to$ `tb_find` $\to$ `tb_gen_code` $\to$ `tcg_gen_code`

#### execute

`main` $\to$ `cpu_loop` $\to$ `cpu_exec` $\to$ `cpu_loop_exec_tb` $\to$ `cpu_tb_exec` $\to$ `tcg_qemu_tb_exec`

## translate

主要的函式在 `accel/tcg/translator.c:translator_loop`

這個函式一次翻譯一個 translation block ( TB )

裡面有一個迴圈，跑一次翻譯一條指令

主要是 `disas_insn` 這個函式在 parse assembly ( 看不太懂可以看看 [x86 Instructions Format](/others/x86-instructions-format) )

當有 `call, jmp, jg, je, ...` 的 branch 指令就會跳出迴圈

也就是整個代碼會被 branch 指令分成很多 TB

`db->pc_first` 就是目前翻譯的 TB 的開頭

`db->pc_next` 就是下一個要翻譯的地方

`(gdb) x/10i db->pc_first` 可以看一下目前 TB 未翻譯的代碼

翻譯好的代碼會放在 `tcg_ctx` 這個全域變數裡面

```c++
while (true) {
    ...
    ops->translate_insn(db, cpu);
    ...
    if (db->is_jmp != DISAS_NEXT) {
        break;
    }
    ...
}
```

## execute

`tcg_qemu_tb_exec` = `((uintptr_t (*)(void *, void *))tcg_ctx->code_gen_prologue)(env, tb_ptr)`
