===
NVM
===

:date: 2023-11-09 14:30:59
:category: Développement
:tags: développement, javascript, node, cli, bash, msys
:lang: fr
:authors: PENAUD Loïc
:summary: NVM un gestionnaire de version de Nodejs.


Il peut arriver dans la vie d'un développeur d'être confronté à devoir travailler sur des applications qui utilise différentes version de Node.
En effet entre version majeur il se peut qu'il y est des changement cassant dans l'API de celui-ci.
Alors cela oblige d'avoir à télécharger, installé plusieurs versions sur le même ordinateur et de devoir jongler avec elles.

NVM est un outils en ligne de commande permettant de simplifier ce processus qui peut être répétitif en nous proposant d'installer en tout sécurité différentes versions de Node.
NVM respect les standard POSIX.

------------------

.. contents::
  :backlinks: top

------------------

-----------
GNU / Linux
-----------

TODO

-------
Windows
-------

MSYS
====

.. code-block::
 
  pacman -S mingw-w64-x86_64-curl unzip ncurses python3 make gcc
  git clone https://github.com/nvm-sh/nvm.git ~/.nvm
  cd ~/.nvm
  git checkout v0.39.5

Par défaut MSYS va utiliser le ``curl`` pré-installer sur Windows qui n'a pas le même comportement (bah oui, ce serait trop simple si Windaube pouvait respecter des standard).
Pour évtier de ce problème on va indiquer à MSYS d'utiliser le curl de ``mingw``.

.. code-block:: bash
  :caption: .bash_aliases / .bashrc

  # Prend en priorité le vrai curl
  add2path /mingw64/bin
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
