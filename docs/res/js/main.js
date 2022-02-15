import { get_config, get_lang_jsons } from './file_getter.js'

main()

async function main() {
    const config = await get_config()
    const langs = await get_lang_jsons(config)
    console.log(config)
    console.log(langs)
}