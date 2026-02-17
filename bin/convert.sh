#!/bin/bash

shopt -s extglob globstar nullglob
shopt -u execfail failglob

function compress () {
  if [ $# -ne 3 ]; then
    printf "Usage: %s INPUT BACKGROUND_COLOR OUTPUT\n" "${FUNCNAME}" >&2
    return 1
  fi
  # Set background color
  # Paint background color
  # Remove all metadata
  # Progressive (optimise loading)
  # Blur a little
  # JPEG compression
  magick "${1}" \
    -background "${2}" \
    -flatten \
    -strip \
    -interlace Plane \
    -gaussian-blur 0.05 \
    -quality 85% \
    "${3}"
}

log_cmd() {
  local -a args=(${BASH_COMMAND})
  [ "$(type -t "${args[0]}")" != "file" ] && return 0
  echo "${BASH_COMMAND}"
}

# The DEBUG and RETURN traps are inherited by shell functions.
set -T
# Log commands
trap 'log_cmd' DEBUG

function main () {
  local srcdir="img"
  local pic name
  for pic in "${srcdir}"/*.{jpg,png}; do
    # Remove extension
    name="${pic%.*}"
    # Remove parents dirs
    name="${name##*/}"
    compress "${pic}" "hsl(221,14%,100%)" "build/img/${name}.light.jpg"
    compress "${pic}" "hsl(221,14%,9%)" "build/img/${name}.dark.jpg"
  done
}

main "$@"
