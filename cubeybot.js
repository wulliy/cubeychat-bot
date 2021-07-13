var socket = new WebSocket(`wss://${window.location.hostname}`)

const prefix = "/"
const name = "sussy bot"

const cooldown = new Set()
const cooldownTime = 400

const cmdCooldown = new Set()
const cmdCooldownTime = 1500

//var dad = false

const random = (min, max) => {return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)}
const isNum = (a) => {return !isNaN(Number(a))}

function sendMessage(msg) {
    const data = {
        user: name,
        content: msg,
    }

    socket.send(JSON.stringify(data))
}

function specialMessage(user, msg) {
    const data = {
        user: user,
        content: msg,
    }

    socket.send(JSON.stringify(data))
}

function systemMessage(msg) {
    const data = {
        type: "system",
        user: "joe",
        joined: true,
        content: msg
      }
  
      socket.send(JSON.stringify(data))
}

// copied from script.js

socket.onopen = () => {
    const data = {
      type: 'system',
      user: name,
      joined: true,
      content: `${name} joined the chat`
    };

    socket.send(JSON.stringify(data));
};

socket.onmessage = (json) => {
    const msg = JSON.parse(json.data)

    if (msg.type) return

    if (!cooldown.has(msg.user)) {
        if (msg.user == name) return

        cooldown.add(msg.user)
    } else if (cooldown.has(msg.user) && !cmdCooldown.has(msg.user)) {
        if (msg.user == name) return

        systemMessage(`stop spamming ${msg.user}, you should really take your normal pills.`)
    }

    //if (dad == true && msg.user != "dad bot") specialMessage("dad bot", "hey did you know im dad bot?")

    const args = msg.content.toLowerCase().slice(prefix.length).split(/ +/)
    const cmd = args.shift()

    if (cmd == "ping") {
        sendMessage("you sir just did a sussy ping! :flushed:")
    }

    if (cmd == "balance" || cmd == "bal") {
        if (!localStorage.getItem(msg.user)) localStorage.setItem(msg.user, 0)

        let balance = localStorage.getItem(msg.user)

        sendMessage(`@${msg.user}, you have ${balance} suscoins.`)
    }

    if (cmd == "say") {
        if (!args.length > 0) return sendMessage("imagine")

        sendMessage(args.join(" "))
    }

    if (cmd == "norrisjoke") {
        sendMessage("fetching norris joke...")

        fetch("https://api.chucknorris.io/jokes/random").then(e=>e.json()).then(e=>sendMessage(e.value))
    }

    /*if (cmd == "dad") {
        if (!dad) dad = true

        systemMessage("dad bot has joined the chat")
        specialMessage("dad bot", "hi guys, im dad bot!")
    }*/

    if (cmd == "kill") {
        systemMessage("you arent op to do that stfu lmao")
    }

    if (cmd == "op") {
        systemMessage("no fuck you")
    }

    if (cmd == "fuck") {
        if (!args[0]) return

        systemMessage("go to horny jail")
    }

    if (cmd == "beg") {
        if (!cmdCooldown.has(msg.user)) {
            cmdCooldown.add(msg.user)
        } else {
            setTimeout(() => {cmdCooldown.delete(msg.user)}, cmdCooldownTime)
            return sendMessage(`@${msg.user}, please wait 1.5 seconds before running this command again.`)
        }

        if (!localStorage.getItem(msg.user)) return sendMessage("you dont have a wallet yet go get one by saying \"/balance\" or \"/bal\"")
        if (!isNum(localStorage.getItem(msg.user))) return sendMessage("your wallet is fucked up, go ask willy to reset your wallet")
        
        let balance = Number(localStorage.getItem(msg.user))
        let amount = random(0, 100)

        if (amount == 0 || amount < 1) return sendMessage(`@${msg.user}, wow you so unlucky you got fucking ${amount} suscoins lmao`)
        if (amount > 1) {
            localStorage.setItem(msg.user, balance + amount)
            sendMessage(`@${msg.user}, you got ${amount} suscoins.`)
        }
    }

    setTimeout(() => {cooldown.delete(msg.user)}, cooldownTime)
}