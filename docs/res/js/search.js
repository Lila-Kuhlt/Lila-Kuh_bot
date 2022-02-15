
function search_command() {
    const search_bar = document.getElementById('search_text')
    let commands = document.getElementById('commands')
    const input = search_bar.value.toLowerCase()

    console.log(commands.children)

    for (let i = 0; i < commands.children.length; i++) {
        if (!commands.children[i].id.toLowerCase().includes(input)) {
            commands.children[i].style.display="none";
        }
        else {
            commands.children[i].style.display="";
        }
    }
}