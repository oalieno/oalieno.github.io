## 取得原始碼

可以從 [ftp.gnu.org](https://ftp.gnu.org/gnu/glibc/) 下載 glibc 的原始碼

```
wget https://ftp.gnu.org/gnu/glibc/glibc-2.29.tar.xz
x glibc-2.29.tar.xz
```

## 編譯

```bash tab="64 bit"
cd glibc-2.29 && mkdir build && cd build
CFLAGS="-g -g3 -ggdb -gdwarf-4 -Og -w" \
  CXXFLAGS="-g -g3 -ggdb -gdwarf-4 -Og -w" \
  ../configure --prefix=/path/to/install
make && make install
```

```bash tab="32 bit"
cd glibc-2.29 && mkdir build32 && cd build32
CC="gcc -m32"
  CXX="g++ -m32" \
  CFLAGS="-g -g3 -ggdb -gdwarf-4 -Og -w" \
  CXXFLAGS="-g -g3 -ggdb -gdwarf-4 -Og -w" \
  ../configure --prefix=/path/to/install --host=i686-linux-gnu
make -j8 && make -j8 install
```

??? info "`-w`"
    `-w` 的作用是關掉所有 warning messages

## 使用

隨便編譯一個範例程式，看一下他的 process maps 就會看到原本的 libc 和 ld 被換成我們編譯的版本了

```
gcc test.c -o test -Wl,-dynamic-linker /path/to/install/lib/ld-2.29.so
```

??? info "`-Wl,-dynamic-linker`"
    `-Wl,xxx` 的作用是把參數 `xxx` 傳給 linker

[^1]:
    https://www.youtube.com/watch?v=wsIvqd9YqTI
[^2]:
    http://look3little.blogspot.com/2017/12/debug-symbolglibc.html
[^3]:
    https://stackoverflow.com/questions/6562403/i-dont-understand-wl-rpath-wl
[^4]:
    https://stackoverflow.com/questions/1452671/disable-all-gcc-warnings
