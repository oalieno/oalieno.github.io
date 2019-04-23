# 指令整理 - SSH

### ssh config

設定這個檔案 `~/.ssh/config`

#### basic config

```
Host dev
    HostName 123.45.67.89
    User oalieno
    Port 22000
```

這樣設定好後 `ssh dev` 就等同於 `ssh -p 22000 oalieno@123.45.67.89`

#### IdentityFile

```
Host dev
    HostName 123.45.67.89
    User oalieno
    Port 22000
    IdentityFile ~/.ssh/id_rsa
```

`IdentityFile` 就是指定要用哪個 key，等同於 `-i ~/.ssh/id_rsa`

預設會抓 `id_*.pub` 中最新的 ( `/usr/bin/ssh-copy-id` 59 行 )

#### ssh tunnel ( port forwarding )

```
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

#### reverse ssh tunnel ( reverse port forwarding )

```
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

#### dynamic port forwarding

```
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

### autossh

```
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

[^1]:
    https://linux.die.net/man/5/ssh_config
[^2]:
    https://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file/
[^3]:
    https://www.everythingcli.org/ssh-tunnelling-for-fun-and-profit-local-vs-remote/
