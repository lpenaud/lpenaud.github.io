# lpenaud.github.io

[My website](https://lpenaud.github.io) powered by [Pelican](https://github.com/getpelican/pelican) - [Flex theme by Alexandre Vicenzi](https://github.com/alexandrevicenzi/Flex)

## Install

- Clone the repository: `git clone https://github.com/lpenaud/lpenaud.github.io.git`
- Create a virtual environment: `python -m venv venv`
- Activate the virtual environment:
    - In GNU / Linux: `source ./venv/bin/activate.sh`
    - In Windows: `./venv/activate.bat`
- Install dependencies: `pip install -r requirements.txt`
- Download plugins and theme: `invoke install`

## Run

- Serve articles (with automatic reload): `invoke serve`
- Open your favorite webbrowser and paste the given URL (by default `http://127.0.0.1:8000`) by the previous command

## Publish

To publish as Github page:

    $ invoke github

## Tasks

You can see all available tasks with the command:

    $ invoke -l

## TODO

- [ ] See how translate in template "This work is licensed under a"
- [x] Modify attention paragraph (See: https://github.com/alexandrevicenzi/Flex/pull/191)
- [ ] Add a button to come back on the top of the page
- [x] Modify table of content style (Add custom css)
