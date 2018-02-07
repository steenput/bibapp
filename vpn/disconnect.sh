#!/bin/bash

IP=192.168.1.1

sudo sed -i -e "s/\(nameserver \).*/\1$IP/" /etc/resolv.conf
