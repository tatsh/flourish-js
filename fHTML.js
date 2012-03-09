/**
 * Provides HTML-related methods.
 * @constructor
 */
var fHTML = function () {};
/**
 * Inline elemenets according to HTML standards.
 * @type Array
 * @private
 */
fHTML._inlineElements = [
  'a',
  'abbr',
  'acronym',
  'address',
  'area',
  'audio',
  'b',
  'big',
  'bm',
  'br',
  'button',
  'cite',
  'code',
  'command',
  'datalist',
  'del',
  'details',
  'dfn',
  'em',
  'embed',
  'font',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'object',
  'kdb',
  'label',
  'mark',
  'meter',
  'progress',
  'q',
  's',
  'samp',
  'select',
  'small',
  'source',
  'span',
  'strike',
  'strong',
  'sup',
  'textarea',
  'time',
  'tt',
  'u',
  'var',
  'video',
  '#text'
];
/**
 * These elements are normally not thought to be block-level in practise most
 *   of the time.
 * @type Array
 * @private
 */
fHTML._inlineElementsStrict = [
  'link',
  'nav',
  'optgroup',
  'option',
  'summary',
  'tbody',
  'td'
];
/**
 * Checks a string of HTML for block level elements.
 * @param {string} content The HTML content to check.
 * @param {boolean} [strict=false] Do not allow exceptions: &lt;nav&gt,
 *   &lt;optgroup&gt;, etc.
 * @returns {boolean} If the content has a block level tag.
 */
fHTML.containsBlockLevelHTML = function (content, strict) {
  if (strict === undefined) {
    strict = false;
  }

  // NOTE This checks both HTML 5 and previous versions
  var inline = fHTML._inlineElements;

  // Many might consider these block-level elements in practise
  if (strict) {
    inline = inline.concat.apply(inline, fHTML._inlineElementsStrict);
  }

  var container = document.createElement('div');
  container.innerHTML = content;

  var inArray = function (nodeName, filter) {
    return filter.indexOf(nodeName.toLowerCase()) !== -1;
  };

  return (function check(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeName.substr(0, 1) === '#') {
        continue;
      }

      if (!inArray(nodes[i].nodeName, inline)) {
        return true;
      }

      if (nodes[i].hasChildNodes()) {
        return check(nodes[i].childNodes);
      }
    }

    return false;
  })(container.childNodes);
};
/**
 * Converts new lines to &lt;br&gt; tags as long as there aren't any block-level
 *   HTML tags present.
 * @param {string} content The content to display.
 * @returns {string} The content.
 */
fHTML.convertNewLines = function (content) {
  if (fHTML.containsBlockLevelHTML(content)) {
    return content;
  }

  var offset = fHTML._inlineElements.indexOf('br');
  var inlineWithoutBr = fHTML._inlineElements.slice(0, offset);
  var add = fHTML._inlineElements.slice(offset + 1);
  inlineWithoutBr = inlineWithoutBr.concat.apply(inlineWithoutBr, add);

  // http://phpjs.org/functions/nl2br:480
  return content.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
};
/**
 * @type Array
 * @private
 * @see http://phpjs.org/functions/get_html_translation_table:416
 */
fHTML._decodeHashMap = (function () {
  var entities = {
    38: '&amp;',
    39: '&#39',
    60: '&lt;',
    62: '&gt;',
    160: '&nbsp;',
    161: '&iexcl;',
    162: '&cent;',
    163: '&pound;',
    164: '&curren;',
    165: '&yen;',
    166: '&brvbar;',
    167: '&sect;',
    168: '&uml;',
    169: '&copy;',
    170: '&ordf;',
    171: '&laquo;',
    172: '&not;',
    173: '&shy;',
    174: '&reg;',
    175: '&macr;',
    176: '&deg;',
    177: '&plusmn;',
    178: '&sup2;',
    179: '&sup3;',
    180: '&acute;',
    181: '&micro;',
    182: '&para;',
    183: '&middot;',
    184: '&cedil;',
    185: '&sup1;',
    186: '&ordm;',
    187: '&raquo;',
    188: '&frac14',
    189: '&frac12',
    190: '&frac34',
    191: '&iquest;',
    192: '&Agrave;',
    193: '&Aacute;',
    194: '&Acirc;',
    195: '&Atilde;',
    196: '&Auml;',
    197: '&Aring;',
    198: '&AElig;',
    199: '&Ccedil;',
    200: '&Egrave;',
    201: '&Eacute;',
    202: '&Ecirc;',
    203: '&Euml;',
    204: '&Igrave;',
    205: '&Iacute;',
    206: '&Icirc;',
    207: '&Iuml;',
    208: '&ETH;',
    209: '&Ntilde;',
    210: '&Ograve;',
    211: '&Oacute;',
    212: '&Ocirc;',
    213: '&Otilde;',
    214: '&Ouml;',
    215: '&times;',
    216: '&Oslash;',
    217: '&Ugrave;',
    218: '&Uacute;',
    219: '&Ucirc;',
    220: '&Uuml;',
    221: '&Yacute;',
    222: '&THORN;',
    223: '&szlig;',
    224: '&agrave;',
    225: '&aacute;',
    226: '&acirc;',
    227: '&atilde;',
    228: '&auml;',
    229: '&aring;',
    230: '&aelig;',
    231: '&ccedil;',
    232: '&egrave;',
    233: '&eacute;',
    234: '&ecirc;',
    235: '&euml;',
    236: '&igrave;',
    237: '&iacute;',
    238: '&icirc;',
    239: '&iuml;',
    240: '&eth;',
    241: '&ntilde;',
    242: '&ograve;',
    243: '&oacute;',
    244: '&ocirc;',
    245: '&otilde;',
    246: '&ouml;',
    247: '&divide;',
    248: '&oslash;',
    249: '&ugrave;',
    250: '&uacute;',
    251: '&ucirc;',
    252: '&uuml;',
    253: '&yacute;',
    254: '&thorn;',
    255: '&yuml;'
  };
  var ret = {};

  for (var decimal in entities) {
    if (entities.hasOwnProperty(decimal)) {
      ret[String.fromCharCode(parseInt(decimal, 10))] = entities[decimal];
    }
  }

  delete ret['&'];
  ret['&'] = '&amp;';

  return ret;
})();
/**
 * Converts all HTML entities to normal characters.
 * @param {string} content The content to decode.
 * @returns {string} The decoded content.
 */
