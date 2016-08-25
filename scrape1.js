var request = require('request');
var cheerio = require('cheerio');
var url = 'http://paragon.wiki/Feng_Mao';
var json = [];

request('https://news.ycombinator.com',function(error, response, html){
    if(!error && response.statusCode == 200){
        var $ = cheerio.load(html);
        $('span.comhead').each(function(i,element){
            var a = $(this).prev();
            var rank = a.parent().parent().text();
            var title = a.text();
            var url = a.attr('href');
            var subtext = a.parent().parent().next().children('.subtext').children();
            var points = $(subtext).eq(0).text();
            var username = $(subtext).eq(1).text();
            var comments = $(subtext).eq(2).text();
            //parsed Data
            var metadata ={
                rank: parseInt(rank),
                title: title,

            };
            json.push(metadata);
        });
        console.log(JSON.stringify(json,null,'\t'));
    }
})
