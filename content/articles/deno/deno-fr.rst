==================================================
Deno - Une nouvelle façon d'utiliser le JavaScript
==================================================

:date: 2020-04-27 15:40:11
:modified: 2020-04-27 15:40:11
:category: développement
:tags: développement, script, javascript, typescript, node, deno
:lang: fr
:authors: Penaud Loïc
:summary: Comment évolue Deno ? Le nouvel environnement d'éxecution JavaScript annoncé par Ryan Dahl créateur de Node 2 ans après son annonce.
:slug: deno-js
:cover: images/deno/deno_logo_3.svg

Le JavaScript_ a bien évolué depuis la création de Node_ en 2010, ce qui n'est pas passé inaperçus par Ryan Dahl et son équipe.
C'est pourquoi avant de parler de Deno parlons un peu de l'évolution du JavaScript_ et de Node_.

.. .. contents::
..     :depth: 3
..     :backlinks: top

---------------
Pourquoi Node ?
---------------
L'idée derrière la création de Node_ était d'avoir un système asynchrones permettant de supporter un grand nombres d'entrées et de sorties (les flux vers des sockets ou des fichiers).

Donc, pour ça Ryan Dahl a utilisé V8_, le moteur JavaScript_, développé par Google pour le projet Chromium_.
Puis, dans l'optique de simplier la vie des développeurs, il créa la fonction require_ permettant d'importer des modules et des fichiers JSON ou JavaScript_.
Ensuite, Isaac Z. Schlueter rajouta un gestionnaire de paquets npm_ permettant aux développeurs de partager leurs modules.
De plus, Node_ posséde une interface de programmation (API) riche.

L'un des problèmes, c'est que le JavaScript_ a bien changé depuis 2010, surtout depuis l'ES6_.

.. hint:: Pourquoi le JavaScript_ ? La réponse est simple : la boucle d'événement.
    Cette boucle est un peu comme une vigile. Elle permet d'organiser l'éxecution des fonctions asynchrones.
    Je ne rentrerai pas dans les détails de celle-ci, puisqu'elle meriterait un article à elle seule.
    Si vous voulez plus de détails je vous invite à regarder la présentation `What the heck is the event loop anyway?`_ de Philip Roberts (sous-titre en français disponible).

---------------------------
ES6 - La grosse mise-à-jour
---------------------------
Pour rappel, JavaScript_ suit les normes standards ECMAScript dictées par l'ECMA_ (European Association for Standardizing Information and Communication Systems). ECMA_ est une association d'industriel qui existe depuis 1961 qui proposes différentes normes et standards dans le domaines de l'informatique.

La |6e| version d'ECMAScript a fait 2 gros ajouts :

* Le système de module avec les mots-clés `import`_ et `export`_.
* Le système des promesses asynchrones avec la classe `Promise`_. 

.. note::
    L'ES8 continue l'évolution des promesses en rajoutant d'autre méthodes en lien avec la classe `Promise`_ et en rajoutant les mots-clés async_ et await_ afin de simplifier encore plus, le système des promesses asynchrones, en éliminant l'utilisation des fonctions de rappelles (callback).

---------------------
Problème liées à Node
---------------------
En 2018 que Ryan Dahl, le créateur de Node_, a fait une conférence qui s'appelle `10 Things I Regret About Node.js (10 choses que je regrette à propos de Node.js)`_ (sous-titre en français disponible) où Ryan Dahl expose les problèmes de Node_ liée à sa conception.

.. important:: 
    J'expose ici avec mes mots, l'avis de Ryan Dahl et de son équipe.

Promesse
========
L'interface de programmation (API) de Node_ posséde de nombreuse fonctions asynchrones, le problème c'est qu'elles ne sont pas compatible avec les promesses.
Par conséquent, ces fonctions sont incompatibles avec la syntaxe async_ et await_.

.. hint:: 
    D'ailleurs, dans la conférence Ryan Dahl explique qu'il avait rajouté le système des promesses sur les fonctions de l'API.
    Mais il a supprimé celui-ci en février 2010, car il voulait que son API, soit la plus simple (légère) possible.
    Il confesse qu'il n'aurait pas pris cette décission s'il avait sus, quel impact aurait les promesses dans le JavaScript_ d'aujourd'hui.

