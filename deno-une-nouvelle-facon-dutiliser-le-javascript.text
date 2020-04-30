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
:cover: images/deno/deno_logo_3.svg

Le JavaScript a bien évolué depuis la création en 2010 de Node, ce qui n'est pas passé inaperçus par Ryan Dahl et son équipe.
C'est pourquoi avant de parler de Deno parlons un peu de l'évolution du JavaScript.

------------------

.. contents::
    :depth: 3
    :backlinks: top

------------------

---------------
Pourquoi Node ?
---------------

L'idée derière la création de Node était d'avoir un système asynchrones permettant de supporter un grand nombres d'entrées et de sorties (par exemple, les sockets ou les fichiers).

Donc, pour ça Ryan Dahl a utilisé V8_, le moteur JavaScript, développé par Google pour le projet Chromium_.
Puis, dans l'optique de simplier la vie des développeurs, il créa la fonction require_ permettant d'importer des modules et des fichiers JSON ou JavaScript.
Ensuite, il rajouta un gestionnaire de paquets npm_ permettant aux développeurs de partager leurs modules.
De plus, Node posséde une bibliothéque standard riche.

L'un des problèmes, c'est que le JavaScript a bien changé depuis 2010, surtout depuis ES6_.

.. hint:: Pourquoi le JavaScript ? La réponse est simple : la boucle d'événement.
    Cette boucle est un peu comme une vigile. Elle permet d'organiser l'éxecution des fonctions asynchrones.
    Je ne rentrerai pas dans les détails de celle-ci, puisqu'elle meriterait un article à elle seule.
    De plus, si vous êtes à l'aise avec l'anglais vous pouvez regarder la présentation `What the heck is the event loop anyway? | Philip Roberts | JSConf EU`_.

---------------------------
ES6 - La grosse mise-à-jour
---------------------------

Pour rappel, JavaScript suit les normes standards ECMAScript dictées par l'ECMA_ (European Association for Standardizing Information and Communication Systems). ECMA_ est une association d'industriel qui existe depuis 1961 qui proposes différentes normes et standards dans le domaines de l'informatique.

ECMAScript |6e| a fait 2 gros ajouts :

* Le système de module avec les mots-clés `import`_, `export`_.
* Le système des promesses asynchrones avec la classe `Promise`_. 

.. note::
    L'ES8 continue l'évolution des promesses en rajoutant d'autre méthodes en lien avec la classe `Promise`_ et en rajoutant les mots-clés async_ et await_ afin de simplifier encore plus, le système des promesses asynchrones, en éliminant l'utilisation des fonctions de rappelles (callback).

---------------------
Problème liées à Node
---------------------

C'est en 2018 que le créateur de Node, a fait une conférence qui s'appelle `10 Things I Regret About Node.js (10 choses que je regrette à propos de Node.js)`_ (sous-titre en français disponible) où Ryan Dahl expose les problèmes de Node liée à sa conception.

.. important:: 
    J'expose ici avec mes mots, l'avis de Ryan Dahl et de son équipe.
    Par contre, ma conclusion, mon avis.

Promise
=======
La bibliothéque standard de Node posséde de nombreuse fonctions asynchrones, le problème c'est qu'elles ne sont pas compatible avec les promesses.
Par conséquent, ces fonctions sont incompatibles avec la syntaxe async_ et await_.

.. hint:: 
    D'ailleurs dans la conférence, Ryan Dahl explique qu'il avait ajouté les promesses en juin 2009.
    Mais il les a supprimé en février 2010, car il voulait que son API, soit la plus simple possible.
    Il n'aurait pas pris cette décission s'il avait sus quel impact aurait les promesses dans le JavaScript d'aujourd'hui.

Sécurité
========
Node donne accées à tout imédiatement, aux système de fichier, aux ports réseaux...
Ce qui pose des problèmes puisque par exemple, via un scripts on imaginer quelqu'un qui copie des fichiers confidentiels (comme des clés SSH par exemple) et les envois via les interfaces réseaux.

