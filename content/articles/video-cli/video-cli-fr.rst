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
:status: draft

Ayant un serveur de fichier qui contient majoritairement de l’audio et de la vidéo.
Il peut arriver que j’ai besoin de faire de la conversion vidéo pour que ma Raspeberry Pi 3 puisse lire ces fichiers sans ralentissement et sans perte d’image.
Cette article a donc pour but de faire un petit tour d’horizon sur les outils en ligne de commande disponible pour gérer les fichiers vidéos.

Tout les logiciels dans cet article peuvent être installés via le gestionnaire de paquet de votre système d'exploitation (``apt``, ``pacman``, ``choco``, etc).

------------------

.. contents::
    :depth: 3
    :backlinks: top

------------------

---------
Mediainfo
---------

Mediainfo est un logiciel qui permet d’obtenir la liste des flux contenue dans un fichier container comme le **Matroska (mkv)** par exemple.
Il est possible d’utiliser ce logiciel en ligne de commande ou avec une interface graphique.

Son utilisation est très simple. En effet pour obtenir les informations d’un fichier il suffit de faire :

.. code::

    $ mediainfo <chemin vers une fichier multimédia>

----------
MKVToolNix
----------

MKVToolNix est un logiciel qui permet de lister, d’extraire, de mélanger différents flux dans des fichiers mkv.

Il se découpe en plusieurs sous-commandes :

.. contents::
    :depth: 1
    :backlinks: none
    :local:

mkvinfo
=======

La commande ``mkvinfo`` permet de lister tout les différents flux dans d’un fichier conteneur sous la forme d’un arbre.

Usage
-----

.. code::

    $ mkvinfo <chemin vers une fichier multimédia>

Pour un usage plus avancé je vous redirige vers la `documentation`__
Ou à la section `Aide-mémoire`_.

.. __: https://mkvtoolnix.download/doc/mkvinfo.html


Les différentes branches de l’arbre sont :

* **Entête EBML** : Les données d'entête (version du format de fichier…).
* **Segment** : Pour simplifier méta-données du fichier cela peut-être le titre de la vidéo qui sera afficher par lecteur multimédia, et l'application de multiplexage (comme mkvmerge).
* **Pistes** : Liste des flux vidéo, audio et sous-titre avec leur informations associé, s'affiche par ordre croisant d’id.
* **Pièces jointes** : Les pièces jointes peuvent être des images (par exemple la converture du DVD), du text…
* **Chapitres** : Informations diverses sur les chapitres du fichier.

Exemple
-------

Exemple de sortie avec un fichier (``movie.mkv``) qui a :

* 1 piste vidéo au format H.264 en 1920x816 pixels
* 2 pistes audio 6 canaux l'une en anglais et l'autre en français
* 2 pistes de sous-titre l'une avec tout les dialogues et l'autre avec la traduction des mots à l'écran (forced)

.. code::
    
    $ mkvinfo movie.mkv
    + Entête EBML
    |+ Version EBML: 1
    |+ Version EBML lue: 1
    |+ Longueur maximale de l'ID EBML: 4
    |+ Longueur maximale de la taille EBML: 8
    |+ Type de document: matroska
    |+ Version du type de document: 2
    |+ Version lue du type de document: 2
    + Segment: taille 8211844081
    |+ Tête de positionnement (sous-entrées ignorées)
    |+ Vide EBML: taille 4025
    |+ Informations de segment
    | + Échelle d'horodatage: 1000000
    | + Application de multiplexage: libebml v1.3.0 + libmatroska v1.4.1
    | + Écriture de l'application: mkvmerge v7.0.0 ('Where We Going') 32bit built on Jun  9 2014 15:08:34
    | + Durée: 01:46:39.456000000
    | + Date: Mon Mar 02 20:29:35 2015 UTC
    | + UID de segment: 0xa2 0x75 0xe4 0xd1 0x70 0x23 0x8b 0x90 0x90 0x0b 0x73 0xe0 0x9d 0xcb 0xf3 0xd2
    |+ Pistes
    | + Piste
    |  + Numéro de la piste: 1 (ID de piste pour mkvmerge et mkvextract : 0)
    |  + UID de piste: 1
    |  + Type de piste: vidéo
    |  + Signal de laçage: 0
    |  + Cache minimal: 1
    |  + Identifiant du codec: V_MPEG4/ISO/AVC
    |  + Données privées de codec: taille 41 (profil AVC/H.264 : High @L4.1)
    |  + Durée par défaut: 00:00:00.041708333 (23.976 trames/champs par seconde pour une piste vidéo) |  + Piste vidéo
    |   + Largeur (pixel): 1920
    |   + Hauteur (pixel): 816
    |   + Largeur à l'écran: 1920
    |   + Hauteur à l'écran: 816
    | + Piste
    |  + Numéro de la piste: 2 (ID de piste pour mkvmerge et mkvextract : 1)
    |  + UID de piste: 10148295179763971202
    |  + Type de piste: audio
    |  + Identifiant du codec: A_DTS
    |  + Durée par défaut: 00:00:00.010666666 (93.750 trames/champs par seconde pour une piste vidéo) |  + Langue: fre
    |  + Piste audio
    |   + Fréquence d'échantillonnage: 48000
    |   + Canaux: 6
    | + Piste
    |  + Numéro de la piste: 3 (ID de piste pour mkvmerge et mkvextract : 2)
    |  + UID de piste: 1829564080678812061
    |  + Type de piste: audio
    |  + Signal « Piste par défaut »: 0
    |  + Identifiant du codec: A_AC3
    |  + Durée par défaut: 00:00:00.032000000 (31.250 trames/champs par seconde pour une piste vidéo) |  + Piste audio
    |   + Fréquence d'échantillonnage: 48000
    |   + Canaux: 6
    | + Piste
    |  + Numéro de la piste: 4 (ID de piste pour mkvmerge et mkvextract : 3)
    |  + UID de piste: 12492895828352048821
    |  + Type de piste: sous-titres
    |  + Signal de laçage: 0
    |  + Identifiant du codec: S_TEXT/UTF8
    |  + Langue: fre
    |  + Nom: French Forced
    | + Piste
    |  + Numéro de la piste: 5 (ID de piste pour mkvmerge et mkvextract : 4)
    |  + UID de piste: 18398026066537722243
    |  + Type de piste: sous-titres
    |  + Signal « Piste par défaut »: 0
    |  + Signal de laçage: 0
    |  + Identifiant du codec: S_TEXT/UTF8
    |  + Langue: fre
    |+ Vide EBML: taille 1203
    |+ Grappe

