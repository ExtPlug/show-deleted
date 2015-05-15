Show Deleted Messages
=====================

ExtPlug plugin that keeps showing deleted chat messages.

![Screenshot](http://i.imgur.com/tA1TcZh.png)

## Installation

You can install this plugin by going to your ExtPlug settings menu, pressing "Install Plugin",
and entering this Plugin URL:

```
https://extplug.github.io/show-deleted/build/show-deleted.js;extplug/show-deleted/main
```

## Room Settings

**Note: This section is intended for room hosts only.**

Deleted chat messages are styled with the ".cm.extplug-deleted" class. Use this class if you
wish to style messages specially in your Room Style.

```json
{
  "css": {
    "rule": {
      ".cm.extplug-deleted": {
        "background-color": "red"
      }
    }
  }
}
```

## Building

**Note: this section is intended for developers only.**

This plugin uses NPM for dependency management and `gulp` for building.

```
npm install
gulp build
```

The built plugin will be stored at `build/show-deleted.js`.

## License

[MIT](./LICENSE)
