---
title: "【指令怎麼用】SSH 的十大妙用"
date: 2018-08-04
categories:
- 程式
tags:
- ssh
- tunnel
- command
- proxy
- reverse ssh
---

## ssh config

```txt ~/.ssh/config
Host vps
    HostName 123.45.67.89
    User oalieno
    Port 22000
```

每次都打一長串的參數很麻煩，可以先在 `~/.ssh/config` 設定好
像上面這樣設定好後 `ssh vps` 就等同於 `ssh -p 22000 oalieno@123.45.67.89`

## IdentityFile

```txt ~/.ssh/config
Host vps
    HostName 123.45.67.89
    User oalieno
    IdentityFile ~/.ssh/id_rsa
```

`IdentityFile` 就是指定要用哪個 key，等同於 `-i ~/.ssh/id_rsa`
預設會抓 `id_*.pub` 中最新的 ( `/usr/bin/ssh-copy-id` 59 行 )

## local port forwarding ( ssh tunnel )

```txt ~/.ssh/config
Host vps
    HostName 123.45.67.89
    User oalieno
    LocalForward 5555 127.0.0.1:6666
```

設定好後可以直接打以下指令

```sh
ssh -f -N vps
# -f : run in background
# -N : not execute remote command, useful for forwarding ports
```

就會等同於以下指令

```sh
ssh -f -N -L 5555:127.0.0.1:6666 oalieno@123.45.67.89
# -f : run in background
# -N : not execute remote command, useful for forwarding ports
```

`local:5555 -> remote:127.0.0.1:6666`
執行這個指令，就會在 local 聽 5555 port 然後把流量都導到 remote 的 127.0.0.1 的 6666 port

## remote port forwarding ( reverse ssh tunnel )

```txt ~/.ssh/config
Host vps
    HostName 123.45.67.89
    User oalieno
    RemoteForward 6666 127.0.0.1:5555
```

設定好後可以直接打以下指令

```sh
ssh -f -N vps
# -f : run in background
# -N : not execute remote command, useful for forwarding ports
```

就會等同於以下指令

```sh
ssh -f -N -R 6666:127.0.0.1:5555 oalieno@123.45.67.89
# -f : run in background
# -N : not execute remote command, useful for forwarding ports
```

`remote:6666 -> local:127.0.0.1:5555`
執行這個指令之後，就會在 remote 聽 6666 port 然後把流量都導到 local 的 127.0.0.1 的 5555 port

## dynamic port forwarding

```txt ~/.ssh/config
Host vps
    HostName 123.45.67.89
    User oalieno
    DynamicForward 9999
```

設定好後可以直接打以下指令

```sh
ssh -f -N vps
# -f : run in background
# -N : not execute remote command, useful for forwarding ports
```

就會等同於打以下指令

```sh
ssh -f -N -D 9999 oalieno@123.45.67.89
# -f : run in background
# -N : not execute remote command, useful for forwarding ports
```

會開一個 SOCKS 代理伺服器聽在 local 的 9999 port，把流量都轉從 remote 的機器出去

## 情境一：存取內網資源

你在你租的 vps 伺服器上面跑了一個 mattermost 在測試
但你不想讓 mattermost 聽在 `0.0.0.0` 公開在網路上讓大家都可以連，有風險
所以你開在 `127.0.0.1` 只有 vps 本地可以連
但是你又想用你的筆電上的瀏覽器測試
這時候就可以用到 local port forwarding 把 `local:8065 -> remote:127.0.0.1:8065`
設定如下之後，執行 `ssh -f -N vps-mattermost`
就可以在本地瀏覽器上面輸入 `http://localhost:8065` 連到你架好的 mattermost 了

```txt ~/.ssh/config
Host vps-mattermost
    HostName 123.45.67.89
    User oalieno
    LocalForward 8065 127.0.0.1:8065
```

## 情境二：透過跳板 ssh 到沒有 public ip 的機器

你在家裡組了一台桌機，但是這台桌機沒有 public ip，所以在外面的時候沒辦法 ssh 連到家裡的桌機
不過你剛好租了一台有 public ip 的 vps 伺服器
這時候就可以用到 remote port forwarding 把 `remote:22000 -> local:127.0.0.1:22`
設定如下之後，在桌機上執行 `ssh -f -N vps-reverse-ssh`
就可以從你的筆電先 ssh 到 vps
然後再從 vps 通過 remote port forwarding ssh 到桌機了
有 public ip 的 vps 伺服器在這裡扮演了跳板的角色

```txt ~/.ssh/config (桌機)
Host vps-reverse-ssh
    HostName 123.45.67.89
    User oalieno
    RemoteForward 22000 127.0.0.1:22
```

```txt ~/.ssh/config (vps)
Host home
    HostName 127.0.0.1
    User oalieno
    Port 22000
```

## autossh

autossh 可以幫你自動重連

```txt ~/.ssh/config
Host vps
    HostName 123.45.67.89
    User oalieno
    IdentityFile ~/.ssh/id_rsa
    LocalForward 5555 127.0.0.1:6666
    ServerAliveInterval 30
    ServerAliveCountMax 3
```

設定好後可以直接打以下指令

```
autossh -M 0 -f -N vps
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
5. https://johnliu55.tw/ssh-tunnel.html
