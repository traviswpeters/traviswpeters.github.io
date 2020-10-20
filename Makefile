# Website Helper Makefile
# -> a bunch of phony targets to help me do things I do a lot...

.PHONY: help # Generate list of targets with descriptions
help:
	@echo "Makefile Targets:"
	@echo "-----------------"
	@grep '^.PHONY: .* #' Makefile | sed 's/\.PHONY: \(.*\) # \(.*\)/\1	# \2/' | expand -t10

.PHONY: local # run a local jekyll server
local:
	@jekyll serve --port 4001 --livereload-port 35729 &

.PHONY: show # show any running jekyll servers
show:
	@psgrep jekyll

.PHONY: kill # kill all currently running instances of ruby/jekyll
kill:
	-@killall 'ruby'
	#- @kill -9 `psgrep -n jekyll | awk '{print $$2}'`

.PHONY: clean # clean up some generated/tmp files
clean:
	rm -rf *~ #$(BUILD_DIR) #$(BUILD_FILE)
