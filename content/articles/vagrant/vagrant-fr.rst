=======
Vagrant
=======

:date: 2019-10-20 19:59:58
:modified: 2019-10-20 20:00:03
:category: Développement
:tags: virtualisation, développement, virtualbox, vagrant, linux, windows
:slug: vagrant
:lang: fr
:authors: Penaud Loïc
:summary: Pourquoi Vagrant c’est bien et comment l’installer et l’utiliser
:cover: images/vagrant-cover.png

.. figure:: /images/vagrant-logo.svg    

Vagrant est un outil puissant pour les développeurs surtout lorsqu’on sait s’en servir.

Cet article a pour but de vous faire savoir pourquoi j’ai commencé à utiliser Vagrant et à faire un tour d’horizon sur les fonctionnalités qu’il propose.

------------------

.. contents::
    :depth: 3
    :backlinks: top

------------------

---------------------
Pourquoi l’utiliser ?
---------------------

Le problème initial
===================

Bien que je sois un très grand fan de GNU / Linux parfois j’utilise Windows.
Cependant, je n’apprécie pas Windows en tant que système d’exploitation pour faire du développement
et j’ai trouvé très vite lourd le fait de devoir passer d’un système d’exploitation à un autre à l’aide d’un amorçage double [1]_.

La solution
===========

Vagrant permet de créer facilement une machine virtuelle sur VirtualBox et plein d’autre hyperviseur.
Ce qui me permet de développer sur GNU / Linux, le tout en étant sur Windows.

De plus à l’aide d’un fichier qu’on appelle ``Vagrantfile`` on peut configurer facilement la machine virtuelle.

--------------------
Comment l’utiliser ?
--------------------

Première étape – Installations
==============================

GNU / Linux
-----------
Si vous êtes sur un système GNU / Linux utiliser votre gestionnaire de paquets en administrateur afin d’installer VirtualBox et Vagrant.

Windows
-------

VirtualBox
``````````

Pour installer VirtualBox, il suffit d’aller sur le site officiel de VirtualBox à cette adresse : https://www.virtualbox.org/wiki/Downloads

Puis de choisir la bonne version pour votre système d’exploitation.

Ou vous utiliser chocolatey_ avec la commande suivante :

.. code::

    $ choco install virtualbox

.. note:: 

    Au vu de se prémunir d’un problème d’encodage,
    lancer VirtualBox puis aller dans le menu fichiers,
    puis changer le dossier par défaut des machines vers un dossier sans espace ni accent à la racine de l’un de vos lecteurs.


