const charExp = /[\w-_.:!@]/;
const spaceExp = /[\s\r\n]/;

function parseTag(str, index = 0) {
    const length = str.length;
    if (index >= length) return null;
    // trim left
    while (index < length) {
        if (!spaceExp.test(str[index])) break;
        index++;
    }
    // begin
    if (str[index] !== '<') throw SyntaxError('Tag must begin with <name ...');
    let startIndex = index;
    index++;
    if (str[index] === '!') {
        let finish = '>';
        if (matchAhead(str, index, '!--')) {
            finish = '-->';
            index += 3
        }
        startIndex = index;
        while (index < length) {
            if (matchAhead(str, index, finish)) {
                // index+=finish.length;
                return [index + finish.length, {
                    tagName: '#comment',
                    text: str.slice(startIndex, index)
                }]
            }
            index++;
        }
    }

    let name = "";
    let attrName = "";
    let attrValue = "";
    let attributes = {};
    let children = undefined;
    let stage = 0; // 0:name 1:attrs 2:close 3:done
    while (index < length) {
        let cur = str[index];
        if (stage === 0) {
            // CAPTURE TAG NAME

            if (spaceExp.test(cur))
                stage = 1;
            else if (charExp.test(cur)) {
                name += cur;
            } else {
                if (cur === '/' || cur === '>') {
                    stage = 2;
                    continue;
                } else {
                    throw SyntaxError('something ' + cur)
                }
            }
            index++;
            continue;
        }
        if (stage === 1) {
            // PARSE ATTRIBUTES

            // trim left
            while (index < length) {
                cur = str[index];
                if (!spaceExp.test(cur)) break;
                index++;
            }

            // tag close
            if (cur === '/' || cur === '>') {
                stage = 2;
                continue;
            }

            // capture attribute NAME
            attrName = "";
            attrValue = "";
            while (index < length) {
                cur = str[index];
                if (cur === '/' || cur === '>') {
                    stage = 2;
                    break;
                }
                if (cur === '=') {
                    // capture attribute VALUE
                    index++;
                    cur = str[index];
                    break;
                }
                if (charExp.test(cur)) {
                    attrName += cur;
                    index++;
                    cur = str[index];
                    continue;
                }
                if (spaceExp.test(cur)) attrValue = null;
                else throw SyntaxError('Malformed attribute at ' + index + ' "' + attrName + '": ...' + str.slice(index - 10, index + 10) + '...')
                break;
            }
            if (stage > 1) {
                if (attrName.length > 0) {
                    attributes[attrName] = ""
                }
                continue;
            }
            if (attrValue === null) {
                attributes[attrName] = "";
                continue;
            }

            let literalEnd = '';
            if (cur === "'" || cur === '"') {
                index++;
                literalEnd = cur;
            } else {
                // deal with badly written attribute value
                throw SyntaxError('Attribute value must be quoted')
            }

            while (index < length) {
                cur = str[index];
                // escape
                if (cur === '\\' && str[index + 1] === literalEnd) {
                    // if (str[index+1] === literalEnd) {
                    attrValue += literalEnd;
                    index += 2;
                    continue;
                    // }
                }
                if (cur === literalEnd) {
                    index += 1;
                    break;
                }
                attrValue += cur;
                index++;
            }

            attributes[attrName] = attrValue

            continue;
        }
        if (stage === 2) {
            // MATCH TAG CLOSE
            if (cur === '>') {
                // close
                index++;
            } else if (cur === '/') {
                // done?
                if (str[index + 1] === '>') {
                    // done
                    stage = 3;
                    index += 2;
                } else {
                    // not done - syntax error
                    throw SyntaxError('Illegal attribute name "/"')
                }
            }
            break;
        }
    }

    const lowerName = name.toLowerCase();
    if ((name === 'meta' || name === 'link') && stage === 2) {
        let mark = index;
        // trim left
        while (index < length) {
            let cur = str[index];
            if (!spaceExp.test(cur)) break;
            index++;
        }
        if (matchAhead(str, index, '</')) {
            if (matchAhead(str, index, '</'+name+'>')) {
                stage = 3;
                index+=name.length+3
            } else {
                index = mark;
            }
        }
        stage = 3;
    }

    if (stage < 3) {
        if (lowerName !== 'script' || lowerName !== 'style') {
            [index, children] = parseNodes(str, index, name)
        } else {
            // capture literal script
            let start = index
            let finish = '</' + name + '>';
            index = skipLiteralBlock(str, index, finish)
            children = [{
                tagName: '#text',
                text: str.slice(start, index - finish.length)
            }]
        }

        let len = name.length + 2;

        if (str.slice(index, index + len) === '</' + name) {
            index += len;
            while (index < length) {
                if (str[index] === '>') {
                    break;
                } else if (spaceExp.test(str[index])) {
                    index++;
                } else throw SyntaxError('Close tag not closed')
            }
            index++;
        }
    }

    return [index, {
        startIndex,
        endIndex: index,
        tagName: name,
        attributes: attributes,
        childNodes: children
    }]

}

