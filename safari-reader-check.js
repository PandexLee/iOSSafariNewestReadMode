/*
 * Copyright (c) 2010 Apple Inc. All rights reserved.
 */
function hostnameMatchesHostKnownToContainEmbeddableMedia(e) {
    const t = /^(.+\.)?(youtube\.com|vimeo\.com|dailymotion\.com|soundcloud\.com|mixcloud\.com|embedly\.com|embed\.ly)\.?$/;
    return t.test(e)
}
function lazyLoadingImageURLForElement(e, t) {
    const n = /(data:image\/)?gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==/,
    i = {
        "data-lazy-src": 1,
        "data-original": 1,
    datasrc: 1,
        "data-src": 1,
        "original-src": 1,
        "rel:bf_image_src": 1,
        "deferred-src": 1,
        "data-mediaviewer-src": 1
    },
    r = {
    original: 1
    };
    var a = e.getAttribute("src"),
    o = /transparent|empty/i.test(a) || n.test(a);
    const l = 2;
    for (var s = e, c = 0; s && l > c; s = s.parentElement, ++c)
        for (var u = s.attributes, m = u.length, d = 0; m > d; ++d) {
            var h = u[d].nodeName;
            if (i[h.toLowerCase()])
                return s.getAttribute(h);
            var g = /\.(jpe?g|png|gif|bmp)$/i.test(u[h].value);
            if (r[h.toLowerCase()] && g)
                return s.getAttribute(h);
            if (o && /^data.*(src|source)$/i.test(h) && g)
                return s.getAttribute(h)
                }
    if (LazyLoadRegex.test(t) && "function" == typeof URL) {
        var f;
        try {
            f = new URL(e.src)
        } catch (p) {}
        if (f && f.search) {
            var E,
            v;
            const N = ["w", "width"];
            for (var C = N.length, d = 0; C > d; ++d) {
                var A = N[d],
                S = f.searchParams.get(A);
                if (S && !isNaN(parseInt(S))) {
                    E = A;
                    break
                }
            }
            const R = ["h", "height"];
            for (var M = R.length, d = 0; M > d; ++d) {
                var b = R[d],
                y = f.searchParams.get(b);
                if (y && !isNaN(parseInt(y))) {
                    v = b;
                    break
                }
            }
            if (E && v) {
                var x = e.getAttribute("width"),
                T = e.getAttribute("height");
                if (!isNaN(parseInt(x)) && !isNaN(parseInt(T)))
                    return f.searchParams.set(E, x), f.searchParams.set(v, T), f.href
                    }
        }
    }
    return null
}
function sanitizeElementByRemovingAttributes(e) {
    const t = /^on|^id$|^class$|^style$|^autofocus$/;
    for (var n = e.attributes, i = 0; i < n.length; ++i) {
        var r = n[i].nodeName;
        t.test(r) && (e.removeAttribute(r), i--)
    }
}
function characterNeedsScoreMultiplier(e) {
    if (!e || 0 === e.length)
        return !1;
    var t = e.charCodeAt(0);
    return t > 11904 && 12031 > t ? !0 : t > 12352 && 12543 > t ? !0 : t > 12736 && 19903 > t ? !0 : t > 19968 && 40959 > t ? !0 : t > 44032 && 55215 > t ? !0 : t > 63744 && 64255 > t ? !0 : t > 65072 && 65103 > t ? !0 : t > 131072 && 173791 > t ? !0 : t > 194560 && 195103 > t
}
function domDistance(e, t, n) {
    for (var i = [], r = e; r;)
        i.unshift(r), r = r.parentNode;
    var a = [];
    for (r = t; r;)
        a.unshift(r), r = r.parentNode;
    for (var o = Math.min(i.length, a.length), l = Math.abs(i.length - a.length), s = o; s >= 0 && i[s] !== a[s]; --s)
        if (l += 2, n && l >= n)
            return n;
    return l
}
function fontSizeFromComputedStyle(e, t) {
    var n = parseInt(e.fontSize);
    return isNaN(n) && (n = t ? t : BaseFontSize), n
}
function contentTextStyleForNode(e, t) {
    function n(e) {
        if (isNodeWhitespace(e))
            return null;
        var t = getComputedStyle(e.parentNode);
        return "none" !== t["float"] ? null : t
    }
    for (var i = "descendant::text()[not(parent::h1) and not(parent::h2) and not(parent::h3) and not(parent::h4) and not(parent::h5) and not(parent::h6)]", r = e.evaluate(i, t, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), a = r.snapshotLength, o = 0; a > o; ++o) {
        for (var l = r.snapshotItem(o), s = !1, c = l.parentElement; c !== t; c = c.parentElement)
            if (NegativeRegEx.test(c.className)) {
                s = !0;
                break
            }
        if (!s) {
            var u = n(l);
            if (u)
                return u
                }
    }
    return null
}
function isNodeWhitespace(e) {
    return e && e.nodeType === Node.TEXT_NODE ? !/\S/.test(e.data) : !1
}
function removeWhitespace(e) {
    return e.replace(/\s+/g, "")
}
function isElementNode(e) {
    return !(!e || e.nodeType !== Node.ELEMENT_NODE)
}
function computedStyleIndicatesElementIsInvisibleDueToClipping(e) {
    if ("absolute" !== e.position)
        return !1;
    var t = e.clip.match(/^rect\((\d+px|auto), (\d+px|auto), (\d+px|auto), (\d+px|auto)\)$/);
    if (!t || 5 !== t.length)
        return !1;
    var n = t.map(function(e) {
                  return parseInt(e)
                  }),
    i = n[1];
    isNaN(i) && (i = 0);
    var r = n[2],
    a = n[3],
    o = n[4];
    return isNaN(o) && (o = 0), i >= a || r >= o
}
function isElementVisible(e) {
    var t = getComputedStyle(e);
    if ("visible" !== t.visibility || "none" === t.display)
        return !1;
    if (cachedElementBoundingRect(e).height)
        return !0;
    var n = document.createRange();
    return n.selectNode(e), !!n.getBoundingClientRect().height
}
function isElementPositionedOffScreen(e) {
    var t = cachedElementBoundingRect(e);
    return t.height && t.width ? t.bottom <= 0 || t.right <= 0 : !1
}
function elementDepth(e) {
    for (var t = 0; e; e = e.parentElement)
        t++;
    return t
}
function depthOfElementWithinElement(e, t) {
    for (var n = 0; e !== t; e = e.parentElement) {
        if (!e)
            return NaN;
        n++
    }
    return n
}
function nearestAncestorElementWithTagName(e, t, n) {
    var i = {};
    if (n)
        for (var r = 0; r < n.length; ++r)
            i[n[r]] = !0;
    if (i[e.tagName])
        return null;
    for (; e = e.parentElement;) {
        var a = e.tagName;
        if (i[a])
            break;
        if (a === t)
            return e
            }
    return null
}
function cachedElementBoundingRect(e) {
    if (e._cachedElementBoundingRect)
        return e._cachedElementBoundingRect;
    var t = e.getBoundingClientRect();
    return ReaderArticleFinderJS._elementsWithCachedBoundingRects.push(e), ReaderArticleFinderJS._cachedScrollX || ReaderArticleFinderJS._cachedScrollY ? (e._cachedElementBoundingRect = {
                                                                                                                                                           top: t.top + ReaderArticleFinderJS._cachedScrollY,
                                                                                                                                                           right: t.right + ReaderArticleFinderJS._cachedScrollX,
                                                                                                                                                           bottom: t.bottom + ReaderArticleFinderJS._cachedScrollY,
                                                                                                                                                           left: t.left + ReaderArticleFinderJS._cachedScrollX,
                                                                                                                                                           width: t.width,
                                                                                                                                                           height: t.height
                                                                                                                                                           }, e._cachedElementBoundingRect) : (e._cachedElementBoundingRect = t, e._cachedElementBoundingRect)
}
function clearCachedElementBoundingRects() {
    for (var e = ReaderArticleFinderJS._elementsWithCachedBoundingRects, t = e.length, n = 0; t > n; ++n)
        e[n]._cachedElementBoundingRect = null;
    ReaderArticleFinderJS._elementsWithCachedBoundingRects = []
}
function trimmedInnerTextIgnoringTextTransform(e) {
    var t = e.innerText;
    if (!/\S/.test(t))
        return e.textContent.trim();
    var n = getComputedStyle(e),
    i = n.textTransform;
    return "uppercase" === i || "lowercase" === i ? e.textContent.trim() : t.trim()
}
function levenshteinDistance(e, t) {
    for (var n = e.length, i = t.length, r = new Array(n + 1), a = 0; n + 1 > a; ++a)
        r[a] = new Array(i + 1), r[a][0] = a;
    for (var o = 0; i + 1 > o; ++o)
        r[0][o] = o;
    for (var o = 1; i + 1 > o; ++o)
        for (var a = 1; n + 1 > a; ++a)
            if (e[a - 1] === t[o - 1])
                r[a][o] = r[a - 1][o - 1];
            else {
                var l = r[a - 1][o] + 1,
                s = r[a][o - 1] + 1,
                c = r[a - 1][o - 1] + 1;
                r[a][o] = Math.min(l, s, c)
            }
    return r[n][i]
}
function stringSimilarity(e, t) {
    var n = Math.max(e.length, t.length);
    return n ? (n - levenshteinDistance(e, t)) / n : 0
}
function stringsAreNearlyIdentical(e, t) {
    return e === t ? !0 : stringSimilarity(e, t) > StringSimilarityToDeclareStringsNearlyIdentical
}
function elementIsCommentBlock(e) {
    if (/(^|\s)comment/.test(e.className))
        return !0;
    var t = e.getAttribute("id");
    return !(!t || 0 !== t.indexOf("comment"))
}
function elementLooksLikeEmbeddedTweet(e) {
    if ("IFRAME" !== e.tagName)
        return !1;
    if (!e.contentDocument)
        return !1;
    var t = e.contentDocument.documentElement,
    n = 0,
    i = t.querySelector("blockquote");
    i && TweetURLRegex.test(i.getAttribute("cite")) && ++n;
    var r = t.querySelector("[data-iframe-title]");
    return r && TweetIframeTitleRegex.test(r.getAttribute("data-iframe-title")) && ++n, e.classList.contains("twitter-tweet") && ++n, t.querySelector("[data-tweet-id]") && ++n, n > 2
}
function elementLooksLikePartOfACarousel(e) {
    const t = /carousel-|carousel_|-carousel|_carousel/,
    n = 3;
    for (var i = e, r = 0; n > r; ++r) {
        if (!i)
            return !1;
        if (t.test(i.className) || t.test(i.getAttribute("data-analytics")))
            return !0;
        i = i.parentElement
    }
}
function shouldPruneIframe(e, t) {
    return e.srcdoc ? !0 : hostnameMatchesHostKnownToContainEmbeddableMedia(anchorForURL(e.src, t).hostname) ? !1 : !elementLooksLikeEmbeddedTweet(e.originalElement)
}
function languageScoreMultiplierForTextNodes(e) {
    if (!e || !e.length)
        return 1;
    for (var t = Math.min(e.length, DefaultNumberOfTextNodesToCheckForLanguageMultiplier), n = 0, i = 0, r = 0; t > r; r++) {
        for (var a = e[r].nodeValue.trim(), o = Math.min(a.length, NumberOfCharactersPerTextNodeToEvaluateForLanguageMultiplier), l = 0; o > l; l++)
            characterNeedsScoreMultiplier(a[l]) && n++;
        i += o
    }
    return n >= i * MinimumRatioOfCharactersForLanguageMultiplier ? ScoreMultiplierForChineseJapaneseKorean : 1
}
function scoreMultiplierForElementTagNameAndAttributes(e) {
    for (var t = 1, n = e; n; n = n.parentElement) {
        var i = n.getAttribute("id");
        i && (ArticleRegEx.test(i) && (t += ArticleMatchBonus), CommentRegEx.test(i) && (t -= CommentMatchPenalty), CarouselRegEx.test(i) && (t -= CarouselMatchPenalty));
        var r = n.className;
        r && (ArticleRegEx.test(r) && (t += ArticleMatchBonus), CommentRegEx.test(r) && (t -= CommentMatchPenalty), CarouselRegEx.test(r) && (t -= CarouselMatchPenalty)), "ARTICLE" === n.tagName && (t += ArticleMatchBonus)
    }
    return 0 > t ? 0 : t
}
function elementAtPoint(e, t) {
    if ("undefined" != typeof ReaderArticleFinderJSController && ReaderArticleFinderJSController.nodeAtPoint) {
        var n = ReaderArticleFinderJSController.nodeAtPoint(e, t);
        return n && n.nodeType !== Node.ELEMENT_NODE && (n = n.parentElement), n
    }
    return document.elementFromPoint(e, t)
}
function userVisibleURLString(e) {
    return "undefined" != typeof ReaderArticleFinderJSController && ReaderArticleFinderJSController.userVisibleURLString ? ReaderArticleFinderJSController.userVisibleURLString(e) : e
}
function anchorRunsJavaScriptOnActivation(e) {
    var t = e.href;
    return "javascript:" === t.trim().substring(0, 11).toLowerCase()
}
function anchorForURL(e, t) {
    var n = t.createElement("a");
    return n.href = e, n
}
function anchorLinksToAttachment(e) {
    return /\battachment\b/i.test(e.getAttribute("rel"))
}
function anchorLinksToTagOrCategoryPage(e) {
    return /\bcategory|tag\b/i.test(e.getAttribute("rel"))
}
function anchorLooksLikeDownloadFlashLink(e) {
    return /^https?:\/\/(www\.|get\.)(adobe|macromedia)\.com\/(((products|[a-zA-Z]{1,2}|)\/flashplayer|flashplayer|go\/getflash(player)?)|(shockwave\/download\/(index|download)\.cgi\?P1_Prod_Version=ShockwaveFlash)\/?$)/i.test(e.href)
}
function elementsHaveSameTagAndClassNames(e, t) {
    return e.tagName === t.tagName && e.className === t.className
}
function selectorForElement(e) {
    for (var t = e.tagName, n = e.classList, i = n.length, r = 0; i > r; r++)
        t += "." + n[r];
    return t
}
function elementFingerprintForDepth(e, t) {
    function n(e, t) {
        if (!e)
            return "";
        var o = [];
        o.push(selectorForElement(e));
        var l = e.children,
        s = l.length;
        if (s && t > 0) {
            o.push(i);
            for (var c = 0; s > c; ++c)
                o.push(n(l[c], t - 1)), c !== s - 1 && o.push(a);
            o.push(r)
        }
        return o.join("")
    }
    const i = " / ",
    r = " \\",
    a = " | ";
    return n(e, t)
}
function childrenOfParentElement(e) {
    var t = e.parentElement;
    return t ? t.children : []
}
function arrayOfKeysAndValuesOfObjectSortedByValueDescending(e) {
    var t = [];
    for (var n in e)
        e.hasOwnProperty(n) && t.push({
                                      key: n,
                                      value: e[n]
                                      });
    return t.sort(function(e, t) {
                  return t.value - e.value
                  }), t
}
function walkElementSubtree(e, t, n) {
    if (!(0 > t)) {
        for (var i = e.children, r = i.length, a = t - 1, o = 0; r > o; ++o)
            walkElementSubtree(i[o], a, n);
        n(e, t)
    }
}
function elementIndicatesItIsASchemaDotOrgArticleContainer(e) {
    var t = e.getAttribute("itemtype");
    return /^https?:\/\/schema\.org\/(News)?Article$/.test(t)
}
function cleanStyleAndClassList(e) {
    e.classList.length || e.removeAttribute("class"), e.getAttribute("style") || e.removeAttribute("style")
}
function getVisibleNonWhitespaceTextNodes(e, t, n, i, r) {
    function a(e) {
        var t = e.children[0];
        if (t)
            for (var n = t.children, i = n.length, r = 0; i > r; ++r)
                if ("none" !== getComputedStyle(n[r])["float"])
                    return !1;
        return !0
    }
    function o(e, i) {
        if (e.nodeType === Node.TEXT_NODE)
            return void (/\S/.test(e.nodeValue) && s.push(e));
        if (e.nodeType === Node.ELEMENT_NODE && isElementVisible(e) && !(n && ++l > n || r && r.has(e))) {
            var u = e.tagName;
            if ("IFRAME" !== u && "FORM" !== u) {
                if (c[u])
                    i--;
                else if ("UL" !== u && "OL" !== u || !a(e)) {
                    var m = e.parentElement;
                    if (m) {
                        var d = m.tagName;
                        "SECTION" !== d || e.previousElementSibling || e.nextElementSibling || i--
                    }
                } else
                    i--;
                var h = i + 1;
                if (t > h)
                    for (var g = e.childNodes, f = g.length, p = 0; f > p; ++p)
                        o(g[p], h)
                        }
        }
    }
    var l = 0,
    s = [],
    c = {
    P: 1,
    STRONG: 1,
    B: 1,
    EM: 1,
    I: 1,
    SPAN: 1,
    SECTION: 1
    };
    return i && (c.CENTER = 1, c.FONT = 1), o(e, 0), s
}
function mapOfVisibleTextNodeComputedStyleReductionToNumberOfMatchingCharacters(e, t) {
    const n = 100;
    for (var i = {}, r = getVisibleNonWhitespaceTextNodes(e, n), a = r.length, o = 0; a > o; ++o) {
        var l = r[o],
        s = l.length,
        c = l.parentElement,
        u = getComputedStyle(c),
        m = t(u);
        i[m] ? i[m] += s : i[m] = s
    }
    return i
}
function keyOfMaximumValueInDictionary(e) {
    var t,
    n;
    for (var i in e) {
        var r = e[i];
        (!n || r > n) && (t = i, n = r)
    }
    return t
}
function elementIsProtected(e) {
    return e.classList.contains("protected") || e.querySelector(".protected")
}
function dominantFontFamilyAndSizeForElement(e) {
    var t = mapOfVisibleTextNodeComputedStyleReductionToNumberOfMatchingCharacters(e, function(e) {
                                                                                   return e.fontFamily + "|" + e.fontSize
                                                                                   });
    return keyOfMaximumValueInDictionary(t)
}
function dominantFontSizeInPointsFromFontFamilyAndSizeString(e) {
    return e ? parseInt(e.split("|")[1]) : null
}
function canvasElementHasNoUserVisibleContent(e) {
    if (!e.width || !e.height)
        return !0;
    for (var t = e.getContext("2d"), n = t.getImageData(0, 0, e.width, e.height).data, i = 0, r = n.length; r > i; i += 4) {
        var a = n[i + 3];
        if (a)
            return !1
            }
    return !0
}
function findArticleNodeSelectorsInWhitelistForHostname(e, t) {
    const n = [[AppleDotComAndSubdomainsRegex, "*[itemprop='articleBody']"], [/^(.+\.)?buzzfeed\.com\.?$/, "article #buzz_sub_buzz"], [/^(.+\.)?mashable\.com\.?$/, ".parsec-body .parsec-container"], [/^(.+\.)?cnet\.com\.?$/, "#rbContent.container"], [/^(.+\.)?engadget\.com\.?$/, "main article #page_body"], [/^(.*\.)?m\.wikipedia\.org\.?$/, "#content #bodyContent"]];
    for (var i = n.length, r = 0; i > r; ++r) {
        var a = n[r],
        o = a[0];
        if (o.test(e.toLowerCase())) {
            var l = a[1],
            s = t(l);
            if (s)
                return
                }
    }
}
function functionToPreventPruningDueToInvisibilityInWhitelistForHostname(e) {
    const t = [[/^mobile\.nytimes\.com\.?$/, function(e, t) {
                var n = e;
                if (!t)
                return !1;
                for (; n && n !== t;) {
                if (n.classList.contains("hidden"))
                return !0;
                n = n.parentElement
                }
                return !1
                }]];
    for (var n = t.length, i = 0; n > i; ++i) {
        var r = t[i],
        a = r[0];
        if (a.test(e.toLowerCase()))
            return r[1]
            }
    return null
}
function elementIsAHeader(e) {
    return !!{
    H1: 1,
    H2: 1,
    H3: 1,
    H4: 1,
    H5: 1,
    H6: 1
    }[e.tagName]
}
function leafElementForElementAndDirection(e, t) {
    var n = e.ownerDocument,
    i = n.createTreeWalker(n.body, NodeFilter.SHOW_ELEMENT, {
                           acceptNode: function(e) {
                           return 0 === e.children.length ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
                           }
                           });
    return i.currentNode = e, i[t]()
}
function previousLeafElementForElement(e) {
    return leafElementForElementAndDirection(e, "previousNode")
}
function nextLeafElementForElement(e) {
    return leafElementForElementAndDirection(e, "nextNode")
}
function nextNonFloatingVisibleElementSibling(e) {
    for (var t = e; t = t.nextElementSibling;)
        if (isElementVisible(t) && "none" === getComputedStyle(t)["float"])
            return t;
    return null
}
function elementWithLargestAreaFromElements(e) {
    var t = e.length;
    if (!t)
        return null;
    for (var n, i = 0, r = 0; t > r; ++r) {
        var a = e[r],
        o = cachedElementBoundingRect(a),
        l = o.width * o.height;
        l > i && (n = a, i = l)
    }
    return n
}
function unwrappedArticleContentElement(e) {
    for (var t = e;;) {
        for (var n = t.childNodes, i = n.length, r = null, a = 0; i > a; ++a) {
            var o = n[a],
            l = o.nodeType,
            s = function() {
                return l === Node.ELEMENT_NODE ? !0 : l === Node.TEXT_NODE ? !isNodeWhitespace(o) : !1
            }();
            if (s) {
                if (r)
                    return t;
                var c = o.tagName;
                if ("DIV" !== c && "ARTICLE" !== c && "SECTION" !== c)
                    return t;
                r = o
            }
        }
        if (!r)
            break;
        t = r
    }
    return t
}
function elementsMatchingClassesInClassList(e, t) {
    return elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t)
}
function elementsMatchingClassesInClassListIgnoringCommonLayoutClassNames(e, t) {
    const n = /clearfix/i;
    return elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t, n)
}
function elementsMatchingClassesInClassListIgnoringClassesWithNumericSuffix(e, t) {
    const n = /\d+$/;
    return elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t, n)
}
function elementsOfSameClassIgnoringClassNamesMatchingRegexp(e, t, n) {
    for (var i = "", r = e.length, a = 0; r > a; ++a) {
        var o = e[a];
        n && n.test(o) || (i += "." + o)
    }
    try {
        return t.querySelectorAll(i)
    } catch (l) {
        return []
    }
}
function imageIsContainedByContainerWithImageAsBackgroundImage(e) {
    var t = e.parentElement;
    if (!t || !t.style.backgroundImage)
        return !1;
    var n = /url\((.*)\)/.exec(t.style.backgroundImage);
    if (!n || 2 !== n.length)
        return !1;
    var i = n[1];
    return i === e.src
}
function childrenWithParallelStructure(e) {
    var t = e.children;
    if (!t)
        return [];
    var n = t.length;
    if (!n)
        return [];
    for (var i = {}, r = 0; n > r; ++r) {
        var a = t[r];
        if (!CandidateTagNamesToIgnore[a.tagName] && a.className)
            for (var o = a.classList, l = o.length, s = 0; l > s; ++s) {
                var c = o[s],
                u = i[c];
                u ? u.push(a) : i[c] = [a]
            }
    }
    var m = Math.floor(n / 2);
    for (var c in i) {
        var u = i[c];
        if (u.length > m)
            return u
            }
    return []
}
function elementAppearsToBeCollapsed(e) {
    return "false" === e.getAttribute("aria-expanded") && !isElementVisible(e)
}
const ReaderMinimumScore = 1600,
ReaderMinimumAdvantage = 15,
ArticleMinimumScoreDensity = 4.25,
CandidateMinimumWidth = 280,
CandidateMinimumHeight = 295,
CandidateMinimumArea = 17e4,
CandidateMaximumTop = 1300,
CandidateMinimumWidthPortionForIndicatorElements = .5,
CandidateMinumumListItemLineCount = 4,
CandidateTagNamesToIgnore = {
A: 1,
EMBED: 1,
FORM: 1,
HTML: 1,
IFRAME: 1,
OBJECT: 1,
OL: 1,
OPTION: 1,
SCRIPT: 1,
STYLE: 1,
svg: 1,
UL: 1
},
PrependedArticleCandidateMinimumHeight = 50,
AppendedArticleCandidateMinimumHeight = 200,
AppendedArticleCandidateMaximumVerticalDistanceFromArticle = 150,
StylisticClassNames = {
justfy: 1,
justify: 1,
left: 1,
right: 1,
small: 1
},
CommentRegEx = /comment|meta|footer|footnote/,
CommentMatchPenalty = .75,
ArticleRegEx = /(?:(?:^|\s)(?:(post|hentry|entry)[-_]?(?:content|text|body)?|article[-_]?(?:content|text|body|page)?)(?:\s|$))/i,
ArticleMatchBonus = .5,
CarouselRegEx = /carousel/i,
CarouselMatchPenalty = .75,
SectionRegex = /section|content.*component/i,
DensityExcludedElementSelector = "#disqus_thread, #comments, .userComments",
PositiveRegEx = /article|body|content|entry|hentry|page|pagination|post|related-asset|text/i,
NegativeRegEx = /advertisement|breadcrumb|combx|comment|contact|disqus|footer|link|meta|mod-conversations|promo|related|scroll|share|shoutbox|sidebar|social|sponsor|subscribe|tags|toolbox|widget|[-_]ad$|zoom-(in|out)/i,
VeryPositiveClassNameRegEx = /instapaper_body/,
VeryNegativeClassNameRegEx = /instapaper_ignore/,
SharingRegex = /email|print|rss|digg|slashdot|delicious|reddit|share|twitter|facebook|pinterest|whatsapp/i,
VeryLiberalCommentRegex = /comment/i,
AdvertisementHostRegex = /^adserver\.|doubleclick.net$/i,
SidebarRegex = /sidebar/i,
MinimumAverageDistanceBetweenHRElements = 400,
MinimumAverageDistanceBetweenHeaderElements = 400,
PortionOfCandidateHeightToIgnoreForHeaderCheck = .1,
DefaultNumberOfTextNodesToCheckForLanguageMultiplier = 3,
NumberOfCharactersPerTextNodeToEvaluateForLanguageMultiplier = 12,
MinimumRatioOfCharactersForLanguageMultiplier = .5,
ScoreMultiplierForChineseJapaneseKorean = 3,
MinimumContentMediaHeight = 150,
MinimumContentMediaWidthToArticleWidthRatio = .25,
MaximumContentMediaAreaToArticleAreaRatio = .2,
LinkContinueMatchRegEx = /continue/gi,
LinkNextMatchRegEx = /next/gi,
LinkPageMatchRegEx = /page/gi,
LinkListItemBonus = 5,
LinkPageMatchBonus = 10,
LinkNextMatchBonus = 15,
LinkContinueMatchBonus = 15,
LinkNextOrdinalValueBase = 3,
LinkMismatchValueBase = 2,
LinkMatchWeight = 200,
LinkMaxVerticalDistanceFromArticle = 200,
LinkVerticalDistanceFromArticleWeight = 150,
LinkCandidateXPathQuery = "descendant-or-self::*[(not(@id) or (@id!='disqus_thread' and @id!='comments')) and (not(@class) or @class!='userComments')]/a",
LinkDateRegex = /\D(?:\d\d(?:\d\d)?[\-\/](?:10|11|12|0?[1-9])[\-\/](?:30|31|[12][0-9]|0?[1-9])|\d\d(?:\d\d)?\/(?:10|11|12|0[1-9])|(?:10|11|12|0?[1-9])\-(?:30|31|[12][0-9]|0?[1-9])\-\d\d(?:\d\d)?|(?:30|31|[12][0-9]|0?[1-9])\-(?:10|11|12|0?[1-9])\-\d\d(?:\d\d)?)\D/,
LinkURLSearchParameterKeyMatchRegex = /(page|^p$|^pg$)/i,
LinkURLPageSlashNumberMatchRegex = /\/.*page.*\/\d+/i,
LinkURLSlashDigitEndMatchRegex = /\/\d+\/?$/,
LinkURLArchiveSlashDigitEndMatchRegex = /archives?\/\d+\/?$/,
LinkURLBadSearchParameterKeyMatchRegex = /author|comment|feed|id|nonce|related/i,
LinkURLSemanticMatchBonus = 100,
LinkMinimumURLSimilarityRatio = .75,
HeaderMinimumDistanceFromArticleTop = 200,
HeaderLevenshteinDistanceToLengthRatio = .75,
MinimumRatioOfListItemsBeingRelatedToSharingToPruneEntireList = .5,
FloatMinimumHeight = 130,
ImageSizeTiny = 32,
ToleranceForLeadingImageWidthToArticleWidthForFullWidthPresentation = 50,
MaximumFloatWidth = 325,
AnchorImageMinimumWidth = 100,
AnchorImageMinimumHeight = 100,
MinimumHeightForImagesAboveTheArticleTitle = 50,
MainImageMinimumWidthAndHeight = 83,
BaseFontSize = 16,
BaseLineHeightRatio = 1.125,
MaximumExactIntegralValue = 9007199254740992,
TitleCandidateDepthScoreMultiplier = .1,
TextNodeLengthPower = 1.25,
LazyLoadRegex = /lazy/i,
StringSimilarityToDeclareStringsNearlyIdentical = .97,
FindArticleMode = {
Element: !1,
ExistenceOfElement: !0
},
AppleDotComAndSubdomainsRegex = /.*\.apple\.com\.?$/,
SchemaDotOrgArticleContainerSelector = "*[itemtype='https://schema.org/Article'], *[itemtype='https://schema.org/NewsArticle'], *[itemtype='http://schema.org/Article'], *[itemtype='http://schema.org/NewsArticle']",
CleaningType = {
MainArticleContent: 0,
MetadataContent: 1,
LeadingFigure: 2
},
MaximumWidthOrHeightOfImageInMetadataSection = 20,
TweetURLRegex = /^https?:\/\/(.+\.)?twitter\.com\/.*\/status\/(.*\/)*[0-9]+\/?$/i,
TweetIframeTitleRegex = /tweet/i;
CandidateElement = function(e, t) {
    this.element = e, this.contentDocument = t, this.textNodes = this.usableTextNodesInElement(this.element), this.rawScore = this.calculateRawScore(), this.tagNameAndAttributesScoreMultiplier = this.calculateElementTagNameAndAttributesScoreMultiplier(), this.languageScoreMultiplier = 0, this.depthInDocument = 0
}, CandidateElement.extraArticleCandidateIfElementIsViable = function(e, t, n, i) {
    const r = "a, b, strong, i, em, u, span";
    var a = cachedElementBoundingRect(e),
    o = cachedElementBoundingRect(t.element);
    if ((i && a.height < PrependedArticleCandidateMinimumHeight || !i && a.height < AppendedArticleCandidateMinimumHeight) && e.childElementCount && e.querySelectorAll("*").length !== e.querySelectorAll(r).length)
        return null;
    if (i) {
        if (a.bottom > o.top)
            return null
            } else if (a.top < o.bottom)
                return null;
    if (!i) {
        var l = a.top - o.bottom;
        if (l > AppendedArticleCandidateMaximumVerticalDistanceFromArticle)
            return null
            }
    if (a.left > o.right || a.right < o.left)
        return null;
    if (elementLooksLikePartOfACarousel(e))
        return null;
    var s = new CandidateElement(e, n);
    return s.isPrepended = i, s
}, CandidateElement.candidateIfElementIsViable = function(e, t, n) {
    var i = cachedElementBoundingRect(e);
    return i.width < CandidateMinimumWidth || i.height < CandidateMinimumHeight ? null : i.width * i.height < CandidateMinimumArea ? null : !n && i.top > CandidateMaximumTop ? null : CandidateElement.candidateElementAdjustedHeight(e) < CandidateMinimumHeight ? null : new CandidateElement(e, t)
}, CandidateElement.candidateElementAdjustedHeight = function(e) {
    for (var t = cachedElementBoundingRect(e), n = t.height, i = e.getElementsByTagName("form"), r = i.length, a = 0; r > a; ++a) {
        var o = i[a],
        l = cachedElementBoundingRect(o);
        l.width > t.width * CandidateMinimumWidthPortionForIndicatorElements && (n -= l.height)
    }
    for (var s = e.querySelectorAll("ol, ul"), c = s.length, u = null, a = 0; c > a; ++a) {
        var m = s[a];
        if (!(u && u.compareDocumentPosition(m) & Node.DOCUMENT_POSITION_CONTAINED_BY)) {
            var d = m.getElementsByTagName("li"),
            h = d.length,
            g = cachedElementBoundingRect(m);
            if (h) {
                var f = g.height / h,
                p = getComputedStyle(d[0]),
                E = parseInt(p.lineHeight);
                if (isNaN(E)) {
                    var v = fontSizeFromComputedStyle(p);
                    E = v * BaseLineHeightRatio
                }
                g.width > t.width * CandidateMinimumWidthPortionForIndicatorElements && CandidateMinumumListItemLineCount > f / E && (n -= g.height, u = m)
            } else
                n -= g.height
                }
    }
    return n
}, CandidateElement.prototype = {
calculateRawScore: function() {
    for (var e = 0, t = this.textNodes, n = t.length, i = 0; n > i; ++i)
        e += this.rawScoreForTextNode(t[i]);
    return e
},
calculateElementTagNameAndAttributesScoreMultiplier: function() {
    return scoreMultiplierForElementTagNameAndAttributes(this.element)
},
calculateLanguageScoreMultiplier: function() {
    0 === this.languageScoreMultiplier && (this.languageScoreMultiplier = languageScoreMultiplierForTextNodes(this.textNodes))
},
depth: function() {
    return this.depthInDocument || (this.depthInDocument = elementDepth(this.element)), this.depthInDocument
},
finalScore: function() {
    return this.calculateLanguageScoreMultiplier(), this.basicScore() * this.languageScoreMultiplier
},
basicScore: function() {
    return this.rawScore * this.tagNameAndAttributesScoreMultiplier
},
scoreDensity: function() {
    var e = 0,
    t = this.element.querySelector(DensityExcludedElementSelector);
    t && (e = t.clientWidth * t.clientHeight);
    for (var n = this.element.children || [], i = n.length, r = 0; i > r; ++r) {
        var a = n[r];
        elementIsCommentBlock(a) && (e += a.clientWidth * a.clientHeight)
    }
    for (var o = cachedElementBoundingRect(this.element).width * cachedElementBoundingRect(this.element).height, l = o * MaximumContentMediaAreaToArticleAreaRatio, s = cachedElementBoundingRect(this.element).width * MinimumContentMediaWidthToArticleWidthRatio, c = this.element.querySelectorAll("img, object, video"), u = c.length, r = 0; u > r; ++r) {
        var m = cachedElementBoundingRect(c[r]);
        if (m.width >= s && m.height > MinimumContentMediaHeight) {
            var d = m.width * m.height;
            l > d && (e += d)
        }
    }
    for (var h = this.basicScore(), g = o - e, f = this.textNodes.length, p = 0, E = 0, r = 0; f > r; ++r) {
        var v = this.textNodes[r].parentNode;
        v && (E += fontSizeFromComputedStyle(getComputedStyle(v)), p++)
    }
    var N = BaseFontSize;
    return p && (N = E /= p), this.calculateLanguageScoreMultiplier(), h / g * 1e3 * (N / BaseFontSize) * this.languageScoreMultiplier
},
usableTextNodesInElement: function(e) {
    var t = [];
    if (!e)
        return t;
    const n = {
    A: 1,
    DD: 1,
    DT: 1,
    NOSCRIPT: 1,
    OL: 1,
    OPTION: 1,
    PRE: 1,
    SCRIPT: 1,
    STYLE: 1,
    TD: 1,
    UL: 1,
    IFRAME: 1
    };
    var i = this.contentDocument,
    r = function(e) {
        const r = "text()|*/text()|*/a/text()|*/li/text()|*/li/p/text()|*/span/text()|*/em/text()|*/i/text()|*/strong/text()|*/b/text()|*/font/text()|blockquote/*/text()|div[count(./p)=count(./*)]/p/text()|div[count(*)=1]/div/p/text()|div[count(*)=1]/div/p/*/text()";
        for (var a = i.evaluate(r, e, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), o = a.snapshotLength, l = 0; o > l; ++l) {
            var s = a.snapshotItem(l);
            n[s.parentNode.tagName] || s._countedTextNode || isNodeWhitespace(s) || (s._countedTextNode = !0, t.push(s))
        }
    };
    r(e);
    for (var a = childrenWithParallelStructure(e), o = a.length, l = 0; o > l; ++l) {
        var s = a[l];
        r(s)
    }
    for (var c = t.length, l = 0; c > l; ++l)
        delete t[l]._countedTextNode;
    return t
},
addTextNodesFromCandidateElement: function(e) {
    for (var t = this.textNodes.length, n = 0; t > n; ++n)
        this.textNodes[n].alreadyCounted = !0;
    for (var i = e.textNodes, r = i.length, n = 0; r > n; ++n)
        i[n].alreadyCounted || this.textNodes.push(i[n]);
    for (var t = this.textNodes.length, n = 0; t > n; ++n)
        this.textNodes[n].alreadyCounted = null;
    this.rawScore = this.calculateRawScore()
},
rawScoreForTextNode: function(e) {
    const t = 20;
    if (!e)
        return 0;
    var n = e.length;
    if (t > n)
        return 0;
    var i = e.parentNode;
    if (!isElementVisible(i))
        return 0;
    for (var r = 1; i && i !== this.element;)
        r -= .1, i = i.parentNode;
    return Math.pow(n * r, TextNodeLengthPower)
},
shouldDisqualifyDueToScoreDensity: function() {
    return this.scoreDensity() < ArticleMinimumScoreDensity
},
shouldDisqualifyDueToHorizontalRuleDensity: function() {
    for (var e = this.element.getElementsByTagName("hr"), t = e.length, n = 0, i = cachedElementBoundingRect(this.element), r = .7 * i.width, a = 0; t > a; ++a)
        e[a].clientWidth > r && n++;
    if (n) {
        var o = i.height / n;
        if (MinimumAverageDistanceBetweenHRElements > o)
            return !0
            }
    return !1
},
shouldDisqualifyDueToHeaderDensity: function() {
    var e = "(h1|h2|h3|h4|h5|h6|*/h1|*/h2|*/h3|*/h4|*/h5|*/h6)[a[@href]]",
    t = this.contentDocument.evaluate(e, this.element, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null),
    n = t.snapshotLength;
    if (n > 2) {
        for (var i = 0, r = cachedElementBoundingRect(this.element), a = r.height * PortionOfCandidateHeightToIgnoreForHeaderCheck, o = 0; n > o; ++o) {
            var l = t.snapshotItem(o),
            s = cachedElementBoundingRect(l);
            s.top - r.top > a && r.bottom - s.bottom > a && i++
        }
        var c = r.height / i;
        if (MinimumAverageDistanceBetweenHeaderElements > c)
            return !0
            }
    return !1
},
shouldDisqualifyDueToSimilarElements: function(e) {
    function t(e, t) {
        if (!e || !t)
            return !1;
        var n = 1;
        return e.className ? e.className === t.className : elementFingerprintForDepth(e, n) === elementFingerprintForDepth(t, n)
    }
    const n = "h1, h2, h3, h4, h5, h6";
    var i = function(e) {
        const t = /related-posts/i;
        for (var n = e.parentElement; n && n !== this.contentDocument.body; n = n.parentElement)
            if (t.test(n.className))
                return !0;
        return !1
    }.bind(this),
    r = this.element;
    if ("ARTICLE" === r.parentElement.tagName)
        return !1;
    if ("LI" === r.tagName || "DD" === r.tagName)
        for (var a = r.parentNode, o = a.children.length, l = 0; o > l; ++l) {
            var s = a.children[l];
            if (s.tagName === r.tagName && s.className === r.className && s !== r)
                return !0
                }
    var c = r.classList;
    if (c.length || (r = r.parentElement, r && (c = r.classList, c.length || (r = r.parentElement, r && (c = r.classList)))), c.length) {
        e || (e = []);
        for (var u = e.length, l = 0; u > l; ++l)
            e[l].element.candidateElement = e[l];
        for (var m = elementsMatchingClassesInClassListIgnoringCommonLayoutClassNames(c, this.contentDocument), d = !1, h = elementDepth(r), g = i(r), f = m.length, l = 0; f > l; ++l) {
            var s = m[l];
            if (s !== r && s.parentElement !== r && r.parentElement !== s && isElementVisible(s)) {
                var p = s.candidateElement;
                if ((p || (p = new CandidateElement(s, this.contentDocument))) && p.basicScore() * ReaderMinimumAdvantage > this.basicScore()) {
                    if (s.closest("section") && r.closest("section"))
                        return !1;
                    if (SectionRegex.test(s.className) && SectionRegex.test(r.className))
                        return !1;
                    if (i(s) && !g)
                        return !1;
                    if (!d && cachedElementBoundingRect(s).bottom < cachedElementBoundingRect(this.element).top) {
                        d = !0;
                        continue
                    }
                    if (t(r.previousElementSibling, s.previousElementSibling) || t(r.nextElementSibling, s.nextElementSibling)) {
                        var E = r.querySelector(n),
                        v = s.querySelector(n);
                        if (E && v && elementsHaveSameTagAndClassNames(E, v))
                            return !0;
                        if (E = r.previousElementSibling, v = s.previousElementSibling, E && v && elementIsAHeader(E) && elementIsAHeader(v) && elementsHaveSameTagAndClassNames(E, v))
                            return !0
                            }
                    if (elementDepth(s) === h)
                        for (; s.parentElement && r.parentElement && s.parentElement !== r.parentElement;)
                            s = s.parentElement, r = r.parentElement;
                    for (; r.childElementCount <= 1;) {
                        if (!r.childElementCount || !s.childElementCount)
                            return !1;
                        if (s.childElementCount > 1)
                            return !1;
                        if (r.firstElementChild.tagName !== s.firstElementChild.tagName)
                            return !1;
                        r = r.firstElementChild, s = s.firstElementChild
                    }
                    if (s.childElementCount <= 1)
                        return !1;
                    var v = s.firstElementChild,
                    N = s.lastElementChild,
                    E = r.firstElementChild,
                    C = r.lastElementChild;
                    if (v.tagName !== E.tagName)
                        return !1;
                    if (N.tagName !== C.tagName)
                        return !1;
                    var A = v.className,
                    S = N.className,
                    R = E.className,
                    M = N.className,
                    b = M === R ? 2 : 1;
                    if (A.length || R.length) {
                        if (!A.length || !R.length)
                            return !1;
                        if (A === R && elementsMatchingClassesInClassList(E.classList, r).length <= b)
                            return !0
                            }
                    if (S.length || M.length) {
                        if (!S.length || !M.length)
                            return !1;
                        if (S === M && elementsMatchingClassesInClassList(N.classList, r).length <= b)
                            return !0
                            }
                    var y = E.clientHeight,
                    x = C.clientHeight;
                    return y && v.clientHeight && x && N.clientHeight ? y === v.clientHeight || x === N.clientHeight : !1
                }
            }
        }
        for (var l = 0; u > l; ++l)
            e[l].element.candidateElement = null
            }
    return !1
},
shouldDisqualifyForDeepLinking: function() {
    function e(e) {
        var t = e.pathname.substring(1).split("/");
        return t[t.length - 1] || t.pop(), t
    }
    const t = 5;
    for (var n = this.element, i = this.contentDocument.location, r = e(i), a = r.length, o = [], l = n.getElementsByTagName("a"), s = l.length, c = 0; s > c; c++) {
        var u = l[c];
        if (i.host === u.host && !(e(u).length <= a || 0 !== (u.host + u.pathname).indexOf(i.host + i.pathname) || anchorLinksToAttachment(u) || (o.push(u), o.length < t))) {
            var m = n.offsetTop + n.offsetHeight / t;
            return o[0].offsetTop < m
        }
    }
    return !1
}
}, String.prototype.lastInteger = function() {
    const e = /[0-9]+/g;
    var t = this.match(e);
    return t ? parseInt(t[t.length - 1]) : NaN
};
ReaderArticleFinder = function(e) {
    this.contentDocument = e, this.didSearchForArticleNode = !1, this.article = null, this.didSearchForExtraArticleNode = !1, this.extraArticle = null, this.leadingImage = null, this._cachedScrollY = 0, this._cachedScrollX = 0, this._elementsWithCachedBoundingRects = [], this._cachedContentTextStyle = null, this.pageNumber = 1, this.prefixWithDateForNextPageURL = null, this.previouslyDiscoveredPageURLStrings = []
}, ReaderArticleFinder.prototype = {
isReaderModeAvailable: function() {
    return this.findArticleBySearchingWhitelist() ? !0 : (this.cacheWindowScrollPosition(), this.findArticleFromMetadata(FindArticleMode.ExistenceOfElement) ? !0 : (this.article = this.findArticleByVisualExamination(), this.article && this.articleIsLTR(), !!this.article))
},
prepareToTransitionToReader: function() {
    this.adoptableArticle(!0), this.nextPageURL(), this.articleIsLTR()
},
nextPageURL: function() {
    if (!this._nextPageURL) {
        var e = this.nextPageURLString();
        "undefined" != typeof ReaderArticleFinderJSController && e && (e = ReaderArticleFinderJSController.substituteURLForNextPageURL(e)), this._nextPageURL = e
    }
    return this._nextPageURL
},
containerElementsForMultiPageContent: function() {
    const e = /(.*page[^0-9]*|.*article.*item[^0-9]*)(\d{1,2})(.*)/i,
    t = 3;
    for (var n, i = [], r = this.articleNode(), a = 0;;) {
        if (n = e.exec(r.getAttribute("id")))
            break;
        if (r = r.parentElement, !r || a++ === t)
            return []
            }
    for (var l = childrenOfParentElement(r), o = l.length, s = 0; o > s; ++s) {
        var c = l[s];
        if (c !== r) {
            var m = e.exec(c.getAttribute("id"));
            m && m[1] === n[1] && m[3] === n[3] && (isElementVisible(c) && !isElementPositionedOffScreen(c) || i.push(c))
        }
    }
    return i
},
adoptableMultiPageContentElements: function() {
    return this.containerElementsForMultiPageContent().map(function(e) {
                                                           return this.cleanArticleNode(e, e.cloneNode(!0), CleaningType.MainArticleContent, !1)
                                                           }, this)
},
classNameIsSignificantInRouteComputation: function(e) {
    return e ? !(e.toLowerCase() in StylisticClassNames) : !1
},
shouldIgnoreInRouteComputation: function(e) {
    return "SCRIPT" === e.tagName || "LINK" === e.tagName || "STYLE" === e.tagName ? !0 : "TR" !== e.tagName ? !1 : !e.offsetHeight
},
routeToArticleNode: function() {
    for (var e = [], t = this.articleNode(); t;) {
        var n = {};
        n.tagName = t.tagName;
        var i = t.getAttribute("id");
        i && (n.id = i), this.classNameIsSignificantInRouteComputation(t.className) && (n.className = t.className), n.index = 1;
        for (var r = t.previousElementSibling; r; r = r.previousElementSibling)
            this.shouldIgnoreInRouteComputation(r) || n.index++;
        e.unshift(n), t = t.parentElement
    }
    return e
},
adjustArticleNodeUpwardIfNecessary: function() {
    if (this.article) {
        var e;
        for (e = this.article.element; e; e = e.parentElement)
            if (VeryPositiveClassNameRegEx.test(e.className))
                return void (this.article.element = e);
        if (e = this.article.element, "HEADER" === e.tagName && "ARTICLE" === e.parentElement.tagName)
            return void (this.article.element = e.parentElement);
        var t = e.previousElementSibling;
        if (t && "FIGURE" === t.tagName && "ARTICLE" === e.parentElement.tagName)
            return void (this.article.element = e.parentElement);
        var n = "SECTION" === e.tagName ? e : nearestAncestorElementWithTagName(e, "SECTION", ["ARTICLE"]);
        if (n) {
            var i = n.parentElement,
            r = function() {
                for (var e = i.children, t = e.length, r = 0; t > r; ++r) {
                    var a = e[r],
                    l = a.tagName;
                    if (a !== n && ("SECTION" === l || "HEADER" === l))
                        return !0
                        }
                return !1
            }();
            if (r && (/\barticleBody\b/.test(i.getAttribute("itemprop")) || "MAIN" === i.tagName || "main" === i.getAttribute("role") || "ARTICLE" === i.tagName || i === this.contentDocument.body))
                return void (this.article.element = i)
                }
        const a = /intro/i,
        l = /body|content/i;
        if (e = this.article.element, a.test(e.className) && e.nextElementSibling && l.test(e.nextElementSibling.className) || l.test(e.className) && e.previousElementSibling && a.test(e.previousElementSibling.className))
            return void (this.article.element = e.parentElement);
        if ("ARTICLE" !== e.tagName) {
            var o = e.parentElement.closest("*[itemprop='articleBody']");
            if (o && o.parentElement.closest(SchemaDotOrgArticleContainerSelector))
                return void (this.article.element = o)
                }
        var s = e.closest("article");
        if (s) {
            e = unwrappedArticleContentElement(e);
            var c = elementDepth(e);
            "P" !== e.tagName || e.className || (e = e.parentElement, c--);
            var m = elementsMatchingClassesInClassListIgnoringCommonLayoutClassNames(e.classList, this.contentDocument);
            1 === m.length && (m = elementsMatchingClassesInClassListIgnoringClassesWithNumericSuffix(e.classList, this.contentDocument));
            for (var d = m.length, h = 0; d > h; ++h) {
                var u = m[h];
                if (e !== u && c === elementDepth(u) && isElementVisible(u) && !u.querySelector("article") && dominantFontFamilyAndSizeForElement(e) === dominantFontFamilyAndSizeForElement(u))
                    return void (this.article.element = s)
                    }
        }
        if (e = this.article.element, !e.getAttribute("id") && e.className) {
            var g = e.tagName,
            f = e.className,
            p = e.parentElement;
            if (p)
                for (var v = p.children, h = 0, E = v.length; E > h; ++h) {
                    var N = v[h];
                    if (N !== e && N.tagName === g && N.className === f) {
                        var S = CandidateElement.candidateIfElementIsViable(N, this.contentDocument, !0);
                        if (S && !(S.finalScore() < ReaderMinimumScore))
                            return void (this.article.element = p)
                            }
                }
        }
    }
},
findArticleBySearchingWhitelist: function() {
    var e,
    t = this.contentDocument;
    return findArticleNodeSelectorsInWhitelistForHostname(t.location.hostname, function(n) {
                                                          var i = t.querySelectorAll(n);
                                                          return 1 === i.length ? (e = new CandidateElement(i[0], t), !0) : void 0
                                                          }), e
},
articleNode: function(e) {
    return this.didSearchForArticleNode || (this.article = this.findArticleBySearchingWhitelist(), this.article || (this.article = this.findArticleBySearchingAllElements()), this.article || (this.article = this.findArticleByVisualExamination()), this.article || (this.article = this.findArticleFromMetadata()), !this.article && e && (this.article = this.findArticleBySearchingAllElements(!0)), this.adjustArticleNodeUpwardIfNecessary(), this.article && (this.article.element = unwrappedArticleContentElement(this.article.element)), this.didSearchForArticleNode = !0, this.article && this.articleIsLTR()), this.article ? this.article.element : null
},
extraArticleNode: function() {
    return this.didSearchForArticleNode || this.articleNode(), this.didSearchForExtraArticleNode || (this.extraArticle = this.findExtraArticle(), this.didSearchForExtraArticleNode = !0), this.extraArticle ? this.extraArticle.element : null
},
cacheWindowScrollPosition: function() {
    this._cachedScrollY = window.scrollY, this._cachedScrollX = window.scrollX
},
contentTextStyle: function() {
    return this._cachedContentTextStyle ? this._cachedContentTextStyle : (this._cachedContentTextStyle = contentTextStyleForNode(this.contentDocument, this.articleNode()), this._cachedContentTextStyle || (this._cachedContentTextStyle = getComputedStyle(this.articleNode())), this._cachedContentTextStyle)
},
commaCountIsLessThan: function(e, t) {
    for (var n = 0, i = e.textContent, r = -1; t > n && (r = i.indexOf(",", r + 1)) >= 0;)
        n++;
    return t > n
},
calculateLinkDensityForPruningElement: function(e, t) {
    var n = removeWhitespace(e.textContent).length;
    if (!n)
        return 0;
    for (var i = this.article.element, r = function() {
         for (var t = e.originalElement; t && t !== i; t = t.parentElement)
         if ("none" !== getComputedStyle(t)["float"])
         return t;
         return null
         }(), a = e.getElementsByTagName("a"), l = 0, o = a.length, s = 0; o > s; ++s) {
        var c = a[s];
        !r && c.href && t && t === dominantFontFamilyAndSizeForElement(c.originalElement) || (l += removeWhitespace(c.textContent).length)
    }
    return l / n
},
shouldPruneElement: function(e, t, n) {
    const i = .33,
    r = .5,
    a = .2,
    l = 25,
    o = 4e4;
    var s = e.tagName;
    if (!e.parentElement)
        return !1;
    if (t.classList.contains("footnotes"))
        return !1;
    if ("FIGURE" === e.parentElement.tagName && e.querySelector("img"))
        return !1;
    if ("IFRAME" === s)
        return shouldPruneIframe(e, this.contentDocument);
    if ("OBJECT" !== s && "EMBED" !== s && "CANVAS" !== s) {
        for (var c = !1, m = e.childNodes.length, d = 0; m > d; ++d) {
            var h = e.childNodes[d],
            u = h.nodeType;
            if (u === Node.ELEMENT_NODE || u === Node.TEXT_NODE && !isNodeWhitespace(h)) {
                c = !0;
                break
            }
        }
        if (!c) {
            if ("P" === s) {
                var g = e.previousSibling,
                f = e.nextSibling;
                if (g && g.nodeType === Node.TEXT_NODE && !isNodeWhitespace(g) && f && f.nodeType === Node.TEXT_NODE && !isNodeWhitespace(f))
                    return !1
                    }
            return !0
        }
        if ("P" === s)
            return !1
            }
    if ("CANVAS" === s) {
        if (window.innerWidth === t.width && window.innerHeight === t.height)
            return !0;
        const p = /progressive/i;
        return p.test(t.className) && "IMG" === t.nextElementSibling.tagName ? !0 : canvasElementHasNoUserVisibleContent(t) ? !0 : "CUFON" === e.parentNode.tagName
    }
    if (e.closest("figure") && e.querySelector("picture"))
        return !1;
    var v = 0;
    if (t) {
        if (VeryNegativeClassNameRegEx.test(t.className))
            return !0;
        var E = t.className,
        N = t.getAttribute("id");
        PositiveRegEx.test(E) && v++, PositiveRegEx.test(N) && v++, NegativeRegEx.test(E) && v--, NegativeRegEx.test(N) && v--
    }
    if (0 > v)
        return !0;
    if (elementIsProtected(e) || e.querySelector(".tweet-wrapper"))
        return !1;
    if ("UL" === s || "OL" === s) {
        if (t.querySelector("iframe") && t.querySelector("script"))
            return !0;
        var S = t.children,
        T = S.length;
        if (!T)
            return !0;
        for (var y = 0, A = 0, d = 0; T > d; ++d) {
            var b = S[d];
            if (SharingRegex.test(b.className))
                y++;
            else {
                var C = b.children,
                x = C.length;
                1 === x && SharingRegex.test(C[0].className) && y++
            }
            NegativeRegEx.test(S[d].className) && A++
        }
        return y / T >= MinimumRatioOfListItemsBeingRelatedToSharingToPruneEntireList ? !0 : A / T >= MinimumRatioOfListItemsBeingRelatedToSharingToPruneEntireList
    }
    if ("OBJECT" === s) {
        var D = e.querySelector("embed[src]"),
        I = D ? anchorForURL(D.src, this.contentDocument) : null;
        if (I && hostnameMatchesHostKnownToContainEmbeddableMedia(I.hostname))
            return !1;
        var R = e.getAttribute("data");
        return I = R ? anchorForURL(R, this.contentDocument) : null, !I || !hostnameMatchesHostKnownToContainEmbeddableMedia(I.hostname)
    }
    if (1 === e.childElementCount) {
        var L = e.firstElementChild;
        if ("A" === L.tagName)
            return !1;
        if ("SPAN" === L.tagName && "converted-anchor" === L.className && nearestAncestorElementWithTagName(L, "TABLE"))
            return !1
            }
    var M = e.getElementsByTagName("img"),
    B = M.length;
    if (B) {
        for (var F = 0, d = 0; B > d; ++d) {
            var O = M[d].originalElement;
            if (isElementVisible(O)) {
                var P = cachedElementBoundingRect(O);
                F += P.width / B * (P.height / B)
            }
        }
        if (F > o)
            return !1
            }
    if (!this.commaCountIsLessThan(e, 10))
        return !1;
    var _ = e.getElementsByTagName("p").length,
    w = e.getElementsByTagName("br").length,
    q = _ + Math.floor(w / 2);
    if (B > q)
        return !0;
    var k = e.closest("table");
    if (!k) {
        if (e.getElementsByTagName("li").length > q && dominantFontFamilyAndSizeForElement(t.querySelector("li")) !== n)
            return !0;
        if (e.textContent.length < l && 1 !== B)
            return !0;
        var W = this.calculateLinkDensityForPruningElement(e, n);
        if (v >= 1 && W > r)
            return !0;
        if (1 > v && W > a)
            return !0
            }
    if (e.getElementsByTagName("input").length / q > i)
        return !0;
    if (e.querySelector("embed"))
        return !0;
    if ("TABLE" === s) {
        var U = removeWhitespace(e.innerText).length,
        H = removeWhitespace(t.innerText).length;
        if (.5 * H >= U)
            return !0;
        if (this.isMediaWikiPage() && t.classList.contains("toc"))
            return !0
            }
    return !1
},
wordCountIsLessThan: function(e, t) {
    for (var n = 0, i = e.textContent, r = -1; (r = i.indexOf(" ", r + 1)) >= 0 && t > n;)
        n++;
    return t > n
},
leadingImageIsAppropriateWidth: function(e) {
    return this.article && e ? e.getBoundingClientRect().width >= this.article.element.getBoundingClientRect().width - ToleranceForLeadingImageWidthToArticleWidthForFullWidthPresentation : !1
},
newDivFromNode: function(e) {
    var t = this.contentDocument.createElement("div");
    return e && (t.innerHTML = e.innerHTML), t
},
headerElement: function() {
    if (!this.article)
        return null;
    var e = this.article.element.previousElementSibling;
    if (e && "HEADER" === e.tagName)
        return e;
    var t = this._articleTitleElement;
    if (!t)
        return null;
    var n = t.parentElement;
    if (n && "HEADER" === n.tagName && !this.article.element.contains(n))
        for (var i = n.querySelectorAll("img"), r = i.length, a = 0; r > a; ++a) {
            var l = i[a],
            o = cachedElementBoundingRect(l);
            if (o.width >= MainImageMinimumWidthAndHeight && o.height >= MainImageMinimumWidthAndHeight)
                return n
                }
    return null
},
adoptableLeadingImage: function() {
    const e = 5,
    t = /credit/,
    n = /caption/,
    i = /src|alt/;
    if (!this.article || !this.leadingImage || !this.leadingImageIsAppropriateWidth(this.leadingImage))
        return null;
    var r = this.leadingImage.closest("figure");
    if (r)
        return this.cleanArticleNode(r, r.cloneNode(!0), CleaningType.LeadingFigure, !0);
    var a = this.leadingImage.parentNode,
    l = null,
    o = null,
    s = a.children.length;
    if ("DIV" === a.tagName && s > 1 && e > s)
        for (var c = a.cloneNode(!0).querySelectorAll("p, div"), m = c.length, d = 0; m > d; ++d) {
            var h = c[d];
            t.test(h.className) ? l = h.cloneNode(!0) : n.test(h.className) && (o = h.cloneNode(!0))
        }
    for (var u = this.leadingImage.cloneNode(!1), g = u.attributes, d = 0; d < g.length; ++d) {
        var f = g[d].nodeName;
        i.test(f) || (u.removeAttribute(f), d--)
    }
    var p = this.contentDocument.createElement("div");
    if (p.className = "leading-image", p.appendChild(u), l) {
        var v = this.newDivFromNode(l);
        v.className = "credit", p.appendChild(v)
    }
    if (o) {
        var E = this.newDivFromNode(o);
        E.className = "caption", p.appendChild(E)
    }
    return p
},
articleBoundingRect: function() {
    return this._articleBoundingRect ? this._articleBoundingRect : (this._articleBoundingRect = cachedElementBoundingRect(this.article.element), this._articleBoundingRect)
},
adoptableArticle: function(e) {
    if (this._adoptableArticle)
        return this._adoptableArticle.cloneNode(!0);
    clearCachedElementBoundingRects(), this.cacheWindowScrollPosition();
    var t = this.articleNode(e);
    if (this._adoptableArticle = t ? t.cloneNode(!0) : null, !this._adoptableArticle)
        return this._adoptableArticle;
    if (this._adoptableArticle = this.cleanArticleNode(t, this._adoptableArticle, CleaningType.MainArticleContent, !1), "P" === this._adoptableArticle.tagName) {
        var n = document.createElement("div");
        n.appendChild(this._adoptableArticle), this._adoptableArticle = n
    }
    var i = this.extraArticleNode();
    if (i) {
        var r = this.cleanArticleNode(i, i.cloneNode(!0), CleaningType.MainArticleContent, !0);
        r && (this.extraArticle.isPrepended ? this._adoptableArticle.insertBefore(r, this._adoptableArticle.firstChild) : this._adoptableArticle.appendChild(r));
        var a = cachedElementBoundingRect(this.article.element),
        l = cachedElementBoundingRect(this.extraArticle.element),
        o = {
        top: Math.min(a.top, l.top),
        right: Math.max(a.right, l.right),
        bottom: Math.max(a.bottom, l.bottom),
        left: Math.min(a.left, l.left)
        };
        o.width = o.right - o.left, o.height = o.bottom - o.top, this._articleBoundingRect = o
    }
    this._articleTextContent = this._adoptableArticle.innerText;
    var s = this.headerElement();
    if (this.leadingImage && (!s || !s.contains(this.leadingImage))) {
        var c = this.adoptableLeadingImage();
        c && this._adoptableArticle.insertBefore(c, this._adoptableArticle.firstChild)
    }
    var m = !!s;
    if (m && i && (i === s && (m = !1), m)) {
        var d = i.compareDocumentPosition(s);
        (d & Node.DOCUMENT_POSITION_CONTAINS || d & Node.DOCUMENT_POSITION_CONTAINED_BY) && (m = !1)
    }
    if (m) {
        var h = this.cleanArticleNode(s, s.cloneNode(!0), CleaningType.MainArticleContent, !0);
        h && this._adoptableArticle.insertBefore(h, this._adoptableArticle.firstChild)
    }
    return this._adoptableArticle
},
elementPinToEdge: function(e) {
    const t = {
    AREA: 1,
    BR: 1,
    CANVAS: 1,
    EMBED: 1,
    FRAME: 1,
    HR: 1,
    IMG: 1,
    INPUT: 1
    },
    n = 120;
    if (window.scrollY < n)
        return null;
    var i = cachedElementBoundingRect(e),
    r = e.ownerDocument.elementFromPoint((i.left + i.right) / 2, 0);
    r && r.tagName in t && (r = r.parentElement);
    for (var a = r; a && a !== e;)
        a = a.parentNode;
    return a ? r : null
},
dominantContentSelectorAndDepth: function(e) {
    const t = 2;
    var n = {},
    i = {};
    walkElementSubtree(e, t, function(e, t) {
                       if (isElementVisible(e)) {
                       var r = selectorForElement(e) + " | " + t;
                       i[r] ? i[r] += 1 : (i[r] = 1, n[r] = e)
                       }
                       });
    var r,
    a = arrayOfKeysAndValuesOfObjectSortedByValueDescending(i);
    switch (a.length) {
        case 0:
            break;
        case 1:
            r = a[0].key;
            break;
        default:
            var l = a[0];
            l.value > a[1].value && (r = l.key)
    }
    if (!r)
        return null;
    var o = n[r];
    return {
    selector: selectorForElement(o),
    depth: depthOfElementWithinElement(o, e)
    }
},
functionToPreventPruningElementDueToInvisibility: function() {
    var e = functionToPreventPruningDueToInvisibilityInWhitelistForHostname(this.contentDocument.location.hostname);
    return e || function() {
        return !1
    }
},
cleanArticleNode: function(e, t, n, i) {
    function r(e) {
        v += e, E && (E += e), N && (N += e), S && (S += e), T && (T += e), y && (y += e)
    }
    function a() {
        1 === E && (E = 0), 1 === N && (N = 0), 1 === S && (S = 0), 1 === T && (T = 0), 1 === y && (y = 0)
    }
    function l() {
        const t = .8;
        var n = cachedElementBoundingRect(e);
        if (0 === n.width || 0 === n.height)
            return !0;
        var i,
        r = childrenWithParallelStructure(e),
        a = r.length;
        if (a) {
            i = [];
            for (var l = 0; a > l; ++l) {
                var o = r[l];
                if ("none" === getComputedStyle(o)["float"])
                    for (var s = o.children, c = s.length, m = 0; c > m; ++m)
                        i.push(s[m]);
                else
                    i.push(o)
                    }
        } else
            i = e.children;
        for (var d = i.length, h = 0, l = 0; d > l; ++l) {
            var u = i[l];
            "none" !== getComputedStyle(u)["float"] && (h += u.innerText.length)
        }
        var g = e.innerText.length,
        f = h / g;
        return f > t
    }
    function o(t) {
        const n = 50;
        if (cachedElementBoundingRect(t).height > n)
            return !1;
        const i = {
        UL: 1,
        LI: 1,
        NAV: 1
        };
        return i[t.tagName] ? !0 : t.parentElement === e && !t.nextElementSibling
    }
    function s(e, t) {
        const n = .9;
        return !(cachedElementBoundingRect(e).height > n * cachedElementBoundingRect(t).height)
    }
    function c(e, t) {
        const n = 1.1,
        i = 1.4;
        if (t && z) {
            var r = t > i * z || G.test(A.className) && t > n * z;
            r && !e.closest(".pullquote") && (e.classList.add("pullquote"), e.classList.contains("float") || (e.style.width = null, cleanStyleAndClassList(e)))
        }
    }
    function m(e, t) {
        for (var n = e[t]; n; n = n[t])
            if (!isNodeWhitespace(n) && n.nodeType !== Node.COMMENT_NODE)
                return !1;
        return !0
    }
    const d = {
    FORM: 1,
    SCRIPT: 1,
    STYLE: 1,
    LINK: 1,
    BUTTON: 1
    },
    h = {
    DIV: 1,
    TABLE: 1,
    OBJECT: 1,
    UL: 1,
    CANVAS: 1,
    P: 1,
    IFRAME: 1,
    ASIDE: 1,
    SECTION: 1,
    FOOTER: 1,
    NAV: 1,
    OL: 1,
    MENU: 1,
    svg: 1
    },
    u = {
    I: 1,
    EM: 1
    },
    g = {
    B: 1,
    STRONG: 1,
    H1: 1,
    H2: 1,
    H3: 1,
    H4: 1,
    H5: 1,
    H6: 1
    },
    f = /lightbox/i;
    var p = [],
    v = 0,
    E = 0,
    N = 0,
    S = 0,
    T = 0,
    y = 0,
    A = e,
    b = A.ownerDocument.defaultView,
    C = t,
    x = this.articleTitle(),
    D = this._articleTitleElement,
    I = (this.articleSubhead(), this._articleSubheadElement),
    R = D && cachedElementBoundingRect(D).top > cachedElementBoundingRect(e).bottom,
    L = this.elementPinToEdge(e),
    M = null,
    B = isElementVisible(e),
    F = new Set([D, I]),
    O = new Set;
    if (n === CleaningType.MainArticleContent) {
        this.updateArticleBylineAndDateElementsIfNecessary();
        var P = this.articleBylineElement();
        P && O.add(P);
        var _ = this.articleDateElement();
        _ && O.add(_)
    }
    var w = this.dominantContentSelectorAndDepth(e),
    q = l(),
    k = new Set;
    this.previouslyDiscoveredPageURLStrings.forEach(function(e) {
                                                    k.add(e)
                                                    });
    var W = this.nextPageURL();
    W && k.add(W);
    var U = null;
    this._articleTitleElement && (U = cachedElementBoundingRect(this._articleTitleElement));
    var H = this.functionToPreventPruningElementDueToInvisibility(),
    V = dominantFontFamilyAndSizeForElement(e),
    z = dominantFontSizeInPointsFromFontFamilyAndSizeString(V);
    const G = /pull(ed)?quote/i;
    for (var j = [], Y = []; A;) {
        var X = null,
        K = C.tagName,
        J = !1;
        if (C.originalElement = A, A === L && (M = C), !y && elementAppearsToBeCollapsed(A) && (y = 1), K in d && (X = C), !X && A !== e && F.has(A) ? X = C : !X && A !== e && O.has(A) ? (C.parentElementBeforePruning = C.parentElement, X = C, j.push(C)) : elementIsAHeader(C) && previousLeafElementForElement(A) === D && C.classList.add("protected"), !X && ("H1" === K || "H2" === K)) {
            var Q = A.offsetTop - e.offsetTop;
            if (Q < HeaderMinimumDistanceFromArticleTop) {
                var $ = trimmedInnerTextIgnoringTextTransform(A),
                Z = $.length * HeaderLevenshteinDistanceToLengthRatio;
                levenshteinDistance(x, $) <= Z && (X = C)
            }
        }
        if (X || this.isMediaWikiPage() && /editsection|icon-edit/.test(A.className) && (X = C), "VIDEO" === K)
            if (C.getAttribute("src")) {
                C.classList.add("protected");
                var ee = cachedElementBoundingRect(A);
                C.setAttribute("width", ee.width), C.setAttribute("height", ee.height), C.setAttribute("controls", !0), C.removeAttribute("autoplay"), C.removeAttribute("preload"), C.removeAttribute("style")
            } else
                X = C;
        var te;
        if (X || (te = getComputedStyle(A)), !X && "DIV" === K && LazyLoadRegex.test(A.className) && !A.innerText) {
            var ne = lazyLoadingImageURLForElement(C, A.className);
            if (ne) {
                var ie = this.contentDocument.createElement("img");
                ie.setAttribute("src", ne), C.parentNode.replaceChild(ie, C), C = ie, C.originalElement = A, K = C.tagName, X = C, C.classList.add("protected")
            }
        }
        if (!X && "DIV" === K && C.parentNode) {
            var re = A.querySelectorAll("a, blockquote, dl, div, img, ol, p, pre, table, ul"),
            ae = E || "none" !== te["float"];
            if (!ae && !re.length) {
                for (var le = C.parentNode, oe = this.contentDocument.createElement("p"); C.firstChild;) {
                    var se = C.firstChild;
                    oe.appendChild(se)
                }
                le.replaceChild(oe, C), M === C && (M = oe), C = oe, C.originalElement = A, K = C.tagName
            }
        }
        if (!X && C.parentNode && K in h && p.push(C), X || (isElementPositionedOffScreen(A) ? X = C : A === e || E || "none" === te["float"] || q || !(cachedElementBoundingRect(A).height >= FloatMinimumHeight || A.childElementCount > 1) || (E = 1)), !X) {
            if (sanitizeElementByRemovingAttributes(C), n === CleaningType.MetadataContent)
                if ("|" === C.innerText)
                    C.innerText = "", C.classList.add("delimiter");
                else if ("TIME" === C.tagName) {
                    var ce = C.previousElementSibling;
                    if (ce && "SPAN" === ce.tagName && !ce.classList.contains("delimiter")) {
                        var me = this.contentDocument.createElement("span");
                        me.classList.add("delimiter"), C.before(me)
                    }
                } else
                    "FIGURE" === K && (X = C);
            if ("both" === te.clear && C.classList.add("clear"), "UL" === K || "OL" === K || "MENU" === K) {
                if (U && cachedElementBoundingRect(A).top < U.top)
                    X = C;
                else if ("none" === te["list-style-type"] && "none" === te["background-image"]) {
                    for (var de = A.children, he = de.length, ue = !0, ge = 0; he > ge; ++ge) {
                        var fe = de[ge],
                        pe = getComputedStyle(fe);
                        if ("none" !== pe["list-style-type"] || 0 !== parseInt(pe["-webkit-padding-start"])) {
                            ue = !1;
                            break
                        }
                        var ve = getComputedStyle(fe, ":before").content;
                        const Ee = /\u2022|\u25e6|\u2023|\u2219|counter/;
                        if (Ee.test(ve)) {
                            ue = !1;
                            break
                        }
                    }
                    ue && C.classList.add("list-style-type-none")
                }
                if (A.querySelector("code")) {
                    const Ne = /monospace|menlo|courier/i;
                    var Se = dominantFontFamilyAndSizeForElement(A);
                    Ne.test(Se) && (C.classList.add("code-block"), C.classList.add("protected"))
                }
            }
            if (S || "normal" === te.fontStyle || (K in u || (C.style.fontStyle = te.fontStyle), S = 1), !T && "normal" !== te.fontWeight) {
                if (!(K in g)) {
                    var Te = parseInt(te.fontWeight),
                    ye = null;
                    isNaN(Te) ? ye = te.fontWeight : 400 >= Te || Te >= 500 && (ye = "bold"), ye && (C.style.fontWeight = ye)
                }
                T = 1
            }
            if (E && "SECTION" !== K && s(A, e) || "ASIDE" === K) {
                var Se = dominantFontFamilyAndSizeForElement(A),
                Ae = dominantFontSizeInPointsFromFontFamilyAndSizeString(Se),
                be = Se && Se === V;
                if (1 === E && (cachedElementBoundingRect(A).width <= MaximumFloatWidth ? C.setAttribute("class", "auxiliary float " + te["float"]) : be || C.classList.add("auxiliary")), C.closest(".auxiliary")) {
                    var Ce = A.style.getPropertyValue("width");
                    if ("table" === te.display && /%/.test(Ce) && parseInt(Ce) < 2)
                        C.style.width = te.width;
                    else if (Ce)
                        C.style.width = Ce;
                    else {
                        var xe = b.getMatchedCSSRules(A, "", !0);
                        if (xe)
                            for (var De = xe.length, ge = De - 1; ge >= 0; --ge) {
                                Ce = xe[ge].style.getPropertyValue("width");
                                var Ie = parseInt(Ce);
                                if (Ce && (isNaN(Ie) || Ie > 0)) {
                                    C.style.width = Ce;
                                    break
                                }
                            }
                    }
                    1 !== E || Ce || (C.style.width = cachedElementBoundingRect(A).width + "px")
                }
                c(C, Ae)
            }
            if ("TABLE" === K)
                N || (N = 1);
            else if ("IMG" === K) {
                var ne = lazyLoadingImageURLForElement(C, A.className);
                if (ne) {
                    C.setAttribute("src", ne);
                    var Re = !!C.closest("figure");
                    if (!Re)
                        for (var Le = A.attributes, Me = Le.length, ge = 0; Me > ge; ++ge)
                            if (f.test(Le[ge].nodeName)) {
                                Re = !0;
                                break
                            }
                    Re && C.classList.add("protected"), J = !0
                }
                C.removeAttribute("border"), C.removeAttribute("hspace"), C.removeAttribute("vspace");
                var Be = C.getAttribute("align");
                if (C.removeAttribute("align"), "left" !== Be && "right" !== Be || (C.classList.add("float"), C.classList.add(Be)), !E && !J) {
                    var Fe = cachedElementBoundingRect(A),
                    Oe = Fe.width,
                    Pe = Fe.height;
                    imageIsContainedByContainerWithImageAsBackgroundImage(A) ? C.classList.add("protected") : 1 === Oe && 1 === Pe ? X = C : U && Pe < MinimumHeightForImagesAboveTheArticleTitle && Fe.bottom < U.top ? X = C : Oe < ImageSizeTiny && Pe < ImageSizeTiny && C.setAttribute("class", "reader-image-tiny")
                }
                if (n === CleaningType.MetadataContent) {
                    var Fe = cachedElementBoundingRect(A);
                    (Fe.width > MaximumWidthOrHeightOfImageInMetadataSection || Fe.height > MaximumWidthOrHeightOfImageInMetadataSection) && (X = C)
                }
            } else if ("FONT" === K)
                C.removeAttribute("size"), C.removeAttribute("face"), C.removeAttribute("color");
            else if ("A" === K && C.parentNode) {
                var _e = C.getAttribute("href");
                if ("author" === A.getAttribute("itemprop"))
                    C.classList.add("protected");
                else if (_e && _e.length && ("#" === _e[0] || anchorRunsJavaScriptOnActivation(C))) {
                    const we = {
                    LI: 1,
                    SUP: 1
                    };
                    if (!N && !C.childElementCount && 1 === C.parentElement.childElementCount && !we[C.parentElement.tagName]) {
                        var qe = this.contentDocument.evaluate("text()", C.parentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                        qe.snapshotLength || (X = C)
                    }
                    if (!X) {
                        var oe = this.contentDocument.createElement("span");
                        if (1 === C.childElementCount && "IMG" === C.firstElementChild.tagName) {
                            var ke = C.firstElementChild;
                            ke.width > AnchorImageMinimumWidth && ke.height > AnchorImageMinimumHeight && oe.setAttribute("class", "converted-image-anchor")
                        }
                        for (oe.className || oe.setAttribute("class", "converted-anchor"); C.firstChild;)
                            oe.appendChild(C.firstChild);
                        C.parentNode.replaceChild(oe, C), C = oe, M === C && (M = oe)
                    }
                } else if (AdvertisementHostRegex.test(C.host) && !C.innerText)
                    X = C;
                else if (D && !R && D.compareDocumentPosition(A) & document.DOCUMENT_POSITION_PRECEDING && cachedElementBoundingRect(A).top < cachedElementBoundingRect(D).top)
                    Y.push(C);
                else {
                    var We = A.children;
                    1 === We.length && "IMG" === We[0].tagName && !A.innerText && anchorLooksLikeDownloadFlashLink(A) && (X = C)
                }
            } else if ("ASIDE" === K || "BLOCKQUOTE" === K || "Q" === K || "DIV" === K && G.test(A.className)) {
                var Se = dominantFontFamilyAndSizeForElement(A),
                Ae = dominantFontSizeInPointsFromFontFamilyAndSizeString(Se);
                c(C, Ae)
            }
        }
        if (te && B && !J) {
            var Ue = "none" === te.display || "visible" !== te.visibility || computedStyleIndicatesElementIsInvisibleDueToClipping(te);
            if (Ue && !y) {
                var He = w ? v === w.depth && selectorForElement(A) === w.selector : !1;
                He || H(A, e) || (X = C)
            }
        }
        if (!X && elementIsCommentBlock(A) && (X = C), !X && U && cachedElementBoundingRect(A).top < U.top && VeryLiberalCommentRegex.test(A.className) && C.parentElement && (X = C), !X && "A" === K && k.has(A.href)) {
            for (var Ve, ze, Ge = A, je = C; (Ge = Ge.parentElement) && (je = je.parentElement);) {
                const Ye = 10;
                if (cachedElementBoundingRect(Ge).top - cachedElementBoundingRect(A).top > Ye)
                    break;
                if (Ge === e)
                    break;
                o(Ge) && (Ve = Ge, ze = je)
            }
            Ve && (X = ze, A = Ve, C = ze, C.originalElement = A, K = C.tagName), Ge = null, je = null, Ve = null, ze = null
        }
        !X || X.parentElement || i || (X = null);
        var Xe = X ? null : A.firstElementChild;
        if (Xe)
            A = Xe, C = C.firstElementChild, r(1);
        else {
            for (var Ke; A !== e && !(Ke = A.nextElementSibling);)
                A = A.parentElement, C = C.parentElement, r(-1);
            if (A === e) {
                if (X && !elementIsProtected(X))
                    if (X.parentElement)
                        X.remove();
                    else if (i)
                        return null;
                break
            }
            A = Ke, C = C.nextElementSibling, a()
        }
        if (X && !elementIsProtected(X))
            if (X.parentElement)
                X.remove();
            else if (i)
                return null
                }
    for (var Je = t.querySelectorAll("iframe"), Qe = Je.length, ge = 0; Qe > ge; ++ge) {
        var $e = Je[ge];
        if (elementLooksLikeEmbeddedTweet($e.originalElement)) {
            var Ze = this.adoptableSimpleTweetFromTwitterIframe($e);
            Ze && $e.parentElement.replaceChild(Ze, $e)
        }
        $e.classList.add("protected"), $e.setAttribute("sandbox", "allow-scripts allow-same-origin")
    }
    for (var ge = p.length - 1; ge >= 0; --ge) {
        var et = p[ge];
        et.parentNode && this.shouldPruneElement(et, et.originalElement, V) && (M === et && ((M = et.nextElementSibling) || (M = et.parentElement)), et.remove())
    }
    for (var tt = Y.length, ge = 0; tt > ge; ++ge)
        Y[ge].remove();
    for (var nt = t.querySelectorAll(".float"), ge = 0; ge < nt.length; ++ge) {
        var it = !1,
        rt = nt[ge];
        if (!it) {
            var at = rt.querySelectorAll("a, span.converted-image-anchor"),
            lt = rt.querySelectorAll("span.converted-anchor");
            it = rt.parentNode && lt.length > at.length
        }
        if (!it) {
            var ot = rt.querySelectorAll("embed, object").length,
            st = rt.originalElement.querySelectorAll("embed, object").length;
            !ot && st && (it = !0)
        }
        if (!it) {
            for (var ct = rt.originalElement.getElementsByTagName("img"), mt = ct.length, dt = 0, ht = 0; mt > ht && (B && isElementVisible(ct[ht]) && dt++, !(dt > 1)); ++ht)
                ;
            if (1 === dt) {
                var ut = rt.getElementsByTagName("img").length;
                ut || (it = !0)
            }
        }
        if (!it) {
            const gt = "img, video, embed, iframe, object, svg";
            /\S/.test(rt.innerText) || rt.matches(gt) || rt.querySelector(gt) || (it = !0)
        }
        it && (M === rt && ((M = rt.nextElementSibling) || (M = rt.parentElement)), elementIsProtected(rt) || rt.remove())
    }
    for (var ft = t.querySelectorAll("br"), pt = ft.length, ge = pt - 1; ge >= 0; --ge) {
        var vt = ft[ge];
        vt.originalElement && "block" === getComputedStyle(vt.originalElement.parentElement).display && (m(vt, "nextSibling") || m(vt, "previousSibling")) && vt.remove()
    }
    if (i && !removeWhitespace(t.innerText).length && n !== CleaningType.LeadingFigure)
        return null;
    if (M) {
        var Et = document.createElement("div"),
        Nt = M.originalElement.getBoundingClientRect(),
        St = Nt.height > 0 ? 100 * Nt.top / Nt.height : 0;
        Et.style.position = "relative", Et.style.top = Math.round(-St) + "%", Et.setAttribute("id", "safari-reader-element-marker"), M.insertBefore(Et, M.firstChild)
    }
    for (var Tt = {}, at = t.querySelectorAll("a"), yt = at.length, ge = 0; yt > ge; ++ge) {
        var At = at[ge],
        bt = At.style.fontWeight;
        Tt[bt] || (Tt[bt] = []), Tt[bt].push(At)
    }
    for (var bt in Tt) {
        var Ct = Tt[bt],
        xt = Ct.length;
        if (xt === yt)
            for (var ge = 0; xt > ge; ++ge) {
                var At = Ct[ge];
                At.style.fontWeight = null, "" === At.getAttribute("style") && (At.style = null)
            }
    }
    for (var Dt = t.querySelectorAll(".protected"), It = Dt.length, ge = 0; It > ge; ++ge) {
        var et = Dt[ge];
        et.classList.remove("protected"), et.classList.length || et.removeAttribute("class")
    }
    for (var Rt = t.querySelectorAll("p.auxiliary"), Lt = Rt.length, ge = 0; Lt > ge; ++ge) {
        for (var Mt = Rt[ge], Bt = [Mt], Ft = Mt.nextElementSibling; Ft && "P" === Ft.tagName && Ft.classList.contains("auxiliary");)
            Bt.push(Ft), Ft = Ft.nextElementSibling;
        var Ot = Bt.length;
        if (Ot > 1) {
            for (var ht = 0; Ot > ht; ++ht) {
                var Pt = Bt[ht];
                Pt.classList.remove("auxiliary"), Pt.style.width = null, cleanStyleAndClassList(Pt)
            }
            ge += Ot - 1
        }
    }
    for (var _t = j.length, ge = 0; _t > ge; ++ge) {
        var wt = j[ge],
        qt = wt.parentElementBeforePruning,
        kt = null,
        Wt = null;
        if (qt)
            var kt = depthOfElementWithinElement(qt, t),
            Wt = selectorForElement(qt);
        var Ut = qt ? qt.closest("ul") : null;
        if (Ut)
            Ut.remove();
        else {
            const Ht = 40;
            qt && cachedElementBoundingRect(qt.originalElement).height < Ht && (!w || w.selector !== Wt || w.depth !== kt) ? qt.remove() : wt.remove()
        }
    }
    return t
},
adoptableSimpleTweetFromTwitterIframe: function(e) {
    var t = function(e) {
        var t = this.contentDocument.createElement("div"),
        n = this.contentDocument.createTextNode(e);
        return t.appendChild(n), t.innerHTML
    }.bind(this),
    n = e.originalElement.contentDocument.documentElement,
    i = n.querySelector("[data-tweet-id].expanded");
    if (!i)
        return null;
    var r = this.contentDocument.createElement("div");
    r.classList.add("tweet-wrapper");
    var a = this.contentDocument.createElement("blockquote");
    a.classList.add("simple-tweet"), r.appendChild(a);
    var l = i.getAttribute("data-tweet-id");
    r.setAttribute("data-reader-tweet-id", l);
    var o = i.querySelector(".dateline"),
    s = i.querySelector('[data-scribe="element:screen_name"]'),
    c = i.querySelector('[data-scribe="element:name"]'),
    m = i.querySelector(".e-entry-title");
    if (!(o && s && c && m))
        return r;
    var d = "&mdash; " + t(c.innerText) + " (" + t(s.innerText) + ")",
    h = this.contentDocument.createElement("p");
    h.innerHTML = m.innerHTML, a.appendChild(h), a.insertAdjacentHTML("beforeend", d);
    var u = this.contentDocument.createElement("span");
    u.innerHTML = o.innerHTML, a.appendChild(u);
    for (var g = a.querySelectorAll("img.twitter-emoji"), f = g.length, p = 0; f > p; ++p) {
        var v = g[p],
        E = v.getAttribute("alt");
        if (E && E.length > 0) {
            var N = this.contentDocument.createElement("span");
            N.innerText = E, v.parentNode.replaceChild(N, v)
        }
    }
    for (var S = a.getElementsByTagName("*"), T = S.length, p = 0; T > p; ++p) {
        var y = S[p];
        "SCRIPT" === y.tagName ? y.remove() : sanitizeElementByRemovingAttributes(y)
    }
    return r
},
leadingImageNode: function() {
    const e = 250,
    t = .5,
    n = .9,
    i = 3;
    if (!this.article || !this.article.element)
        return null;
    for (var r = this.article.element, a = 0; i > a && r.parentNode; ++a) {
        r = r.parentNode;
        var l = r.getElementsByTagName("img")[0];
        if (l && isElementVisible(l)) {
            var o = cachedElementBoundingRect(l),
            s = o.width >= window.innerWidth * n;
            if (!s && o.height < e)
                continue;
            if (o.width < this._articleWidth * t)
                continue;
            var c = this.article.element.compareDocumentPosition(l);
            if (!(c & Node.DOCUMENT_POSITION_PRECEDING) || c & Node.DOCUMENT_POSITION_CONTAINED_BY)
                continue;
            if (c = this.extraArticle ? this.extraArticle.element.compareDocumentPosition(l) : null, c && (!(c & Node.DOCUMENT_POSITION_PRECEDING) || c & Node.DOCUMENT_POSITION_CONTAINED_BY))
                continue;
            return l
        }
    }
    return null
},
pageImageURLFromMetadata: function() {
    var e = this.contentDocument,
    t = e.querySelector("meta[property='og:image']");
    return t || (t = e.querySelector("meta[property='twitter:image']")), t || (t = e.querySelector("meta[property='twitter:image:src']")), t && t.content ? t.content : null
},
mainImageNode: function() {
    var e = this.leadingImageNode();
    if (e)
        return e;
    if (this.article && this.article.element)
        for (var t = this.article.element.querySelectorAll("img"), n = t.length, i = 0; n > i; ++i) {
            var r = t[i],
            a = r._cachedElementBoundingRect;
            if (a || (a = r.getBoundingClientRect()), a.width >= MainImageMinimumWidthAndHeight && a.height >= MainImageMinimumWidthAndHeight)
                return r
                }
    return null
},
schemaDotOrgMetadataObject: function() {
    if (this._schemaDotOrgMetadataObject)
        return this._schemaDotOrgMetadataObject;
    var e = this.contentDocument.querySelectorAll("script[type='application/ld+json']"),
    t = e.length;
    try {
        for (var n = 0; t > n; ++n) {
            var i = e[n],
            r = JSON.parse(i.textContent),
            a = r["@context"];
            if ("https://schema.org" === a || "http://schema.org" === a)
                return this._schemaDotOrgMetadataObject = r, r
                }
        return null
    } catch (l) {
        return null
    }
},
articleTitle: function() {
    function e(e, t) {
        var n = e ? t.indexOf(e) : -1;
        return -1 !== n && (0 === n || n + e.length === t.length)
    }
    function t(e, t) {
        return e.host === t.host && e.pathname === t.pathname && e.hash === t.hash
    }
    if (this.articleNode()) {
        if (this._articleTitle)
            return this._articleTitle;
        const n = 500,
        i = 20,
        r = 8,
        a = 1.1,
        l = 1.25,
        o = /header|title|headline|instapaper_title/i,
        s = 1.5,
        c = 1.8,
        m = 1.5,
        d = .6,
        h = 3,
        u = 1.5,
        g = .8,
        f = 9,
        p = 1.5,
        v = /byline|author/i;
        var E = function(e, t) {
            var n = this.contentFromUniqueMetadataSelector(e, t);
            if (n) {
                var i = this.articleTitleAndSiteNameFromTitleString(n);
                i && (n = i.articleTitle)
            }
            return n
        }.bind(this),
        N = function() {
            for (var e = this.articleNode(); e; e = e.parentElement)
                if (elementIndicatesItIsASchemaDotOrgArticleContainer(e))
                    return e;
            return null
        }.bind(this)(),
        S = N ? this.contentFromUniqueMetadataSelector(N, "meta[itemprop=headline]") : "",
        T = N ? this.contentFromUniqueMetadataSelector(N, "meta[itemprop=alternativeHeadline]") : "",
        y = this.contentDocument,
        A = y.title,
        b = E(y, "head meta[property='og:title']"),
        C = this.contentFromUniqueMetadataSelector(y, "head meta[property='og:site_name']"),
        x = E(y, "head meta[name='twitter:title']"),
        D = E(y, "meta[name='sailthru.headline']"),
        I = this.schemaDotOrgMetadataObject(),
        R = I ? I.headline : null,
        L = cachedElementBoundingRect(this.articleNode());
        this.extraArticleNode() && this.extraArticle.isPrepended && (L = cachedElementBoundingRect(this.extraArticleNode()));
        var M = L.left + L.width / 2,
        B = L.top,
        F = B;
        if (this._articleWidth = L.width, this.leadingImage = this.leadingImageNode(), this.leadingImage) {
            var O = cachedElementBoundingRect(this.leadingImage);
            F = (O.top + B) / 2
        }
        var P = "h1, h2, h3, h4, h5, .headline, .article_title, .post-title, #hn-headline, .inside-head, .instapaper_title",
        _ = this.article.element.tagName;
        "DL" !== _ && "DD" !== _ || (P += ", dt");
        var w = this.contentDocument.querySelectorAll(P);
        w = Array.prototype.slice.call(w, 0);
        const q = 2;
        for (var k = y.location, W = this.article.element, U = 0; q > U; ++U)
            W.parentElement && (W = W.parentElement);
        for (var H = W.getElementsByTagName("a"), U = 0, V = H.length; V > U; ++U) {
            var z = H[U];
            if (z.offsetTop > this.articleNode().offsetTop + i)
                break;
            if (t(z, k) && "#" !== z.getAttribute("href")) {
                w.push(z);
                break
            }
        }
        for (var G, j = w.map(trimmedInnerTextIgnoringTextTransform), Y = w.length, X = 0, K = [], J = [], Q = [], $ = [], Z = [], ee = [], te = [], U = 0; Y > U; ++U) {
            var ne = w[U],
            ie = j[U],
            re = stringSimilarity(A, ie);
            if (b) {
                var ae = stringSimilarity(b, ie);
                re += ae, ae > StringSimilarityToDeclareStringsNearlyIdentical && J.push(ne)
            }
            if (x) {
                var le = stringSimilarity(x, ie);
                re += le, le > StringSimilarityToDeclareStringsNearlyIdentical && Q.push(ne)
            }
            if (S) {
                var oe = stringSimilarity(S, ie);
                re += oe, oe > StringSimilarityToDeclareStringsNearlyIdentical && $.push(ne)
            }
            if (T) {
                var se = stringSimilarity(T, ie);
                re += se, se > StringSimilarityToDeclareStringsNearlyIdentical && Z.push(ne)
            }
            if (D) {
                var ce = stringSimilarity(D, ie);
                re += ce, ce > StringSimilarityToDeclareStringsNearlyIdentical && ee.push(ne)
            }
            if (R) {
                var me = stringSimilarity(R, ie);
                re += me, me > StringSimilarityToDeclareStringsNearlyIdentical && te.push(ne)
            }
            re === X ? K.push(ne) : re > X && (X = re, K = [ne])
        }
        if (1 === J.length ? (G = J[0], G.headerText = trimmedInnerTextIgnoringTextTransform(G)) : 1 === Q.length ? (G = Q[0], G.headerText = trimmedInnerTextIgnoringTextTransform(G)) : 1 === $.length ? (G = $[0], G.headerText = trimmedInnerTextIgnoringTextTransform(G)) : 1 === ee.length ? (G = ee[0], G.headerText = trimmedInnerTextIgnoringTextTransform(G)) : 1 === te.length && (G = te[0], G.headerText = trimmedInnerTextIgnoringTextTransform(G)), !G)
            for (var U = 0; Y > U; ++U) {
                var ne = w[U];
                if (isElementVisible(ne)) {
                    var de = cachedElementBoundingRect(ne),
                    he = de.left + de.width / 2,
                    ue = de.top + de.height / 2,
                    ge = he - M,
                    fe = ue - F,
                    pe = -1 !== J.indexOf(ne),
                    ve = -1 !== Q.indexOf(ne),
                    Ee = ne.classList.contains("instapaper_title"),
                    Ne = /\bheadline\b/.test(ne.getAttribute("itemprop")),
                    Se = -1 !== $.indexOf(ne),
                    Te = -1 !== Z.indexOf(ne),
                    ye = -1 !== ee.indexOf(ne),
                    Ae = pe || ve || Ee || Ne || Se || Te || ye,
                    be = Math.sqrt(ge * ge + fe * fe),
                    Ce = Ae ? n : Math.max(n - be, 0),
                    ie = j[U],
                    xe = ne.getAttribute("property");
                    if (xe) {
                        var De = /dc.title/i.exec(xe);
                        if (De && De[0]) {
                            var Ie = this.contentDocument.querySelectorAll('*[property~="' + De[0] + '"]');
                            if (1 === Ie.length) {
                                G = ne, G.headerText = ie;
                                break
                            }
                        }
                    }
                    if (!v.test(ne.className)) {
                        if (!Ae) {
                            if (be > n)
                                continue;
                            if (he < L.left || he > L.right)
                                continue
                                }
                        if (A && stringsAreNearlyIdentical(ie, A))
                            Ce *= h;
                        else if (e(ie, A))
                            Ce *= u;
                        else if (ie.length < r)
                            continue;
                        if (ie !== C || !b) {
                            var Re = !1,
                            Le = nearestAncestorElementWithTagName(ne, "A");
                            if (Le || (Le = ne.querySelector("a")), Le) {
                                if ("author" === Le.getAttribute("rel"))
                                    continue;
                                var Me = Le.host === k.host,
                                Be = Le.pathname === k.pathname;
                                if (Me && Be)
                                    Ce *= m;
                                else {
                                    if (Me && nearestAncestorElementWithTagName(ne, "LI"))
                                        continue;
                                    Ce *= d, Re = !0
                                }
                            }
                            var Fe = fontSizeFromComputedStyle(getComputedStyle(ne));
                            Re || (Ce *= Fe / BaseFontSize), Ce *= 1 + TitleCandidateDepthScoreMultiplier * elementDepth(ne);
                            var Oe = parseInt(this.contentTextStyle().fontSize);
                            parseInt(Fe) > Oe * a && (Ce *= l), (o.test(ne.className) || o.test(ne.getAttribute("id"))) && (Ce *= s);
                            var Pe = ne.parentElement;
                            Pe && (o.test(Pe.className) || o.test(Pe.getAttribute("id"))) && (Ce *= s), -1 !== K.indexOf(ne) && (Ce *= c);
                            for (var _e = this.article.element, we = ne; we && we !== _e; we = we.parentElement)
                                if (SidebarRegex.test(we.className)) {
                                    Ce *= g;
                                    break
                                }
                            (!G || Ce > G.headerScore) && (G = ne, G.headerScore = Ce, G.headerText = ie)
                        }
                    }
                }
            }
        if (G && domDistance(G, this.articleNode(), 10) > f && parseInt(getComputedStyle(G).fontSize) < p * Oe && (G = null), G) {
            this._articleTitleElement = G;
            var qe = G.headerText.trim();
            b && e(b, qe) ? this._articleTitle = b : A && e(A, qe) ? this._articleTitle = A : this._articleTitle = qe
        }
        return this._articleTitle || (b && e(b, A) ? this._articleTitle = b : this._articleTitle = A), this._articleTitle
    }
},
contentFromUniqueMetadataSelector: function(e, t) {
    var n = e.querySelectorAll(t);
    if (1 !== n.length)
        return null;
    var i = n[0];
    return i && 2 === i.attributes.length ? i.content : null
},
articleSubhead: function() {
    function e(e) {
        return elementIsAHeader(e) ? parseInt(/H(\d)?/.exec(e.tagName)[1]) : NaN
    }
    const t = /author|kicker/i,
    n = /sub(head|title)|description|dec?k/i;
    if (this._articleSubhead)
        return this._articleSubhead;
    var i = this.articleNode();
    if (i) {
        var r = this._articleTitleElement;
        if (r) {
            var a,
            l = e(r),
            o = cachedElementBoundingRect(r),
            s = this.contentDocument.querySelector("meta[property='og:description']");
            if (s)
                a = s.content;
            else {
                var c = this.contentDocument.querySelector("meta[name=description]");
                c && (a = c.content)
            }
            for (var m = [nextNonFloatingVisibleElementSibling(r), nextLeafElementForElement(r)], d = m.length, h = 0; d > h; ++h) {
                var u = m[h];
                if (u && u !== i) {
                    var g = u.className;
                    if (!t.test(g)) {
                        var f = !1;
                        if (elementIsAHeader(u))
                            if (isNaN(l))
                                f = !0;
                            else {
                                var p = e(u);
                                p - 1 === l && (f = !0)
                            }
                        if (!f && n.test(g) && (f = !0), !f && /\bdescription\b/.test(u.getAttribute("itemprop")) && (f = !0), !f && a && a === u.innerText && (f = !0), f || "summary" !== u.getAttribute("itemprop") || (f = !0), f) {
                            var v;
                            if ("META" === u.tagName) {
                                var E = u.getAttribute("content");
                                v = E ? E.trim() : "";
                                var N = u.nextElementSibling;
                                if (!N || trimmedInnerTextIgnoringTextTransform(N) !== v)
                                    continue;
                                u = N
                            } else {
                                if (cachedElementBoundingRect(u).top < (o.bottom + o.top) / 2)
                                    continue;
                                v = trimmedInnerTextIgnoringTextTransform(u).trim()
                            }
                            if (v.length) {
                                this._articleSubheadElement = u, this._articleSubhead = v;
                                break
                            }
                        }
                    }
                }
            }
            return this._articleSubhead
        }
    }
},
adoptableMetadataBlock: function() {
    function e(e) {
        function t(e, i) {
            if (e.nodeType === Node.TEXT_NODE)
                return void (i === n.Left ? e.textContent = e.textContent.trimLeft() : i === n.Right ? e.textContent = e.textContent.trimRight() : e.textContent = e.textContent.trim());
            if (e.nodeType === Node.ELEMENT_NODE) {
                var r = e.childNodes,
                a = r.length;
                if (0 !== a) {
                    if (1 === a)
                        return void t(r[0], i);
                    i !== n.Right && t(r[0], n.Left), i !== n.Left && t(r[a - 1], n.Right)
                }
            }
        }
        const n = {
        Left: 1,
        Right: 2,
        Both: 3
        };
        t(e)
    }
    this.updateArticleBylineAndDateElementsIfNecessary();
    var t = this.articleBylineElement(),
    n = this.articleDateElement();
    if (!t && !n)
        return null;
    if (t && n) {
        var i = t.compareDocumentPosition(n);
        i & Node.DOCUMENT_POSITION_CONTAINS && (t = null), i & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = null), t === n && (n = null)
    }
    var r,
    a = this.contentDocument.createElement("div"),
    l = !1,
    o = !1;
    if (t) {
        var r = this.cleanArticleNode(t, t.cloneNode(!0), CleaningType.MetadataContent, !1);
        e(r), r.innerText.trim() && (l = !0, r.classList.add("byline"))
    }
    if (n) {
        var s = this.cleanArticleNode(n, n.cloneNode(!0), CleaningType.MetadataContent, !1);
        e(s), s.innerText.trim() && (o = !0, s.classList.add("date"))
    }
    if (l && a.appendChild(r), l && o) {
        var c = document.createElement("span");
        c.classList.add("delimiter"), a.appendChild(c)
    }
    return o && a.appendChild(s), a
},
articleBylineElement: function() {
    return this._articleBylineElement
},
findArticleBylineElement: function() {
    var e = this.findArticleBylineElementWithoutRejection();
    return e && ("FOOTER" === e.tagName || e.closest("figure")) ? null : e
},
findArticleBylineElementWithoutRejection: function() {
    function e(e) {
        for (var t = new Set, n = new Set, i = e.length, o = 0; i - 1 > o; ++o) {
            var s = e[o],
            c = e[o + 1];
            if (isElementVisible(s) && isElementVisible(c)) {
                var m = s.parentElement;
                m === c.parentElement && (m.contains(l) || (n.add(s.parentElement), t.add(s), t.add(c)))
            }
        }
        var d = new Set(e);
        n.forEach(function(e) {
                  d.add(e)
                  }), t.forEach(function(e) {
                                d["delete"](e)
                                }), e = [], d.forEach(function(t) {
                                                      e.push(t)
                                                      });
        var h,
        u = null;
        i = e.length;
        for (var o = 0; i > o; ++o) {
            var s = e[o];
            if (isElementVisible(s)) {
                var g = cachedElementBoundingRect(s),
                f = g.left + g.width / 2,
                p = g.top + g.height / 2,
                v = r - f,
                E = a - p,
                N = Math.sqrt(v * v + E * E);
                (!u || h > N) && (u = s, h = N)
            }
        }
        return u
    }
    const t = "[itemprop='author'], a[rel='author']",
    n = ".byline, .article-byline, .entry-meta, .author-name, .byline-dateline, [itemprop='author'], a[rel='author']";
    var i,
    r,
    a,
    l = this._articleSubheadElement || this._articleTitleElement;
    if (l)
        var i = l ? cachedElementBoundingRect(l) : null,
        r = i.left + i.width / 2,
        a = i.top + i.height / 2;
    var o = this.contentFromUniqueMetadataSelector(this.contentDocument, "head meta[name=author]");
    if (o || (o = this.contentFromUniqueMetadataSelector(this.contentDocument, "head meta[property=author]")), !o) {
        var s = this.schemaDotOrgMetadataObject();
        if (s) {
            var c = s.author;
            c && "object" == typeof c && (o = c.name)
        }
    }
    var m = this.article.element,
    d = m.querySelectorAll(n);
    if (1 === d.length)
        return d[0];
    var h = l ? l.nextElementSibling : null;
    if (h) {
        if (h.matches(n) || h.innerText === o || (h = h.querySelector(n)), h) {
            var u = h.querySelector("li");
            if (u) {
                var g = h.querySelector(n);
                g && (h = g)
            }
        }
        if (h)
            return h
            }
    for (var f = this.contentDocument.getElementsByTagName("a"), p = 0, v = f.length; v > p; ++p) {
        var E = f[p];
        if (trimmedInnerTextIgnoringTextTransform(E) === o)
            return E
            }
    var N = m.closest("article");
    if (l && N) {
        var S = N.querySelectorAll(t),
        T = e(S);
        if (T)
            return T;
        if (S = N.querySelectorAll(n), T = e(S))
            return T
            }
    return null
},
articleDateElement: function() {
    return this._articleDateElement
},
findArticleDateElement: function() {
    function e(e) {
        for (var t = e; t && t !== r; t = t.parentElement)
            if (elementIsCommentBlock(t))
                return !0;
        return !1
    }
    function t(t) {
        for (var n, i = null, r = t.length, a = 0; r > a; ++a) {
            var l = t[a];
            if (isElementVisible(l) && !e(l)) {
                var c = cachedElementBoundingRect(l),
                m = c.left + c.width / 2,
                d = c.top + c.height / 2,
                h = o - m,
                u = s - d,
                g = Math.sqrt(h * h + u * u);
                (!i || n > g) && (i = l, n = g)
            }
        }
        return i
    }
    const n = "time, .dateline, .entry-date";
    var i = this._articleSubheadElement || this._articleTitleElement,
    r = this.article.element,
    a = i ? i.nextElementSibling : null;
    if (a && (c = a.querySelectorAll(n), 1 === c.length && (a = c[0])), !a || a.matches(n) || a.querySelector(n) || (a = null), a && a.contains(r) && (a = null), a)
        return a;
    var l,
    o,
    s;
    if (i)
        var l = i ? cachedElementBoundingRect(i) : null,
        o = l.left + l.width / 2,
        s = l.top + l.height / 2;
    var c = r.querySelectorAll(n);
    if (c.length)
        return t(c);
    if (r = r.closest("article")) {
        var c = r.querySelectorAll(n);
        if (c.length)
            return t(c)
            }
    return null
},
articleDateElementWithBylineElementHint: function(e) {
    function t(e) {
        return /date/.test(e.className) || /\bdatePublished\b/.test(e.getAttribute("itemprop"))
    }
    var n = e.nextElementSibling;
    if (n && t(n))
        return n;
    var i = nextLeafElementForElement(e);
    return i && t(i) ? i : null
},
updateArticleBylineAndDateElementsIfNecessary: function() {
    this._didArticleBylineAndDateElementDetection || (this.updateArticleBylineAndDateElements(), this._didArticleBylineAndDateElementDetection = !0)
},
updateArticleBylineAndDateElements: function() {
    var e = this.findArticleBylineElement(),
    t = this.findArticleDateElement();
    !t && e && (t = this.articleDateElementWithBylineElementHint(e)), this._articleDateElement = t, this._articleBylineElement = e
},
articleIsLTR: function() {
    if (!this._articleIsLTR) {
        var e = getComputedStyle(this.article.element);
        this._articleIsLTR = e ? "ltr" === e.direction : !0
    }
    return this._articleIsLTR
},
findSuggestedCandidate: function() {
    var e = this.suggestedRouteToArticle;
    if (!e || !e.length)
        return null;
    var t,
    n;
    for (n = e.length - 1; n >= 0 && (!e[n].id || !(t = this.contentDocument.getElementById(e[n].id))); --n)
        ;
    for (n++, t || (t = this.contentDocument); n < e.length;) {
        for (var i = e[n], r = t.nodeType === Node.DOCUMENT_NODE ? t.documentElement : t.firstElementChild, a = 1; r && a < i.index; r = r.nextElementSibling)
            this.shouldIgnoreInRouteComputation(r) || a++;
        if (!r)
            return null;
        if (r.tagName !== i.tagName)
            return null;
        if (i.className && r.className !== i.className)
            return null;
        t = r, n++
    }
    return isElementVisible(t) ? new CandidateElement(t, this.contentDocument) : null
},
findArticleBySearchingAllElements: function(e) {
    var t = this.findSuggestedCandidate(),
    n = this.findCandidateElements();
    if (!n || !n.length)
        return t;
    if (t && t.basicScore() >= ReaderMinimumScore)
        return t;
    for (var i = this.highestScoringCandidateFromCandidates(n), r = i.element; r !== this.contentDocument; r = r.parentNode)
        if ("BLOCKQUOTE" === r.tagName) {
            for (var a = r.parentNode, l = n.length, o = 0; l > o; ++o) {
                var s = n[o];
                if (s.element === a) {
                    i = s;
                    break
                }
            }
            break
        }
    if (t && i.finalScore() < ReaderMinimumScore)
        return t;
    if (!e) {
        if (i.shouldDisqualifyDueToScoreDensity())
            return null;
        if (i.shouldDisqualifyDueToHorizontalRuleDensity())
            return null;
        if (i.shouldDisqualifyDueToHeaderDensity())
            return null;
        if (i.shouldDisqualifyDueToSimilarElements(n))
            return null
            }
    return i
},
findExtraArticle: function() {
    if (!this.article)
        return null;
    for (var e = 0, t = this.article.element; 3 > e && t; ++e, t = t.parentNode) {
        var n = this.findExtraArticleCandidateElements(t);
        if (n && n.length)
            for (var i, r = this.sortCandidateElementsInDescendingScoreOrder(n), a = 0; a < r.length && (i = r[a], i && i.basicScore()); a++)
                if (!i.shouldDisqualifyDueToScoreDensity() && !i.shouldDisqualifyDueToHorizontalRuleDensity() && !(i.shouldDisqualifyDueToHeaderDensity() || cachedElementBoundingRect(i.element).height < PrependedArticleCandidateMinimumHeight && cachedElementBoundingRect(this.article.element).width !== cachedElementBoundingRect(i.element).width)) {
                    var l = contentTextStyleForNode(this.contentDocument, i.element);
                    if (l && l.fontFamily === this.contentTextStyle().fontFamily && l.fontSize === this.contentTextStyle().fontSize && i)
                        return i
                        }
    }
    return null
},
highestScoringCandidateFromCandidates: function(e) {
    for (var t = 0, n = null, i = e.length, r = 0; i > r; ++r) {
        var a = e[r],
        l = a.basicScore();
        l >= t && (t = l, n = a)
    }
    return n
},
sortCandidateElementsInDescendingScoreOrder: function(e) {
    function t(e, t) {
        return e.basicScore() !== t.basicScore() ? t.basicScore() - e.basicScore() : t.depth() - e.depth()
    }
    return e.sort(t)
},
findCandidateElements: function() {
    const e = 1e3;
    for (var t = Date.now() + e, n = this.contentDocument.getElementsByTagName("*"), i = n.length, r = [], a = 0; i > a; ++a) {
        var l = n[a];
        if (!CandidateTagNamesToIgnore[l.tagName]) {
            var o = CandidateElement.candidateIfElementIsViable(l, this.contentDocument);
            if (o && r.push(o), Date.now() > t) {
                r = [];
                break
            }
        }
    }
    for (var s = r.length, a = 0; s > a; ++a)
        r[a].element.candidateElement = r[a];
    for (var a = 0; s > a; ++a) {
        var c = r[a];
        if ("BLOCKQUOTE" === c.element.tagName) {
            var m = c.element.parentElement.candidateElement;
            m && m.addTextNodesFromCandidateElement(c)
        }
    }
    for (var a = 0; s > a; ++a)
        r[a].element.candidateElement = null;
    return r
},
findExtraArticleCandidateElements: function(e) {
    if (!this.article)
        return [];
    e || (e = this.article.element);
    for (var t = "preceding-sibling::*/descendant-or-self::*", n = this.contentDocument.evaluate(t, e, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), i = n.snapshotLength, r = [], a = 0; i > a; ++a) {
        var l = n.snapshotItem(a);
        if (!CandidateTagNamesToIgnore[l.tagName]) {
            var o = CandidateElement.extraArticleCandidateIfElementIsViable(l, this.article, this.contentDocument, !0);
            o && r.push(o)
        }
    }
    t = "following-sibling::*/descendant-or-self::*", n = this.contentDocument.evaluate(t, e, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null), i = n.snapshotLength;
    for (var a = 0; i > a; ++a) {
        var l = n.snapshotItem(a);
        if (!CandidateTagNamesToIgnore[l.tagName]) {
            var o = CandidateElement.extraArticleCandidateIfElementIsViable(l, this.article, this.contentDocument, !1);
            o && r.push(o)
        }
    }
    return r
},
isGeneratedBy: function(e) {
    var t = this.contentDocument.head ? this.contentDocument.head.querySelector("meta[name=generator]") : null;
    if (!t)
        return !1;
    var n = t.content;
    return n ? e.test(n) : !1
},
isMediaWikiPage: function() {
    return this.isGeneratedBy(/^MediaWiki /)
},
isWordPressSite: function() {
    return this.isGeneratedBy(/^WordPress/)
},
nextPageURLString: function() {
    if (!this.article)
        return null;
    if (this.isMediaWikiPage())
        return null;
    var e,
    t = 0,
    n = this.article.element;
    n.parentNode && "inline" === getComputedStyle(n).display && (n = n.parentNode);
    for (var i = n, r = cachedElementBoundingRect(n).bottom + LinkMaxVerticalDistanceFromArticle; isElementNode(i) && cachedElementBoundingRect(i).bottom <= r;)
        i = i.parentNode;
    i === n || i !== this.contentDocument && !isElementNode(i) || (n = i);
    var a = this.contentDocument.evaluate(LinkCandidateXPathQuery, n, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null),
    l = a.snapshotLength;
    if (this.pageNumber <= 2 && !this.prefixWithDateForNextPageURL) {
        var o = this.contentDocument.location.pathname,
        s = o.match(LinkDateRegex);
        s && (s = s[0], this.prefixWithDateForNextPageURL = o.substring(0, o.indexOf(s) + s.length))
    }
    for (var c = 0; l > c; ++c) {
        var m = a.snapshotItem(c),
        d = this.scoreNextPageLinkCandidate(m);
        d > t && (e = m, t = d)
    }
    return e ? e.href : null
},
scoreNextPageLinkCandidate: function(e) {
    function t(e, t, n, i) {
        t.substring(0, e.length) === e && (t = t.substring(e.length), e = "");
        var r = t.lastInteger();
        if (isNaN(r))
            return !1;
        var a = e ? e.lastInteger() : NaN;
        return (isNaN(a) || a >= MaximumExactIntegralValue) && (a = i), r === a ? n.lastInteger() === a + 1 : r === a + 1
    }
    function n(e) {
        for (var t = {}, n = e.substring(1).split("&"), i = n.length, r = 0; i > r; ++r) {
            var a = n[r],
            l = a.indexOf("=");
            -1 === l ? t[a] = null : t[a.substring(0, l)] = a.substring(l + 1)
        }
        return t
    }
    var i = this.contentDocument.location;
    if (e.host !== i.host)
        return 0;
    if (e.pathname === i.pathname && e.search === i.search)
        return 0;
    if (-1 !== e.toString().indexOf("#"))
        return 0;
    if (anchorLinksToAttachment(e) || anchorLinksToTagOrCategoryPage(e))
        return 0;
    if (!isElementVisible(e))
        return 0;
    var r = cachedElementBoundingRect(e),
    a = this.articleBoundingRect(),
    l = Math.max(0, Math.max(a.top - (r.top + r.height), r.top - (a.top + a.height)));
    if (r.top < a.top)
        return 0;
    if (l > LinkMaxVerticalDistanceFromArticle)
        return 0;
    var o = Math.max(0, Math.max(a.left - (r.left + r.width), r.left - (a.left + a.width)));
    if (o > 0)
        return 0;
    var s = i.pathname,
    c = e.pathname;
    if (this.prefixWithDateForNextPageURL) {
        if (-1 === e.pathname.indexOf(this.prefixWithDateForNextPageURL))
            return 0;
        s = s.substring(this.prefixWithDateForNextPageURL.length), c = c.substring(this.prefixWithDateForNextPageURL.length)
    }
    var m = c.substring(1).split("/");
    m[m.length - 1] || m.pop();
    var d = m.length,
    h = s.substring(1).split("/"),
    u = !1;
    h[h.length - 1] || (u = !0, h.pop());
    var g = h.length;
    if (g > d)
        return 0;
    for (var f = 0, p = 0, v = e.textContent, E = 0; d > E; ++E) {
        var N = m[E],
        S = g > E ? h[E] : "";
        if (S !== N) {
            if (g - 2 > E)
                return 0;
            if (N.length >= S.length) {
                for (var T = 0; N[N.length - 1 - T] === S[S.length - 1 - T];)
                    T++;
                T && (N = N.substring(0, N.length - T), S = S.substring(0, S.length - T));
                var y = N.indexOf(S);
                -1 !== y && (N = N.substring(y))
            }
            t(S, N, v, this.pageNumber) ? p = Math.pow(LinkNextOrdinalValueBase, E - d + 1) : f++
        }
        if (f > 1)
            return 0
            }
    var A = !1;
    if (e.search) {
        linkParameters = n(e.search), referenceParameters = n(i.search);
        for (var b in linkParameters) {
            var C = linkParameters[b],
            x = b in referenceParameters ? referenceParameters[b] : null;
            if (x !== C)
                if (null === x && (x = ""), null === C && (C = ""), C.length < x.length)
                    f++;
                else if (t(x, C, v, this.pageNumber)) {
                    if (LinkURLSearchParameterKeyMatchRegex.test(b)) {
                        if (s.toLowerCase() !== c.toLowerCase())
                            return 0;
                        if (this.isWordPressSite() && u)
                            return 0;
                        A = !0
                    }
                    if (LinkURLBadSearchParameterKeyMatchRegex.test(b)) {
                        f++;
                        continue
                    }
                    p = Math.max(p, 1 / LinkNextOrdinalValueBase)
                } else
                    f++
                    }
    }
    if (!p)
        return 0;
    if ((LinkURLPageSlashNumberMatchRegex.test(e.href) || LinkURLSlashDigitEndMatchRegex.test(e.href)) && (A = !0), !A && d === g && stringSimilarity(s, c) < LinkMinimumURLSimilarityRatio)
        return 0;
    if (LinkURLArchiveSlashDigitEndMatchRegex.test(e))
        return 0;
    var D = LinkMatchWeight * (Math.pow(LinkMismatchValueBase, -f) + p) + LinkVerticalDistanceFromArticleWeight * l / LinkMaxVerticalDistanceFromArticle;
    A && (D += LinkURLSemanticMatchBonus), "LI" === e.parentNode.tagName && (D += LinkListItemBonus);
    var v = e.innerText;
    return LinkNextMatchRegEx.test(v) && (D += LinkNextMatchBonus), LinkPageMatchRegEx.test(v) && (D += LinkPageMatchBonus), LinkContinueMatchRegEx.test(v) && (D += LinkContinueMatchBonus), D
},
elementContainsEnoughTextOfSameStyle: function(e, t, n) {
    const i = 110;
    for (var r = "BODY" === e.tagName, a = r ? 2 : 3, l = getVisibleNonWhitespaceTextNodes(e, a, i, r, t), o = n / scoreMultiplierForElementTagNameAndAttributes(e) / languageScoreMultiplierForTextNodes(l), s = {}, c = l.length, m = 0; c > m; ++m) {
        var d = l[m],
        h = d.length,
        u = d.parentElement,
        g = window.getComputedStyle(u),
        f = g.fontFamily + "|" + g.fontSize,
        p = Math.pow(h, TextNodeLengthPower);
        if (s[f]) {
            if ((s[f] += p) > o)
                break
                } else
                    s[f] = p
                    }
    for (var f in s)
        if (s[f] > o)
            return !0;
    return !1
},
openGraphMetadataClaimsPageTypeIsArticle: function() {
    if (!this._openGraphMetadataClaimsPageTypeIsArticle) {
        var e = this.contentDocument.querySelector("head meta[property='og:type']");
        this._openGraphMetadataClaimsPageTypeIsArticle = e && "article" === e.content
    }
    return this._openGraphMetadataClaimsPageTypeIsArticle
},
pointsToUseForHitTesting: function() {
    const e = window.innerWidth,
    t = e / 4,
    n = e / 2,
    i = 128,
    r = 320;
    var a = [[n, 800], [n, 600], [t, 800], [n, 400], [n - i, 1100], [r, 700], [3 * t, 800], [e - r, 700]];
    return this.openGraphMetadataClaimsPageTypeIsArticle() && a.push([n - i, 1400]), a
},
findArticleByVisualExamination: function() {
    for (var e = new Set, t = this.pointsToUseForHitTesting(), n = t.length, i = AppleDotComAndSubdomainsRegex.test(this.contentDocument.location.hostname.toLowerCase()) ? 7200 : 1800, r = 0; n > r; r++)
        for (var a = t[r][0], l = t[r][1], o = elementAtPoint(a, l), s = o; s && !e.has(s); s = s.parentElement) {
            if (VeryPositiveClassNameRegEx.test(s.className))
                return new CandidateElement(s, this.contentDocument);
            if (!CandidateTagNamesToIgnore[s.tagName]) {
                var c = s.offsetWidth,
                m = s.offsetHeight;
                if (!c && !m) {
                    var d = cachedElementBoundingRect(s);
                    c = d.width, m = d.height
                }
                if (!(c < CandidateMinimumWidth || m < CandidateMinimumHeight || c * m < CandidateMinimumArea)) {
                    var h = this.elementContainsEnoughTextOfSameStyle(s, e, i);
                    if (e.add(s), h && !(CandidateElement.candidateElementAdjustedHeight(s) < CandidateMinimumHeight)) {
                        var u = new CandidateElement(s, this.contentDocument);
                        if (u.shouldDisqualifyDueToSimilarElements())
                            return null;
                        if (u.shouldDisqualifyDueToHorizontalRuleDensity())
                            return null;
                        if (u.shouldDisqualifyDueToHeaderDensity())
                            return null;
                        if (!u.shouldDisqualifyForDeepLinking())
                            return u
                            }
                }
            }
        }
    return null
},
findArticleFromMetadata: function(e) {
    var t = this.contentDocument.querySelectorAll(SchemaDotOrgArticleContainerSelector);
    if (1 === t.length) {
        var n = t[0];
        if (n.matches("article, *[itemprop=articleBody]")) {
            var i = CandidateElement.candidateIfElementIsViable(n, this.contentDocument, !0);
            if (i)
                return e === FindArticleMode.ExistenceOfElement ? !0 : i
                }
        var r = n.querySelectorAll("article, *[itemprop=articleBody]"),
        a = elementWithLargestAreaFromElements(r);
        if (a) {
            var i = CandidateElement.candidateIfElementIsViable(a, this.contentDocument, !0);
            if (i)
                return e === FindArticleMode.ExistenceOfElement ? !0 : i
                }
        return new CandidateElement(n, this.contentDocument)
    }
    if (this.openGraphMetadataClaimsPageTypeIsArticle()) {
        var l = this.contentDocument.querySelectorAll("main article"),
        o = elementWithLargestAreaFromElements(l);
        if (o) {
            var i = CandidateElement.candidateIfElementIsViable(o, this.contentDocument, !0);
            if (i)
                return e === FindArticleMode.ExistenceOfElement ? !0 : i
                }
        var s = this.contentDocument.querySelectorAll("article");
        if (1 === s.length) {
            var i = CandidateElement.candidateIfElementIsViable(s[0], this.contentDocument, !0);
            if (i)
                return e === FindArticleMode.ExistenceOfElement ? !0 : i
                }
    }
    return null
},
articleTextContent: function() {
    return this._articleTextContent || this.adoptableArticle(), this._articleTextContent
},
unformattedArticleTextContentIncludingMetadata: function() {
    var e = this.articleNode();
    if (e) {
        var t = "",
        n = this.articleTitle();
        n && (t += n + "\n");
        var i = this.articleSubhead();
        i && (t += i + "\n");
        var r = this.adoptableMetadataBlock();
        return r && (t += this.plaintextVersionOfNodeAppendingNewlinesBetweenBlockElements(r) + "\n"), t + e.innerText
    }
},
plaintextVersionOfNodeAppendingNewlinesBetweenBlockElements: function(e) {
    var t = this.contentDocument.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null),
    n = "";
    for (t.currentNode = e; t.nextNode();) {
        var i = t.currentNode;
        if (i.nodeType !== Node.TEXT_NODE) {
            var r = i.tagName;
            "P" !== r && "DIV" !== r || (n += "\n")
        } else
            n += i.textContent
            }
    return n
},
pageDescription: function() {
    for (var e = this.contentDocument.querySelectorAll("head meta[name]"), t = e.length, n = 0; t > n; ++n) {
        var i = e[n];
        if ("description" === i.getAttribute("name").toLowerCase()) {
            var r = i.getAttribute("content");
            if (r)
                return r.trim()
                }
    }
    return null
},
articleTitleAndSiteNameFromTitleString: function(e) {
    const t = [" - ", " \u2013 ", " \u2014 ", ": ", " | ", " \xbb "],
    n = t.length,
    i = .6;
    for (var r, a, l = this.contentDocument.location.host, o = l.replace(/^(www|m)\./, ""), s = o.replace(/\.(com|info|net|org|edu)$/, "").toLowerCase(), c = 0; n > c; ++c) {
        var m = e.split(t[c]);
        if (2 === m.length) {
            var d = m[0].trim(),
            h = m[1].trim(),
            u = d.toLowerCase(),
            g = h.toLowerCase(),
            f = Math.max(stringSimilarity(u, o), stringSimilarity(u, s)),
            p = Math.max(stringSimilarity(g, o), stringSimilarity(g, s)),
            v = Math.max(f, p);
            (!a || v > a) && (a = v, r = f > p ? {
                              siteName: d,
                              articleTitle: h
                              } : {
                              siteName: h,
                              articleTitle: d
                              })
        }
    }
    return r && a >= i ? r : null
},
pageMetadata: function(e, t) {
    var n,
    i = this.pageDescription(),
    r = !1;
    this.adoptableArticle() ? (n = this.articleTitle(), i = i || this.articleTextContent(), r = !0) : (n = this.contentDocument.title, this.contentDocument.body && (i = i || this.contentDocument.body.innerText));
    var a = "",
    l = this.pageImageURLFromMetadata();
    if (l)
        a = l;
    else {
        var o = this.mainImageNode();
        o && (a = o.src)
    }
    n || (n = userVisibleURLString(this.contentDocument.location.href)), n = n.trim(), e && (n = n.substring(0, e));
    var s = this.contentFromUniqueMetadataSelector(this.contentDocument, "head meta[property='og:site_name']");
    if (!s) {
        var c = this.articleTitleAndSiteNameFromTitleString(this.contentDocument.title);
        c && c.articleTitle === n && (s = c.siteName)
    }
    return s || (s = ""), i = i ? i.trim() : "", t && (i = i.substring(0, t)), i = i.replace(/[\s]+/g, " "), {
    title: n,
    previewText: i,
    siteName: s,
    mainImageURL: a,
    isReaderAvailable: r
    }
},
readingListItemInformation: function() {
    const e = 220,
    t = 220;
    return this.pageMetadata(e, t)
}
};
var ReaderArticleFinderJS = new ReaderArticleFinder(document);


