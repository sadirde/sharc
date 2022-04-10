const base = "%base%";
const locale = "%locale%";
const timeZone = "%timeZone%";

const $table = document.querySelector("table");
const $tbody = $table.querySelector("tbody");
const $single = document.getElementById("single");
const $site = document.getElementById("site");
const $ul = $single.querySelector("ul");

const groups = links.reduce((group, element) => {
    const host = getHost(element[0]);
    group[element[0]] = group[element[0]] || [];
    group[element[0]].push(element[1]);
    group.hosts[host] = group.hosts[host] || [];
    !group.hosts[host].includes(element[0]) && group.hosts[host].push(element[0]);
    return group;
}, { hosts: {} });
const hash = window.location.hash.substring(1);

if (hash !== "" && groups[hash]) {
    const host = getHost(hash);

    appendChildren($site, [
        document.createTextNode("Snapshots for "),
        createFavicon(hash, groups[hash][0]),
        createElement("a", {
            href: hash,
            textContent: hash
        })
    ]);
    groups[hash].forEach((timestamp) => {
        appendListElement(getLink(hash, timestamp), getDateTime(timestamp).full);
    });
    appendChildren($single, [
        createElement("hr"),
        document.createTextNode("Go to all archived URLs in the domain "),
        createElement("a", {
            href: `#${host}`,
            textContent: host
        })
    ]);
    $single.classList.remove("hidden");
} else if (hash !== "" && groups.hosts[hash]) {
    appendChildren($site, [
        document.createTextNode(`All archived URLs in the domain `),
        createFavicon(groups.hosts[hash][0], groups[groups.hosts[hash][0]][0]),
        createElement("span", { textContent: hash })
    ]);
    groups.hosts[hash].forEach((url) => { appendListElement(`#${url}`, url); });
    $single.classList.remove("hidden");
} else {
    links.forEach((site) => { appendRow(site[0], site[1]); });
    $table.classList.remove("hidden");
}

window.addEventListener("hashchange", () => { location.reload(); });

function getHost(url) {
    return url.match(/https?:\/{2}([^\/]+)/)[1];
}

function appendChildren(parent, children) {
    parent = typeof parent === "string" ? createElement(parent) : parent;
    children.forEach((child) => { parent.appendChild(child); });
    return parent;
}

function createElement(tagName, attributes) {
    const $element = document.createElement(tagName);
    for (const attribute in attributes) {
        if (attributes.hasOwnProperty(attribute)) {
            $element[attribute] = attributes[attribute];
        }
    }
    return $element;
}

function createFavicon(url, timestamp) {
    url = url.replace(/https?:\/{2}([^\/]+)\/?.*$/, `${base}/$1/${timestamp}/favicon.png`);
    return createElement("img", {
        src: url,
        width: 16,
        height: 16
    });
}

function appendListElement(href, textContent) {
    const $li = appendChildren("li", [
        createElement("a", { href, textContent })
    ]);
    appendChildren($ul, [ $li ]);
}

function appendRow(url, timestamp) {
    const dateTime = getDateTime(timestamp);
    const $date = createElement("td", {
        textContent: dateTime.date,
        title: dateTime.time
    });
    const $link = appendChildren("td", [
        createFavicon(url, timestamp),
        createElement("a", {
            href: getLink(url, timestamp),
            textContent: url
        })
    ]);
    const $amount = appendChildren("td", [
        createElement("a", {
            href: `#${url}`,
            textContent: groups[url].length
        })
    ]);
    const $row = appendChildren("tr", [ $date, $link, $amount ]);
    appendChildren($tbody, [ $row ])
}

function getDateTime(timestamp) {
    const date = new Date(+timestamp);
    return {
        full: date.toLocaleString(locale, { timeZone, dateStyle: "medium", timeStyle: "medium" }),
        date: date.toLocaleString(locale, { timeZone, dateStyle: "medium" }),
        time: date.toLocaleString(locale, { timeZone, timeStyle: "medium" })
    };
}

function getLink(url, timestamp) {
    return url.replace(/https?:\/{2}([^\/]+)\/?/, `${base}/$1/${timestamp}/`)
        .replace(/\/[^\/]*$/, "/index.html");
}
