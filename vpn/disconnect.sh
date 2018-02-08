#!/bin/bash

IP=9.9.9.9

sudo sed -i -e "s/\(nameserver \).*/\1$IP/" /etc/resolv.conf
