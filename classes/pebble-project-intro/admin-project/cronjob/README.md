## Description
Cronjob schedule clones for final projects from **GitLab**.

## Author
Rui Liu, Apr, 2017
Rui.Liu.GR@Dartmouth.edu

## File structure

```Bash
cronjobs
├── README.md
├── clone.sh            : the script to execute by cronjob
├── project.cron        : cronjob to clone
├── pullscript.sh
└── sharekey            : 'sharekey' owned by CS50
    ├── README.md
    ├── cs50-17s
    ├── cs50-17s.pub
    └── cs50git.sh
```

## Usage
  * Use `crontab project.cron` to install the cronjobs to clone the submissions from **GitLab** to `clones` directory

