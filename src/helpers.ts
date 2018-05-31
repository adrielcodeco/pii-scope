const CHAR_HASH = 35 /* # */
const CHAR_EXCLAMATION_MARK = 33 /* ! */
const CHAR_LINE_FEED = 10 /* \n */
const CHAR_CARRIAGE_RETURN = 13 /* \r */

function stripBOM(content: string) {
    if (content.charCodeAt(0) === 0xfeff) {
        content = content.slice(1)
    }
    return content
}

function stripShebang(content: string) {
    // Remove shebang
    var contLen = content.length
    if (contLen >= 2) {
        if (
            content.charCodeAt(0) === CHAR_HASH &&
            content.charCodeAt(1) === CHAR_EXCLAMATION_MARK
        ) {
            if (contLen === 2) {
                // Exact match
                content = ''
            } else {
                // Find end of shebang line and slice it off
                var i = 2
                for (; i < contLen; ++i) {
                    var code = content.charCodeAt(i)
                    if (
                        code === CHAR_LINE_FEED ||
                        code === CHAR_CARRIAGE_RETURN
                    ) {
                        break
                    }
                }
                if (i === contLen) content = ''
                else {
                    // Note that this actually includes the newline character(s) in the
                    // new output. This duplicates the behavior of the regular expression
                    // that was previously used to replace the shebang line
                    content = content.slice(i)
                }
            }
        }
    }
    return content
}

export { stripBOM, stripShebang }