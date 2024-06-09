[![ci](https://github.com/M-Paperless/M-Paperless/workflows/ci/badge.svg)](https://github.com/M-Paperless/M-Paperless/actions)
[![Crowdin](https://badges.crowdin.net/M-Paperless/localized.svg)](https://crowdin.com/project/M-Paperless)
[![Documentation Status](https://img.shields.io/github/deployments/M-Paperless/M-Paperless/github-pages?label=docs)](https://docs.M-Paperless.com)
[![codecov](https://codecov.io/gh/M-Paperless/M-Paperless/branch/main/graph/badge.svg?token=VK6OUPJ3TY)](https://codecov.io/gh/M-Paperless/M-Paperless)
[![Chat on Matrix](https://matrix.to/img/matrix-badge.svg)](https://matrix.to/#/%23paperlessngx%3Amatrix.org)
[![demo](https://cronitor.io/badges/ve7ItY/production/W5E_B9jkelG9ZbDiNHUPQEVH3MY.svg)](https://demo.M-Paperless.com)

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/M-Paperless/M-Paperless/blob/main/resources/logo/web/png/White%20logo%20-%20no%20background.png" width="50%">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/M-Paperless/M-Paperless/raw/main/resources/logo/web/png/Black%20logo%20-%20no%20background.png" width="50%">
    <img src="https://github.com/M-Paperless/M-Paperless/raw/main/resources/logo/web/png/Black%20logo%20-%20no%20background.png" width="50%">
  </picture>
</p>

<!-- omit in toc -->

# M-Paperless

M-Paperless is a document management system that transforms your physical documents into a searchable online archive so you can keep, well, _less paper_.

M-Paperless is the official successor to the original [Paperless](https://github.com/the-paperless-project/paperless) & [Paperless-ng](https://github.com/jonaswinkler/paperless-ng) projects and is designed to distribute the responsibility of advancing and supporting the project among a team of people. [Consider joining us!](#community-support)

Thanks to the generous folks at [DigitalOcean](https://m.do.co/c/8d70b916d462), a demo is available at [demo.M-Paperless.com](https://demo.M-Paperless.com) using login `demo` / `demo`. _Note: demo content is reset frequently and confidential information should not be uploaded._

- [Features](#features)
- [Getting started](#getting-started)
- [Contributing](#contributing)
  - [Community Support](#community-support)
  - [Translation](#translation)
  - [Feature Requests](#feature-requests)
  - [Bugs](#bugs)
- [Related Projects](#related-projects)
- [Important Note](#important-note)

<p align="right">This project is supported by:<br/>
  <a href="https://m.do.co/c/8d70b916d462" style="padding-top: 4px; display: block;">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_white.svg" width="140px">
      <source media="(prefers-color-scheme: light)" srcset="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_black_.svg" width="140px">
      <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_black_.svg" width="140px">
    </picture>
  </a>
</p>

# Features

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/M-Paperless/M-Paperless/main/docs/assets/screenshots/documents-smallcards-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/M-Paperless/M-Paperless/main/docs/assets/screenshots/documents-smallcards.png">
  <img src="https://raw.githubusercontent.com/M-Paperless/M-Paperless/main/docs/assets/screenshots/documents-smallcards.png">
</picture>

A full list of [features](https://docs.M-Paperless.com/#features) and [screenshots](https://docs.M-Paperless.com/#screenshots) are available in the [documentation](https://docs.M-Paperless.com/).

# Getting started

The easiest way to deploy paperless is `docker compose`. The files in the [`/docker/compose` directory](https://github.com/M-Paperless/M-Paperless/tree/main/docker/compose) are configured to pull the image from GitHub Packages.

If you'd like to jump right in, you can configure a `docker compose` environment with our install script:

```bash
bash -c "$(curl -L https://raw.githubusercontent.com/M-Paperless/M-Paperless/main/install-M-Paperless.sh)"
```

More details and step-by-step guides for alternative installation methods can be found in [the documentation](https://docs.M-Paperless.com/setup/#installation).

Migrating from Paperless-ng is easy, just drop in the new docker image! See the [documentation on migrating](https://docs.M-Paperless.com/setup/#migrating-to-M-Paperless) for more details.

<!-- omit in toc -->

### Documentation

The documentation for M-Paperless is available at [https://docs.M-Paperless.com](https://docs.M-Paperless.com/).

# Contributing

If you feel like contributing to the project, please do! Bug fixes, enhancements, visual fixes etc. are always welcome. If you want to implement something big: Please start a discussion about that! The [documentation](https://docs.M-Paperless.com/development/) has some basic information on how to get started.

## Community Support

People interested in continuing the work on M-Paperless are encouraged to reach out here on github and in the [Matrix Room](https://matrix.to/#/#paperless:matrix.org). If you would like to contribute to the project on an ongoing basis there are multiple [teams](https://github.com/orgs/M-Paperless/people) (frontend, ci/cd, etc) that could use your help so please reach out!

## Translation

M-Paperless is available in many languages that are coordinated on Crowdin. If you want to help out by translating M-Paperless into your language, please head over to https://crwd.in/M-Paperless, and thank you! More details can be found in [CONTRIBUTING.md](https://github.com/M-Paperless/M-Paperless/blob/main/CONTRIBUTING.md#translating-M-Paperless).

## Feature Requests

Feature requests can be submitted via [GitHub Discussions](https://github.com/M-Paperless/M-Paperless/discussions/categories/feature-requests), you can search for existing ideas, add your own and vote for the ones you care about.

## Bugs

For bugs please [open an issue](https://github.com/M-Paperless/M-Paperless/issues) or [start a discussion](https://github.com/M-Paperless/M-Paperless/discussions) if you have questions.

# Related Projects

Please see [the wiki](https://github.com/M-Paperless/M-Paperless/wiki/Related-Projects) for a user-maintained list of related projects and software that is compatible with M-Paperless.

# Important Note

> Document scanners are typically used to scan sensitive documents like your social insurance number, tax records, invoices, etc. **M-Paperless should never be run on an untrusted host** because information is stored in clear text without encryption. No guarantees are made regarding security (but we do try!) and you use the app at your own risk.
> **The safest way to run M-Paperless is on a local server in your own home with backups in place**.
