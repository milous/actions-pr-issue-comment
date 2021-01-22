#!/bin/bash

s="Issue: #128"
s="Issue: #2"

regex="Issue\: \#([[:digit:]]+)"
if [[ $s =~ $regex ]]; then
  echo "$s matches $regex"
  echo "${BASH_REMATCH[1]}"
else
  echo "$s doesn't match $regex"
fi


if [[ $s =~ $regex ]]; then
  echo "${BASH_REMATCH[1]}"
fi
