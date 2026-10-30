"use strict";
// Inline SVG illustrations: no external images or fonts. Flat shapes only (no
// gradient ids), so the same art can appear many times on one page safely.
window.KitchenArt = (() => {
  const svg = (body, cls = "", view = "0 0 100 100") =>
    `<svg class="art ${cls}" viewBox="${view}" aria-hidden="true" focusable="false">${body}</svg>`;
  const shadow = (cx = 50, cy = 86, rx = 32, ry = 6) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#4b3218" opacity=".13"/>`;
  const eggBody = (x = 0, y = 0, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path d="M20 47c-7-13 5-29 20-27 7-9 25-9 31 2 14 1 20 16 13 26 6 12-4 27-19 25-8 9-27 8-33-2-15-1-20-15-12-24z" fill="#fffaf0"/><path d="M27 70c8 6 22 7 31 1" stroke="#efe2c4" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="50" cy="49" r="15" fill="#ffb21e"/><path d="M38 56a15 15 0 0 0 26-2" stroke="#f08c0f" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".7"/><ellipse cx="44.5" cy="43.5" rx="5.5" ry="3.5" fill="#fff" opacity=".8" transform="rotate(-32 44.5 43.5)"/></g>`;
  const parts = {
    friedEgg: (c) => svg(shadow() + eggBody(), c),
    twoEggs: (c) =>
      svg(shadow(50, 88, 38) + eggBody(-2, 2, 0.7) + eggBody(30, 24, 0.68), c),
    toast: (c) =>
      svg(
        shadow() +
          '<path d="M23 45c-9-3-10-17-1-24 9-8 23-8 28-4 6-4 20-4 28 4 9 7 8 21-1 24v33a6 6 0 0 1-6 6H29a6 6 0 0 1-6-6z" fill="#b8692c"/><path d="M29 47c-6-2-7-11-1-16 7-6 17-6 22-2 5-4 15-4 22 2 6 5 5 14-1 16v28a3 3 0 0 1-3 3H32a3 3 0 0 1-3-3z" fill="#f0bf6d"/><path d="M34 52l6 4M58 64l6 4M38 70l5 3" stroke="#d99a4a" stroke-width="2.4" stroke-linecap="round"/><rect x="40" y="47" width="21" height="15" rx="3.5" fill="#fff0a3"/><rect x="40" y="47" width="21" height="5" rx="2.5" fill="#fffbdc"/>',
        c,
      ),
    sausage: (c) =>
      svg(
        shadow() +
          '<g transform="rotate(-22 50 52)"><rect x="12" y="39" width="76" height="26" rx="13" fill="#b9472f"/><rect x="12" y="39" width="76" height="17" rx="8.5" fill="#d8644a"/><path d="M30 42l-5 20M46 42l-5 20M62 42l-5 20M78 43l-4 17" stroke="#8d2f1d" stroke-width="3" stroke-linecap="round" opacity=".55"/><rect x="22" y="43" width="40" height="4.5" rx="2.2" fill="#fff" opacity=".45"/></g>',
        c,
      ),
    rawEgg: (c) =>
      svg(
        shadow(50, 90, 24, 5) +
          '<path d="M50 10c17 0 30 28 30 47a30 30 0 0 1-60 0c0-19 13-47 30-47z" fill="#fbf0dc"/><path d="M76 53c1 21-12 32-26 32-9 0-17-4-22-11 21 5 42-4 48-21z" fill="#ecd9b6"/><ellipse cx="38" cy="36" rx="6" ry="11" fill="#fff" opacity=".85" transform="rotate(22 38 36)"/><circle cx="60" cy="40" r="1.6" fill="#d8bf98"/><circle cx="55" cy="66" r="1.3" fill="#d8bf98"/><circle cx="66" cy="57" r="1.1" fill="#d8bf98"/>',
        c,
      ),
    bowl: (c) =>
      svg(
        shadow(50, 88, 34, 5) +
          '<path d="M12 44h76c0 23-17 40-38 40S12 67 12 44z" fill="#6f9f91"/><path d="M12 44h76c0 5-1 9-2 13H14c-1-4-2-8-2-13z" fill="#86b5a6"/><ellipse cx="50" cy="44" rx="38" ry="8" fill="#a9cfc2"/><ellipse cx="50" cy="45" rx="31" ry="5" fill="#ffd25a"/><path d="M68 18l-10 26" stroke="#9aa9ae" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="57" cy="44" rx="8" ry="4" fill="none" stroke="#9aa9ae" stroke-width="2.5"/>',
        c,
      ),
    pan: (c) =>
      svg(
        shadow(46, 84, 32, 6) +
          '<path d="M74 52l22-10" stroke="#7a5236" stroke-width="9" stroke-linecap="round"/><circle cx="44" cy="52" r="32" fill="#3d4a44"/><circle cx="44" cy="52" r="25" fill="#2a3530"/>' +
          '<g transform="translate(19 27) scale(.5)">' + eggBody() + "</g>",
        c,
      ),
    plate: (c) =>
      svg(
        shadow(50, 84, 38, 6) +
          '<ellipse cx="50" cy="55" rx="40" ry="28" fill="#eae6d6"/><ellipse cx="50" cy="53" rx="40" ry="28" fill="#fffdf6"/><ellipse cx="50" cy="53" rx="28" ry="19" fill="#f5f1e3"/><path d="M8 26v22M4 26v10a4 4 0 0 0 8 0V26" stroke="#9aa9ae" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M92 26c-5 4-5 13 0 16v10" stroke="#9aa9ae" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
        c,
      ),
    salad: (c) =>
      svg(
        shadow(50, 88, 34, 5) +
          '<circle cx="34" cy="42" r="13" fill="#6ab04c"/><circle cx="52" cy="35" r="14" fill="#89c45c"/><circle cx="68" cy="43" r="12" fill="#5c9e42"/><circle cx="44" cy="44" r="7" fill="#e5533c"/><circle cx="62" cy="38" r="6" fill="#f06a4f"/><circle cx="62" cy="38" r="2" fill="#ffd9c9"/><circle cx="56" cy="47" r="5" fill="#d7ecb8" stroke="#7fb24f" stroke-width="2"/><path d="M12 46h76c0 22-17 38-38 38S12 68 12 46z" fill="#e8a95e"/><path d="M12 46h76c0 4-1 8-2 11H14c-1-3-2-7-2-11z" fill="#f2c27f"/><ellipse cx="50" cy="46" rx="38" ry="5" fill="#d38f45"/>',
        c,
      ),
    croissant: (c) =>
      svg(
        shadow() +
          '<g stroke="#b06a24" stroke-width="2.4"><ellipse cx="20" cy="64" rx="9" ry="13" fill="#d98d35" transform="rotate(-50 20 64)"/><ellipse cx="80" cy="64" rx="9" ry="13" fill="#d98d35" transform="rotate(50 80 64)"/><ellipse cx="33" cy="52" rx="12" ry="18" fill="#e6a149" transform="rotate(-30 33 52)"/><ellipse cx="67" cy="52" rx="12" ry="18" fill="#e6a149" transform="rotate(30 67 52)"/><ellipse cx="50" cy="47" rx="15" ry="22" fill="#f0b55c"/></g><ellipse cx="45" cy="38" rx="4" ry="8" fill="#fff" opacity=".45"/>',
        c,
      ),
    skillet: (c) =>
      svg(
        shadow(46, 88, 36, 6) +
          '<path d="M78 46l20-6" stroke="#7a5236" stroke-width="9" stroke-linecap="round"/><circle cx="44" cy="50" r="36" fill="#3d4a44"/><circle cx="44" cy="50" r="29" fill="#2a3530"/>' +
          eggBody(12, 18, 0.42) + eggBody(36, 14, 0.4) + eggBody(24, 38, 0.42) +
          '<circle cx="28" cy="66" r="3" fill="#5fa35a"/><circle cx="64" cy="58" r="3" fill="#5fa35a"/>',
        c,
      ),
    bento: (c) =>
      svg(
        shadow(50, 88, 40, 5) +
          '<rect x="8" y="22" width="84" height="62" rx="10" fill="#9d3b2b"/><rect x="13" y="27" width="74" height="52" rx="6" fill="#2f2420"/><rect x="16" y="30" width="34" height="46" rx="4" fill="#fbf7ec"/><circle cx="26" cy="42" r="1.4" fill="#2f2420"/><circle cx="36" cy="52" r="1.4" fill="#2f2420"/><circle cx="29" cy="63" r="1.4" fill="#2f2420"/><rect x="53" y="30" width="31" height="21" rx="4" fill="#ffd25a"/><path d="M58 36h21M58 44h21" stroke="#f0b52d" stroke-width="2"/><rect x="53" y="54" width="14" height="22" rx="4" fill="#f28c6b"/><circle cx="76" cy="62" r="7" fill="#5fa35a"/><circle cx="74" cy="70" r="5" fill="#4c8e47"/>',
        c,
      ),
    cloche: (c) =>
      svg(
        shadow(50, 86, 42, 5) +
          '<ellipse cx="50" cy="76" rx="44" ry="8" fill="#e8e4d6"/><path d="M14 74a36 36 0 0 1 72 0z" fill="#c9d4d8"/><path d="M14 74a36 36 0 0 1 36-36v36z" fill="#dfe8eb"/><rect x="10" y="71" width="80" height="6" rx="3" fill="#a9b7bd"/><circle cx="50" cy="34" r="6" fill="#a9b7bd"/><path d="M28 56c3-7 8-11 14-13" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity=".8"/><path d="M84 18l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill="#ffc94a"/>',
        c,
      ),
    crown: (c) =>
      svg(
        shadow(50, 88, 34, 5) +
          '<path d="M14 36l18 16 18-28 18 28 18-16-6 42H20z" fill="#f4b53f"/><path d="M20 78l-2-14h64l-2 14z" fill="#d9952a"/><circle cx="14" cy="34" r="5" fill="#f4b53f"/><circle cx="50" cy="22" r="5" fill="#f4b53f"/><circle cx="86" cy="34" r="5" fill="#f4b53f"/><circle cx="50" cy="60" r="6" fill="#e5533c"/><circle cx="32" cy="64" r="4" fill="#4c9bd6"/><circle cx="68" cy="64" r="4" fill="#5fa35a"/><path d="M26 48l6 6" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>',
        c,
      ),
    trophy: (c) =>
      svg(
        shadow(50, 90, 26, 5) +
          '<path d="M30 16h40v22a20 20 0 0 1-40 0z" fill="#f4b53f"/><path d="M30 22H18c0 14 6 20 14 21M70 22h12c0 14-6 20-14 21" stroke="#d9952a" stroke-width="5" fill="none"/><rect x="45" y="56" width="10" height="14" fill="#d9952a"/><rect x="32" y="70" width="36" height="12" rx="3" fill="#7a5236"/><rect x="38" y="74" width="24" height="4" rx="2" fill="#f4b53f"/><path d="M38 22v16" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".55"/><path d="M50 26l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#fff6d0"/>',
        c,
      ),
    chef: (c) =>
      svg(
        '<circle cx="50" cy="60" r="26" fill="#f5c9a3"/><path d="M24 40c-12-2-14-20 0-22 2-12 20-14 26-4 6-10 24-8 26 4 14 2 12 20 0 22z" fill="#fff" stroke="#e3dccb" stroke-width="2"/><rect x="26" y="36" width="48" height="10" rx="3" fill="#fff" stroke="#e3dccb" stroke-width="2"/><circle cx="41" cy="60" r="3" fill="#3b2a20"/><circle cx="59" cy="60" r="3" fill="#3b2a20"/><path d="M42 70q8 7 16 0" stroke="#3b2a20" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="34" cy="68" r="4" fill="#f29a8a" opacity=".6"/><circle cx="66" cy="68" r="4" fill="#f29a8a" opacity=".6"/>',
        c,
      ),
    coffee: (c) =>
      svg(
        shadow(48, 88, 32, 5) +
          '<ellipse cx="46" cy="82" rx="34" ry="6" fill="#e8e4d6"/><path d="M76 46h6a10 10 0 0 1 0 20h-6" stroke="#e86f4f" stroke-width="6" fill="none"/><path d="M18 40h58v16a29 26 0 0 1-58 0z" fill="#e86f4f"/><ellipse cx="47" cy="40" rx="29" ry="6" fill="#f08a6c"/><ellipse cx="47" cy="41" rx="24" ry="4" fill="#6b3e22"/><path d="M38 30c-4-6 4-8 0-14M52 30c-4-6 4-8 0-14" stroke="#c9b9a3" stroke-width="3" fill="none" stroke-linecap="round" class="steam-line"/>',
        c,
      ),
    leaf: (c) =>
      svg(
        '<path d="M14 86C20 46 50 18 88 14 84 52 56 82 14 86z" fill="#6ab04c"/><path d="M14 86C34 62 54 42 80 22" stroke="#4c8e47" stroke-width="3" fill="none" stroke-linecap="round"/>',
        c,
      ),
    tomato: (c) =>
      svg(
        '<circle cx="50" cy="54" r="32" fill="#e5533c"/><circle cx="50" cy="54" r="24" fill="#f47a5e"/><g fill="#ffd2c2"><ellipse cx="40" cy="46" rx="4" ry="6"/><ellipse cx="60" cy="46" rx="4" ry="6"/><ellipse cx="50" cy="66" rx="6" ry="4"/></g>',
        c,
      ),
    lock: (c) =>
      svg(
        '<path d="M34 44V32a16 16 0 0 1 32 0v12" stroke="#8b927f" stroke-width="8" fill="none"/><rect x="24" y="42" width="52" height="40" rx="9" fill="#a8ae9a"/><circle cx="50" cy="60" r="5" fill="#f1f0e8"/><rect x="48" y="62" width="4" height="10" rx="2" fill="#f1f0e8"/>',
        c,
      ),
    hero: (c) =>
      svg(
        '<ellipse cx="160" cy="228" rx="120" ry="12" fill="#4b3218" opacity=".08"/>' +
          '<ellipse cx="160" cy="146" rx="138" ry="86" fill="#e7e1cd"/><ellipse cx="160" cy="140" rx="138" ry="86" fill="#fffdf6"/><ellipse cx="160" cy="140" rx="106" ry="64" fill="#f6f1e2"/>' +
          '<g transform="translate(150 36) scale(1.12)">' + eggBody() + "</g>" +
          '<g transform="translate(44 40) scale(1.02) rotate(-12 50 50)"><path d="M23 45c-9-3-10-17-1-24 9-8 23-8 28-4 6-4 20-4 28 4 9 7 8 21-1 24v33a6 6 0 0 1-6 6H29a6 6 0 0 1-6-6z" fill="#b8692c"/><path d="M29 47c-6-2-7-11-1-16 7-6 17-6 22-2 5-4 15-4 22 2 6 5 5 14-1 16v28a3 3 0 0 1-3 3H32a3 3 0 0 1-3-3z" fill="#f0bf6d"/><rect x="40" y="47" width="21" height="15" rx="3.5" fill="#fff0a3"/></g>' +
          '<g transform="translate(92 150) rotate(-6)"><rect x="0" y="0" width="92" height="24" rx="12" fill="#b9472f"/><rect x="0" y="0" width="92" height="15" rx="7.5" fill="#d8644a"/><path d="M20 3l-4 18M40 3l-4 18M60 3l-4 18M78 4l-3 15" stroke="#8d2f1d" stroke-width="3" stroke-linecap="round" opacity=".5"/></g>' +
          '<g transform="translate(104 176) rotate(-4)"><rect x="0" y="0" width="84" height="22" rx="11" fill="#b9472f"/><rect x="0" y="0" width="84" height="14" rx="7" fill="#d8644a"/><rect x="10" y="3" width="40" height="4" rx="2" fill="#fff" opacity=".4"/></g>' +
          '<g transform="translate(212 150)"><circle cx="22" cy="22" r="22" fill="#e5533c"/><circle cx="22" cy="22" r="16" fill="#f47a5e"/><g fill="#ffd2c2"><ellipse cx="16" cy="17" rx="3" ry="4"/><ellipse cx="28" cy="17" rx="3" ry="4"/><ellipse cx="22" cy="30" rx="4" ry="3"/></g></g>' +
          '<g fill="#5fa35a"><circle cx="64" cy="150" r="7"/><circle cx="74" cy="160" r="6"/><circle cx="60" cy="162" r="5"/></g>',
        c,
        "0 0 320 250",
      ),
    whisk: (c) =>
      svg(
        '<path d="M50 92V58" stroke="#c98f55" stroke-width="9" stroke-linecap="round"/><path d="M50 58C30 44 34 10 50 8c16 2 20 36 0 50z" fill="none" stroke="#9aa9ae" stroke-width="3.5"/><path d="M50 58C40 40 42 12 50 8c8 4 10 32 0 50z" fill="none" stroke="#b8c5c9" stroke-width="3"/><path d="M50 58V8" stroke="#9aa9ae" stroke-width="3"/>',
        c,
      ),
  };
  parts.levelArt = ["friedEgg", "toast", "twoEggs", "salad", "sausage", "croissant", "skillet", "bento", "cloche", "crown"];
  parts.levelTint = ["#fff1c9", "#fbe2c3", "#fff4d8", "#dff0d2", "#fbd9cf", "#f8e3c5", "#e3ebe6", "#f6d9d3", "#e4ecef", "#fbe7b5"];
  parts.stepArt = ["rawEgg", "bowl", "pan", "toast", "plate"];
  return parts;
})();
