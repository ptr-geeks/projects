let clanData = []; 
let playerCnt;
async function getData(){
    //Dobi podatke
    const response = await fetch('http://localhost:8080/guild/slo')
    const data = await response.json();
    guildData = data
    //mapira ven samo id-je
    let uuidji = data.guild.members.map((clan) => {return clan.uuid;});
    //z forEach zanko za vsakega naredi GET request
    playerCnt = uuidji.length;
    uuidji.forEach(userLookUp)
};

function displayData(){
    if (clanData.length == playerCnt){
        const clani = clanData.map((clan) => {
            const guildMemberData = guildData.guild.members.find(item =>  item.uuid == clan.player.uuid);
            return '<tr>' + '<td><img alt="head" src="https://hypixel.paniek.de/player/' + clan.player.uuid + '/skin/head.webp?size=2" lazy="loaded"> <a href="http://localhost:8080/prikaz/uuid/'+clan.player.uuid + '"><span class="mcfont">' + getRank(clan) + ' ' + clan.player.displayname + '</a></td>'+
            '<td>' + guildMemberData.rank +  '</td>'+
            '<td>' + new Date(guildMemberData.joined).toLocaleDateString("sl-SI") + '</td>'+
            '<td>' + new Date(clan.player.firstLogin).toLocaleDateString("sl-SI") + '</td>'+
            '</tr>'
        });
        //zapiše v html element
        document.getElementById("tabela").innerHTML = '<table id="listClanov">'+
        '<tr>'+
            '<th>Username</th>'+
            '<th>Guild rank</th>'+
            '<th>Član guilda od</th>'+
            '<th>Prva prijava</th>'+
        '</tr>'+
        clani.join('') + '</table>';
    } 
}

function getRank(data){
    //Hvala https://hypixel.net/threads/api-help-how-to-get-a-player-rank-network-level.1797880/post-21487465
      player = data.player;
        let rank = '';
        if (player.rank) { // Check if is ADMIN, MOD, HELPER, YT...
            return rank = player.rank; // player.prefix exist here as well
        } else if (player.monthlyPackageRank && player.monthlyPackageRank !== 'NONE') { // Check if is MVP++
            return rank = 'MVP++'
        } else if (player.newPackageRank) { // Check if its VIP...MVP+
            return rank = player.newPackageRank.replace('_PLUS', '+');
        } else {
            return rank = '';
        }
}
// function getrankClass(data){
//     //Hvala https://hypixel.net/threads/api-help-how-to-get-a-player-rank-network-level.1797880/post-21487465
//       player = data.player;
//         let rank = '';  
//         if (player.rank) { // Check if is ADMIN, MOD, HELPER, YT...
//             return rank = player.rank; // player.prefix exist here as well
//         } else if (player.monthlyPackageRank && player.monthlyPackageRank !== 'NONE') { // Check if is MVP++
//             return rank = 'MVP-PLUS'
//         } else if (player.newPackageRank) { // Check if its VIP...MVP+
//             return rank = player.newPackageRank.replace('_PLUS', '');
//         } else {
//             return rank = 'NON';
//         }
// }

async function userLookUp(uuid) {
    fetch('http://localhost:8080/player/uuid/' + uuid)
    .then(response => response.json())
    .then(data => {
        clanData.push(data)
        displayData();
    });
}

// async function izris(clan){
//     return '<tr>' + '<td><img alt="head" src="https://hypixel.paniek.de/player/' + clan.player.uuid + '/skin/head.webp?size=2" lazy="loaded"> ' + clan.player.displayName + '</td>'+
//             '<td>' + '</td>'+
//             '<td>' + '</td>'+
//             '<td>' + new Date(clan.player.firstLogin) + '</td>'+
//             '</tr>'
//     //const clani = await clanData.forEach(izris)
// }

function test() {
    //button
};

getData();