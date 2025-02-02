#!/bin/bash

DOTENV=${1:-.env}

cat $DOTENV \
| sed -r 's/#.*//; /^\s*$/d' \
| xargs printf -- '--build-arg %s\n'