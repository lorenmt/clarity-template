/**
 *  Hoverable Citations & Footnotes
 * A self-contained module for Distill-style inline citations and footnotes.
 * 
 * Usage:
 *   1. Add <script src="assets/scripts/citations.js"></script> to your <head>.
 *   2. Define bibliography in a <script type="text/bibliography"> block (JSON array).
 *   3. Use <a class="cite" data-cite="key"></a> for inline citations.
 *   4. Use <span class="footnote-ref" data-footnote="fnId"></span> for footnotes.
 *   5. Define footnotes in a hidden <div class="footnote-defs"> container.
 *   6. Add an empty <div id="bibliography"><h1>References</h1></div> where you want the reference list.
 *
 * Comment out the script tag(in clarity.html and minimal.html) to disable this feature entirely.
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Inject styles for citations and footnotes: 
    var style = document.createElement('style');
    style.textContent = `
        /* ---- Inline citation pill ---- */
        .cite {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-family: 'Poppins', sans-serif;
            font-size: 0.6em;
            font-weight: 600;
            color: #304463;
            background: #E6EBF2;
            min-width: 17px;
            height: 17px;
            padding: 0 4px;
            border-radius: 9px;
            cursor: pointer;
            position: relative;
            top: -0.4em;
            margin: 0 1px;
            transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
            text-decoration: none !important;
            line-height: 1;
            user-select: none;
        }
        .cite:hover {
            background: #304463;
            color: #fff;
            transform: scale(1.12);
            text-decoration: none !important;
        }

        /* ---- Inline footnote pill ---- */
        .footnote-ref {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-family: 'Poppins', sans-serif;
            font-size: 0.6em;
            font-weight: 600;
            color: #8B6914;
            background: #FFF8E7;
            min-width: 17px;
            height: 17px;
            padding: 0 4px;
            border-radius: 9px;
            cursor: pointer;
            position: relative;
            top: -0.4em;
            margin: 0 1px;
            transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
            text-decoration: none !important;
            line-height: 1;
            user-select: none;
        }
        .footnote-ref:hover {
            background: #D4A720;
            color: #fff;
            transform: scale(1.12);
            text-decoration: none !important;
        }

        /* ---- Popup (shared by citations and footnotes) ---- */
        .cite-popup,
        .footnote-popup {
            position: absolute;
            z-index: 10000;
            background: #fff;
            border-radius: 8px;
            padding: 14px 16px;
            max-width: 380px;
            min-width: 260px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06);
            font-size: 14px;
            line-height: 1.55;
            color: #353535;
            pointer-events: auto;
            opacity: 0;
            transform: translateY(6px);
            transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .cite-popup   { border: 1px solid #F0D98C; }
        .footnote-popup { border: 1px solid #D8D8D3; }

        .cite-popup.visible,
        .footnote-popup.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .cite-popup .cite-authors   { font-weight: 600; margin-bottom: 2px; }
        .cite-popup .cite-title     { font-style: italic; margin-bottom: 3px; }
        .cite-popup .cite-venue     { font-size: 13px; color: #858585; }
        .cite-popup .cite-venue a   { color: #2563EB; font-size: 12px; text-decoration: none; }
        .cite-popup .cite-venue a:hover { text-decoration: underline; }

        /* ---- Auto-generated bibliography list ---- */
        .bib-entry {
            display: flex;
            gap: 12px;
            margin-bottom: 14px;
            font-size: 15px;
            line-height: 1.55;
        }
        .bib-number {
            font-family: 'Poppins', sans-serif;
            font-size: 11px;
            font-weight: 600;
            color: #304463;
            background: #E6EBF2;
            min-width: 22px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 11px;
            flex-shrink: 0;
            margin-top: 3px;
        }
        .bib-text { flex: 1; }
        .bib-text .bib-authors { font-weight: 600; }
        .bib-text .bib-title   { font-style: italic; }
        .bib-text .bib-venue   { color: #858585; }
        .bib-text a { color: #2563EB; text-decoration: none; font-size: 13px; }
        .bib-text a:hover { text-decoration: underline; }

        /* ---- Responsive ---- */
        @media (max-width: 600px) {
            .cite-popup, .footnote-popup {
                max-width: 300px;
                min-width: 200px;
                font-size: 13px;
            }
        }
    `;
    document.head.appendChild(style);

    //Parse Bibliography:
    var bibliography = [];
    var bibScript = document.querySelector('script[type="text/bibliography"]');
    if (bibScript) {
        try {
            bibliography = JSON.parse(bibScript.textContent);
        } catch (e) {
            console.warn('Clarity Citations: could not parse bibliography JSON.', e);
        }
    }

    // Build lookup map
    var bibMap = {};
    bibliography.forEach(function (entry, i) {
        entry._index = i + 1;
        bibMap[entry.key] = entry;
    });

    // Auto-number Citations : 
    document.querySelectorAll('.cite[data-cite]').forEach(function (el) {
        var key = el.getAttribute('data-cite');
        var entry = bibMap[key];
        if (entry) {
            el.textContent = entry._index;
            el.setAttribute('href', '#ref-' + key);
            el.setAttribute('role', 'doc-noteref');
            el.setAttribute('aria-label', 'Citation ' + entry._index);
        }
    });

    //  Auto-Number Footnotes:
    document.querySelectorAll('.footnote-ref[data-footnote]').forEach(function (el, i) {
        el.textContent = i + 1;
        el.setAttribute('role', 'doc-noteref');
        el.setAttribute('aria-label', 'Footnote ' + (i + 1));
        el.setAttribute('tabindex', '0');
    });

    // Generate Bibliography Section :
    var bibSection = document.getElementById('bibliography');
    if (bibSection && bibliography.length > 0) {
        bibliography.forEach(function (entry) {
            var div = document.createElement('div');
            div.className = 'bib-entry';
            div.id = 'ref-' + entry.key;
            var urlPart = entry.url
                ? ' <a href="' + entry.url + '" target="_blank" rel="noopener">[link]</a>'
                : '';
            div.innerHTML =
                '<span class="bib-number">' + entry._index + '</span>' +
                '<span class="bib-text">' +
                    '<span class="bib-authors">' + entry.authors + ' </span>' +
                    '<span class="bib-title">' + entry.title + '. </span>' +
                    '<span class="bib-venue">' + entry.venue + '.' + urlPart + '</span>' +
                '</span>';
            bibSection.appendChild(div);
        });
    }

    // Popup Logic:
    var activePopup = null;
    var hoverTimeout = null;

    function removePopup() {
        if (activePopup) {
            var popup = activePopup;
            popup.classList.remove('visible');
            activePopup = null;
            setTimeout(function () {
                if (popup.parentNode) popup.parentNode.removeChild(popup);
            }, 200);
        }
    }

    function positionPopup(popup, anchor) {
        document.body.appendChild(popup);

        // Measure after appending (so dimensions are real)
        var aRect = anchor.getBoundingClientRect();
        var pRect = popup.getBoundingClientRect();

        // Default: below the pill, horizontally centred
        var top = aRect.bottom + window.scrollY + 8;
        var left = aRect.left + window.scrollX + (aRect.width / 2) - (pRect.width / 2);

        // Keep within viewport horizontally
        var maxLeft = window.innerWidth - pRect.width - 12;
        if (left < 12) left = 12;
        if (left > maxLeft) left = maxLeft;

        // Flip above if it would overflow the bottom
        if (aRect.bottom + pRect.height + 20 > window.innerHeight) {
            top = aRect.top + window.scrollY - pRect.height - 8;
        }

        popup.style.top = top + 'px';
        popup.style.left = left + 'px';

        requestAnimationFrame(function () {
            popup.classList.add('visible');
        });
    }

    function showCitePopup(el) {
        removePopup();
        var key = el.getAttribute('data-cite');
        var entry = bibMap[key];
        if (!entry) return;

        var popup = document.createElement('div');
        popup.className = 'cite-popup';
        var urlPart = entry.url
            ? '<br><a href="' + entry.url + '" target="_blank" rel="noopener">Open paper →</a>'
            : '';
        popup.innerHTML =
            '<div class="cite-authors">' + entry.authors + '</div>' +
            '<div class="cite-title">' + entry.title + '</div>' +
            '<div class="cite-venue">' + entry.venue + urlPart + '</div>';

        activePopup = popup;
        positionPopup(popup, el);
    }

    function showFootnotePopup(el) {
        removePopup();
        var fnId = el.getAttribute('data-footnote');
        var fnDef = document.getElementById(fnId);
        if (!fnDef) return;

        var popup = document.createElement('div');
        popup.className = 'footnote-popup';
        popup.innerHTML = fnDef.innerHTML;

        activePopup = popup;
        positionPopup(popup, el);
    }

    //  Event Binding :
    var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    function bindHover(el, showFn) {
        if (isTouchDevice) {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (activePopup) { removePopup(); } else { showFn(el); }
            });
        } else {
            el.addEventListener('mouseenter', function () {
                clearTimeout(hoverTimeout);
                showFn(el);
            });
            el.addEventListener('mouseleave', function () {
                hoverTimeout = setTimeout(removePopup, 300);
            });
        }
    }

    document.querySelectorAll('.cite[data-cite]').forEach(function (el) {
        bindHover(el, showCitePopup);
    });

    document.querySelectorAll('.footnote-ref[data-footnote]').forEach(function (el) {
        bindHover(el, showFootnotePopup);
    });

    // Keep popup alive when hovering over it
    document.addEventListener('mouseover', function (e) {
        if (activePopup && activePopup.contains(e.target)) {
            clearTimeout(hoverTimeout);
        }
    });
    document.addEventListener('mouseout', function (e) {
        if (activePopup && activePopup.contains(e.target) &&
            !activePopup.contains(e.relatedTarget)) {
            hoverTimeout = setTimeout(removePopup, 300);
        }
    });

    // Dismiss on click outside (for mobile)
    document.addEventListener('click', function (e) {
        if (activePopup &&
            !activePopup.contains(e.target) &&
            !e.target.classList.contains('cite') &&
            !e.target.classList.contains('footnote-ref')) {
            removePopup();
        }
    });

    // Dismiss on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') removePopup();
    });
});
