/*
 * Copyright (c) 2010 Apple Inc. All rights reserved.
 */
function articleHeight() {
    var e = document.getElementById("article").offsetHeight,
    t = parseFloat(getComputedStyle(document.getElementById("article")).marginTop);
    return e + 2 * t
}
function smoothScroll(e, t, n, i) {
    function a(t, n) {
        scrollEventIsSmoothScroll = !0, e.scrollTop = n, setTimeout(function() {
                                                                    scrollEventIsSmoothScroll = !1
                                                                    }, 0)
    }
    const o = 1e3 / 60;
    var r = e.scrollTop,
    s = r + t,
    l = 0,
    m = articleHeight() - window.innerHeight;
    if (l > s && (s = l), s > m && (s = m), r != s) {
        var d = Math.abs(s - r);
        if (d < Math.abs(t) && (n = n * d / Math.abs(t)), smoothScrollingAnimator) {
            var c = smoothScrollingAnimator.animations[0],
            u = c.progress,
            h = u > .5 ? 1 - u : u,
            g = n / (1 - h),
            p = -h * g,
            f = Math.sin(Math.PI / 2 * h),
            S = f * f,
            C = (r - s * S) / (1 - S);
            return abortSmoothScroll(), smoothScrollingAnimator = new AppleAnimator(g, o, i), smoothScrollingAnimation = new AppleAnimation(C, s, a), smoothScrollingAnimator.addAnimation(smoothScrollingAnimation), void smoothScrollingAnimator.start(p)
        }
        smoothScrollingAnimator = new AppleAnimator(n, o, i), smoothScrollingAnimation = new AppleAnimation(r, s, a), smoothScrollingAnimator.addAnimation(smoothScrollingAnimation), smoothScrollingAnimator.start()
    }
}
function abortSmoothScroll() {
    smoothScrollingAnimator.stop(AnimationTerminationCondition.Interrupted), smoothScrollingAnimator = null, smoothScrollingAnimation = null
}
function articleScrolled() {
    !scrollEventIsSmoothScroll && smoothScrollingAnimator && abortSmoothScroll(), ReaderJSController.articleScrolled()
}
function traverseReaderContent(e, t) {
    if (e) {
        var n = e.offsetTop,
        i = document.createTreeWalker(document.getElementById("article"), NodeFilter.SHOW_ELEMENT, {
                                      acceptNode: function(e) {
                                      var t = e.classList;
                                      return t.contains("page-number") || t.contains("float") || t.contains("page") || t.contains("scrollable") || "HR" === e.tagName || 0 === e.offsetHeight || "inline" === getComputedStyle(e).display || n === e.offsetTop ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
                                      }
                                      });
        return i.currentNode = e, i[t]()
    }
}
function nextReaderContentElement(e) {
    return traverseReaderContent(e, "nextNode")
}
function previousReaderContentElement(e) {
    return traverseReaderContent(e, "previousNode")
}
function articleTitleElement() {
    return document.querySelector("#article .page .title")
}
function keyDown(e) {
    var t = !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey),
    n = !e.metaKey && !e.altKey && !e.ctrlKey && e.shiftKey;
    switch (e.keyCode) {
        case 8:
            n ? ReaderJSController.goForward() : t && ReaderJSController.goBack(), e.preventDefault();
            break;
        case 74:
            ContentAwareScrollerJS.scroll(ContentAwareNavigationDirection.Down);
            break;
        case 75:
            ContentAwareScrollerJS.scroll(ContentAwareNavigationDirection.Up)
    }
}
function getArticleScrollPosition() {
    scrollInfo = {}, scrollInfo.version = 1;
    var e = document.getElementsByClassName("page");
    if (!e.length)
        return scrollInfo.pageIndex = 0, scrollInfo;
    scrollInfo.pageIndex = e.length - 1;
    var t,
    n = window.scrollY;
    for (t = 0; t < e.length; t++) {
        var i = e[t];
        if (i.offsetTop + i.offsetHeight >= n) {
            scrollInfo.pageIndex = t;
            break
        }
    }
    return scrollInfo
}
function restoreInitialArticleScrollPosition() {
    var e = document.getElementsByClassName("page"),
    t = e[initialScrollPosition.pageIndex];
    t && (document.body.scrollTop = t.offsetTop)
}
function restoreInitialArticleScrollPositionIfPossible() {
    if (!didRestoreInitialScrollPosition) {
        if (!initialScrollPosition && (initialScrollPosition = ReaderJSController.initialArticleScrollPosition(), !initialScrollPosition || !initialScrollPosition.pageIndex))
            return void (didRestoreInitialScrollPosition = !0);
        var e = document.getElementsByClassName("page-number").length;
        initialScrollPosition.pageIndex >= e || (setTimeout(restoreInitialArticleScrollPosition, DelayBeforeRestoringScrollPositionInMs), didRestoreInitialScrollPosition = !0)
    }
}
function makeWideElementsScrollable() {
    for (var e = document.querySelectorAll("table, pre"), t = e.length, n = 0; t > n; ++n) {
        var i = e[n];
        if (!i.classList.contains("float") && !i.parentElement.classList.contains("scrollable")) {
            var a = document.createElement("div");
            i.parentElement.insertBefore(a, i), i.remove(), a.appendChild(i), a.classList.add("scrollable")
        }
    }
}
function fontSettings(e) {
    const t = [15, 16, 17, 18, 19, 20, 21, 23, 26, 28, 37, 46],
    n = ["25px", "26px", "27px", "28px", "29px", "30px", "31px", "33px", "37px", "39px", "51px", "62px"],
    i = {
    System: {
    lineHeights: ["25px", "26px", "27px", "29px", "30px", "31px", "32px", "33px", "38px", "39px", "51px", "62px"],
    cssClassName: "system"
    },
    Athelas: {
    cssClassName: "athelas"
    },
    Charter: {
    lineHeights: ["25px", "26px", "27px", "28px", "29px", "30px", "32px", "34px", "38px", "39px", "51px", "62px"],
    cssClassName: "charter"
    },
    Georgia: {
    lineHeights: ["25px", "26px", "27px", "28px", "29px", "30px", "32px", "34px", "38px", "41px", "51px", "62px"],
    cssClassName: "georgia"
    },
        "Iowan Old Style": {
        lineHeights: ["25px", "26px", "27px", "28px", "29px", "30px", "32px", "34px", "38px", "39px", "51px", "62px"],
        cssClassName: "iowan"
        },
    Palatino: {
    lineHeights: ["25px", "26px", "27px", "28px", "29px", "30px", "31px", "34px", "37px", "40px", "51px", "62px"],
    cssClassName: "palatino"
    },
    Seravek: {
    lineHeights: ["25px", "26px", "27px", "28px", "28px", "30px", "31px", "34px", "37px", "39px", "51px", "62px"],
    cssClassName: "seravek"
    },
        "Times New Roman": {
        cssClassName: "times"
        },
        "Hiragino Sans W3": {
        cssClassName: "hiraginosans",
        lineHeights: ["1.85em", "1.78em", "1.74em", "1.71em", "1.72em", "1.73em", "1.75em", "1.76em", "1.78em", "1.9em", "1.92em", "2em"]
        },
        "Hiragino Kaku Gothic ProN": {
        cssClassName: "hiraginokaku",
        lineHeights: ["1.85em", "1.78em", "1.74em", "1.7em", "1.69em", "1.68em", "1.69em", "1.7em", "1.74em", "1.85em", "1.9em", "2em"]
        },
        "Hiragino Mincho ProN": {
        cssClassName: "hiraginomincho",
        lineHeights: ["1.75em", "1.72em", "1.69em", "1.66em", "1.64em", "1.56em", "1.53em", "1.56em", "1.6em", "1.65em", "1.69em", "1.72em"]
        },
        "Hiragino Maru Gothic ProN": {
        cssClassName: "hiraginomaru",
        lineHeights: ["1.85em", "1.78em", "1.74em", "1.7em", "1.69em", "1.68em", "1.69em", "1.7em", "1.74em", "1.85em", "1.9em", "2em"]
        },
        "PingFang SC": {
        lineHeights: ["1.85em", "1.78em", "1.74em", "1.7em", "1.69em", "1.68em", "1.69em", "1.7em", "1.74em", "1.85em", "1.9em", "2em"],
        cssClassName: "pingfangsc"
        },
        "Heiti SC": {
        lineHeights: ["1.85em", "1.78em", "1.74em", "1.7em", "1.7em", "1.71em", "1.72em", "1.75em", "1.8em", "1.9em", "1.95em", "2em"],
        cssClassName: "heitisc"
        },
        "Songti SC": {
        lineHeights: ["1.8em", "1.78em", "1.74em", "1.72em", "1.71em", "1.72em", "1.73em", "1.75em", "1.8em", "1.9em", "1.95em", "1.96em"],
        cssClassName: "songtisc"
        },
        "Kaiti SC": {
        lineHeights: ["1.75em", "1.72em", "1.69em", "1.66em", "1.64em", "1.56em", "1.53em", "1.56em", "1.6em", "1.65em", "1.69em", "1.72em"],
        cssClassName: "kaitisc"
        },
        "Yuanti SC": {
        lineHeights: ["1.95em", "1.93em", "1.9em", "1.87em", "1.85em", "1.8em", "1.83em", "1.85em", "1.88em", "1.9em", "1.91em", "1.92em"],
        cssClassName: "yuantisc"
        },
        "Libian SC": {
        fontSizes: [27, 28, 29, 30, 31, 32, 33, 35, 37, 40, 42, 46],
        lineHeights: ["1.65em", "1.63em", "1.62em", "1.61em", "1.6em", "1.6em", "1.61em", "1.62em", "1.63em", "1.64em", "1.64em", "1.65em"],
        cssClassName: "libiansc"
        },
        "Weibei SC": {
        fontSizes: [21, 22, 23, 24, 25, 26, 27, 29, 32, 34, 39, 43],
        lineHeights: ["1.65em", "1.63em", "1.62em", "1.61em", "1.6em", "1.6em", "1.61em", "1.62em", "1.63em", "1.64em", "1.64em", "1.65em"],
        cssClassName: "weibeisc"
        },
        "Yuppy SC": {
        lineHeights: ["1.75em", "1.73em", "1.7em", "1.67em", "1.65em", "1.6em", "1.63em", "1.65em", "1.68em", "1.7em", "1.71em", "1.72em"],
        cssClassName: "yuppysc"
        },
        "PingFang TC": {
        lineHeights: ["1.85em", "1.78em", "1.75em", "1.72em", "1.7em", "1.7em", "1.7em", "1.72em", "1.75em", "1.82em", "1.85em", "1.9em"],
        cssClassName: "pingfangtc"
        },
        "Heiti TC": {
        lineHeights: ["1.85em", "1.78em", "1.75em", "1.72em", "1.71em", "1.71em", "1.72em", "1.75em", "1.78em", "1.82em", "1.86em", "1.9em"],
        cssClassName: "heititc"
        },
        "Songti TC": {
        lineHeights: ["1.8em", "1.78em", "1.74em", "1.73em", "1.72em", "1.72em", "1.73em", "1.75em", "1.8em", "1.9em", "1.95em", "1.96em"],
        cssClassName: "songtitc"
        },
        "Kaiti TC": {
        fontSizes: [20, 21, 22, 23, 24, 25, 26, 28, 31, 33, 38, 43],
        lineHeights: ["1.63em", "1.62em", "1.62em", "1.6em", "1.56em", "1.53em", "1.5em", "1.53em", "1.56em", "1.6em", "1.62em", "1.63em"],
        cssClassName: "kaititc"
        },
        "Yuanti TC": {
        lineHeights: ["1.95em", "1.93em", "1.9em", "1.87em", "1.85em", "1.8em", "1.83em", "1.85em", "1.88em", "1.9em", "1.91em", "1.92em"],
        cssClassName: "yuantitc"
        },
        "Libian TC": {
        fontSizes: [27, 28, 29, 30, 31, 32, 33, 35, 37, 40, 42, 46],
        lineHeights: ["1.65em", "1.63em", "1.62em", "1.61em", "1.6em", "1.6em", "1.61em", "1.62em", "1.63em", "1.64em", "1.64em", "1.65em"],
        cssClassName: "libiantc"
        },
        "Weibei TC": {
        fontSizes: [21, 22, 23, 24, 25, 26, 27, 29, 32, 34, 39, 43],
        lineHeights: ["1.65em", "1.63em", "1.62em", "1.61em", "1.6em", "1.6em", "1.61em", "1.62em", "1.63em", "1.64em", "1.64em", "1.65em"],
        cssClassName: "weibeitc"
        },
        "Yuppy TC": {
        lineHeights: ["1.75em", "1.73em", "1.7em", "1.67em", "1.65em", "1.6em", "1.63em", "1.65em", "1.68em", "1.7em", "1.71em", "1.72em"],
        cssClassName: "yuppytc"
        },
        "Apple SD Gothic Neo": {
        cssClassName: "applesdgothicneo"
        },
        "Nanum Gothic": {
        cssClassName: "nanumgothic"
        },
        "Nanum Myeongjo": {
        cssClassName: "nanummyeongjo"
        },
        "Khmer Sangam MN": {
        cssClassName: "khmersangammn"
        },
        "Lao Sangam MN": {
        cssClassName: "laosangam"
        },
    Thonburi: {
    cssClassName: "thonburi"
    },
    Damascus: {
    cssClassName: "damascus"
    },
    Kefa: {
    cssClassName: "kefa"
    },
        "Arial Hebrew": {
        cssClassName: "arialhebrew"
        },
    Mshtakan: {
    cssClassName: "mshtakan"
    },
        "Plantagenet Cherokee": {
        cssClassName: "plantagenetcherokee"
        },
        "Euphemia UCAS": {
        cssClassName: "euphemiaucas"
        },
        "Kohinoor Bangla": {
        cssClassName: "kohinoorbangla"
        },
        "Bangla Sangam MN": {
        cssClassName: "banglasangammn"
        },
        "Gujarati Sangam MN": {
        cssClassName: "gujarati"
        },
        "Gurmukhi MN": {
        cssClassName: "gurmukhi"
        },
        "Kohinoor Devanagari": {
        cssClassName: "kohinoordevanagari"
        },
        "ITF Devanagari": {
        cssClassName: "itfdevanagari"
        },
        "Kannada Sangam MN": {
        cssClassName: "kannada"
        },
        "Malayalam Sangam MN": {
        cssClassName: "malayalam"
        },
        "Oriya Sangam MN": {
        cssClassName: "oriya"
        },
        "Sinhala Sangam MN": {
        cssClassName: "sinhala"
        },
    InaiMathi: {
    cssClassName: "inaimathi"
    },
        "Tamil Sangam MN": {
        cssClassName: "tamil"
        },
        "Kohinoor Telugu": {
        cssClassName: "Kohinoor Telugu"
        },
        "Telugu Sangam MN": {
        cssClassName: "telugu"
        },
        "Noto Nastaliq Urdu": {
        lineHeights: ["2.6em", "2.7em", "2.8em", "2.8em", "2.8em", "2.8em", "2.8em", "2.6em", "2.5em", "2.5em", "2.5em", "2.6em"],
        cssClassName: "noto"
        },
        "Geeza Pro": {
        cssClassName: "geezapro"
        },
        "Arial Unicode MS": {
        cssClassName: "arialunicodems"
        },
        "Arial Rounded MT Bold": {
        cssClassName: "arialmt"
        },
    Tahoma: {
    cssClassName: "tahoma"
    }
    };
    var a = i[e];
    return a ? (a.fontSizes || (a.fontSizes = t), a.lineHeights || (a.lineHeights = n), a) : a
}
function loadTwitterJavaScript() {
    window.twttr = function(e, t, n) {
        var i,
        a,
        o = e.getElementsByTagName(t)[0];
        if (!e.getElementById(n))
            return a = e.createElement(t), a.id = n, a.src = "https://platform.twitter.com/widgets.js", o.parentNode.insertBefore(a, o), window.twttr || (i = {
                                                                                                                                                          _e: [],
                                                                                                                                                          ready: function(e) {
                                                                                                                                                          i._e.push(e)
                                                                                                                                                          }
                                                                                                                                                          })
            }(document, "script", "twitter-wjs")
}
function richTweetWasCreated(e) {
    var t = e.parentNode.querySelector(".simple-tweet");
    t.classList.add("hidden")
}
function replaceSimpleTweetsWithRichTweets() {
    if (ReaderJS._isJavaScriptEnabled()) {
        var e = document.querySelectorAll("[data-reader-tweet-id]"),
        t = e.length;
        t && (loadTwitterJavaScript(), twttr.ready(function(n) {
                                                   for (var i = 0; t > i; ++i) {
                                                   var a = e[i];
                                                   n.widgets.createTweet(a.getAttribute("data-reader-tweet-id"), a, {
                                                                         dnt: !0
                                                                         }).then(richTweetWasCreated)
                                                   }
                                                   }))
    }
}
function prepareTweetsInPrintingMailingFrame(e) {
    for (var t = e.querySelectorAll(".tweet-wrapper"), n = t.length, i = 0; n > i; ++i) {
        var a = t[i],
        o = a.querySelector("iframe");
        o && o.remove();
        var r = a.querySelector(".simple-tweet");
        r && r.classList.remove("hidden")
    }
}
function localeForElement(e) {
    var t = ReaderJSController.bestLocaleForString(e.textContent);
    return t && t.length && "und" !== t ? t : "en"
}
function anchorForURL(e) {
    var t = document.createElement("a");
    return t.href = e, t
}
function stopExtendingElementBeyondTextColumn(e) {
    e.classList.remove("extendsBeyondTextColumn"), e.style.removeProperty("width"), e.style.removeProperty("-webkit-margin-start")
}
function leadingMarginAndPaddingAppliedToElementFromAncestors(e) {
    for (var t = 0, n = e.parentElement; n && !n.classList.contains("page");) {
        var i = getComputedStyle(n);
        t += parseFloat(i["-webkit-padding-start"]) + parseFloat(i["-webkit-margin-start"]), n = n.parentElement
    }
    return t
}
function extendElementBeyondTextColumn(e, t, n) {
    e.classList.add("extendsBeyondTextColumn"), e.style.setProperty("width", t + "px"), e.style.setProperty("-webkit-margin-start", (n - t) / 2 - leadingMarginAndPaddingAppliedToElementFromAncestors(e) + "px")
}
function textSizeIndexIsValid(e) {
    return "number" == typeof e && e >= MinTextZoomIndex && MaxTextZoomIndex >= e
}
function monitorMouseDownForPotentialDeactivation(e) {
    lastMouseDownWasOutsideOfPaper = e && ReaderAppearanceJS.usesPaperAppearance() && !document.getElementById("article").contains(e.target)
}
function deactivateIfEventIsOutsideOfPaperContainer(e) {
    lastMouseDownWasOutsideOfPaper && e && ReaderAppearanceJS.usesPaperAppearance() && !document.getElementById("article").contains(e.target) && ReaderJSController.requestDeactivationFromUserAction()
}
function updatePageNumbers() {
    for (var e = document.getElementsByClassName("page-number"), t = e.length, n = ReaderJS.isLoadingNextPage(), i = 0; t > i; ++i)
        n ? e[i].textContent = getLocalizedString("Page %@").format(i + 1) : e[i].textContent = getLocalizedString("Page %@ of %@").format(i + 1, t)
        }
