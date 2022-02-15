import { get_config, get_lang_jsons } from './file_getter.js'
import { generate_accordion_elements } from './gen_cmd_accordion.js'

document.body.onload = main()

async function main() {
    const config = await get_config()
    const langs = await get_lang_jsons(config)
    generate_accordion_elements(langs.de)
}