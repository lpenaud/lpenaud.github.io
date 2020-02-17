#!/bin/sh
sudo apt-get update
sudo apt-get install -y python3-pip subversion ghp-import python-pip python3-venv
sudo locale-gen fr_FR fr_FR.utf8 en_US
python3 -m venv venv
mkdir themes plugins
git clone https://github.com/alexandrevicenzi/Flex themes/Flex
svn export https://github.com/getpelican/pelican-plugins.git/trunk/i18n_subsites plugins/i18n_subsites
echo "To start execute:"
echo "source ./venv/bin/activate"
echo "pip install -r requirements.txt"
