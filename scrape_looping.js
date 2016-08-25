var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var heroPage = 'http://paragon.wiki/Heroes'
var url = 'http://paragon.wiki/Feng_Mao';
var herourls = [];
herosfull = false
var json = [];

// get all Hero URLs
request(heroPage,function(error, response, html){
    if(!error && response.statusCode == 200){
        //console.log("Connection Made!Grabbing Hero URLs now");
        var $ = cheerio.load(html);
        numOfHeros = ($('.nowraplinks li a').length)/2;
        console.log(numOfHeros);
        $('.nowraplinks li a').each(function(i,element){
            if(i%2 != 0){
                var a = 'http://paragon.wiki' + $(this).attr('href');
                herourls.push(a);
            }
            // console.log(numOfHeros, herourls.length);
        });
        if (herourls.length == numOfHeros) {
            console.log('executing makeJSON');
            makeJSON();
        }
    }
});

//for Each of the Urls in the array herourls
//grab the relevant info and push it into the JSON object
function makeJSON(){
    console.log("Making JSON");
    herourls.forEach(function(el){
        request(el,function(error, response, html){
            if(!error && response.statusCode == 200){
                console.log("Connection Made! Scraping data for " + el +" now!");
                var $ = cheerio.load(html);
                $('.infobox.wikitable', '#mw-content-text').each(function(i,element){
                    var foo = $(this).children().eq(5).children().eq(1).text().trim();
                    // console.log(foo);
                    var a = $(this).attr('href');
                    var name = $(this).children().first().children().text().trim();
                    var category = $(this).children().eq(3).children().eq(1).text().trim();
                    var role = $(this).children().eq(4).children().eq(1).text().trim();
                    var attackType = $(this).children().eq(5).children().eq(1).text().trim();
                    var affinities =[$(this).children().eq(6).children().eq(1).children().first().text().trim(),$(this).children().eq(6).children().eq(1).children().eq(1).text().trim()];;
                    var damageType = $(this).children().eq(6).children().eq(1).children().first().text().trim();
                    var difficulty = $(this).children().eq(9).children().eq(1).children().first().text().trim();
                    var attackPower = $(this).children().eq(12).children().eq(1).text().trim();
                    var abilityPower = $(this).children().eq(13).children().eq(1).text().trim();
                    var durability = $(this).children().eq(14).children().eq(1).text().trim();
                    var mobility = $(this).children().eq(15).children().eq(1).text().trim();
                    var baseHealth = $(this).children().eq(16).children().eq(1).text().trim();
                    var healthRegen =$(this).children().eq(17).children().eq(1).text().trim();
                    var baseMana = $(this).children().eq(18).children().eq(1).text().trim();
                    var manaRegen = $(this).children().eq(19).children().eq(1).text().trim();
                    var physicalArmor = $(this).children().eq(20).children().eq(1).text().trim();
                    var energyArmor = $(this).children().eq(21).children().eq(1).text().trim();
                    var attackSpeedLevelBonus = $(this).children().eq(22).children().eq(1).text().trim();
                    var moveSpeed = $(this).children().eq(23).children().eq(1).text().trim();
                    var object={
                        name: name,
                        image: '',
                        category: category,
                        difficulty: difficulty,
                        primaryRole: role,
                        attackType: attackType,
                        affinity1: affinities[0],
                        affinity2: affinities[1],
                        baseStats:{
                            basicAttackPower: attackPower,
                            abilityAttackPower: abilityPower,
                            durability:durability,
                            mobility:mobility
                        },
                        stats:{
                            health:{
                                base: baseHealth,
                                regen:healthRegen
                            },
                            mana:{
                                base: baseMana,
                                regen:manaRegen
                            },
                            movementSpeed: moveSpeed,
                            armor:{
                                physical: physicalArmor,
                                energy: energyArmor
                            },
                        },
                        attacks:{

                        }

                    }
                    //end Variables
                    json.push(object);
                    printJSON(json)
                });
            }
        });

    });
}

function printJSON(x){
    if(x.length == numOfHeros){
        console.log(x);
        var j = JSON.stringify(x, undefined, 2);
        fs.writeFile('paragonHeros.json',j);
    }
}
