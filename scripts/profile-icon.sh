#!/bin/bash

echo_usage() {
    echo "Usage: ${0} [-c] IMG_NAME"
}

if [[  "${#}" -eq 0 ]] || [[ "${#}" -gt 2 ]]
then
    echo_usage
    exit 1
fi

abs_dir="$(dirname $(realpath ${0}))"
img_dir="${abs_dir}/../content/images"
img_name=""
copy="false"

while [[ "${#}" -ne 0 ]]
do
  case $1 in
        "-c")
            copy="true"
            ;;
        *)
            img_name="${1}"
            ;;
    esac
  shift
done

if [[ -z "${img_name}" ]]
then
    echo_usage
    echo "Missing required parameter: IMG_NAME"
    exit 1
fi

img_file="${img_dir}/${img_name}"

if [[ "${copy}" == "true" ]]
then
    cp -v "${img_file}" "${img_file}.old"
fi

mogrify -quality "90%" -resize 280 -filter Lanczos -interlace Plane -gaussian-blur 0.05 "${img_file}"
convert -resize 16x16 "${img_file}" "${img_dir}/favicon.ico"