fHTML.decode = function (content) {
  var entity, tmpStr = content.toString();

  for (var symbol in fHTML._decodeHashMap) {
    if (fHTML._decodeHashMap.hasOwnProperty(symbol)) {
      entity = fHTML._decodeHashMap[symbol];
      tmpStr = tmpStr.split(entity).join(symbol);
    }
  }
  tmpStr = tmpStr.split('&#039;').join("'");

  return tmpStr;
};
/**
 * Converts all special characters to entities.
 * @param {string|Array} content The content to encode.
 * @returns {string} The encoded content.
 */
fHTML.encode = function (content) {
  if (typeof content === 'string') {
    content = [content];
  }
  var div = document.createElement('div');
  div.innerHTML = content.join('');
  return div.innerHTML;
};
/**
 * Make links within a content string.
 * @param {string} content Content to process.
 * @param {number} [linkTextLength=0] Length of the text within the tag. If
 *   this argument is used, then a title attribute will be on each link with
 *   the full link text.
 * @returns {string}
 */
fHTML.makeLinks = function(content, linkTextLength) {
  var div = document.createElement('div');
  var regex = /\b([a-z]{3,}:\/\/[a-z0-9%\$\-_.+!*;\/?:@=&\'\#,]+[a-z0-9\$\-_+!*;\/?:@=&\'\#,])\b|\b(www\.(?:[a-z0-9\-]+\.)+[a-z]{2,}(?:\/[a-z0-9%\$\-_.+!*;\/?:@=&\'\#,]+[a-z0-9\$\-_+!*;\/?:@=&\'\#,])?)\b|\b([a-z0-9\\.+\'_\\\-]+@(?:[a-z0-9\\\-]+\.)+[a-z]{2,})\b/gi;
  div.innerHTML = content; // Encodes everything

  content = div.innerHTML;
  return (function make(nodes) {
    var currentText = '', tmp;
    var matches;
    var printedText, scheme, replace;
    var container, tag;
    var matchRegex;
    var used = {};

    // Find every #text node and parse URIs
    for (var i = 0, j; i < nodes.length; i++) {
      if (nodes[i].hasChildNodes()) {
        // Make a new tag to get innerHTML from
        // This preserves outer tags without having to rely on outerHTML being available
        container = document.createElement('div');
        tag = nodes[i].cloneNode(true);
        tag.innerHTML = make(nodes[i].childNodes);
        container.appendChild(tag);
        currentText += container.innerHTML;
      }
      else if (nodes[i].nodeType === 3) {
        currentText += nodes[i].nodeValue;

        matches = currentText.match(regex);
        if (matches !== null && matches.length) {
          for (j = 0; j < matches.length; j++) {
            if (used[matches[j]] !== undefined) {
              continue;
            }

            printedText = matches[j];

            if (linkTextLength !== undefined) {
              printedText = matches[j].substr(0, linkTextLength) + '...';
            }

            // Simple check
            scheme = '';
            if (matches[j].indexOf('@') !== -1) {
              scheme = 'mailto:';
            }

            replace = '<a href="' + scheme + matches[j] + '" ';
            if (linkTextLength !== undefined) {
              replace += 'title="' + matches[j] + '"';
            }
            replace += '>' + printedText + '</a>';

            matchRegex = new RegExp(matches[j], 'g');
            used[matches[j]] = matches[j];
            currentText = currentText.replace(matchRegex, replace);
          }
        }
      }
    }

    return currentText;
  })(div.childNodes);
};
/**
 * Prepares content for display. Allows HTML tags.
 * @param {string|Array} content The content to prepare.
 * @returns {string} The encoded HTML.
 */
fHTML.prepare = function (content) {
  if (typeof content !== 'object') {
    content = [content];
  }

  var div = document.createElement('div');
  div.innerHTML = content.join('');

  return div.innerHTML;
};
