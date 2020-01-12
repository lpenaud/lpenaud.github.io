=====================================
La gestion vidéo en ligne de commande
=====================================

:date: 2020-01-12 18:00:00
:modified: 2020-01-12 18:00:00
:category: cli
:tags: cli, video
:slug: video-cli
:lang: fr
:authors: Penaud Loïc
:summary: Conversion, gestion de flux audio / vidéo en ligne de commande à l’aide de ffmpeg et mkvtoolnix.

Ayant un serveur de fichier qui contient majoritairement de l’audio et de la vidéo.
Il peut arriver que j’ai besoin de faire de la conversion vidéo pour que ma Raspeberry Pi 3 puisse lire ces fichiers sans ralentissement et sans perte d’image.
Cette article a donc pour but de faire un petit tour d’horizon sur les outils en ligne de commande disponible pour gérer les fichiers vidéos.

Tout les logiciels dans cet article peuvent être installés via le gestionnaire de paquet de votre distribution (``apt``, ``pacman``, etc).

------------------

.. contents::
    :depth: 3

------------------

---------
Mediainfo
---------

Mediainfo est un logiciel qui permet d’obtenir la liste des flux contenue dans un fichier container comme le **Matroska (mkv)** par exemple.
Il est possible d’utiliser ce logiciel en ligne de commande ou avec une interface graphique.

Son utilisation est très simple. En effet pour obtenir les informations d’un fichier il suffit de faire :

.. code-block:: shell

    mediainfo <chemin vers une fichier multimédia>

----------
MKVToolNix
----------

MKVToolNix est un logiciel qui permet de lister, d’extraire, de mélanger des fichier mkv.
