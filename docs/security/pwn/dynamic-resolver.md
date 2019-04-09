## patch gdb

gdb 預設會跳過 dynamic symbol resolution，所以我們 patch gdb 的原始碼

```diff
@@ -6536,9 +6536,20 @@
      backward through the trampoline code, and that's handled further
      down, so there is nothing for us to do here.  */

+  static int env_debug_resolver = -1;
+  if (env_debug_resolver == -1) {
+    char *env_debug_resolver_str = getenv("DEBUG_RESOLVER");
+    if (env_debug_resolver_str && !strcmp(env_debug_resolver_str, "1")) {
+      env_debug_resolver = 1;
+    } else {
+      env_debug_resolver = 0;
+    }
+  }
+
   if (execution_direction != EXEC_REVERSE
       && ecs->event_thread->control.step_over_calls == STEP_OVER_UNDEBUGGABLE
-      && in_solib_dynsym_resolve_code (ecs->event_thread->suspend.stop_pc))
+      && in_solib_dynsym_resolve_code (ecs->event_thread->suspend.stop_pc)
+      && env_debug_resolver == 0)
     {
       CORE_ADDR pc_after_resolver =
        gdbarch_skip_solib_resolver (gdbarch,
```

### 取得原始碼

[ftp.gnu.org](https://ftp.gnu.org/gnu/gdb/)

```
wget https://ftp.gnu.org/gnu/gdb/gdb-8.2.1.tar.xz
x gdb-8.2.1.tar.xz
```

### 編譯

```bash
cd gdb-8.2.1 && mkdir build && cd build
../configure --enable-tui --with-python=/usr/bin/python3.6 --prefix=/path/to/install
make -j8 && make -j8 install
```

### 使用

```bash
export DEBUG_RESOLVER=1
/path/to/install/bin/gdb
```

[^1]:
    https://www.youtube.com/watch?v=wsIvqd9YqTI
[^2]:
    http://rk700.github.io/2015/08/09/return-to-dl-resolve/
