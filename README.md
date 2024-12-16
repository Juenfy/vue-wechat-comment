The cover wechat comment for vue3
=======================

[![NPM package][npm-img]][npm-url]
[![Build Size][build-size-img]][build-size-url]
[![NPM Downloads][npm-downloads-img]][npm-downloads-url]

<p align="center">
     <a href="https://vasturiano.github.io/3d-force-graph/example/large-graph/"><img width="80%" src="https://raw.githubusercontent.com/Juenfy/resources/refs/heads/master/emoji/1734319436951.jpg"></a>
</p>

Support emoji and extend emoji
Support text
Support voice record

Keydown enter or click send button to send text message.
## Quick start

```shell
npm i wechat-comment
```

How to import

```js
import WechatComment from 'wechat-comment'
import 'wechat-comment/dist/wechat-comment.css'
```

then

```html
<wechat-comment @sendCb="(msg) => { console.log(msg) }" position="bottom" :emoji="extEmoji"></wechat-comment>
```

## API reference

### Initialisation
```js
//Extend more emoji.
const extEmoji = {
  mmz: [{
    name: "mmz_00",
    ext: "gif",
    path: "/emoji/mmz/mmz_00.gif" //local path or remote url
  },
  {
    name: "mmz_01",
    ext: "gif",
    path: "/emoji/mmz/mmz_01.gif"
  },
  {
    name: "mmz_02",
    ext: "gif",
    path: "/emoji/mmz/mmz_02.gif"
  },
  {
    name: "mmz_03",
    ext: "gif",
    path: "/emoji/mmz/mmz_03.gif"
  }]
};
```
```html
<wechat-comment @sendCb="(msg) => { console.log(msg) }" :emoji="extEmoji"></wechat-comment>
```

| Props                                       | Description                                                          |      Default       |
|---------------------------------------------|----------------------------------------------------------------------|:------------------:|
| <b>show</b>: <i>Boolean</i>                 | Show the wechat-comment component.                                   |       `true`       |
| <b>modules</b>: <i>String</i>               | Support `voice`(voice record) `emoji` `send`(send btn).              | `voice,emoji,send` |
| <b>position</b>: <i>String</i>              | Set the position of the component.Support `bottom` `top` `relative`. |      `bottom`      |
| <b>emoji</b>: <i>Object</i>                 | Extend more emoji.                                                   |        `{}`        |
| <b>activeDefaultEmoji</b>: <i>String</i>    | Active the default emoji tab when you expand the emoji first time.   |       first        |
| <b>disabledDefaultEmoji</b>: <i>Boolean</i> | Disabled the default emoji.                                          |      `false`       |

| Events            | Description                                |                                   Callback params                                    |
|-------------------|--------------------------------------------|:------------------------------------------------------------------------------------:|
| <b>sendCb</b>     | Callback when you send message.            | `{ type: "emoji", content: {name:"mmz_00",ext:"gif",path:"/emoji/mmz/mmz_00.gif"} }` |
| <b>focus</b>      | Callback when you focus the input element. |                                 `INPUT HTML ELEMENT`                                 |
| <b>input</b>      | Callback when you focus the input element. |                                 `INPUT HTML ELEMENT`                                 |
| <b>startVoice</b> | Callback when you start voice record.      |                                                                                      |
| <b>stopVoice</b>  | Callback when you stop voice record.       |                                  `cancel` or `send`                                  |

[npm-img]: https://img.shields.io/npm/v/wechat-comment
[npm-url]: https://npmjs.org/package/wechat-comment
[build-size-img]: https://img.shields.io/bundlephobia/minzip/wechat-comment
[build-size-url]: https://bundlephobia.com/result?p=wechat-comment
[npm-downloads-img]: https://img.shields.io/npm/dt/wechat-comment
[npm-downloads-url]: https://www.npmtrends.com/wechat-comment