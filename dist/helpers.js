'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
const CHAR_HASH = 35
const CHAR_EXCLAMATION_MARK = 33
const CHAR_LINE_FEED = 10
const CHAR_CARRIAGE_RETURN = 13

function stripBOM (content) {
  if (content && content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1)
  }

  return content
}

exports.stripBOM = stripBOM

function stripShebang (content) {
  if (!content) {
    content = ''
  }

  const contLen = content.length

  if (contLen >= 2) {
    if (
      content.charCodeAt(0) === CHAR_HASH &&
      content.charCodeAt(1) === CHAR_EXCLAMATION_MARK
    ) {
      if (contLen === 2) {
        content = ''
      } else {
        let i = 2

        for (; i < contLen; ++i) {
          const code = content.charCodeAt(i)

          if (code === CHAR_LINE_FEED || code === CHAR_CARRIAGE_RETURN) {
            break
          }
        }

        if (i === contLen) {
          content = ''
        } else {
          content = content.slice(i)
        }
      }
    }
  }

  return content
}

exports.stripShebang = stripShebang

//# sourceMappingURL=helpers.js.map
