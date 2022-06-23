#!/bin/bash

for i in $(ls -d * | sed s/exportXpi.sh//g); do
  cd $i
  zip ../$i.xpi *
  cd ..
done
