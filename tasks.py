# -*- coding: utf-8 -*-

import os
import shutil
import sys
import datetime
import asyncio

from invoke import task, run
from invoke.util import cd
from pelican.server import ComplexHTTPRequestHandler, RootedHTTPServer
from pelican.settings import DEFAULT_CONFIG, get_settings_from_file

SETTINGS_FILE_BASE = 'pelicanconf.py'
SETTINGS = {}
SETTINGS.update(DEFAULT_CONFIG)
LOCAL_SETTINGS = get_settings_from_file(SETTINGS_FILE_BASE)
SETTINGS.update(LOCAL_SETTINGS)

CONFIG = {
    'settings_base': SETTINGS_FILE_BASE,
    'settings_publish': 'publishconf.py',
    # Output path. Can be absolute or relative to tasks.py. Default: 'output'
    'deploy_path': os.path.abspath(SETTINGS['OUTPUT_PATH']),
    # Port for `serve`
    'port': 8000,
    'github_branch': 'master',
    'theme_repo': 'https://github.com/alexandrevicenzi/Flex.git',
}

@task
def clean(c):
    """Remove generated files"""
    if os.path.isdir(CONFIG['deploy_path']):
        shutil.rmtree(CONFIG['deploy_path'])
        os.makedirs(CONFIG['deploy_path'])

@task
def build(c):
    """Build local version of site"""
    c.run('pelican -s {settings_base}'.format(**CONFIG))

@task
def publish(c):
    """Build production version of site"""
    c.run('pelican -r -s {settings_publish}'.format(**CONFIG))

@task(pre=[build])
def serve(c):
    """Automatically reload browser tab upon file modification."""
    from livereload import Server
    from livereload.watcher import Watcher
    import glob
    class RecursiveWatcher(Watcher):
        def is_glob_changed(self, path, ignore=None):
            for f in glob.glob(path, recursive=True):
                if self.is_file_changed(f, ignore):
                    return True
            return False
    server = Server(watcher=RecursiveWatcher())
    # Watch the base settings file
    server.watch(CONFIG['settings_base'], lambda: build(c))
    # Watch content source files
    content_file_extensions = ['.rst']
    for extension in content_file_extensions:
        content_blob = '{0}/**/*{1}'.format(SETTINGS['PATH'], extension)
        server.watch(content_blob, lambda: build(c))
    # Watch the theme's templates and static assets
    theme_path = SETTINGS['THEME']
    server.watch('{}/templates/*.html'.format(theme_path), lambda: build(c))
    static_file_extensions = ['.css', '.js']
    for extension in static_file_extensions:
        static_file = '{0}/static/**/*{1}'.format(theme_path, extension)
        server.watch(static_file, lambda: build(c))
    # Serve output path on configured port
    server.serve(port=CONFIG['port'], root=CONFIG['deploy_path'])

@task(pre=[publish])
def github(c):
    """Upload the web site via gh-pages"""
    c.run('ghp-import -m "Generate Pelican site" -b {github_branch} {deploy_path}'.format(**CONFIG))
    c.run('git push origin {github_branch}'.format(**CONFIG))

@task
def install(c):
    """Download plugins and theme"""
    if 'win32' in sys.platform:
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    asyncio.run(_install())

async def _download_plugin(plugin: str):
    plugin_path = os.path.join(SETTINGS['PLUGIN_PATHS'][0], plugin)
    if os.path.isdir(plugin_path):
        shutil.rmtree(plugin_path)
    else:
        os.makedirs(plugin_path, exist_ok=True)
    proc = await asyncio.create_subprocess_shell('svn export https://github.com/getpelican/pelican-plugins.git/trunk/{} {}'.format(
        plugin,
        plugin_path,
    ), stdout=asyncio.subprocess.DEVNULL,)
    print("Downloading {}...".format(plugin))
    code = await proc.wait()
    print("Download of {} is finished".format(plugin))
    return code

async def _download_theme():
    themes_dir = os.path.normpath(SETTINGS['THEME'])
    os.makedirs(themes_dir, exist_ok=True)
    print("Downloading {} to {}...".format(CONFIG['theme_repo'], themes_dir))
    proc = await asyncio.create_subprocess_shell('git clone {} {}'.format(
        CONFIG['theme_repo'],
        themes_dir,
    ), stdout=asyncio.subprocess.DEVNULL, stderr=asyncio.subprocess.DEVNULL)
    code = await proc.wait()
    print("Download of {} is finished".format(themes_dir))
    return code

async def _install():
    plugins_dir = SETTINGS['PLUGIN_PATHS'][0]
    coroutines = (_download_plugin(p) for p in SETTINGS['PLUGINS'])
    return await asyncio.gather(*coroutines, _download_theme())
