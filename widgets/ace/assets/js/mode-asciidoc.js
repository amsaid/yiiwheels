ace.define("ace/mode/asciidoc", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/asciidoc_highlight_rules", "ace/mode/folding/asciidoc"], function (e, t, n) {
    var r = e("../lib/oop"), i = e("./text").Mode, s = e("../tokenizer").Tokenizer, o = e("./asciidoc_highlight_rules").AsciidocHighlightRules, u = e("./folding/asciidoc").FoldMode, a = function () {
        var e = new o;
        this.$tokenizer = new s(e.getRules()), this.foldingRules = new u
    };
    r.inherits(a, i), function () {
        this.getNextLineIndent = function (e, t, n) {
            if (e == "listblock") {
                var r = /^((?:.+)?)([-+*][ ]+)/.exec(t);
                return r ? (new Array(r[1].length + 1)).join(" ") + r[2] : ""
            }
            return this.$getIndent(t)
        }
    }.call(a.prototype), t.Mode = a
}), ace.define("ace/mode/asciidoc_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (e, t, n) {
    var r = e("../lib/oop"), i = e("./text_highlight_rules").TextHighlightRules, s = function () {
        function t(e) {
            var t = /\w/.test(e) ? "\\b" : "(?:\\B|^)";
            return t + e + "[^" + e + "].*?" + e + "(?![\\w*])"
        }

        var e = "[a-zA-Z¡-￿]+\\b";
        this.$rules = {start: [
            {token: "empty", regex: /$/},
            {token: "literal", regex: /^\.{4,}\s*$/, next: "listingBlock"},
            {token: "literal", regex: /^-{4,}\s*$/, next: "literalBlock"},
            {token: "string", regex: /^\+{4,}\s*$/, next: "passthroughBlock"},
            {token: "keyword", regex: /^={4,}\s*$/},
            {token: "text", regex: /^\s*$/},
            {token: "empty", regex: "", next: "dissallowDelimitedBlock"}
        ], dissallowDelimitedBlock: [
            {include: "paragraphEnd"},
            {token: "comment", regex: "^//.+$"},
            {token: "keyword", regex: "^(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION):"},
            {include: "listStart"},
            {token: "literal", regex: /^\s+.+$/, next: "indentedBlock"},
            {token: "empty", regex: "", next: "text"}
        ], paragraphEnd: [
            {token: "doc.comment", regex: /^\/{4,}\s*$/, next: "commentBlock"},
            {token: "tableBlock", regex: /^\s*[|!]=+\s*$/, next: "tableBlock"},
            {token: "keyword", regex: /^(?:--|''')\s*$/, next: "start"},
            {token: "option", regex: /^\[.*\]\s*$/, next: "start"},
            {token: "pageBreak", regex: /^>{3,}$/, next: "start"},
            {token: "literal", regex: /^\.{4,}\s*$/, next: "listingBlock"},
            {token: "titleUnderline", regex: /^(?:={2,}|-{2,}|~{2,}|\^{2,}|\+{2,})\s*$/, next: "start"},
            {token: "singleLineTitle", regex: /^={1,5}\s+\S.*$/, next: "start"},
            {token: "otherBlock", regex: /^(?:\*{2,}|_{2,})\s*$/, next: "start"},
            {token: "optionalTitle", regex: /^\.[^.\s].+$/, next: "start"}
        ], listStart: [
            {token: "keyword", regex: /^\s*(?:\d+\.|[a-zA-Z]\.|[ixvmIXVM]+\)|\*{1,5}|-|\.{1,5})\s/, next: "listText"},
            {token: "meta.tag", regex: /^.+(?::{2,4}|;;)(?: |$)/, next: "listText"},
            {token: "support.function.list.callout", regex: /^(?:<\d+>|\d+>|>) /, next: "text"},
            {token: "keyword", regex: /^\+\s*$/, next: "start"}
        ], text: [
            {token: ["link", "variable.language"], regex: /((?:https?:\/\/|ftp:\/\/|file:\/\/|mailto:|callto:)[^\s\[]+)(\[.*?\])/},
            {token: "link", regex: /(?:https?:\/\/|ftp:\/\/|file:\/\/|mailto:|callto:)[^\s\[]+/},
            {token: "link", regex: /\b[\w\.\/\-]+@[\w\.\/\-]+\b/},
            {include: "macros"},
            {include: "paragraphEnd"},
            {token: "literal", regex: /\+{3,}/, next: "smallPassthrough"},
            {token: "escape", regex: /\((?:C|TM|R)\)|\.{3}|->|<-|=>|<=|&#(?:\d+|x[a-fA-F\d]+);|(?: |^)--(?=\s+\S)/},
            {token: "escape", regex: /\\[_*'`+#]|\\{2}[_*'`+#]{2}/},
            {token: "keyword", regex: /\s\+$/},
            {token: "text", regex: e},
            {token: ["keyword", "string", "keyword"], regex: /(<<[\w\d\-$]+,)(.*?)(>>|$)/},
            {token: "keyword", regex: /<<[\w\d\-$]+,?|>>/},
            {token: "constant.character", regex: /\({2,3}.*?\){2,3}/},
            {token: "keyword", regex: /\[\[.+?\]\]/},
            {token: "support", regex: /^\[{3}[\w\d =\-]+\]{3}/},
            {include: "quotes"},
            {token: "empty", regex: /^\s*$/, next: "start"}
        ], listText: [
            {include: "listStart"},
            {include: "text"}
        ], indentedBlock: [
            {token: "literal", regex: /^[\s\w].+$/, next: "indentedBlock"},
            {token: "literal", regex: "", next: "start"}
        ], listingBlock: [
            {token: "literal", regex: /^\.{4,}\s*$/, next: "dissallowDelimitedBlock"},
            {token: "constant.numeric", regex: "<\\d+>"},
            {token: "literal", regex: "[^<]+"},
            {token: "literal", regex: "<"}
        ], literalBlock: [
            {token: "literal", regex: /^-{4,}\s*$/, next: "dissallowDelimitedBlock"},
            {token: "constant.numeric", regex: "<\\d+>"},
            {token: "literal", regex: "[^<]+"},
            {token: "literal", regex: "<"}
        ], passthroughBlock: [
            {token: "literal", regex: /^\+{4,}\s*$/, next: "dissallowDelimitedBlock"},
            {token: "literal", regex: e + "|\\d+"},
            {include: "macros"},
            {token: "literal", regex: "."}
        ], smallPassthrough: [
            {token: "literal", regex: /[+]{3,}/, next: "dissallowDelimitedBlock"},
            {token: "literal", regex: /^\s*$/, next: "dissallowDelimitedBlock"},
            {token: "literal", regex: e + "|\\d+"},
            {include: "macros"}
        ], commentBlock: [
            {token: "doc.comment", regex: /^\/{4,}\s*$/, next: "dissallowDelimitedBlock"},
            {token: "doc.comment", regex: "^.*$"}
        ], tableBlock: [
            {token: "tableBlock", regex: /^\s*\|={3,}\s*$/, next: "dissallowDelimitedBlock"},
            {token: "tableBlock", regex: /^\s*!={3,}\s*$/, next: "innerTableBlock"},
            {token: "tableBlock", regex: /\|/},
            {include: "text", noEscape: !0}
        ], innerTableBlock: [
            {token: "tableBlock", regex: /^\s*!={3,}\s*$/, next: "tableBlock"},
            {token: "tableBlock", regex: /^\s*|={3,}\s*$/, next: "dissallowDelimitedBlock"},
            {token: "tableBlock", regex: /\!/}
        ], macros: [
            {token: "macro", regex: /{[\w\-$]+}/},
            {token: ["text", "string", "text", "constant.character", "text"], regex: /({)([\w\-$]+)(:)?(.+)?(})/},
            {token: ["text", "markup.list.macro", "keyword", "string"], regex: /(\w+)(footnote(?:ref)?::?)([^\s\[]+)?(\[.*?\])?/},
            {token: ["markup.list.macro", "keyword", "string"], regex: /([a-zA-Z\-][\w\.\/\-]*::?)([^\s\[]+)(\[.*?\])?/},
            {token: ["markup.list.macro", "keyword"], regex: /([a-zA-Z\-][\w\.\/\-]+::?)(\[.*?\])/},
            {token: "keyword", regex: /^:.+?:(?= |$)/}
        ], quotes: [
            {token: "string.italic", regex: /__[^_\s].*?__/},
            {token: "string.italic", regex: t("_")},
            {token: "keyword.bold", regex: /\*\*[^*\s].*?\*\*/},
            {token: "keyword.bold", regex: t("\\*")},
            {token: "literal", regex: t("\\+")},
            {token: "literal", regex: /\+\+[^+\s].*?\+\+/},
            {token: "literal", regex: /\$\$.+?\$\$/},
            {token: "literal", regex: t("`")},
            {token: "keyword", regex: t("^")},
            {token: "keyword", regex: t("~")},
            {token: "keyword", regex: /##?/},
            {token: "keyword", regex: /(?:\B|^)``|\b''/}
        ]};
        var n = {macro: "constant.character", tableBlock: "doc.comment", titleUnderline: "markup.heading", singleLineTitle: "markup.heading", pageBreak: "string", option: "string.regexp", otherBlock: "markup.list", literal: "support.function", optionalTitle: "constant.numeric", escape: "constant.language.escape", link: "markup.underline.list"};
        for (var r in this.$rules) {
            var i = this.$rules[r];
            for (var s = i.length; s--;) {
                var o = i[s];
                if (o.include || typeof o == "string") {
                    var u = [s, 1].concat(this.$rules[o.include || o]);
                    o.noEscape && (u = u.filter(function (e) {
                        return!e.next
                    })), i.splice.apply(i, u)
                } else o.token in n && (o.token = n[o.token])
            }
        }
    };
    r.inherits(s, i), t.AsciidocHighlightRules = s
}), ace.define("ace/mode/folding/asciidoc", ["require", "exports", "module", "ace/lib/oop", "ace/mode/folding/fold_mode", "ace/range"], function (e, t, n) {
    var r = e("../../lib/oop"), i = e("./fold_mode").FoldMode, s = e("../../range").Range, o = t.FoldMode = function () {
    };
    r.inherits(o, i), function () {
        this.foldingStartMarker = /^(?:\|={10,}|[\.\/=\-~^+]{4,}\s*$|={1,5} )/, this.singleLineHeadingRe = /^={1,5}(?=\s+\S)/, this.getFoldWidget = function (e, t, n) {
            var r = e.getLine(n);
            return this.foldingStartMarker.test(r) ? r[0] == "=" ? this.singleLineHeadingRe.test(r) ? "start" : e.getLine(n - 1).length != e.getLine(n).length ? "" : "start" : e.bgTokenizer.getState(n) == "dissallowDelimitedBlock" ? "end" : "start" : ""
        }, this.getFoldWidgetRange = function (e, t, n) {
            function l(t) {
                return f = e.getTokens(t)[0], f && f.type
            }

            function d() {
                var t = f.value.match(p);
                if (t)return t[0].length;
                var r = c.indexOf(f.value[0]) + 1;
                return r == 1 && e.getLine(n - 1).length != e.getLine(n).length ? Infinity : r
            }

            var r = e.getLine(n), i = r.length, o = e.getLength(), u = n, a = n;
            if (!r.match(this.foldingStartMarker))return;
            var f, c = ["=", "-", "~", "^", "+"], h = "markup.heading", p = this.singleLineHeadingRe;
            if (l(n) == h) {
                var v = d();
                while (++n < o) {
                    if (l(n) != h)continue;
                    var m = d();
                    if (m <= v)break
                }
                var g = f && f.value.match(this.singleLineHeadingRe);
                a = g ? n - 1 : n - 2;
                if (a > u)while (a > u && (!l(a) || f.value[0] == "["))a--;
                if (a > u) {
                    var y = e.getLine(a).length;
                    return new s(u, i, a, y)
                }
            } else {
                var b = e.bgTokenizer.getState(n);
                if (b == "dissallowDelimitedBlock") {
                    while (n-- > 0)if (e.bgTokenizer.getState(n).lastIndexOf("Block") == -1)break;
                    a = n + 1;
                    if (a < u) {
                        var y = e.getLine(n).length;
                        return new s(a, 5, u, i - 5)
                    }
                } else {
                    while (++n < o)if (e.bgTokenizer.getState(n) == "dissallowDelimitedBlock")break;
                    a = n;
                    if (a > u) {
                        var y = e.getLine(n).length;
                        return new s(u, 5, a, y - 5)
                    }
                }
            }
        }
    }.call(o.prototype)
})