Sécurité
========
Node_ donne accées à tout imédiatement, aux système de fichier, aux ports réseaux, etc.
Ce qui pose des problèmes, en effet, on peut très bien imaginer quelqu'un qui copie des fichiers confidentiels (comme des clés SSH par exemple) et les envois via les interfaces réseaux à des fins malveillantes.

.. hint:: 
    À noter que le JavaScript_ s'exécute dans une machine virtuelle (ici V8_).
    Alors on peut restreindre les accès, tout comme le font les navigateurs.

Le système de compilation de module natifs GYP
==============================================
node-gyp_ est un système permettant de compiler des modules natifs programmer en `C`, `C++` pour pouvoir les utiliser en JavaScript_.
Le problème de ce système c'est qu'il n'a pas été bien pensé.

Utilise de tels module oblige, une compilation spéciale qu'on doit configurer à l'aide d'un fichier de configuration dans un format ressemblant à du JSON. Ensuite ce fichier est lus par un programme Python_ puis envoyé à node-gyp_ qui éxecute des fonctions du projet **obsolète** gyp_ (remplacé par GN_ depuis 2016 pour des raisons de performance) de Chromium_.

Il aurait plus simple de créer une interface de fonction étrangère (FFI_), permettant d'appeller une fonction à partir d'un fichier bibliothéque (``.dll`` pour Windows, ``.so`` pour GNU / Linux) comme en Python_ avec le module ctypes_.

Les système de modules 
======================
Le système de module CommonJS est celui utiliser par Node_, cependant il n'a pas été développer ni standardisé par ECMA.

Donc ce système différe de son anolog embarqué dans les navigateurs web :

* Une résolution de chemin dynamique ce qui entraine des requêtes inutiles aux système de fichiers et l'utilisation du fichier package.json.
* Le fait qu'on doit pas préciser l'extention `.js` du fichier
* Le possibilité d'importer un dossier si celui-ci a un fichier ``index.js`` (ajouter aux système, car Ryan Dahl trouvait sa mignon)
* L'impossibilité d'utiliser une URL pour importer des modules.

.. hint::
    Les 3 premiers points, permettent de gagner en abstration **superflues**.

package.json
------------
Ce fichier permet d'obtenir :

