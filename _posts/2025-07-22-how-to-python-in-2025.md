---
layout: post
title: "The Right Way to Python in 2025"
published: true
tags: [dev, python, tooling]
image:
  feature:
  teaser:
  credit:
---

Python development in 2025 doesn't have to be a pain—if you use the right tools. The new standard is [`uv`](https://github.com/astral-sh/uv), a lightning-fast, all-in-one Python toolchain that replaces pip, pipx, virtualenv, and more. Here’s how to get started and why you should switch.

## Why `uv`?
- **All-in-one**: Manages environments, dependencies, and scripts—no more juggling pip, venv, or pipx.
- **Blazing fast**: Written in Rust, so installs and builds are much quicker than legacy Python tools.
- **No bootstrap headaches**: Installs easily, even if your Python setup is broken.
- **Modern workflows**: Supports inline script dependencies and running tools without global installs.

## Installation
Install `uv` in seconds:

```bash
brew install uv
# or
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Everyday Python Tasks with `uv`

**Install a CLI tool from PyPI:**
```bash
uv tool install <package>
```

**Install your local project (for development):**
```bash
uv tool install .
```

**Run a tool or script without installing globally:**
```bash
uvx <package>
```

**Run a script with dependencies (no manual venv!):**
```bash
uv add --script myscript.py requests otherdep
# This adds metadata to your script so you can just:
uv run ./myscript.py
```

## Comparing uv vs. pip vs. pipx vs. virtualenv

| Task                                 | uv                              | pip                | pipx               | virtualenv         |
|--------------------------------------|---------------------------------|--------------------|--------------------|--------------------|
| Install a package globally           | `uv tool install <pkg>`         | `pip install <pkg>`| `pipx install <pkg>`| ✗                  |
| Install a CLI tool                   | `uv tool install <pkg>`         | ✗                  | `pipx install <pkg>`| ✗                  |
| Create a virtual environment         | `uv venv <env>`                 | ✗                  | ✗                  | `virtualenv <env>` |
| Activate a virtual environment       | `uv venv exec <env> <cmd>`      | ✗                  | ✗                  | `source <env>/bin/activate` |
| Install dependencies in a project    | `uv pip install -r requirements.txt` | `pip install -r requirements.txt` | ✗ | ✗ |
| Run a tool without global install    | `uvx <pkg>`                     | ✗                  | `pipx run <pkg>`   | ✗                  |
| Run a script with dependencies       | `uv add --script ...` + `uv run`| (manual venv + pip install) | ✗ | (manual venv + pip install) |
| Rebuild broken environments fast     | Yes                             | No                 | No                 | No                 |
| Written in Rust (speed)              | Yes                             | No                 | No                 | No                 |

**Legend:**
- `✗` = Not supported or not the main use case

## Alternatives & Further Reading
- **Inline script dependencies**: For quick scripts, [Simon Willison’s guide](https://simonwillison.net/2024/Dec/19/one-shot-python-tools/) shows how to declare dependencies right in your script.
- **MCP Python SDK**: See [core development rules](https://github.com/modelcontextprotocol/python-sdk/blob/main/CLAUDE.md#core-development-rules) for best practices—hint: they recommend `uv` too.

## In Summary
If you’re still using pip, pipx, or virtualenv, it’s time to upgrade. `uv` is the fastest, easiest way to manage Python in 2025—whether you’re a beginner or a pro. Try it on your next project and see the difference!
