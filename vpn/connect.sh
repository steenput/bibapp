#!/bin/bash

IP=208.67.220.220

sudo sed -i -e "s/\(nameserver \).*/\1$IP/" /etc/resolv.conf
sudo openvpn --config vpn_nebis.conf
