find . -type f -name '*.webp' -exec sh -c '
    name="${1%.*}"
    echo "$name"
    convert "$1" -resize 80% "${name}.webp"
' find-sh {} \;

