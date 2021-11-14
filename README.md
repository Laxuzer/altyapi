# Temiz Altyapı

- **Soru/İstek/Şikayet** ve __daha fazlası__ için [Discord Sunucum](https://discord.gg/VUNbq4SwxY) `Laxuzer#0480`

- Botu çalıştırmadan önce [`config.json`](src/config.json)'u doldurmalısınız.

- Altyapı **Slash Commands** uyumludur.

- Eğer Slash ile kullanacaksanız [find](src/base/Ctx.js#L75L153) özelliğini kullanmanızı öneririm.

# Ctx Info
Tek bir parametre ile `herşeye` erişim sağlayabilirsiniz.
- Ctx
    - [Client](src/base/Client.js#L3) ([Discord.Client](https://discord.js.org/#/docs/main/stable/class/Client))
        - [CommandHandler](src/base/CommandHandler.js#L4)
        - [ErrorHandler](src/base/ErrorHandler.js#L3)
        - [logger](src/base/Logger.js#L22)
        - [Emoji](src/base/Emoji.js#L3)
        - db `(LowDB)`
        - [config](src/config.json)
    - [Message](src/base/Ctx.js#L50) ([Discord.Message](https://discord.js.org/#/docs/main/stable/class/Message))
    - [Interaction](src/base/SlashCtx.js#L15) ([Discord.Interaction](https://discord.js.org/#/docs/main/stable/class/Interaction))
    - [Channel](src/base/Ctx.js#L53) ([Discord.Channel](https://discord.js.org/#/docs/main/stable/class/Channel))
    - [Guild](src/base/Ctx.js#L56) ([Discord.Guild](https://discord.js.org/#/docs/main/stable/class/Guild))
    - [Me](src/base/Ctx.js#L59) (Client [Discord.GuildMember](https://discord.js.org/#/docs/main/stable/class/GuildMember))
    - [Author](src/base/Ctx.js#L62) ([Discord.User](https://discord.js.org/#/docs/main/stable/class/User))
    - [Member](src/base/Ctx.js#L65) ([Discord.GuildMember](https://discord.js.org/#/docs/main/stable/class/GuildMember))
    - [Find](src/base/Ctx.js#L80)

# Client Info
- [`Client.js`](src/base/Client.js) dosyasında class adını **botunuzun adıyla** değiştirebilirsiniz.
- Client özel olduğu için kod yazarken size rahatlık sağlayacaktır.

# Command Info
- `src/commands/kategori/komutadı.js` gibi koymanız gerekmektedir. 
- Komutlar [`class`](https://www.w3schools.com/js/js_classes.asp) dır. 
- Örnek komut olarak [`eval`](src/commands/dev/eval.js) komutu koydum inceleyebilirsiniz. 
- Ayrıca [`Command.js`](src/base/Command.js) dosyasına giderek oradan detaylı inceleyebilirsiniz.

# Event Info
- Eventler [`class`](https://www.w3schools.com/js/js_classes.asp) dır. 
- [`ready.js`](src/events/ready.js) ve [`message.js`](src/events/message.js) yi örnek olarak koydum inceleyebilirsiniz.

# Function Handler
- `src/handlers/manual/functionHandler.js` dosyasında hazır functionlar bulunmaktadır.
- Functionlara dilerseniz `ekleme` yapabilir veya `çıkarabilirsiniz`.

-- [Laxuzer#0480](https://discord.com/users/576749207084466197)
