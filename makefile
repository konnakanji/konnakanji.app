# Makefile for Konna Kanji

IPTABLES=@sudo iptables
IP6TABLES=@sudo ip6tables

# Determine the name of the platform
OSNAME=

ifeq ($(OS),Windows_NT)
	OSNAME = WINDOWS
else
	UNAME_S := $(shell uname -s)
	ifeq ($(UNAME_S),Linux)
		OSNAME = LINUX
	endif
	ifeq ($(UNAME_S),Darwin)
		OSNAME = OSX
	endif
endif

# Build targets:
ports:
ifeq ($(OSNAME),LINUX)
	$(IPTABLES) -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 4000
	$(IPTABLES) -t nat -A OUTPUT -o lo -p tcp --dport 443 -j REDIRECT --to-port 4001
	$(IP6TABLES) -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 4000
	$(IP6TABLES) -t nat -A OUTPUT -o lo -p tcp --dport 443 -j REDIRECT --to-port 4001
endif
ifeq ($(OSNAME),OSX)
	@echo "rdr pass inet proto tcp from any to any port 443 -> 127.0.0.1 port 4001" | sudo pfctl -ef -
endif

.PHONY: ports
