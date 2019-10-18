=======
Vagrant
=======

:date: 2019-10-17 19:18:42
:modified: 2019-10-17 19:21:04
:category: Développement
:tags: virtualisation, développement, virtualbox, vagrant, linux, windows
:slug: vagrant
:lang: fr
:authors: Penaud Loïc
:summary: Pourquoi Vagrant c’est bien et comment l’installer et l’utiliser

Vagrant est un outil puissant pour les développeurs surtout lorsqu’on sait s’en servir.

Cette article a pour but de vous faire savoir pourquoi j’ai commencé à utiliser Vagrant et à faire un tour d’horizon sur les fonctionnalités qu’il propose.

------------------

.. contents::
    :depth: 3

------------------

---------------------
Pourquoi l’utiliser ?
---------------------

Le problème initial
===================

Bien que je suis un très fan de GNU / Linux parfois j’utilise Windows.
Cependant, je n’apprécie pas Windows en tant que système d’exploitation pour faire du développement
et j’ai trouvé très vite lourd le fait de devoir passer d’un système d’exploitation à un autre à l’aide d’un amorçage double [1]_.

La solution
===========

Vagrant permet de créer facilement une machine virtuel sur VirtualBox et plein d'autre hyperviseur.
Ce qui me permet de développer sur GNU / Linux, le tout en étant sur Windows.

De plus à l’aide d’un fichier qu’on appelle ``Vagrantfile`` on peut configurer facilement la machine virtuelle.

--------------------
Comment l’utiliser ?
--------------------

Pour apprendre à utiliser Vagrant on prendra le ``Vagrantfile`` de ce blog en tant qu'exemple.

Première étape - Installations
==============================

GNU / Linux
-----------
Si vous êtes sur un système GNU / Linux utiliser votre gestionnaire de paquets en administrateur afin d'installer VirtualBox et Vagrant.

Windows
-------

VirtualBox
``````````

Pour installer VirtualBox, il suffit d'aller sur le site officiel de VirtualBox à cette adresse : https://www.virtualbox.org/wiki/Downloads

Puis de choisir la bonne version pour votre système d'exploitation.

Ou vous utiliser chocolatey_ avec la commande suivante :

.. code-block:: batch

    choco install virtualbox

.. attention:: Au vus de se prémunir d'un problème d'encodage, lancer VirtualBox puis aller dans le menu fichiers puis changer le dossier par défaut des machines vers un dossier sans espace ni accent à la racine de l'un de vos lecteurs.


Vagrant
```````

Pour installer Vagrant, il suffit d'aller sur le site officiel de Vagrant à cette adresse : https://www.vagrantup.com/downloads.html

Puis de choisir la bonne version pour votre système d'exploitation.

Ou vous utiliser chocolatey_ avec la commande suivante :

.. code-block:: batch

    choco install vagrant

.. attention:: Au vus de se prémunir d'un problème d'encodage, rajouter la variable suivante dans votre environnement ``VAGRANT_HOME=<chemin vers un dossier sans espace ni accent à la racine de l'un de vos lecteurs>`` 


Seconde étape - Initialisation
==============================

Il faut choisir une Vagrant Boxes qui est un système d'exploitation pré-configuré il en existe plein.
Dans notre exemple on choisira la boîte ``ubuntu/bionic64`` qui est la dernière version LTF d'ubuntu [2]_.

Puis il suffit de taper la commande suivante dans le répertoire de votre choix :

.. code-block:: shell

    vagrant init ubuntu/bionic64

Cette commande devra générer une fichier nommée ``Vagrantfile``.

Troisième étape - Lancement
===========================

Une fois que vous avez votre ``Vagrantfile``, vous pouvez taper la commande suivante dans le même répertoire afin de lancer la machine virtuelle :

.. code-block:: shell

    vagrant up

La première fois ça prend toujours un peu plus de temps, car Vagrant télécharge la boîte.

Quatrième étape - Communication
===============================

Une fois que votre machine virtuelle c'est bien initialisée.
Vous pouvez communiquer avec elle.

Par ssh
-------

Vous pouvez lancer la commande suivante afin de communiquer en ssh avec la machine virtuelle :

.. code-block:: shell

    vagrant ssh

Via le répertoire partagé
-------------------------

En allant listant le contenue du répertoire ``/vagrant`` de votre machine virtuelle vous pouvez constater qu'il y a les même fichiers que sur votre machine.
Les machines créées par Vagrant, partage toujours le dossier où il y a le ``Vagrantfile`` de votre machine hôte.

Donc si vous créez un fichier dans ce répertoire il sera automatiquement partagé entre la machine hôte et virtuelle.

Cinquième étape - Configuration
===============================

Maintenant nous allons voir des fonctionnalités que propose Vagrant grâce au ``Vagrantfile``.
En effet avoir une belle machine virtuelle c'est bien mais configurée directement c'est mieux.
Cela vous permettre de rajouter à vos projet le fichier ``Vagrantfile`` qui permettra aux développeur
et à vous même d'avoir un environnement de développement prêt même si vous changez d'ordinateur.

.. _chocolatey: https://chocolatey.org/
.. [1] Un Amorçage double ou dual-boot permet à l’utilisateur d’installer plusieurs systèmes d’exploitation sur son ordinateur et d’en choisir un lors du démarrage.
.. [2] Une version LTS (Long Term Support, Support à long terme en français) d'Ubuntu garanti le support du système pendant 5 ans.
