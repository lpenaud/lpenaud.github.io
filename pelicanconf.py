#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals
from datetime import datetime

PORT = 8000
BIND = '0.0.0.0'

AUTHOR = 'Loïc Penaud'
SITENAME = AUTHOR
SITETITLE = AUTHOR
SITEURL = 'http://localhost:8000'
SITESUBTITLE = 'Développeur Back-end'
SITEDESCRIPTION = 'Site d\'article sur l\'informatique'

SITELOGO = SITEURL + '/images/profile.jpg'
FAVICON = SITEURL + '/images/favicon.ico'

THEME = 'themes/Flex'
ROBOTS = 'index, follow'
LINKS_IN_NEW_TAB = 'external'
BROWSER_COLOR = '#333'
PYGMENTS_STYLE = 'manni'
THEME_COLOR_AUTO_DETECT_BROWSER_PREFERENCE = True
THEME_COLOR_ENABLE_USER_OVERRIDE = True
PYGMENTS_STYLE_DARK = "monokai"

COPYRIGHT_YEAR = datetime.now().year
COPYRIGHT_NAME = AUTHOR
CC_LICENSE = {
    'name': 'Creative Commons Attribution-ShareAlike',
    'version': '4.0',
    'slug': 'by-sa',
}

MAIN_MENU = True

PATH = 'content'
STATIC_PATHS = ['images', 'js', 'downloads']

TIMEZONE = 'Europe/Paris'

PLUGIN_PATHS = ['plugins']
PLUGINS = ['i18n_subsites', 'neighbors', 'pelican-toc']
TOC = {
    'TOC_INCLUDE_TITLE': 'false',
}
TOC_FLOAT = 'right'

# Translate template
I18N_TEMPLATES_LANG = 'en'
DEFAULT_LANG = 'fr'
OG_LOCALE = 'fr_FR'
LOCALE = 'fr_FR'
JINJA_ENVIRONMENT = {
    'extensions': ['jinja2.ext.i18n'],
}

I18N_SUBSITES = {
    'en': {
        'SITESUBTITLE': 'Back-end Developer',
        'LOCALE': 'en_US',
        'OG_LOCALE': 'en_US',
    }
}

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
#LINKS = ()

# Social widget
SOCIAL = (
    ('envelope', 'mailto:l.penaud@zaclys.net'),
    ('github', 'https://github.com/lpenaud'),
    ('linkedin', 'https://www.linkedin.com/in/lo%C3%AFc-penaud-296067129/'),
    ('twitter', 'https://twitter.com/LoicPenaud'),
)

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

OUTPUT_SOURCES = True
OUTPUT_PATH = "public"

# TODO: Add language buttons ?
# languages_lookup = {
#     'en': 'English',
#     'fr': 'Français',
# }

# def lookup_lang_name(lang_code):
#     return languages_lookup[lang_code]


# def my_ordered_items(dict):
#     items = list(dict.items())
#     # swap first and last using tuple unpacking
#     items[0], items[-1] = items[-1], items[0]
#     return items

# JINJA_FILTERS = {
#     'lookup_lang_name': lookup_lang_name,
#     'my_ordered_items': my_ordered_items,
# }