function incomingPagePlaceholder() {
    return document.getElementById("incoming-page-placeholder")
}
function addIncomingPagePlaceholder(e) {
    var t = document.createElement("div");
    t.className = "page", t.id = "incoming-page-placeholder";
    var n = document.createElement("div");
    n.id = "incoming-page-corner";
    var i = document.createElement("div");
    i.id = "incoming-page-text", i.innerText = getLocalizedString(e ? "Loading Next Page\u2026" : "Connect to the Internet to view remaining pages."), n.appendChild(i), t.appendChild(n), document.getElementById("article").appendChild(t)
}
function removeIncomingPagePlaceholder() {
    var e = incomingPagePlaceholder();
    e.parentNode.removeChild(e)
}
function nextPageContainer() {
    return document.getElementById("next-page-container")
}
function getLocalizedString(e) {
    var t = localizedStrings[e];
    return t ? t : e
}
function nextPageLoadComplete() {
    if (nextPageContainer().removeEventListener("load", nextPageLoadComplete, !1), ReaderJS.pageNumber++, ReaderJS.readerOperationMode == ReaderOperationMode.OffscreenFetching) {
        var e = ReaderJS.pageURLs[ReaderJS.pageURLs.length - 1];
        ReaderJSController.nextPageLoadComplete(ReaderJS.pageNumber, e, "next-page-container")
    }
    ReaderJSController.prepareNextPageFrame("next-page-container");
    var t = ReaderJSController.nextPageArticleFinder();
    t.pageNumber = ReaderJS.pageNumber, t.suggestedRouteToArticle = ReaderJS.routeToArticle, t.previouslyDiscoveredPageURLStrings = ReaderJS.pageURLs;
    var n = t.adoptableArticle();
    n && (ReaderJS.createPageFromNode(n), ReaderJS.routeToArticle = t.routeToArticleNode()), nextPageContainer().removeAttribute("src"), ReaderJSController.clearNextPageArticleFinder(), ReaderJS.canLoadNextPage() ? ReaderJS.setNextPageURL(t.nextPageURL()) : ReaderJS.setCachedNextPageURL(t.nextPageURL()), updatePageNumbers(), restoreInitialArticleScrollPositionIfPossible(), ReaderJS.isLoadingNextPage() || ReaderJS.doneLoadingAllPages()
}
function contentElementTouchingTopOfViewport() {
    var e = articleTitleElement();
    do {
        var t = e.getBoundingClientRect();
        if (t.top <= 0 && t.bottom >= 0)
            return e
            } while (e = nextReaderContentElement(e));
    return null
}
var LoadNextPageDelay = 250,
MaxNumberOfNextPagesToLoad = 80,
ReaderOperationMode = {
Normal: 0,
OffscreenFetching: 1,
ArchiveViewing: 2
},
DelayBeforeRestoringScrollPositionInMs = 1e3;
String.prototype.format = function() {
    for (var e = this.split("%@"), t = 0, n = arguments.length; n > t; ++t)
        e.splice(2 * t + 1, 0, arguments[t].toString());
    return e.join("")
};
var AnimationTerminationCondition = {
Interrupted: 0,
CompletedSuccessfully: 1
};
AppleAnimator = function(e, t, n) {
    this.startTime = 0, this.duration = e, this.interval = t, this.animations = [], this.animationFinishedCallback = n, this.currentFrameRequestID = null, this._firstTime = !0;
    var i = this;
    this.animate = function() {
        function e(e, t, n) {
            return t > e ? t : e > n ? n : e
        }
        var t,
        n,
        a,
        o,
        n = (new Date).getTime(),
        r = i.duration;
        t = e(n - i.startTime, 0, r), n = t / r, a = .5 - .5 * Math.cos(Math.PI * n), o = t >= r;
        for (var s = i.animations, l = s.length, m = i._firstTime, d = 0; l > d; ++d)
            s[d].doFrame(i, a, m, o, n);
        return o ? void i.stop(AnimationTerminationCondition.CompletedSuccessfully) : (i._firstTime = !1, void (this.currentFrameRequestID = requestAnimationFrame(i.animate)))
    }
}, AppleAnimator.prototype = {
start: function(e) {
    var t = (new Date).getTime(),
    n = this.interval;
    this.startTime = t - n, e && (this.startTime += e), this.currentFrameRequestID = requestAnimationFrame(this.animate)
},
stop: function(e) {
    this.animationFinishedCallback && this.animationFinishedCallback(e), this.currentFrameRequestID && cancelAnimationFrame(this.currentFrameRequestID)
},
addAnimation: function(e) {
    this.animations[this.animations.length] = e
}
}, AppleAnimation = function(e, t, n) {
    this.from = e, this.to = t, this.callback = n, this.now = e, this.ease = 0, this.progress = 0
}, AppleAnimation.prototype = {
doFrame: function(e, t, n, i, a) {
    var o;
    o = i ? this.to : this.from + (this.to - this.from) * t, this.now = o, this.ease = t, this.progress = a, this.callback(e, o, n, i)
}
};
var scrollEventIsSmoothScroll = !1,
smoothScrollingAnimator,
smoothScrollingAnimation;
window.addEventListener("scroll", articleScrolled, !1);
const ContentAwareNavigationMarker = "reader-content-aware-navigation-marker",
ContentAwareNavigationAnimationDuration = 200,
ContentAwareNavigationElementOffset = 8,
ContentAwareNavigationDirection = {
Up: 0,
Down: 1
};
ContentAwareScroller = function() {
    this._numberOfContentAwareScrollAnimationsInProgress = 0
}, ContentAwareScroller.prototype = {
_contentElementAtTopOfViewport: function() {
    var e = articleTitleElement();
    do if (!(e.getBoundingClientRect().top < ContentAwareNavigationElementOffset))
        return e;
    while (e = nextReaderContentElement(e));
    return null
},
_clearTargetOfContentAwareScrolling: function() {
    var e = document.getElementById(ContentAwareNavigationMarker);
    e && e.removeAttribute("id")
},
_contentAwareScrollFinished: function(e) {
    e === AnimationTerminationCondition.CompletedSuccessfully && (--this._numberOfContentAwareScrollAnimationsInProgress, this._numberOfContentAwareScrollAnimationsInProgress || (smoothScrollingAnimator = null, smoothScrollingAnimation = null, this._clearTargetOfContentAwareScrolling()))
},
scroll: function(e) {
    var t,
    n,
    i = document.getElementById(ContentAwareNavigationMarker),
    a = i || this._contentElementAtTopOfViewport();
    if (e === ContentAwareNavigationDirection.Down) {
        var o = Math.abs(a.getBoundingClientRect().top - ContentAwareNavigationElementOffset) < 1;
        t = i || o ? nextReaderContentElement(a) : a
    } else if (e === ContentAwareNavigationDirection.Up)
        if (a === articleTitleElement()) {
            if (0 === document.body.scrollTop)
                return;
            n = -1 * document.body.scrollTop
        } else
            t = previousReaderContentElement(a);
    t && (n = t.getBoundingClientRect().top - ContentAwareNavigationElementOffset), ++this._numberOfContentAwareScrollAnimationsInProgress, smoothScroll(document.body, n, ContentAwareNavigationAnimationDuration, this._contentAwareScrollFinished.bind(this)), this._clearTargetOfContentAwareScrolling(), t && (t.id = ContentAwareNavigationMarker)
}
}, window.addEventListener("keydown", keyDown, !1);
var didRestoreInitialScrollPosition = !1,
initialScrollPosition;
const ThemeSettings = {
White: {
cssClassName: "white"
},
Gray: {
cssClassName: "gray"
},
Sepia: {
cssClassName: "sepia"
},
Night: {
cssClassName: "night"
}
},
ConfigurationVersion = 4,
ShouldSaveConfiguration = {
No: !1,
Yes: !0
},
ShouldRestoreReadingPosition = {
No: !1,
Yes: !0
},
MinTextZoomIndex = 0,
MaxTextZoomIndex = 11,
MaximumWidthOfImageOrVideoExtendingBeyondTextContainer = 1050,
ReaderConfigurationJavaScriptEnabledKey = "javaScriptEnabled";
ReaderAppearanceController = function() {
    this._defaultTextSizeIndexProducer = function() {
        return 3
    }, this._readerSizeClassProducer = function() {
        return "all"
    }, this._shouldUsePaperAppearance = function() {
        return this.articleWidth() + 140 < this.documentElementWidth()
    }, this._isOLEDDisplay = function() {
        return !1
    }, this._canLayOutContentBeyondMainTextColumn = !0, this._defaultFontFamilyName = "System", this._defaultThemeName = "White", this.configuration = {}, this._textSizeIndex = null, this._fontFamilyName = this._defaultFontFamilyName, this._themeName = this._defaultThemeName
}, ReaderAppearanceController.prototype = {
initialize: function() {
    this.applyConfiguration(ReaderJSController.initialConfiguration()), /Macintosh/g.test(navigator.userAgent) ? document.body.classList.add("mac") : document.body.classList.add("ios"), this._isOLEDDisplay() && document.body.classList.add("oled")
},
applyConfiguration: function(e) {
    var t = this._validConfigurationAndValidityFromUntrustedConfiguration(e),
    n = t[0],
    i = t[1],
    a = this._locale(),
    o = n.fontFamilyNameForLanguageTag[a];
    o && fontSettings(o) || (o = this._defaultFontFamilyNameForLanguage(a), i = !1), this.setLocale(a), this.setFontFamily(o, ShouldSaveConfiguration.No), this.setTheme(n.themeName, ShouldSaveConfiguration.No);
    var r = n.fontSizeIndexForSizeClass[this._readerSizeClassProducer()];
    textSizeIndexIsValid(r) ? this.setCurrentTextSizeIndex(r, ShouldSaveConfiguration.No) : (this.setCurrentTextSizeIndex(this._defaultTextSizeIndexProducer(), ShouldSaveConfiguration.No), i = !1), this.configuration = n, i || this._updateSavedConfiguration()
},
_validConfigurationAndValidityFromUntrustedConfiguration: function(e) {
    var t = {
    fontSizeIndexForSizeClass: {},
    fontFamilyNameForLanguageTag: {},
    themeName: null
    },
    n = !0;
    e || (e = {}, n = !1);
    var i = (e || {}).version;
    (!i || "number" != typeof i || ConfigurationVersion > i) && (e = {}, n = !1);
    var a = (e || {}).fontSizeIndexForSizeClass;
    if (a && "object" == typeof a)
        for (var o in a) {
            var r = a[o];
            textSizeIndexIsValid(r) ? t.fontSizeIndexForSizeClass[o] = r : n = !1
        }
    else
        n = !1;
    var s = e.fontFamilyNameForLanguageTag;
    s && "object" == typeof s ? t.fontFamilyNameForLanguageTag = s : (t.fontFamilyNameForLanguageTag = {}, n = !1);
    var l = e.themeName;
    return l && "string" == typeof l && ThemeSettings[l] ? t.themeName = l : (t.themeName = this._defaultThemeName, n = !1), [t, n]
},
_updateSavedConfiguration: function() {
    this.configuration.fontSizeIndexForSizeClass[this._readerSizeClassProducer()] = this._textSizeIndex, this.configuration.fontFamilyNameForLanguageTag[this._locale()] = this._fontFamilyName, this.configuration.themeName = this._themeName;
    var e = this.configuration;
    e.version = ConfigurationVersion, ReaderJSController.didSetConfiguration(e)
},
applyAppropriateFontSize: function() {
    var e = this.configuration.fontSizeIndexForSizeClass[this._readerSizeClassProducer()];
    e && this.setCurrentTextSizeIndex(e, ShouldSaveConfiguration.No)
},
makeTextLarger: function() {
    this._textSizeIndex < this._currentFontSettings().fontSizes.length - 1 && this.setCurrentTextSizeIndex(this._textSizeIndex + 1, ShouldSaveConfiguration.Yes)
},
makeTextSmaller: function() {
    this._textSizeIndex > 0 && this.setCurrentTextSizeIndex(this._textSizeIndex - 1, ShouldSaveConfiguration.Yes)
},
articleWidth: function() {
    return document.getElementById("article").getBoundingClientRect().width
},
_textColumnWidthInPoints: function() {
    return parseFloat(getComputedStyle(document.querySelector("#article .page")).width)
},
documentElementWidth: function() {
    return document.documentElement.clientWidth
},
setCurrentTextSizeIndex: function(e, t) {
    this._textSizeIndex = e, this._rebuildDynamicStyleSheet(), this.layOutContent(), t === ShouldSaveConfiguration.Yes && this._updateSavedConfiguration()
},
currentFontCSSClassName: function() {
    return this._currentFontSettings().cssClassName
},
_currentFontSettings: function() {
    return fontSettings(this._fontFamilyName)
},
setLocale: function(e) {
    if (e !== this._lastSetLocale) {
        var t = document.body.classList;
        const n = "locale-";
        t.remove(n + this._lastSetLocale), t.add(n + e), this._lastSetLocale = e
    }
},
setFontFamily: function(e, t) {
    var n = document.body,
    i = fontSettings(e);
    n.classList.contains(i.cssClassName) || (this._fontFamilyName && n.classList.remove(fontSettings(this._fontFamilyName).cssClassName), n.classList.add(i.cssClassName), this._fontFamilyName = e, this.layOutContent(), t === ShouldSaveConfiguration.Yes && this._updateSavedConfiguration())
},
_theme: function() {
    return ThemeSettings[this._themeName]
},
setTheme: function(e, t) {
    var n = document.body,
    i = ThemeSettings[e];
    n.classList.contains(i.cssClassName) || (this._theme() && n.classList.remove(this._theme().cssClassName), n.classList.add(i.cssClassName), this._themeName = e, t === ShouldSaveConfiguration.Yes && this._updateSavedConfiguration())
},
usesPaperAppearance: function() {
    return document.documentElement.classList.contains("paper")
},
layOutContent: function(e) {
    void 0 === e && (e = ShouldRestoreReadingPosition.Yes), this._shouldUsePaperAppearance() ? document.documentElement.classList.add("paper") : document.documentElement.classList.remove("paper"), makeWideElementsScrollable(), this._canLayOutContentBeyondMainTextColumn && (this._layOutImagesAndVideoElementsBeyondTextColumn(), this._layOutElementsContainingTextBeyondTextColumn(), this._layOutVideos()), this._layOutMetadataBlock(), e === ShouldRestoreReadingPosition.Yes && ReadingPositionStabilizerJS.restorePosition()
},
_layOutMetadataBlock: function() {
    var e = document.querySelector(".metadata");
    if (e) {
        var t = e.querySelector(".byline"),
        n = e.querySelector(".date");
        if (!t || !n)
            return void e.classList.add("singleline");
        for (var i = t.getClientRects(), a = i.length, o = n.getClientRects(), r = o.length, s = 0, l = 0; a > l; ++l)
            s += i[l].width;
        for (var l = 0; r > l; ++l)
            s += o[l].width;
        const m = 25;
        s + m > this._textColumnWidthInPoints() ? e.classList.remove("singleline") : e.classList.add("singleline")
    }
},
_layOutImagesAndVideoElementsBeyondTextColumn: function() {
    for (var e = this.canLayOutContentMaintainingAspectRatioBeyondTextColumn(), t = article.querySelectorAll("img, video"), n = t.length, i = 0; n > i; ++i)
        this.setImageOrVideoShouldLayOutBeyondTextColumnIfAppropriate(t[i], e)
        },
_layOutElementsContainingTextBeyondTextColumn: function() {
    const e = {
    PRE: !0,
    TABLE: !1
    },
    t = 22;
    for (var n = document.querySelectorAll(".scrollable pre, .scrollable table"), i = n.length, a = 0; i > a; ++a) {
        for (var o = n[a], r = o.parentElement, s = r; s; s = s.parentElement)
            "BLOCKQUOTE" === s.tagName && s.classList.add("simple");
        stopExtendingElementBeyondTextColumn(r);
        var l = o.scrollWidth,
        m = this._textColumnWidthInPoints();
        if (!(m >= l)) {
            var d = getComputedStyle(document.querySelector(".page")),
            c = 0;
            if (e[o.tagName]) {
                var u = parseFloat(d["-webkit-padding-start"]) + parseFloat(d["-webkit-margin-start"]);
                c = Math.min(u, t)
            }
            var h = Math.min(l, this._widthAvailableForLayout() - 2 * c);
            extendElementBeyondTextColumn(r, h, m)
        }
    }
},
_layOutVideos: function() {
    function e(e) {
        return e.src && /^(.+\.)?(youtube|vimeo)\.com\.?$/.test(anchorForURL(e.src).hostname)
    }
    const t = 16 / 9;
    for (var n, i, a = ReaderAppearanceJS.canLayOutContentMaintainingAspectRatioBeyondTextColumn(), o = article.querySelectorAll("iframe"), r = o.length, s = 0; r > s; ++s) {
        var l = o[s];
        if (e(l)) {
            var m;
            if (l.parentElement.classList.contains("iframe-wrapper") ? m = l.parentElement : (m = document.createElement("div"), m.className = "iframe-wrapper", l.nextSibling ? l.parentNode.insertBefore(m, l.nextSibling) : l.parentNode.appendChild(m), m.appendChild(l)), n || (n = Math.min(MaximumWidthOfImageOrVideoExtendingBeyondTextContainer, this._widthAvailableForLayout())), i || (i = this._textColumnWidthInPoints()), a && n > i) {
                m.style.height = n / t + "px", extendElementBeyondTextColumn(m, n, i), l.style.height = "100%";
                var d = this.usesPaperAppearance() ? 2 : 0;
                l.style.width = n - d + "px"
            } else
                stopExtendingElementBeyondTextColumn(m), m.style.width = "100%", m.style.height = this._textColumnWidthInPoints() / t + "px"
                }
    }
},
canLayOutContentMaintainingAspectRatioBeyondTextColumn: function() {
    const e = 700;
    if (window.innerHeight >= e)
        return !0;
    const t = 1.25;
    return window.innerWidth / window.innerHeight <= t
},
setImageOrVideoShouldLayOutBeyondTextColumnIfAppropriate: function(e, t) {
    if (t && !e.closest("blockquote, table, .float")) {
        var n,
        i = this._textColumnWidthInPoints(),
        a = parseFloat(e.getAttribute("width"));
        n = isNaN(a) ? e.naturalWidth : a;
        var o = Math.min(n, Math.min(MaximumWidthOfImageOrVideoExtendingBeyondTextContainer, this._widthAvailableForLayout()));
        if (o > i)
            return void extendElementBeyondTextColumn(e, o, i)
            }
    stopExtendingElementBeyondTextColumn(e)
},
_widthAvailableForLayout: function() {
    return this.usesPaperAppearance() ? this.articleWidth() : this.documentElementWidth()
},
_rebuildDynamicStyleSheet: function() {
    for (var e = document.getElementById("dynamic-article-content").sheet; e.cssRules.length;)
        e.removeRule(0);
    var t = this._currentFontSettings().fontSizes[this._textSizeIndex] + "px",
    n = this._currentFontSettings().lineHeights[this._textSizeIndex];
    e.insertRule("#article { font-size: " + t + "; line-height: " + n + "; }")
},
_locale: function() {
    var e = document.getElementById("article").style.webkitLocale;
    return e && e.length ? e : ""
},
_defaultFontFamilyNameForLanguage: function(e) {
    const t = {
    am: "Kefa",
    ar: "Damascus",
    hy: "Mshtakan",
    bn: "Kohinoor Bangla",
    chr: "Plantagenet Cherokee",
    gu: "Gujarati Sangam MN",
        "pa-Guru": "Gurmukhi MN",
    he: "Arial Hebrew",
    hi: "Kohinoor Devanagari",
    ja: "Hiragino Mincho ProN",
    kn: "Kannada Sangam MN",
    km: "Khmer Sangam MN",
    ko: "Apple SD Gothic Neo",
    lo: "Lao Sangam MN",
    ml: "Malayalam Sangam MN",
    or: "Oriya Sangam MN",
    si: "Sinhala Sangam MN",
    ta: "InaiMathi",
    te: "Kohinoor Telugu",
    th: "Thonburi",
        "zh-Hans": "PingFang SC",
        "zh-Hant": "PingFang TC",
        "iu-Cans": "Euphemia UCAS",
    ur: "Noto Nastaliq Urdu"
    };
    var n = t[e];
    return n ? n : this._defaultFontFamilyName
}
};
var lastMouseDownWasOutsideOfPaper = !1;
ReaderController = function() {
    this.pageNumber = 1, this.pageURLs = [], this.articleIsLTR = !0, this.loadingNextPage = !1, this.loadingNextPageManuallyStopped = !1, this.cachedNextPageURL = null, this.lastKnownUserVisibleWidth = 0, this.lastKnownDocumentElementWidth = 0, this._readerWillBecomeVisible = function() {}, this._readerWillEnterBackground = function() {}, this._distanceFromBottomOfArticleToStartLoadingNextPage = function() {
        return NaN
    }, this._clickingOutsideOfPaperRectangleDismissesReader = !1, this._shouldSkipActivationWhenPageLoads = function() {
        return !1
    }, this._shouldConvertRelativeURLsToAbsoluteURLsWhenPrintingOrMailing = !1, this._deferSendingContentIsReadyForDisplay = !1, this._isJavaScriptEnabled = function() {
        return !0
    }
}, ReaderController.prototype = {
setOriginalURL: function(e) {
    this.originalURL = e, this.pageURLs.push(e), document.head.getElementsByTagName("base")[0].href = this.originalURL
},
setNextPageURL: function(e) {
    if (!e || -1 !== this.pageURLs.indexOf(e) || this.pageNumber + 1 === MaxNumberOfNextPagesToLoad)
        return void this.setLoadingNextPage(!1);
    this.setLoadingNextPage(!0), this.pageURLs.push(e);
    var t = function() {
        nextPageContainer().addEventListener("load", nextPageLoadComplete, !1), nextPageContainer().src = e
    };
    this.readerOperationMode == ReaderOperationMode.OffscreenFetching ? t() : this.nextPageLoadTimer = setTimeout(t, LoadNextPageDelay)
},
pauseLoadingNextPage: function() {
    this.readerOperationMode == ReaderOperationMode.Normal && (nextPageContainer().removeEventListener("load", nextPageLoadComplete, !1), this.cachedNextPageURL || (this.cachedNextPageURL = this.pageURLs.pop()), nextPageContainer().src = null, this.nextPageLoadTimer && clearTimeout(this.nextPageLoadTimer), ReaderJSController.didChangeNextPageLoadingState(!1))
},
stopLoadingNextPage: function() {
    nextPageContainer().removeEventListener("load", nextPageLoadComplete, !1), nextPageContainer().src = null, this.nextPageLoadTimer && clearTimeout(this.nextPageLoadTimer), this.isLoadingNextPage() && (this.setLoadingNextPage(!1), this.loadingNextPageManuallyStopped = !0)
},
isLoadingNextPage: function() {
    return this.loadingNextPage
},
setLoadingNextPage: function(e) {
    this.loadingNextPage != e && (e ? addIncomingPagePlaceholder(ReaderJSController.canLoadFromNetwork()) : removeIncomingPagePlaceholder(), this.loadingNextPage = e, ReaderJSController.didChangeNextPageLoadingState(this.loadingNextPage))
},
doneLoadingAllPages: function() {
    ReaderJSController.doneLoadingReaderPage()
},
loaded: function() {
    if (this.readerOperationMode = ReaderJSController.readerOperationMode(), !ReaderJSController.originalArticleFinder() || this._shouldSkipActivationWhenPageLoads())
        return void ReaderJSController.deactivateNow();
    this.loadArticle(), ReadingPositionStabilizerJS.initialize();
    var e = ReaderJSController.cachedTopScrollOffset();
    if (e > 0)
        document.body.scrollTop = e;
    else {
        var t = document.getElementById("safari-reader-element-marker");
        if (t) {
            var n = parseFloat(t.style.top) / 100,
            i = t.parentElement,
            a = i.getBoundingClientRect();
            document.body.scrollTop = window.scrollY + a.top + a.height * n, i.removeChild(t)
        }
    }
    this._clickingOutsideOfPaperRectangleDismissesReader && (document.documentElement.addEventListener("mousedown", monitorMouseDownForPotentialDeactivation), document.documentElement.addEventListener("click", deactivateIfEventIsOutsideOfPaperContainer));
    var o = function() {
        this.setUserVisibleWidth(this.lastKnownUserVisibleWidth)
    }.bind(this);
    window.addEventListener("resize", o, !1);
    var r = this._bestLocale,
    s = function() {
        ReaderJSController.contentIsReadyForDisplay(r)
    };
    this._deferSendingContentIsReadyForDisplay ? setTimeout(s, 0) : s()
},
setUserVisibleWidth: function(e) {
    var t = ReaderAppearanceJS.documentElementWidth();
    e === this.lastKnownUserVisibleWidth && t === this.lastKnownDocumentElementWidth || (this.lastKnownUserVisibleWidth = e, this.lastKnownDocumentElementWidth = t, ReaderAppearanceJS.applyAppropriateFontSize(), ReaderAppearanceJS.layOutContent())
},
loadArticle: function() {
    var e = ReaderJSController.originalArticleFinder();
    if (e.article || e.articleNode(!0), !e.article)
        return this.setOriginalURL(e.contentDocument.baseURI), void this.doneLoadingAllPages();
    this.routeToArticle = e.routeToArticleNode(), this.displayTitle = e.articleTitle(), this.displaySubhead = e.articleSubhead(), this.metadataElement = e.adoptableMetadataBlock(), this.articleIsLTR = e.articleIsLTR();
    var t = e.adoptableArticle().ownerDocument;
    if (document.title = t.title, this.setOriginalURL(t.baseURI), this.readerOperationMode == ReaderOperationMode.ArchiveViewing)
        return void ReaderAppearanceJS.layOutContent();
    var n = e.adoptableArticle();
    if (this._isJavaScriptEnabled()) {
        var i = e.nextPageURL();
        this.setNextPageURL(i)
    } else {
        for (var a = n.querySelectorAll("iframe"), o = a.length, r = 0; o > r; ++r)
            a[r].remove();
        this.stopLoadingNextPage()
    }
    this.updateLocaleFromElement(n), this.createPageFromNode(n), ReaderAppearanceJS.initialize(), i || (e.adoptableMultiPageContentElements().forEach(this.createPageFromNode, this),
                                                                                                        updatePageNumbers()), this.isLoadingNextPage() || this.doneLoadingAllPages()
},
loadNewArticle: function() {
    if (!ReaderJSController.originalArticleFinder())
        return void ReaderJSController.deactivateNow();
    for (var e = document.getElementById("article"); e.childNodes.length >= 1;)
        e.removeChild(e.firstChild);
    this.reinitialize(), document.body.scrollTop = 0, this.loadArticle()
},
reinitialize: function() {
    this.pageNumber = 1, this.pageURLs = [], this.articleIsLTR = !0, this.loadingNextPage = !1, this.loadingNextPageManuallyStopped = !1, this.routeToArticle = void 0, this.displayTitle = void 0, this.displaySubhead = void 0, this.originalURL = void 0, this.nextPageLoadTimer = void 0, this.readerOperationMode = ReaderJSController.readerOperationMode(), this.cachedNextPageURL = null
},
createPageFromNode: function(e) {
    var t = document.createElement("div");
    t.className = "page", this.articleIsLTR || t.classList.add("rtl");
    var n = document.createElement("div");
    n.className = "page-number", t.appendChild(n);
    var i = document.createElement("h1");
    if (i.className = "title", i.textContent = this.displayTitle, t.appendChild(i), this.displaySubhead) {
        var a = document.createElement("h2");
        a.className = "subhead", a.textContent = this.displaySubhead, t.appendChild(a)
    }
    if (this.metadataElement && this.metadataElement.innerText) {
        var o = document.createElement("div");
        for (o.className = "metadata"; this.metadataElement.firstChild;)
            o.appendChild(this.metadataElement.firstChild);
        t.appendChild(o)
    }
    for (; e.firstChild;)
        t.appendChild(e.firstChild);
    var r = document.getElementById("article");
    r.insertBefore(t, incomingPagePlaceholder()), replaceSimpleTweetsWithRichTweets(), ReaderAppearanceJS.layOutContent(ShouldRestoreReadingPosition.No), updatePageNumbers(), restoreInitialArticleScrollPositionIfPossible();
    for (var s = t.querySelectorAll("img"), l = s.length, m = 0; l > m; ++m)
        s[m].onload = function(e) {
            var t = e.target;
            ReaderAppearanceJS.setImageOrVideoShouldLayOutBeyondTextColumnIfAppropriate(t, ReaderAppearanceJS.canLayOutContentMaintainingAspectRatioBeyondTextColumn()), t.onload = null
        };
    this._fixImageElementsWithinPictureElements()
},
removeAttribute: function(e, t) {
    for (var n = e.querySelectorAll("[" + t + "]"), i = n.length, a = 0; i > a; a++)
        n[a].removeAttribute(t)
        },
preparePrintingMailingFrame: function() {
    var e = this.printingMailingFrameElementId(),
    t = document.getElementById(e);
    t && document.body.removeChild(t), t = document.createElement("iframe"), t.id = e, t.style.display = "none", t.style.position = "absolute", document.body.appendChild(t);
    var n = t.contentDocument,
    i = document.createElement("base");
    i.href = this.originalURL, n.head.appendChild(i);
    var a = document.createElement("div");
    a.className = "original-url";
    var o = document.createElement("a");
    o.href = this.originalURL, o.textContent = this.originalURL, a.appendChild(document.createElement("br")), a.appendChild(o), a.appendChild(document.createElement("br")), a.appendChild(document.createElement("br")), n.body.appendChild(a), n.body.appendChild(this.sanitizedFullArticle()), n.head.appendChild(document.getElementById("print").cloneNode(!0));
    var r = n.createElement("title");
    r.innerText = document.title, n.head.appendChild(r)
},
sanitizedFullArticle: function() {
    var e = document.getElementById("article").cloneNode(!0);
    e.removeAttribute("tabindex");
    for (var t = e.querySelectorAll(".title"), n = 1; n < t.length; ++n)
        t[n].remove();
    for (var i = e.querySelectorAll(".page-number, #incoming-page-placeholder"), n = 0; n < i.length; ++n)
        i[n].remove();
    if (prepareTweetsInPrintingMailingFrame(e), this._shouldConvertRelativeURLsToAbsoluteURLsWhenPrintingOrMailing) {
        var a = e.querySelectorAll("img, video, audio, source");
        const o = /^http:\/\/|^https:\/\/|^data:/i;
        for (var n = 0; n < a.length; n++) {
            var r = a[n],
            s = r.getAttribute("src");
            o.test(s) || r.setAttribute("src", r.src)
        }
    }
    for (var l = e.querySelectorAll(".extendsBeyondTextColumn"), m = l.length, n = 0; m > n; ++n)
        stopExtendingElementBeyondTextColumn(l[n]);
    for (var d = e.querySelectorAll(".delimeter"), c = d.length, n = 0; c > n; ++n)
        d[n].innerText = "\u2022";
    e.classList.add(ReaderAppearanceJS.currentFontCSSClassName()), e.classList.add("exported");
    for (var u = document.getElementById("article-content").sheet.cssRules, h = u.length, g = 0; h > g; ++g) {
        var p = u[g].selectorText,
        f = u[g].style;
        if (f) {
            var S = f.cssText;
            e.matches(p) && (e.style.cssText += S);
            for (var C = e.querySelectorAll(p), x = C.length, v = 0; x > v; ++v)
                C[v].style.cssText += S
                }
    }
    return e
},
printingMailingFrameElementId: function() {
    return "printing-mailing-frame"
},
updateLocaleFromElement: function(e) {
    this._bestLocale = localeForElement(e), document.getElementById("article").style.webkitLocale = "'" + this._bestLocale + "'"
},
canLoadNextPage: function() {
    if (this.readerOperationMode != ReaderOperationMode.Normal)
        return !0;
    var e = document.querySelectorAll(".page"),
    t = e[e.length - 1],
    n = t.getBoundingClientRect(),
    i = this._distanceFromBottomOfArticleToStartLoadingNextPage();
    return isNaN(i) ? !0 : !(n.bottom - window.scrollY > i)
},
setCachedNextPageURL: function(e) {
    e ? (this.cachedNextPageURL = e, ReaderJSController.didChangeNextPageLoadingState(!1)) : this.setNextPageURL(e)
},
loadNextPage: function() {
    null != this.cachedNextPageURL && (this.setNextPageURL(this.cachedNextPageURL), this.cachedNextPageURL = null, ReaderJSController.didChangeNextPageLoadingState(!0))
},
resumeCachedNextPageLoadIfNecessary: function() {
    ReaderJS.cachedNextPageURL && ReaderJS.canLoadNextPage() && ReaderJS.loadNextPage()
},
readerWillBecomeVisible: function() {
    document.body.classList.remove("cached"), this.resumeCachedNextPageLoadIfNecessary(), this._readerWillBecomeVisible()
},
readerWillEnterBackground: function() {
    (ReaderJS.isLoadingNextPage() || ReaderJS.loadingNextPageManuallyStopped) && this.pauseLoadingNextPage();
    for (var e = document.querySelectorAll("audio, video"), t = 0, n = e.length; n > t; ++t)
        e[t].pause();
    document.body.classList.add("cached"), this._readerWillEnterBackground()
},
_fixImageElementsWithinPictureElements: function() {
    requestAnimationFrame(function() {
                          for (var e = !1, t = document.querySelectorAll("#article picture img"), n = t.length, i = 0; n > i; ++i) {
                          var a = t[i],
                          o = a.previousElementSibling;
                          o && (a.remove(), o.after(a), e = !0)
                          }
                          e && ReaderAppearanceJS.layOutContent()
                          })
}
}, ReadingPositionStabilizer = function() {
    this.elementTouchingTopOfViewport = null, this.elementTouchingTopOfViewportOffsetFromTopOfElementRatio = 0
}, ReadingPositionStabilizer.prototype = {
initialize: function() {
    this.setTrackPosition(!0)
},
setTrackPosition: function(e) {
    this._positionUpdateFunction || (this._positionUpdateFunction = this._updatePosition.bind(this)), e ? window.addEventListener("scroll", this._positionUpdateFunction, !1) : window.removeEventListener("scroll", this._positionUpdateFunction, !1)
},
_updatePosition: function() {
    var e = contentElementTouchingTopOfViewport();
    if (!e)
        return void (this.elementTouchingTopOfViewport = null);
    this.elementTouchingTopOfViewport = e;
    var t = this.elementTouchingTopOfViewport.getBoundingClientRect();
    this.elementTouchingTopOfViewportOffsetFromTopOfElementRatio = t.height > 0 ? t.top / t.height : 0
},
restorePosition: function() {
    if (this.elementTouchingTopOfViewport) {
        var e = this.elementTouchingTopOfViewport.getBoundingClientRect(),
        t = document.body.scrollTop + e.top - e.height * this.elementTouchingTopOfViewportOffsetFromTopOfElementRatio;
        t > 0 && (document.body.scrollTop = t), this._updatePosition()
    }
}
};
var ContentAwareScrollerJS = new ContentAwareScroller,
ReaderAppearanceJS = new ReaderAppearanceController,
ReadingPositionStabilizerJS = new ReadingPositionStabilizer,
ReaderJS = new ReaderController;


