# Snapchat

### Nodejs client for the unofficial Snapchat API

This project is a node.js port of the excellent Objective-C [SnapchatKit](https://github.com/ThePantsThief/SnapchatKit) library by Tanner Bennett ([ThePantsThief](https://github.com/ThePantsThief)).

It provides an easy-to-use client interface to Snapchat's unofficial API, allowing Javascript developers to script Snapchat!

**NOTE** This project is a pre-release alpha, and I would not recommend using it for production projects until it is more stable. PRs welcome :)

### Install

```bash
npm install snapchat
```

### Usage

TODO

### Contribute

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

See [CONTRIBUTING](https://github.com/fisch0920/snapchat/blob/master/CONTRIBUTING.md).

#### Debugging

You can enable [debug](https://www.npmjs.com/package/debug) logs by setting the `DEBUG` environment variable:

```bash
DEBUG=snapchat; # debug core snapchat
```
OR
```bash
DEBUG=snapchat,snapchat:*; # debug all snapchat submodules
```

### Third party resources

- https://github.com/ThePantsThief/SnapchatKit
- https://gibsonsec.org/snapchat/fulldisclosure/
- https://github.com/mgp25/SC-API/wiki/API-v2-Research/
- https://github.com/mgp25/SC-API/
- https://github.com/liamcottle/AttestationServlet

### Credits

- Tanner Bennett ([ThePantsThief](https://github.com/ThePantsThief)), the auther of the Objective-C library SnapchatKit, which this version is **heavily** based on.
- Everyone who built and maintains the PHP implementation.

### Author

<table><tbody>
<tr><th align="left">Travis Fischer</th><td><a href="https://github.com/fisch0920">GitHub/fisch0920</a></td><td><a href="http://twitter.com/fisch0920">Twitter/@fisch0920</a></td></tr>
</tbody></table>

### Todo

* ts/timestamps milliseconds or seconds
* JSON.stringify internal params or nah?

* move tryParseJSON into Request success handler
* also move response out and just return parsed JSON body

### License

MIT. Copyright (c) [Travis Fischer](https://makesnaps.com).

### Legal

I believe it's 100% legal to use a "private" REST API and that there are no laws explicitly prohibiting the use of "private" REST APIs. However, this does not mean that the makers of these private APIs can't try to sue you under something overly-broad, such as the CFAA. I don't think Snapchat will, personally; in my experience they've only gone after developers for copyright disputes.

Disclaimer: The name "Snapchat" is a copyright of Snapchat™, Inc. This project is in no way affiliated with, sponsored, or endorsed by Snapchat™, Inc. I, the project owner and creator, am not responsible for any legalities that may arise in the use of this project. Use at your own risk.
