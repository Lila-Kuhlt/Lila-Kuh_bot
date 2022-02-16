
const accordion_base_id = "commands"
const accordion_element = document.getElementById(accordion_base_id)

const id_head_base = "head-"
const id_body_base = "body-"

export function generate_accordion_elements(lang_json) {
    const commands = lang_json.commands

    for (const command_key of Object.keys(commands)) {
        accordion_element.append(create_accordion_element(command_key, commands[command_key].help))
    }
}

function create_accordion_element(name, description) {
    const element_div = document.createElement("div")
    element_div.setAttribute("class", "accordion-item")
    element_div.setAttribute("id", name)

    // head
    const h2 = document.createElement("h2")
    h2.setAttribute("class", "accordion-header")
    h2.setAttribute("id", `${id_head_base}${name}`)

    const button = document.createElement("button")
    button.setAttribute("class","accordion-button")
    button.setAttribute("type", "button")
    button.setAttribute("data-bs-toggle", "collapse")
    button.setAttribute("data-bs-target", `#${id_body_base}${name}`)
    button.setAttribute("aria-expanded", "true")
    button.setAttribute("aria-controls", `#${id_body_base}${name}`)
    button.innerHTML = `<b>${name}</b>`
    h2.append(button)
    element_div.append(h2)

    // body
    const collapse_div = document.createElement("div")
    collapse_div.setAttribute("id", `${id_body_base}${name}`)
    collapse_div.setAttribute("class", "accordion-collapse collapse show")
    collapse_div.setAttribute("aria-labelledby", `#${id_head_base}${name}`)
    collapse_div.setAttribute("data-bs-parent", accordion_base_id)

    const body_div = document.createElement("div")
    body_div.setAttribute("class", "accordion-body")
    body_div.innerHTML = description
    collapse_div.append(body_div)
    element_div.append(collapse_div)

    return element_div
}