function parseNodes(str, index = 0) {
    const length = str.length;
    let children = [];
    let text = "";
    while (index < length) {
        let cur = str[index];
        if (cur === '<') {
            if (str[index + 1] === '/') return [index, children]
            else {
                let [idx, tag] = parseTag(str, index);
                index = idx;
                children.push(tag);
            }
        } else {
            // capture text and tag
            while (index < length) {
                cur = str[index];
                if (cur === '<') {
                    if (text.length > 0) {
                        if (text.trim() !== "")
                            children.push({
                                tagName: '#text',
                                text: text
                            });
                    }
                    if (str[index + 1] === '/') return [index, children]
                    else {
                        let [idx, tag] = parseTag(str, index);
                        index = idx;
                        children.push(tag);
                    }
                    text = "";
                    index--;
                    break;
                } else {
                    text += cur;
                    index++;
                }
            }
            if (text.length > 0) {
                if (text.trim() !== "")
                    children.push({
                        index,
                        tagName: '#text',
                        text: text
                    });
            }
        }
        index++;
    }
    return [index, children]
}

const literals = ['"', "'", '`'];

function litStart(cur) {
    let lt = literals.indexOf(cur)
    return lt >= 0 ? literals[lt] : null
}

function matchAhead(str, index, seq) {
    for (let i = 0; i < seq.length; i++) {
        if (seq[i] !== str[index + i]) return false
    }
    return true;
}

function skipLiteralBlock(str, index, finish) {
    const length = str.length;
    // let start = index;
    let lit = null;
    while (index < length) {
        let cur = str[index];
        // INSIDE LITERAL
        if (lit !== null) {
            // escape
            if (cur === '\\' && str[index + 1] === lit || str[index + 1] === '\\' || str[index + 1] === '$') {
                index += 2;
                continue;
            }

            // lit end
            if (cur === lit) {
                index++;
                lit = null;
                continue;
            }

            // in template string block
            if (lit === '`' && matchAhead(str, index, '${')) {
                index = skipLiteralBlock(str, index + 2, '}');
                index++;
                continue;
            }
            index++;
            continue;
        }
        // single line comment
        if (cur === '/' && str[index + 1] === '/') {
            index += 2;
            while (index < length) {
                if (str[index] === '\n') {
                    index++;
                    break;
                }
                index++;
            }
        }
        // multi line comment
        if (cur === '/' && str[index + 1] === '*') {
            index += 2;
            while (index < length) {
                if (matchAhead(str, index, '*/')) {
                    index += 2;
                    break;
                }
                index++;
            }
        }
        // OUTSIDE LITERAL
        // finished
        if (matchAhead(str, index, finish)) {
            return index + finish.length;
        }

        lit = litStart(cur);
        index++;
    }
    return index
}

module.exports = function parse(str) {
    let [idx, nodes] = parseNodes(str);
    return nodes
}