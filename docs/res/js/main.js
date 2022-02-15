import { get_config, get_lang_jsons } from './file_getter.js'
import { generate_accordion_elements } from './gen_cmd_accordion.js'
import { set_langs, choose_lang } from './lang.js'

document.body.onload = main()

async function main() {
    console.log(window.location)
    const config = await get_config()
    const langs = await get_lang_jsons(config)
    set_langs(Object.keys(langs))
    const chosen_lang = choose_lang(Object.keys(langs))
    generate_accordion_elements(langs[chosen_lang])
}