.. hint:: 
    À noter que V8_ exécute le code dans une machine virtuelle, donc on pourrait restraintre l'accées au système.

Le système de compilation de module natifs GYP
==============================================
node-gyp_ est un système permettant de compiler des modules natifs programmer en `C`, `C++` pour pouvoir les utiliser en JavaScript.
Le problème de ce système c'est qu'il n'a pas été bien pensé, car :

* Plein de couche inutile (JSON, Python_, node-gyp_, gyp_) qui rajoute de la compléxité.
* Le fait qu'il n'est pas une interface de fonction étrangère (FFI_) qui permet aux développeur d'appeller une fonction à partir d'un fichier bibliothéque (``.dll`` pour Windows, ``.so`` pour GNU / Linux) comme en Python_ avec le module ctypes_.

.. hint::
    De plus, GYP_ vient du projet chromium_. Cependant, les développeurs de celui-ci ont arrêté de l'utiliser au profit de GN_.

Les système de modules 
======================
Le système de module CommonJS est celui utiliser par Node, cependant il n'a pas été développer ni standardisé par ECMA.

Donc ce système différe de son anolog embarqué dans les navigateurs web :

* Une résolution de chemin dynamique ce qui entraine des requêtes inutiles aux système de fichiers et l'utilisation du fichier package.json.
* Le fait qu'on doit pas préciser l'extention `.js` du fichier
* Le possibilité d'importer un dossier si celui-ci a un fichier ``index.js`` (ajouter aux système, car Ryan Dahl trouvait sa mignon)
* L'impossibilité d'utiliser une URL pour importer des modules.

.. hint::
    Les 3 premiers points, permettent de gagner en abstration superflues.

package.json
------------
Ce fichier permet d'avoir une descriptions du projet, la liste des dépendances du projet ainsi que leurs versions, des lignes de commandes et pleins d'autre informations qui ne sont pas forcément très utiles en tant que développeur.
Chaque projet Node doit obligatoirement avoir un fichier ``package.json`` donc l'utilisation de npm_ aussi, ce qui n'étais pas prévus.

De plus, les modules disponible via npm_ sont héberger de façon centralisé et privé.

node_modules
------------
Les problèmes de ``node_modules`` sont liée avec ceux de package.json_. Du fait du système de résolution de dépendances, le dossier ``node_modules`` a tendances à devenir très vite, très lourd.

.. figure:: images/deno-node_module-meme.jpg
    :alt: node_modules plus lourds qu'un trou noir ?
    :align: center
    
    Mème concernant la taille volumineuse du dossier ``node_modules``


.. |6e| replace:: 6\ :sup:`e`
.. _`V8`: https://fr.wikipedia.org/wiki/V8_(moteur_JavaScript)
.. _`Chromium`: https://fr.wikipedia.org/wiki/Chromium
.. _`require`: https://nodejs.org/fr/knowledge/getting-started/what-is-require/
.. _`npm`: https://www.npmjs.com/
.. _`ES6`: #es6-la-grosse-mise-a-jour
.. _`What the heck is the event loop anyway? | Philip Roberts | JSConf EU`: https://youtu.be/8aGhZQkoFbQ
.. _`ECMA`: https://www.ecma-international.org/
.. _`ECMAScript (ES)`: https://fr.wikipedia.org/wiki/ECMAScript
.. _`import`: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/import
.. _`export`: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/export
.. _`Promise`: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise
.. _`async`: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/async_function
.. _`await`: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/await
.. _`10 Things I Regret About Node.js (10 choses que je regrette à propos de Node.js)`: https://youtu.be/M3BM9TB-8yA
.. _`node-gyp`: https://github.com/nodejs/node-gyp
.. _`Python`: https://fr.wikipedia.org/wiki/Python_(langage)
.. _`gyp`: https://gyp.gsrc.io/
.. _`FFI`: https://en.wikipedia.org/wiki/Foreign_function_interface
.. _`ctypes`: https://docs.python.org/3/library/ctypes.html
.. _`GN`: https://gn.googlesource.com/gn/