mkvmerge
========

La commande ``mkvmerge`` est très pratique puisqu'elle
nous permet de créer des fichiers mkv en mélangeant plusieurs fichiers qui deviendront des pistes.

Usage
-----

.. code::

    $ mkvmerge -o <fichier de sortie> [options] <liste de fichier d'entrée (audio, vidéo, sous-titre, conteneur…)>

Pour un usage plus avancé je vous redirige vers la `documentation`__
Ou à la section `Aide-mémoire`_.

.. __: https://mkvtoolnix.download/doc/mkvmerge.html

Ajout d'une piste de sous-titre
-------------------------------

En prenant le fichier de la partie précédente `Exemple`_ 
et que je souhaite rajouter une piste de sous-titre anglaise en format texte encodé en *ISO-8859-1*
(format beaucoup utilisé sur sous-titre).

Je devrai taper la commande suivante :

.. code::

    $ mkvmerge -o movie-subtitled.mkv --sub-charset 0:iso-8859-1 --language 0:eng subtitle.srt movie.mkv
    mkvmerge v43.0.0 ('The Quartermaster') 64-bit
    « subtitle.srt » : utilisation du démultiplexeur pour le format « Sous-titres SRT ».
    « movie.mkv » : utilisation du démultiplexeur pour le format « Matroska ».
    « subtitle.srt » piste 0 : utilisation du module de sortie pour le format « sous-titres texte ».
    « movie.mkv » piste 0 : utilisation du module de sortie pour le format « AVC/H.264 ».
    « movie.mkv » piste 1 : utilisation du module de sortie pour le format « DTS ».
    « movie.mkv » piste 2 : utilisation du module de sortie pour le format « AC-3 ».
    « movie.mkv » piste 3 : utilisation du module de sortie pour le format « sous-titres texte ».
    « movie.mkv » piste 4 : utilisation du module de sortie pour le format « sous-titres texte ».
    Le fichier « movie-subtitled.mkv » est ouvert en écriture.
    Progression : 100%
    Les entrées CUE (l'index) sont en cours d'écriture…
    Le multiplexage a pris 33 secondes.

Que fait exactement cette ligne de commande ?
Faisons du pas à pas avec les arguments :

1. ``-o movie-subtitled.mkv`` : Le fichier de sortie de la fusion sera ``movie-subtitled.mkv``
2. ``--sub-charset 0:iso-8859-1`` : On précise que la piste 0 sera encodé en *ISO-8859-1*
3. ``--language 0:eng`` : On précise que la piste 0 sera en anglais
4. ``subtitle.srt`` : On donne le chemin du fichier sous-titre qui sera la piste 0
5. ``movie.mkv`` : On donne le chemin du fichier mkv pour obtenir les autres pistes qui seront décalé automatiquement.

.. tip::

    Si vous voulez que le lecteur vidéo lise cette piste par défaut vous pouvez rajouter l'option ``--default-track 0``
    dans les options de ``subtitle.srt``, on le rentrant juste avant celui-ci.

Sélection de pistes
-------------------

Maintenant imaginons que vous souhaitez garder seulement l'audio anglais et supprime tout les sous-titres
pour votre amis anglais qui en a que faire des sous-titre en français.

On pourra taper la commande suivante :

.. code::

    $ mkvmerge -o movie-eng.mkv --audio-tracks 2 --no-subtitles movie.mkv
    mkvmerge v43.0.0 ('The Quartermaster') 64-bit
    « movie.mkv » : utilisation du démultiplexeur pour le format « Matroska ».
    « movie.mkv » piste 0 : utilisation du module de sortie pour le format « AVC/H.264 ».
    « movie.mkv » piste 2 : utilisation du module de sortie pour le format « AC-3 ».
    Le fichier « movie-eng.mkv » est ouvert en écriture.
    Progression : 100%
    Les entrées CUE (l'index) sont en cours d'écriture…
    Le multiplexage a pris 1 minute 18 secondes.

Découpons les arguments :

1. ``-o movie-eng.mkv`` : Fichier de sortie
2. ``--audio-tracks 2`` : Sélection de la piste audio n°2 (l'anglaise)
3. ``--no-subtitles`` : Précise qu'on ne veut pas garder les pistes de sous-titre
4. ``movie.mkv`` : Fichier d'entré.

.. tip::

    Vous pouvez sélectionner plusieurs pistes en séparant les pistes avec des virgules (``--audio-tracks 1,2``).
    La sélection des pistes se fait toujours sous la forme ``--<type>-tracks``.
    Tout comme il y a des commandes sous la forme ``--no-<type>`` pour ignorer les pistes.
    Plus d'information dans la section `mkvmerge - fichier conteneur`_ de l'`aide-mémoire`_.

mkvpropedit
===========

La commande ``mkvpropedit`` permet d'éditer les propriété d'un fichier mkv.
Elle est utile lors d'un oublis dans ``mkvmerge``.

.. hint::
    
    À noter que cette commande ne permet pas d'ajouter ou de supprimer des pistes.

Usage
-----

.. code::

    $ mkvinfo [options] <chemin vers un fichier mkv>

Pour un usage plus avancé je vous redirige vers la `documentation`__
Ou à la section `Aide-mémoire`_.

.. __: https://mkvtoolnix.download/doc/mkvpropedit.html

Modification de la langue d'une piste
-------------------------------------

Modifions la langue de la piste vidéo (0) pour préciser qu'elle est française.

.. code::

    $ mkvpropedit --edit track:0 --set language=fre movie.mkv

Découpons les arguments :

1. ``--edit track:0`` : Sélectionne la piste 0 qui correspond à la piste vidéo dans notre cas.
2. ``--set language=fre`` : Attribution de la langue française à la piste.
3. ``movie.mkv```: Fichier qui va être modifié.

.. note::

    L'option ``--set`` permet l'attribution d'une propriété mais si celle-ci n'existe pas.


Modification du titre d'un fichier mkv
--------------------------------------

Modifions le titre du fichier mkv par « Titre ».

.. code::

    $ mkvpropedit --edit info --set "title=Titre" movie.mkv

.. note::

    On notera que cette fois-ci, nous n'avons pas besoins de spécfié une piste
    vus que c'est une propriété du fichier et non pas d'une piste.

------------
Aide-mémoire
------------

mkvmerge - général
==================

* ``--language <id piste>:<langue dans le format ISO 639-2 ou ISO 639-1>`` : Spécifie la langue d'une piste
* ``--default-track <id piste>`` : Précise si la piste devra lus par défaut par les lecteurs
* ``--title <titre>`` : Permet de donner un titre au fichier.
* ``-o <fichier de sortie mkv>`` : Fichier mkv de sortie.

mkvmerge - ordre des arguments
==============================

.. caution::

    L'ordre des arguments est important. Il faut toujours commencé par le ``-o`` pour indiquer le fichier de sortie.
    Puis les options appliqué au premier fichier, ensuite le nom de celui-ci et pareil pour les autres.

**Exemple** :

.. code::

    $ mkvmerge --title "Titre" -o movie.mkv --no-subtitle movie-subtitled.mkv --audio-tracks 1 movie-audio.mkv

**Contre-exemple** :

.. code::

    $ mkvmerge movie-subtitled.mkv --no-subtitle movie-audio.mkv --audio-tracks 1 -o movie.mkv --title "Titre"

mkvmerge - sous-titre
=====================

* ``--sub-charset <id piste>:<encodage>`` : Spécifie le codec (non obligatoire si l'encodage du fichier est l'UTF-8) d'une piste de sous-titre

mkvmerge - fichier conteneur
============================

* ``--video-track`` : Sélection des pistes vidéo
* ``--audio-track`` : Sélection des pistes audio
* ``--subtitle-track`` : Sélection des pistes de sous-titre
* ``--no-video`` : Suppression des pistes vidéo
* ``--no-audio`` : Suppression des pistes audio
* ``--no-subtitle`` : Suppression des pistes de sous-titre

mkvpropedit - général
=====================

* ``--edit track:<id piste> --set <propriété>=<nouvelle valeur>`` : Permet d'éditer une propriété d'une piste
* ``--edit track:<id piste> --add <propriété>=<nouvelle valeur>`` : Permet d'éditer une propriété d'une piste
* ``--edit track:<id piste> --delete <propriété>`` : Permet de supprimer une propriété d'une piste 