Vagrant
```````

Pour installer Vagrant, il suffit d’aller sur le site officiel de Vagrant à cette adresse : https://www.vagrantup.com/downloads.html

Puis de choisir la bonne version pour votre système d’exploitation.

Ou vous utiliser chocolatey_ avec la commande suivante :

.. code::

    $ choco install vagrant

.. note:: 

    Au vu de se prémunir d’un problème d’encodage,
    rajouter la variable suivante dans votre environnement ``VAGRANT_HOME=<chemin vers un dossier sans espace ni accent à la racine de l’un de vos lecteurs>``.


Seconde étape – Initialisation
==============================

Il faut choisir une Vagrant Boxes qui est un système d’exploitation pré-configuré il en existe plein.
Dans notre exemple on choisira la boîte ``ubuntu/bionic64`` qui est la dernière version LTF d’ubuntu [2]_.

Puis il suffit de taper la commande suivante dans le répertoire de votre choix :

.. code::

    $ vagrant init ubuntu/bionic64

Cette commande devra générer un fichier nommé ``Vagrantfile``.

Troisième étape – Lancement
===========================

Une fois que vous avez votre ``Vagrantfile``, vous pouvez taper la commande suivante dans le même répertoire afin de lancer la machine virtuelle :

.. code::

    $ vagrant up

La première fois ça prend toujours un peu plus de temps, car Vagrant télécharge la boîte.

Quatrième étape – Communication
===============================

Une fois que votre machine virtuelle c’est bien initialisé.
Vous pouvez communiquer avec elle.

Par ssh
-------

Vous pouvez lancer la commande suivante afin de communiquer en ssh avec la machine virtuelle :

.. code::

    $ vagrant ssh

Via le répertoire partagé
-------------------------

En allant listant le contenu du répertoire ``/vagrant`` de votre machine virtuelle vous pouvez constater qu’il y a les même fichiers que sur votre machine.
Les machines créées par Vagrant, partage toujours le dossier où il y a le ``Vagrantfile`` de votre machine hôte.

Donc si vous créez un fichier dans ce répertoire il sera automatiquement partagé entre la machine hôte et virtuelle.

Cinquième étape – Configuration
===============================

Maintenant nous allons voir des fonctionnalités que propose Vagrant grâce au ``Vagrantfile``.
En effet avoir une belle machine virtuelle c’est bien mais configurée directement c’est mieux.
Cela vous permet de rajouter à vos projets le fichier ``Vagrantfile`` qui permettra aux développeurs
et à vous-même d’avoir un environnement de développement prêt même si vous changez d’ordinateur.

.. caution::

    Pour prendre au compte les modifications du ``Vagrantfile`` il faudra que vous redémarriez votre machine virtuelle à l’aide de la commande suivante :
    
    .. code

        $ vagrant reload

Redirection de port
-------------------

L’un des points pratique de Vagrant c’est qu’on peut facilement faire de la redirection de port.

C’est d’ailleurs l’une des premières chose que fait Vagrant après avoir allumé votre machine.
Pour le vérifier vous pouvez taper cette ligne de votre terminale :

.. code::

    $ ssh vagrant@localhost -p 2222 -i .vagrant/machines/default/virtualbox/private_key

Logiquement vous vous êtes connecté à votre machine virtuelle.
En effet, Vagrant créer une redirection de port sur l’hôte local [3]_ au port 2222 vers le port 22 de la machine virtuel pour communiquer en ssh.
Comme l’indiquer sur le schéma suivant :

.. raw:: html

    <div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;lightbox&quot;:false,&quot;nav&quot;:true,&quot;zoom&quot;:1.5,&quot;resize&quot;:true,&quot;toolbar&quot;:&quot;zoom&quot;,&quot;edit&quot;:&quot;_blank&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;Electron\&quot; modified=\&quot;2019-10-19T16:19:50.687Z\&quot; agent=\&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/12.1.0 Chrome/76.0.3809.139 Electron/6.0.7 Safari/537.36\&quot; etag=\&quot;KADBMBf9bEnTG8wHOt1E\&quot; version=\&quot;12.1.0\&quot; type=\&quot;device\&quot; pages=\&quot;2\&quot;&gt;&lt;diagram name=\&quot;Step-1\&quot; id=\&quot;yfRgNmL5UC6R6sA0enTj\&quot;&gt;5VbJbtswEP0aHWto8Zaj1y5o0MVFmxwZaSwRoEWBoi0pX9+hSGqxjLopkqLLxZh5Jocz782QcoLVoXwtSJbc8giY47tR6QRrx/fnXoC/Cqg0MJ65GogFjTTktcCOPoIB7bIjjSDvLZScM0mzPhjyNIVQ9jAiBC/6y/ac9U/NSAwDYBcSNkS/0Ugmpix/1uJvgMaJOXkyN/UeiF1rCskTEvGiAwUbJ1gJzqW2DuUKmKLO0pK5n6W7udm+PX2C/P27bVLA6ZUOtn3KlqYCAal83tC+Dn0i7GjouiVhQlNw/CnDs5YPAq1YWV+pkEfVGjUXsrL84ikoJTrLIqESdhkJ1T8FNhNiiTww9Dw0SZ5pffe0BExqac4GIaE80+pKpV5DP3Yt8ANIUeE+27JGsKrvFq36ntU06SjfgMR0XNxEbmlFwzD7BJaDAcsfRERTIuEo/gI+x+M/jdDxgNAhjWm0ULcHeilPoU8dsiGqO3Rc69x3nXXZ8yrrlVTe2Qho33fwdoty7A6dFUSDG+pn9MBy+FGEcH18JREx/ChecFlfAYxIeuond0kss/Ujp5h20xfeWV80jWFD6PzNru7VdBYocK8E0gUOAtW909Tz6+00GbRTnieDjsKpkv02EpDTR/JQL1ByZyrBOuXJ0pms1YweJc/1k1iPLKNxijaDvQqlRpXiS7UwsORqxHOceJrGX5SzxlZ/ucE+5306HOzgwly/2FhPBzp47mg+ckc4dYsLM/7vKeJdf7vmv1MR+xHXkYRx5Cfhuaw1+S9UCWZXVbl5HlXQbT8o9fXWfpQHm+8=&lt;/diagram&gt;&lt;/mxfile&gt;&quot;}"></div>


Redirection de l’hôte local de votre machine
````````````````````````````````````````````

Vous pouvez rajouter rediriger d’autres ports de la machine virtuelle.

Imaginons que votre application utilise le port 8000 avec le protocole http et que vous souhaitez y accéder à l’adresse suivante : ``localhost:8000``

Décommentez la ligne 31 de votre ``Vagrantfile`` :

.. code-block:: ruby

    config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

Cette ligne signifie que le port 80 de votre machine virtuelle va être redirigé sur le port 8080 de l’hôte local.
Il suffit donc de changer l’argument ``guest`` et ``host`` par 8000.

.. caution::

    Votre application sur votre machine virtuelle ne doit pas écouter que l'hôte local.
    Il faut qu’elle écoute son adresse publique.
    La solution la plus simple est de changer l’adresse d’écoute par l’adresse ``0.0.0.0`` si ce n’est pas déjà fait.

Vous devriez avoir donc cette ligne :

.. code-block:: ruby

    config.vm.network "forwarded_port", guest: 8000, host: 8000, host_ip: "127.0.0.1"

.. raw:: html

    <div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;lightbox&quot;:false,&quot;nav&quot;:true,&quot;zoom&quot;:1.5,&quot;resize&quot;:true,&quot;toolbar&quot;:&quot;zoom&quot;,&quot;edit&quot;:&quot;_blank&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;Electron\&quot; modified=\&quot;2019-10-19T16:20:17.375Z\&quot; agent=\&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/12.1.0 Chrome/76.0.3809.139 Electron/6.0.7 Safari/537.36\&quot; etag=\&quot;NJltfC1CAG6-4ZeZadw3\&quot; version=\&quot;12.1.0\&quot; type=\&quot;device\&quot; pages=\&quot;2\&quot;&gt;&lt;diagram name=\&quot;Step-2\&quot; id=\&quot;c131klW8t6bT565_GznW\&quot;&gt;5VjbTuMwEP2aPFLFcdIkj73A7mqFWIm9AG+mcRNLaRw5Lk35+h03dtLUFQVEq136UnlO7bHnnLlAHTxZ1F8EKbNrntDc8dykdvDU8bwIYfhUwLoB/NBtgFSwpIFQB9yyZ6pBs23JElr1NkrOc8nKPjjjRUFnsocRIfiqv23O8/6tJUmpBdzOSG6jf1giMx2WF3b4V8rSTN8cRDreBTF7dSBVRhK+2oLwpYMngnPZrBb1hOaKOkNLSMPvV6O5wOzy4QI9ZPHNt18XjbOrtxxpIxC0kB/r2mtcP5F8qem6JrOMFdTxhjncNX4UsErV6jcTcqlSY8OFXBt+4RaQEozxKmOS3pZkpr5ZQTIBlslFDhaCJanKRt85qyk8aqzvpkLSekerA5Giln7IWsoXVIo1nDMpqwVb981Vpz4ymmZbyrcg0RmXtp47WmGhmX0Dy9hi+UYkrCCSLsV/wKfv/2uE+hahNo1FMlLdA6yCF7RPHbAh1ndguMa43zamdc9aG6tm8s54gPX9Ft4dUYY50byKJlaHeo0eEA5fihk9XL6SiJS+5A/v11fQnEj21H/cPrH00R+cwbPbvEA7edEmhnHRvF+f2m5NO46we8BRE6DlaJM7bTzvT6ehlU5VlVkZBVUl+2kkaMWeyeNmg5K7VA/cPDkYO8FU1ehS8qoZiZuSzVlawDqnc+VKlSqDSTXSsOSqxCuoeFakP5UxhVQ/XmHv8j60CxvvqeujlXVo6YDcQTRwB1B1oz01/vkUQYdnV3RKRaKjNFr0jkaLzrnRRt7A94a+O4xChGIvDntJgqJwEIQ4iDHyosgNXfzONhzu9/PKa47cpM3/E1u5mElZnkFT8OKgL0RsdwX/lF0BoZcadeSasfK5VdkZnmjP9IxPqor9V3HOgaCMV3IzP89iguLw4AQ9rSrBi6qcSbHg4GTFAmb3m0wzfLrftfDlXw==&lt;/diagram&gt;&lt;/mxfile&gt;&quot;}"></div>

Étendre la portée de votre machine virtuelle
````````````````````````````````````````````

Si vous voulez que les autres machines de votre réseau puissent accéder elle aussi aux services de votre machine virtuelle vous pouvez modifier la ligne 26 :

.. code-block:: ruby

    config.vm.network "forwarded_port", guest: 8000, host: 8000

Dans ce cas, le port 8000 de votre machine virtuelle sera accessible via le port 8000 de votre ordinateur.

.. raw:: html

    <div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;lightbox&quot;:false,&quot;nav&quot;:true,&quot;zoom&quot;:1.5,&quot;resize&quot;:true,&quot;toolbar&quot;:&quot;zoom&quot;,&quot;edit&quot;:&quot;_blank&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;Electron\&quot; modified=\&quot;2019-10-19T16:27:54.784Z\&quot; agent=\&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/12.1.0 Chrome/76.0.3809.139 Electron/6.0.7 Safari/537.36\&quot; etag=\&quot;bvYsO9_oSJATClRZsn9X\&quot; version=\&quot;12.1.0\&quot; type=\&quot;device\&quot; pages=\&quot;3\&quot;&gt;&lt;diagram name=\&quot;step-3\&quot; id=\&quot;oYa7kyQJZyjASMcxxCIH\&quot;&gt;5VlNc5swEP01PpZBCLA4xnHSTqeddppO2xwVkEEtRoyQazu/visQ2CCP03qCm4+TpUVaSe/tW61hgi+Xm7eSltlHkbB84rnJZoLnE89DiATwoy3bxhK2hlTyxAzaGW74PTNG11hXPGFVb6ASIle87BtjURQsVj0blVKs+8MWIu+vWtKUWYabmOa29TtPVNZYiTfd2d8xnmZm5YDg5sGStmPNQaqMJmK9Z8JXE3wphVBNa7m5ZLnGroXl/Zvk9n79jVxXV1/KhPz6vGbqTePs+l+mdCeQrFCP69prXP+m+crA9ZHGGS/YxAtzWGt2J6GV6tY3LtVKx0aNhdq2+MIqQCV0ZuuMK3ZT0lg/WUM0gS1Tyxx6CJq0Kht+F3zDYFMzszaTim0GXD1wUtTBD2HLxJIpuYV5xotvCDMBS0x3vWMftZxme8x3RmoiLu0872CFhkH2H1DGFsqfZMILqthKPgs8nxqgKLRhS0D1pluIQuMnxapINDJzF3pCqkykoqD5ByFKg+FPptTW5Cy6UqKPMCuSC52Bdi7Bcs31XmuXAKrc/ugGQ+dWP3GCtjvf7I+cb01vAS4uRS5kvXWcUEYWMdgrJcUvtvckjAm7W3TU6jOeQCzgJFYyZsfG+SYzU5myYw7x4UiRLKeK/+7v7vFp95+3kMKBkDz3vyvJRtTG0VJBTyJGAm5PAg8IgG246nQD7ds9+26K7rQzxhaAd6b4N1M/Cw7b7gIDDQODDPhu9m9m7V/yA0cQYscdNQe0HNWx053n9HAKrHCqqsyKKJCV6oeRZBW/p3f1AE13qTdYbzmYTYK5Filk56pJ1LVmc54W0M7ZQrvSWuVQ810Ys9IZflaB5HmRfq3TPYT6eMoe4h7awsYHdD2arEOLB+Q6xHEdUN3FAY2/PEbQw1UgOScj01ESLToh0aLXnGh9z/G90HdDMkUo8qJpL0gQmTrBFAcRRh4h7tTFp6VhjA/7+ctlRk7SxArFTKnyFeQELwj6PER2UvDPmRSiY2mauG1V8KJJQYOrEx24O6NzktK+uNpjJRcAUCYqVd+er+L+xPjB+/O8rKCjrLwSsWD01MRi1zVwrTooJA56ilns1Fcvj09lEAyoxDaVCJ2Ty0Ml6Yt+q9ZWx20RvLfOf6uP8V/Wx94o9TF2Iyfy/dDFJCAugSgdFK6uEwVegKZBBFU0IqeVxx4KnIFjdxDUI5fAnv1K/gtLuGSx4qIYM1/FECZMPsuMZV0+aLT/1NDdfVhrSN99ncRXfwA=&lt;/diagram&gt;&lt;/mxfile&gt;&quot;}"></div>

Sinon vous pouvez aussi faire en sorte que votre machine virtuelle fasse partie de votre réseau, pour cela décommentez la ligne 40.

.. code-block:: ruby

    config.vm.network "public_network"

Maintenant votre machine virtuelle est considérée comme un appareil qui serait connecté à votre réseau.

.. raw:: html

    <div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph="{&quot;highlight&quot;:&quot;#0000ff&quot;,&quot;lightbox&quot;:false,&quot;nav&quot;:true,&quot;zoom&quot;:1.5,&quot;resize&quot;:true,&quot;toolbar&quot;:&quot;zoom&quot;,&quot;edit&quot;:&quot;_blank&quot;,&quot;xml&quot;:&quot;&lt;mxfile host=\&quot;Electron\&quot; modified=\&quot;2019-10-19T16:36:24.144Z\&quot; agent=\&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) draw.io/12.1.0 Chrome/76.0.3809.139 Electron/6.0.7 Safari/537.36\&quot; etag=\&quot;yivDdXJfRHfQ7YiqTWAv\&quot; version=\&quot;12.1.0\&quot; type=\&quot;device\&quot; pages=\&quot;4\&quot;&gt;&lt;diagram name=\&quot;page-4\&quot; id=\&quot;1MSpEVdIaEvBATusKa1R\&quot;&gt;5VjbcpswEP0aHutBEjc/xnbSTJtMO0mnTfKmgAC1GDFCju18fVcgwAQ3FzfO5DLjB+1aWknnnD3YWGQ6X32WtEhPRcQyC9vRyiIzC2PkYGzpjx2t60zQJBLJIzOpS5zzW2aStskueMTK3kQlRKZ40U+GIs9ZqHo5KqVY9qfFIuvvWtCEDRLnIc2G2V88UmlzC7/LHzOepGZnNyD1F3PazDUXKVMaieVGihxaZCqFUPVovpqyTGPXwELOji+vUurfnJzFX45Pb69i/PVTXezoKUvaG0iWq+ctbai8odnCwHVKw5TnzMJeBntNriWMEj36yaVaaG1UWKh1gy/sAlRCMFmmXLHzgob6myWoCXKpmmcQIRjSsqj5jfmKwaEmZm8mFVvd4eqBm6IWfpAtE3Om5BrWmSqOIawRrAmXHfuo4TTdYL5NUqO4pK3cwQoDg+wTUCYDlL/JiOdUsYV8E3i+NkCdIWoRNL0Jc5Fr+KRY5JEGZmZDJKRKRSJymp0IURgIfzOl1say6EKJPsAsjw60AXUlIXPE9VGrkjEMpyITsjoCiSgL4hDypZLiD9v4xgsDdh23DOmz7sAP3FcsZMjumecaf6UyYffVw9v5liyjit/0D/fs5LlvvRt6zfAKusEbADqEcSDlns7hFBdG1FVwuRnMVr1o3UQrri6aCjC+3Mh3S3TQrNi3+vEj1U/+U/1m6XfB4ditLpD9D2E0Jerzm1WbD+o7hbD3QKH6goNClXba++wuJ38gp7JMB4qCrlJ9GUlW8lt6XU3QdBf6gNWR3YnlznSPgsWWtdtWLZvxJIdxxmJdSrcqh99tByattE1PSuh4nic/Ks8G499fY9/F3Rs2NtnS13tr62DAAxrjEfKCERpB4x1safP3Rwp6xI85+yVZGe/FbNEOZos+stk6eORgz7G9wEfQFmO/pxIU+CPXJ+6YIBwEtm+T3ayYkO11HrnNno26+Ye9ocVUqeIDuAJ23T4R46EtOC/pCgg9YNaB3bjUuyYG3XmGoi0PUYRelBnnbTGz65/KPXBp95usfaO3By4h7F6k1f7YvY0kh38B&lt;/diagram&gt;&lt;/mxfile&gt;&quot;}"></div>

Installation des dépendances du projet
--------------------------------------

L’un des points pratique de Vagrant c’est que l’on peut exécuter des lignes de commande lors du premier démarrage de la machine.

En effet grâce à l’option ``config.vm.provision`` du ``Vagrantfile`` vous pouvez lancer des lignes de commande au démarrage de votre machine.

Par exemple vous pouvez rajouter les commandes suivantes pour installer NGINX :

.. code-block:: ruby

    config.vm.provision "shell", inline: <<-SHELL
      sudo apt-get update
      sudo apt-get install -y nginx
    SHELL

Ces lignes de commande devront s’éxécuter après l’installation de la machine virtuelle.
Si vous voulez les exécuter après, vous pouvez taper cette commande dans le terminal de votre ordinateur :

.. code::

    $ vagrant provision

Si vous avez un script shell déjà à votre disposition vous pouvez l’exécuter en remplaçant ce que nous avons fait plus tôt par :

.. code-block:: ruby

    config.vm.provision "shell", path: "script.sh"

Après l’installation de la machine virtuelle le fichier ``script.sh`` devra être exécuté.

.. _chocolatey: https://chocolatey.org/
.. [1] Un Amorçage double ou dual-boot permet à l’utilisateur d’installer plusieurs systèmes d’exploitation sur son ordinateur et d’en choisir un lors du démarrage.
.. [2] Une version LTS (Long Term Support, Support à long terme en français) d’Ubuntu garanti le support du système pendant 5 ans.
.. [3] L’hôte local ou localhost du machine est une adresse accessible uniquement par elle-même.

------------
Aide-mémoire
------------

Commandes
=========

- ``vagrant init <vagrant box>`` Crée le ``Vagrantfile`` avec la boîte que vous avez choisie.
- ``vagrant up`` Installe et / ou démarre la machine virtuelle configurée par le ``Vagrantfile``.
- ``vagrant reload`` Redémarrer la machine virtuelle configurée par le ``Vagrantfile``.
- ``vagrant halt`` Éteint la machine virtuelle configurée par le ``Vagrantfile``.
- ``vagrant destroy`` Supprime la machine virtuelle configurée par le ``Vagrantfile`` et l'éteint si ce n’est pas déjà fait.
- ``vagrant provision`` Éxecute le script post-installation de la machine virtuelle configurée par le ``Vagrantfile``.
- ``vagrant box update`` Met à jour la boîte spécifiée dans le fichier ``Vagrantfile``.

Vagrantfile
===========

- ``config.vm.box = "ubuntu/bionic64"`` Le nom de la boîte à installer.
- ``config.vm.box_check_update`` Si Vagrant doit vérifier si la boîte a des mises à jour disponible (``true`` / ``false`` par défaut ``true``).
- ``config.vm.network "forwarded_port"`` Configure une redirection de port de la machine virtuelle, voir : `Redirection de port`_.
- ``config.vm.network "private_network"`` Crée un réseau privé entre la machine virtuelle et l’hôte.
- ``config.vm.network "public_network"`` Permet à la machine virtuelle de rejoindre le réseau de l’hôte comme un appareil normal.
- ``config.vm.synced_folder <chemin vers un dossier de l’hôte> <chemin vers un dossier de la machine virtuelle>`` Permet de rajouter un nouveau dossier à synchroniser entre la machine virtuelle et l’hôte.
- ``config.vm.provision "shell", <inline | path>`` Script post-installation de la machine virtuelle soit un chemin fait un fichier script (sh) soit directement des instructions, voir : `Installation des dépendances du projet`_. 

.. raw:: html

    <script type="text/javascript" src="/js/viewer.min.js"></script>
