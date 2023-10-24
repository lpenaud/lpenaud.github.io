NVM
===

MSYS
----

```
pacman -S mingw-w64-x86_64-curl unzip ncurses python3 make gcc
git clone https://github.com/nvm-sh/nvm.git ~/.nvm
cd ~/.nvm
git checkout v0.39.5
```

.bash_aliases

```
# Prend en priorité le vrai curl
add2path /mingw64/bin
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```