* Les listes des dépendances ainsi que leurs versions utilisé dans le module
* Des commandes a exécuter dans un terminal (lancement, construction de l'application...)
* Description du module
* Dépôt du gestionnaire de version du module
* Nom du module
* Etc...

Chaque projet Node_ doit obligatoirement avoir un fichier ``package.json`` se qui entraine l'obligation de l'utilisation de npm_, ce qui n'étais pas prévus.
De plus, les modules disponible via npm_ sont héberger de façon centralisé et privé.

.. hint::
    D'ailleurs npm_ a été racheté par Github_ en avril 2020.
    Sachant que Github_ appartient à Microsoft depuis juin 2018.


node_modules
------------
En plus des problèmes qui viennent de package.json_. ``node_module`` a tendance à devenir très vite, très volumineux à cause du système de résolution de dépendances, car le gestionnaire de paquets de Node_ télécharge tout les modules dans l'arbre de dépendances à l'échelle d'un projet.

.. figure:: images/deno-node_module-meme.jpg
    :alt: node_modules plus lourds qu'un trou noir ?
    :align: center
    
    Mème concernant la taille volumineuse du dossier ``node_modules``

Mon avis
========
Certe, je suis pas l'informatien le plus expérimenté du monde et mon avis n'est peut-être pas le plus éclairé.
Cependant, j'ai commencé à utiliser Node_ dès ma |1ere| au lycée (donc depuis environ 5 ans), j'ai utilisé quasiment que ça lors mes expériences professionelles.

Mon avis sur les problèmes souligné lors `cette représentation`_ :

* J'ai peur qu'on ne puisse pas faire grand chose au problème de poids de ``node_modules``, puisqu'on sera toujours obligé de télécharger les dépendances d'un module pour qu'il fonctionne.
* Un gestionnaire de paquets est quelque chose de majoritairement aprécier par les développeurs. Ce qui explique leur présence dans les langages de programmations récent comme Rust_ et Go_. Cependant, je comprends le problème d'un hébergement central et privé, qui est opposé à la philosophie du logiciel libre.
* La syntaxe des module CommonJS, n'est pas mauvaise. Le problème c'est qu'elle différe trop des standards ES6_ or le but de Node_ est de programmer en utilisant la même syntaxe que sur les navigateurs web. C'est pour ça qu'il y a pléthore de transcompileur et que l'équipe de Node_ travaille sur l'intégration de cette nouvelle syntaxe. À la date où j'écris l'utilisation est expérimentale (pour plus de détails rendez-vous dans la `section esm de la documentation de Node`_).
* Le problème de sécurité, ne me parait pas si impactant que ça pour plusieurs raison :
    * De nombreux langages de programmation ne sont pas sécurisé et certains comme Python_ ou Java_ sont beaucoup utilisé.
    * La plupart des projets qui utilise Node_ sont des serveurs Web, ils sont donc toujours besoins d'utiliser les ports réseaux et dans beaucoup de cas, le système de fichier pour lire des variables environnement dans un ``.env``.
* Pour palier aux problèmes dues à l'absence des promesses dans l'API standard, il y a souvent 2 solutions :
    * Soit des développeurs ont créer des versions `promessifier` des fonctions de l'API standard comme fs-extra_ pour remplacer le module fs_.
    * Soit il y a une conversion des fonctions de rappelles grâce à la fonction util.promisify_.

---------------------------------------------
Deno la solution face aux problèmes de Node ?
---------------------------------------------
Les problèmes soulevés dans la partie précédente ne peuvent pas être résolue en faisant une mise à jour de Node_ car se sont des problèmes de conception trop profond.

Alors Ryan Dahl et son équipe ont commencés à travailler sur un nouveau projet qui s'appelle Deno_.
Ce projet est censé palier aux problèmes de son prédécesseur en permettant aux développeurs :

* D'importer des scripts à partir de lien HTTP(S) avec la syntaxe ES6.
* D'utiliser une bibliothéque standard ``std`` (séparée du coeur) qui n'a aucune dépendance externe et qui utilise les promesses. Cette bibliothéque est fortement inspiré de celle de Go_.
* De programmer directement en TypeScript_.
* D'assurer un maxium de sécurité, car Deno_ demande une autorisation pour chaque accée système (fichier, socket, lancer sous-programmes...). Sauf en présence de certain drapeau commme ``--allow-read`` pour permettre l'accées aux systèmes de fichier en lecture, ``--allow-net`` pour pouvoir utiliser les interfaces réseau...
* D'avoir un objet global plus proche de ceux des navigateurs, permettant d'unifier le développement en JavaScript_.
* De programmer plus facilement des fonctionnalité à rajouter au coeurde en utilisant Rust_.
* D'exécuter un script directement à partir d'un URL.

De plus Deno_ rajoute ces fonctions à son exécutable :

* ``bundle`` : Empacte un module ainsi que ces dépendances dans un seul fichier (mécanique similaire à Webpack_ en Node_).
* ``doc`` : Affiche la documentation d'un module.
* ``fmt`` : Auto-formate les fichiers source JavaScript_ et TypeScript_ donnée en argument (semblable à Eslint_).
* ``install`` : Crée un exécutable à partir d'un script (mécanique similaire qu'il y a dans Node_).
* ``types`` : Affiche le fichier decrivant les types dans l'objet global (fichier de définition TypeScript_).
* ``test`` : Lance dans les scripts de test donnés en argument qui correspont à ce blob ``{*_,}test.{js,ts,jsx,tsx}`` (tout les fichier qui finissent par *test* suivis d'une extention compatible avec Deno_ (``js``, ``ts``, ``jsx``, ``tsx``).

.. attention:: 
    Bien que sur le papier, Deno_ apporte son lot de fonctionnalité plus qu'appréciables.
    Il serait inconciants de l'utiliser en production, étant donné son état de développement.

.. note::
    Ici, je ne rentrerai pas dans les détails technique, mais si vous êtes interressés par comment marche le coeur de Deno_.
    Je peux vous conseiller de jeter à un œil à Tokio_ une librarie asynchrones en Rust_ qui offre le service de sa boucle d'événement à Deno_.
    Ainsi que le `dépot github de Deno`_.

Comment le tester ?
===================
Après environ 2 ans de développement, elle est là. La premier version de Deno_ est sortie le 13/05/2020 [1]_ sur Windows, Mac et GNU / Linux.

Installation sur Windows
------------------------

Via PowerShell
^^^^^^^^^^^^^^
.. code::

    $ iwr https://deno.land/x/install/install.ps1 -useb | iex

Via Chocolatey_
^^^^^^^^^^^^^^^
.. code::

    $ choco install deno

Via Scoop_
^^^^^^^^^^
.. code::

    $ scoop install deno

Installation sur Mac
--------------------

Via un Shell
^^^^^^^^^^^^
.. code::

    $ curl -fsSL https://deno.land/x/install/install.sh | sh

Via un Homebrew
^^^^^^^^^^^^^^^
.. code::

    $ brew install deno

Installation sur GNU / Linux
----------------------------
.. code::

    $ curl -fsSL https://deno.land/x/install/install.sh | sh

À partir du code source
-----------------------
.. code::

    $ cargo install deno

Serveur HTTP
------------
Script très fortement inspiré de la section *Getting Started* du site officiel de Deno_.

Code source
^^^^^^^^^^^
.. include:: ../../downloads/deno-fr-server.ts
    :code: TypeScript

Vous pouvez télécharger ce script `ici <{static}/downloads/deno-fr-server.ts>`_.

Exécution
^^^^^^^^^
Pour que ce script fonctionne il faut autoriser l'accée au port 8080 de l'hôte local :

.. code::

    $ deno run --allow-net=localhost:8080 deno-fr-server.ts
    Compile file:///<Dossier contenant le script>/deno-fr-server.ts
    Download https://deno.land/std@0.50.0/http/server.ts
    Download https://deno.land/std@0.50.0/encoding/utf8.ts
    Download https://deno.land/std@0.50.0/io/bufio.ts
    Download https://deno.land/std@0.50.0/testing/asserts.ts
    Download https://deno.land/std@0.50.0/async/mod.ts
    Download https://deno.land/std@0.50.0/http/_io.ts
    Download https://deno.land/std@0.50.0/io/util.ts
    Download https://deno.land/std@0.50.0/path/mod.ts
    Download https://deno.land/std@0.50.0/path/win32.ts
    Download https://deno.land/std@0.50.0/path/posix.ts
    Download https://deno.land/std@0.50.0/path/common.ts
    Download https://deno.land/std@0.50.0/path/separator.ts
    Download https://deno.land/std@0.50.0/path/interface.ts
    Download https://deno.land/std@0.50.0/path/glob.ts
    Download https://deno.land/std@0.50.0/path/_constants.ts
    Download https://deno.land/std@0.50.0/path/_util.ts
    Download https://deno.land/std@0.50.0/fmt/colors.ts
    Download https://deno.land/std@0.50.0/testing/diff.ts
    Download https://deno.land/std@0.50.0/path/_globrex.ts
    Download https://deno.land/std@0.50.0/async/deferred.ts
    Download https://deno.land/std@0.50.0/async/delay.ts
    Download https://deno.land/std@0.50.0/async/mux_async_iterator.ts
    Download https://deno.land/std@0.50.0/textproto/mod.ts
    Download https://deno.land/std@0.50.0/http/http_status.ts
    Download https://deno.land/std@0.50.0/bytes/mod.ts
    http://localhost:8080

On peut voir que Deno_ compile le script puis télécharge tout les modules de la bibliothéque utilisés par celui-ci.

.. hint::
    On peut voir aussi que un URL est utilisé pour spécifié le chemin vers le fichier source.
    C'est parce que Deno_ peut télécharger et compiler des scripts distants via le protocole HTTP(S).

.. tip::
    Si vous relancez le script, vous pouvez voir que Deno_ ne va pas retélécharger les dépendances.
    Sauf si vous spécifiez le drapeau ``--reload`` ou ``--reload=<...liens vers les modules>``.

.. note::
    Si vous voulez autoriser une autre interface ou un autre port il vous suffit de changer la valeur du drapeau ``--allow-net``.
    Vous pouvez aussi ne pas spécifier d'hôte si vous voulez permettre l'utilisation de tout les ports et les hôtes.

Si vous le lancer sans autoriser l'accée au réseau vous aurez la sortie suivante :

.. code::

    $ deno run deno-server.ts
    error: Uncaught PermissionDenied: network access to "localhost:8000", run again with the --allow-net flag
        at unwrapResponse ($deno$/ops/dispatch_json.ts:43:11)
        at Object.sendSync ($deno$/ops/dispatch_json.ts:72:10)
        at Object.listen ($deno$/ops/net.ts:51:10)
        at listen ($deno$/net.ts:152:22)
        at serve (https://deno.land/std@0.50.0/http/server.ts:261:20)
        at file:///D:/home/loic/Documents/git/pelican/content/articles/deno/server.ts:5:11

.. hint::
    Pour le moment, un script ne peut pas demander à l'utilisateur une autorisation d'accée au système.

.. [1] Article (en anglais) sur le blog officiel de Deno : https://deno.land/v1.
.. |6e| replace:: 6\ :sup:`e`
.. |1ere| replace:: 1\ :sup:`ère`
.. _`JavaScript`: https://developer.mozilla.org/fr/docs/Web/JavaScript
.. _`Node`: https://fr.wikipedia.org/wiki/Node.js
.. _`V8`: https://fr.wikipedia.org/wiki/V8_(moteur_JavaScript)
.. _`Chromium`: https://fr.wikipedia.org/wiki/Chromium
.. _`require`: https://nodejs.org/fr/knowledge/getting-started/what-is-require/
.. _`npm`: https://www.npmjs.com/
.. _`ES6`: #es6-la-grosse-mise-a-jour
.. _`What the heck is the event loop anyway?`: https://youtu.be/8aGhZQkoFbQ
.. _`ECMA`: https://www.ecma-international.org/
.. _`ECMAScript (ES)`: https://fr.wikipedia.org/wiki/ECMAScript
.. _`import`: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/import
.. _`export`: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/export
.. _`Promise`: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise
.. _`async`: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/async_function
.. _`await`: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/await
.. _`cette représentation`:
.. _`10 Things I Regret About Node.js (10 choses que je regrette à propos de Node.js)`: https://youtu.be/M3BM9TB-8yA
.. _`node-gyp`: https://github.com/nodejs/node-gyp
.. _`Python`: https://fr.wikipedia.org/wiki/Python_(langage)
.. _`gyp`: https://gyp.gsrc.io/
.. _`FFI`: https://en.wikipedia.org/wiki/Foreign_function_interface
.. _`ctypes`: https://docs.python.org/3/library/ctypes.html
.. _`GN`: https://gn.googlesource.com/gn/
.. _`Github`: https://fr.wikipedia.org/wiki/GitHub
.. _`Rust`: https://fr.wikipedia.org/wiki/Rust_(langage)
.. _`Go`: https://fr.wikipedia.org/wiki/Go_(langage)
.. _`section esm de la documentation de Node`: https://nodejs.org/api/esm.html
.. _`Java`: https://fr.wikipedia.org/wiki/Java_(langage)
.. _`fs-extra`: https://www.npmjs.com/package/fs-extra
.. _`fs`: https://nodejs.org/api/fs.html
.. _`util.promisify`: https://nodejs.org/api/util.html#util_util_promisify_original
.. _`Deno`: https://en.wikipedia.org/wiki/Deno_(software)
.. _`TypeScript`: https://fr.wikipedia.org/wiki/TypeScript
.. _`Tokio`: https://tokio.rs/
.. _`dépot github de Deno`: https://github.com/denoland/deno
.. _`Webpack`: https://webpack.js.org/
.. _`Eslint`: https://eslint.org/
.. _`Chocolatey`: https://chocolatey.org/
.. _`Scoop`: https://scoop.sh/
