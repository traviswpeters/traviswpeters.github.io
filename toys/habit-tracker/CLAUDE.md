# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

45-Intentional Tracker - A single-file habit tracking web application built with vanilla JavaScript, HTML, and CSS. The app tracks daily habits across 8 categories with a focus on the 45 Day Challenge starting from October 15, 2024.

## Vision

- Robust, fine-tunable habit tracking that doesn't suck.
- Always simple, secure, browser-first app. We value no lock-in, like apps like Obsidian. You own your data. We don't want it. 

## Architecture

This is a client-side only application consisting of a single `index.html` file (2132 lines) that contains:
- All HTML structure
- Embedded CSS styles (lines 7-684)
- Embedded JavaScript (lines 872-2130)
- No external dependencies or build process
- All data stored in browser localStorage

## Development Commands

Since this is a static HTML file with no build process:
- **Run locally**: Open `index.html` directly in a browser or use a local server: `python3 -m http.server 8000` or `npx serve .`
- **Test**: Manual testing in browser (no test framework)
- **Deploy**: Upload the single HTML file to any static hosting

## Key Application Components

### Data Structure
- Daily data stored with keys: `day-YYYY-MM-DD` in localStorage
- Habit notes stored with keys: `note-YYYY-MM-DD-habitName`
- Habit order preference stored in `habitOrder` key

### Core Habits Tracked
1. **Active Time** - 30 minutes x2 daily (checkboxes: active1, active2)
2. **Water** - 25oz x4 daily (checkboxes: water1-water4)
3. **Alcohol** - No alcohol (single checkbox)
4. **Diet** - Healthy eating (single checkbox)
5. **Weight** - Daily tracking with numeric input
6. **Reading** - 15 minutes daily
7. **Scripture** - 10 minutes daily
8. **Prayer** - 10 minutes daily

### Main Features
- Date navigation with calendar picker
- Drag-and-drop habit reordering
- Per-habit notes functionality
- Import/Export data as JSON
- Statistics view with 7/30/All-time ranges
- Daily gains and goals tracking (3 of each)
- Progress visualization with completion indicators

## Important Implementation Details

- All event handlers are inline onclick attributes in HTML
- Drag-and-drop uses HTML5 Drag API with data-habit attributes
- Date handling uses ISO format (YYYY-MM-DD) consistently
- Modal dialogs are implemented as hidden divs toggled via display property
- Export creates a JSON blob download, import uses FileReader API

## TODOs / Feature Roadmap
- Refactor simple codebase into more logical, reusable components. 
- Implemtn as an offline-capable PWA (progressive web app) that fully runs in the browser.
- Implement Journal feature. Select a habit and open a view that allows you to scroll back through that activity and any journal notes. 
- Rebrand as a generic habit tracking app (nix mentions of 45-Intentional, etc.)
- Implement 'Challenges' that allow you to specify a date range and a series of habits. 
- Implement a 'Settings' feature. Settings enable users to add/remove/edit habits and what is tracked (checkboxes, numeric values, etc.)