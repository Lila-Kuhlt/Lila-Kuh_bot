
const lang_dropdown = document.getElementById("lang-dropdown")
export function set_langs(langs) {
    for (const lang of langs) {
        lang_dropdown.append(create_lang_element(lang))
    }
}

function create_lang_element(name) {
    const href = window.location.origin + window.location.pathname + "?lang=" + name
    console.log(href)
    const li = document.createElement("li")
    const a = document.createElement("a")
    a.setAttribute("class", "dropdown-item")
    a.setAttribute("href", href)
    a.innerHTML = name

    li.append(a)
    return li
}

export function choose_lang(langs) {
    const lang = (new URL(window.location.href)).searchParams.get("lang")
    console.log(lang)

    if (langs.includes(lang)) return lang
    else if (langs.includes("en")) return "en"
    else if (langs.length >= 1) return langs[0]
    else {
        console.error("[Error] Could not choose langs!")
        return null
    }
}
