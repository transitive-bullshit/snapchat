# Snapchat

### Nodejs client for the unofficial Snapchat API

This project is a node.js port of the excellent Objective-C [SnapchatKit](https://github.com/ThePantsThief/SnapchatKit) library.

It provides an easy-to-use client interface to Snapchat's unofficial API, allowing Javascript developers to script Snapchat!

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
DEBUG=snapchat; # debug core snapchat client
```
OR
```bash
DEBUG=snapchat,snapchat:*; # debug all snapchat client 
```

### Third party resources

https://github.com/ThePantsThief/SnapchatKit
https://gibsonsec.org/snapchat/fulldisclosure/
https://github.com/mgp25/SC-API/wiki/API-v2-Research/
https://github.com/mgp25/SC-API/
https://github.com/liamcottle/AttestationServlet

### Credits

Tanner Bennett ([ThePantsThief](https://github.com/ThePantsThief)), the auther of the Objective-C library SnapchatKit, which this version is **heavily** based on.
Everyone who built and maintains the PHP implementation.

### Author

<table><tbody>
<tr><th align="left">Travis Fischer</th><td><a href="https://github.com/fisch0920">GitHub/fisch0920</a></td><td><a href="http://twitter.com/fisch0920">Twitter/@fisch0920</a></td></tr>
</tbody></table>

### License

MIT. Copyright (c) [Travis Fischer](https://makesnaps.com).
