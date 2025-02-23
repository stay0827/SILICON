const { EmbedBuilder } = require('discord.js');

function successEmbed(content) {
    return new EmbedBuilder()
        .setTitle(`[ 성공 ] ${content}`)
        .setColor('#00CA14')
        .setImage('https://cdn.discordapp.com/attachments/1148554507165372416/1342729053425111061/SILICON_BANNER.png?ex=67bab161&is=67b95fe1&hm=3d1179d3e881780a779302589893b9f1ac7a6be9dcef10e7ba76bc7ad9eb9531&');
}

function failedEmbed(content) {
    return new EmbedBuilder()
        .setTitle(`[ 실패 ] ${content}`)
        .setColor('#D70000')
        .setImage('https://cdn.discordapp.com/attachments/1148554507165372416/1342729053425111061/SILICON_BANNER.png?ex=67bab161&is=67b95fe1&hm=3d1179d3e881780a779302589893b9f1ac7a6be9dcef10e7ba76bc7ad9eb9531&');
}

function errorEmbed(content) {
    return new EmbedBuilder()
        .setTitle(`[ 오류 ] ${content}`)
        .setColor('#FFD301')
        .setImage('https://cdn.discordapp.com/attachments/1148554507165372416/1342729053425111061/SILICON_BANNER.png?ex=67bab161&is=67b95fe1&hm=3d1179d3e881780a779302589893b9f1ac7a6be9dcef10e7ba76bc7ad9eb9531&');
}

module.exports = { successEmbed, failedEmbed, errorEmbed };
