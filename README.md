# Temiz Altyapı

[Discord Sunucum](https://discord.gg/VUNbq4SwxY)

# Config
- Botu çalıştırmadan önce `src/config.json`'u doldurmalısınız.

# Ctx Info
Tek bir parametre ile `bütün herşeye` erişim sağlayabilirsiniz.
- Ctx
    - Client ([Discord.Client](https://discord.js.org/#/docs/main/stable/class/Client))
        - CommandHandler
        - ErrorHandler
        - logger
        - events
        - Emoji
        - db `(LowDB)`
        - config
    - Message ([Discord.Message](https://discord.js.org/#/docs/main/stable/class/Message))
    - Channel ([Discord.Channel](https://discord.js.org/#/docs/main/stable/class/Channel))
    - Guild ([Discord.Guild](https://discord.js.org/#/docs/main/stable/class/Guild))
    - Me (Client [Discord.GuildMember](https://discord.js.org/#/docs/main/stable/class/GuildMember))
    - User ([Discord.User](https://discord.js.org/#/docs/main/stable/class/User))
    - Author ([Discord.User](https://discord.js.org/#/docs/main/stable/class/User))
    - Member ([Discord.GuildMember](https://discord.js.org/#/docs/main/stable/class/GuildMember))
    - [Find](src/base/Ctx.js:80:5)
    - Input
        - Prefix
        - Flags `(-- ile başlayanlar --full gibi)`
        - Args `(Temiz Argümanlar)`
        - fullArgs `(Bütün Argümanlar)`
        - Content
        - cleanContent

# Client Info
- `src/base/Client.js` dosyasında class adını **botunuzun adıyla** değiştirebilirsiniz.
- Client özel olduğu için kod yazarken size rahatlık sağlayacaktır.

# Command Info
- `src/commands/kategori/komutadı.js` gibi koymanız gerekmektedir. 
- Komutlar `class` dır. 
- Örnek komut olarak `eval` komutu koydum inceleyebilirsiniz. 
- Ayrıca `src/classes/Command.js` dosyasına giderek oradan detaylı inceleyebilirsiniz.

# Event Info
- Eventler `class` dır. 
- `src/events/ready.js` ve `message.js` yi örnek olarak koydum inceleyebilirsiniz.

# Function Handler
- `src/handlers/functionHandler.js` dosyasında hazır functionlar bulunmaktadır.
- Functionlara dilerseniz `ekleme` yapabilir veya `çıkarabilirsiniz`.

Database modülü olarak [ervel.db](https://www.npmjs.com/package/ervel.db) kullanabilirsiniz.

-- [Laxuzer#0480](https://discord.com/users/576749207084466197)
