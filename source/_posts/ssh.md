---
title: "【指令怎麼用】SSH Tunnel 篇"
date: 2018-08-04 09:37:58
tags:
- ssh
- tunnel
- command
- proxy
- reverse ssh
---

## basic config

```txt ~/.ssh/config
Host dev
    HostName 123.45.67.89
    User oalieno
    Port 22000
```

這樣設定好後 `ssh dev` 就等同於 `ssh -p 22000 oalieno@123.45.67.89`

## IdentityFile

```txt ~/.ssh/config
Host dev
    HostName 123.45.67.89
    User oalieno
    Port 22000
    IdentityFile ~/.ssh/id_rsa
```

`IdentityFile` 就是指定要用哪個 key，等同於 `-i ~/.ssh/id_rsa`

預設會抓 `id_*.pub` 中最新的 ( `/usr/bin/ssh-copy-id` 59 行 )

## ssh tunnel ( port forwarding )

```txt ~/.ssh/config
Host dev
    HostName 123.45.67.89
    User oalieno
    Port 22000
    LocalForward 5555 127.0.0.1:6666
```

將 local 的 5555 port 透過 ssh tunnel 對應到 remote 的 6666 port

連線到 local 的 5555 port 等於連線到 remote 的 127.0.0.1 的 6666 port

不一定要用 127.0.0.1 也可以連到 remote 出去的 google.com:80 ( 透過 remote 瀏覽 google.com )

設定好後可以直接打以下指令

```sh
ssh -f -N dev
# -f : run in background
# -N : not execute remote command, useful for forwarding ports
```

就會等同於以下指令

```sh
ssh -f -N -L 5555:127.0.0.1:6666 oalieno@123.45.67.89
# -f : run in background
# -N : not execute remote command, useful for forwarding ports
```

## reverse ssh tunnel ( reverse port forwarding )

```txt ~/.ssh/config
Host dev
    HostName 123.45.67.89
    User oalieno
    Port 22000
    RemoteForward 6666 127.0.0.1:5555
```

將 remote 的 6666 port 透過 reverse ssh tunnel 對應到 local 的 5555 port

連線到 remote 的 6666 port 等於連線到 local 的 5555 port

不一定要用 127.0.0.1 也可以連到 local 出去的 google.com:80 ( 透過 local 瀏覽 google.com )

設定好後可以直接打以下指令

```sh
ssh -f -N dev
# -f : run in background
# -N : not execute remote command, useful for forwarding ports
```

就會等同於以下指令

```sh
ssh -f -N -R 6666:127.0.0.1:5555 oalieno@123.45.67.89
# -f : run in background
# -N : not execute remote command, useful for forwarding ports
```

## dynamic port forwarding

```txt ~/.ssh/config
Host dev
    HostName 123.45.67.89
    User oalieno
    Port 22000
    DynamicForward 9999
```

設定好後可以直接打以下指令

```sh
ssh -f -N dev
# -f : run in background
# -N : not execute remote command, useful for forwarding ports
```

就會等同於打以下指令

```sh
ssh -f -N -D 9999 oalieno@123.45.67.89
# -f : run in background
# -N : not execute remote command, useful for forwarding ports
```

並在電腦上設定 SOCKS 代理伺服器 ( `127.0.0.1:9999` )

之後你可以查找你的 ip 位址 ( https://www.whatismyip.com/ )

會發現你已經跳去 `123.45.67.89`

## autossh

autossh 可以幫你自動重連

```txt ~/.ssh/config
Host dev
    HostName 123.45.67.89
    User oalieno
    Port 22000
    IdentityFile ~/.ssh/id_rsa
    LocalForward 5555 127.0.0.1:6666
    ServerAliveInterval 30
    ServerAliveCountMax 3
```

設定好後可以直接打以下指令

```
autossh -M 0 -f -N dev
# -M 0 : autossh echo port, recommend disable it by setting it to 0
# -f : run in background
# -N : not execute remote command, useful for forwarding ports
```

就會等同於打以下指令

```sh
autossh -M 0 -f -N -o "ServerAliveInterval 30" -o "ServerAliveCountMax 3" -L 5555:localhost:6666 oalieno@123.45.67.89
# -M 0 : autossh echo port, recommend disable it by setting it to 0
# -f : run in background
# -N : not execute remote command, useful for forwarding ports
```

覺得不夠有時候還是會斷掉的話，或是要在開機時候也要開起來的話，可以再搭配上 crontab 服用
用 crontab 定時執行下面的 shell script
只要沒看到 `autossh` 這個 process，就再跑一次
~~搞的好像自己種自己後門一樣~~

```sh
#!/bin/bash
  
if [[ $(ps -C autossh) == *'autossh'* ]]; then
    :
else
    autossh -M 0 -f -N dev
fi
```

## escape sequence

有時候連線斷掉後，畫面就會卡在那裡
這時候就可以直接在鍵盤上打 `~.` 這個 escape sequences 就可以直接跳出來啦，感覺像是在逃脫 vim 呢xD
下面還有更多的神秘金手指可以打

```
Supported escape sequences:
     ~.   - terminate connection (and any multiplexed sessions)
     ~B   - send a BREAK to the remote system
     ~C   - open a command line
     ~R   - request rekey
     ~V/v - decrease/increase verbosity (LogLevel)
     ~^Z  - suspend ssh
     ~#   - list forwarded connections
     ~&   - background ssh (when waiting for connections to terminate)
     ~?   - this message
     ~~   - send the escape character by typing it twice
(Note that escapes are only recognized immediately after newline.)
```

---

1. https://linux.die.net/man/5/ssh_config
2. https://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/
3. https://www.everythingcli.org/ssh-tunnelling-for-fun-and-profit-local-vs-remote/
4. https://askubuntu.com/questions/29942/how-can-i-break-out-of-ssh-when-it-locks