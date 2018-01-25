CODEDROP=data/codedrop.dat
CODEDROPTEST=data/codedrop-test.dat

# By default, this Makefile will generate an html file plotting known code drop sites.
all: map

# Start filewriter to make a new code drop file(s)
file:
	@node filewriter

# Generate map.html
map:
	@node makemap.js
	@# cp map.html ~/public_html/map.html

# Make a single codedrop.dat file from all .dat files
dat:
	cat *.dat > $(CODEDROPTEST)
	@# cat *.dat > codedrop.dat

# Cleanup generated files
clean:
	rm -f log.txt
	rm -f map.html
	rm -f $(CODEDROPTEST)
