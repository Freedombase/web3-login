# freedombase:web3-login

Template package with CI and everything else to get started quickly with creating a new FOSS Meteor package.

[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
![GitHub](https://img.shields.io/github/license/freedombase/web3-login)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/freedombase/web3-login.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/freedombase/web3-login/context:javascript) ![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/freedombase/web3-login?label=latest&sort=semver) [![](https://img.shields.io/badge/semver-2.0.0-success)](http://semver.org/spec/v2.0.0.html) <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## ALPHA stage

This package is in active development and is bare bones. Do not use in production. Yet!

## Getting started

### Install

```shell
meteor add freedombase:web3-login
```

## Settings

To set up additional providers beside Metamask add them to your `settings.json`:

```json
{
  "public": {
    "packages": {
      'freedombase:web3-login': {
        "providername": {
          "provider": "settings"
        }
      }
    }
  }
}
```

Providers available at this moment (no need to install provider package, for settings see the `providerOptions` part):

* [WalletConnect](https://github.com/Web3Modal/web3modal/blob/master/docs/providers/walletconnect.md)
* [Formatic](https://github.com/Web3Modal/web3modal/blob/master/docs/providers/fortmatic.md)

More coming soon!

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/StorytellerCZ"><img src="https://avatars2.githubusercontent.com/u/1715235?v=4" width="100px;" alt="Jan Dvorak"/><br /><sub><b>Jan Dvorak</b></sub></a><br /><a href="https://github.com/Meteor Community Packages/template-package/commits?author=StorytellerCZ" title="Code">💻</a> <a href="https://github.com/Meteor Community Packages/template-package/commits?author=StorytellerCZ" title="Documentation">📖</a> <a href="#maintenance-StorytellerCZ" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.
Contributions of any kind welcome!
