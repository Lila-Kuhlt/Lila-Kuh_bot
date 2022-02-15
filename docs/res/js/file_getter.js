const links = {
    github_base: "https://raw.githubusercontent.com/Lila-Kuhlt/Lila-Kuh-bot/main/",
    config: "config/config-template.json",
    lang_base: "src/lang/"
}

export async function get_config() {
    return await (await fetch(links.github_base + links.config)).json()
}

export async function get_lang_jsons(config_json) {
    const lang_jsons = {}

    for (const lang_path_key of Object.keys(config_json.lang_paths)) {
        try {
            lang_jsons[lang_path_key] = (await (await fetch(links.github_base + links.lang_base + config_json.lang_paths[lang_path_key])).json())
        } catch (e) {
            console.log("[Error] Could not get lang_file for lang " + lang_path_key)
            console.error(e)
        }
    }

    return lang_jsons
}
