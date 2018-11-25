var app = new Framework7();
var $$ = Dom7;
var mainView = app.addView('.view-main', { dynamicNavbar: true });

function ssLogin() {
	var user_id = $('#login_box input').val();
	if (user_id == '') {
		$('#login_box input').val('srn919')
		user_id = 'srn919';
	};
	localStorage.setItem('user', user_id);
	setCookie('user', user_id, 10000);

	$$.post('http://sau-shoppen.dk/app.php', {quest: 'login_check', id: user_id}, function (data) {
		$('#login_box').addClass('hidden');
		$('#splash_box').removeClass('hidden');

		if (data == 1) {
			$$.post('http://sau-shoppen.dk/app.php', {quest: 'personligt_skema', id: user_id}, function (skema) {
				$('#skema_box').append(skema);
				$('#skema_box tr').each(function () {
					/*$(this)(function () {
						var id = '#'+$(this).attr('id')+'_more';
						var txt = $(id).text();
						if (txt.indexOf('lokale') < 0) {
							txt += '; lokale: ' + $(this).find('td:last-child').text();
						}
						$(id + ' td').text(txt);
						$(id).toggle();
					});*/
					$(this).click(function () {
						sau_shop( $(this).find('.code').first().text() );
					});
				});
				$("#week_list").contents().filter(function(){ return (this.nodeType == 3); }).remove();
				$('#week_list a').each(function () {
					$(this).attr('href', 'javascript:scrollWeek(' + $(this).text() + ')');
				});

				$('#splash_box').addClass('hidden');
				$('#login_box').addClass('hidden');
				$('#skema_box').removeClass('hidden');
			});
		} else {
			$('#splash_box').addClass('hidden');
			$('#login_box').removeClass('hidden');
			$('#skema_box').addClass('hidden');
			$(document).keypress(function (e) {
				if (e.which == 13) {
					ssLogin();
				}
			});
			$('#get_auto .error').removeClass('hidden');
		}
	});
}
function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}
function ssLoginM() {
	var valgt = $('#get_manual select').val();
	//valgt = encodeURI(valgt);

	if (valgt != null) {
		$('#login_box').addClass('hidden');
		$('#splash_box').removeClass('hidden');

		$$.post('http://sau-shoppen.dk/app.php', {quest: 'manuelt_skema', valg: valgt}, function (skema) {
			if (valgt.substr(0,1) == '%') {
				$('#skema_manuelt_sund').html(skema.trim());

				$('#skema_manuelt_sund tr').each(function () {
					$(this).after('<tr style="display:none"><td colspan="5">' + $(this).find('td:nth-child(2)').text() + ', ' + $(this).find('td:nth-child(3)').text() + ', ' + $(this).find('td:nth-child(8)').text() + ', ' + $(this).find('td:nth-child(9)').text() + '</td></tr>');

					$(this)(function () {
						$(this).next().toggle();

						$('#skema_manuelt_sund tr:nth-child(odd) td').css('color','black');

						var dscrptns = $('#skema_manuelt_sund tr:nth-child(odd) td:first-child').text();
						var activity = $(this).find('td:first-child').text();
						var count = 0;

						dscrptns = dscrptns.replace(/[\s\/\?]*/g, '');
						modified = activity.replace(/[\s\/\?]*/g, '');

						while (getIndicesOf(modified.substr(0,20), dscrptns, false).length < 2) {
							modified = modified.substr(0, modified.length-1);
							count++;
						}

						count += 2;
						var finalcut = activity.substr(0,activity.length - count);

						$('#skema_manuelt_sund tr:nth-child(odd) td:contains("' + finalcut + '")').each(function () {
							$(this).css('color','red');
							$(this).nextAll().css('color','red');
						});
					});
				});

				$('#splash_box').addClass('hidden');
				$('#skema_manuelt_sund').removeClass('hidden');
			} else {
				$('#skema_manuelt_ku').html(skema.trim());

				$('#skema_manuelt_ku tr').each(function () {
					$(this).after('<tr style="display:none"><td colspan="5">' + $(this).find('td:nth-child(2)').text() + ', ' + $(this).find('td:nth-child(3)').text() + ', ' + $(this).find('td:nth-child(6)').text() + ', ' + $(this).find('td:nth-child(8)').text() + ', ' + $(this).find('td:nth-child(9)').text() + '</td></tr>');
					$(this).find('td:nth-child(7)').css('white-space','nowrap');

					$(this).click(function () {
						$(this).next().toggle();

						$('#skema_manuelt_ku tr:nth-child(odd) td').css('color','black');

						var dscrptns = $('#skema_manuelt_ku tr:nth-child(odd) td:first-child').text();
						var activity = $(this).find('td:first-child').text();
						var count = 0;

						dscrptns = dscrptns.replace(/[\s\/\?]*/g, '');
						modified = activity.replace(/[\s\/\?]*/g, '');

						while (getIndicesOf(modified.substr(0,20), dscrptns, false).length < 2) {
							modified = modified.substr(0, modified.length-1);
							count++;
						}

						count += 2;
						var finalcut = activity.substr(0,activity.length - count);

						$('#skema_manuelt_ku tr:nth-child(odd) td:contains("' + finalcut + '")').each(function () {
							$(this).css('color','red');
							$(this).nextAll().css('color','red');
						});
					});
				});

				$('#splash_box').addClass('hidden');
				$('#skema_manuelt_ku').removeClass('hidden');
			}
		});
	} else {
		$('#get_manual .error').removeClass('hidden');
	}
}
function goto_index() {
	window.location.reload();
}
function ssLogout() {
	localStorage.removeItem('user');
	$('#skema_box').addClass('hidden');
	$('#skema_manuelt_sund').addClass('hidden');
	$('#skema_manuelt_ku').addClass('hidden');
	$('#login_box').removeClass('hidden');
	goto_index();
}

function sendFeedback() {
	var usr = localStorage.getItem('user');
	var txt = $('#feedback_box textarea').val();
	if (txt.length > 0) {
		$$.post("http://sau-shoppen.dk/app.php", {quest: 'feedback', t: txt, u: usr}, function(data) {
			$('#feedback_box textarea').toggle();
			$('#feedback_box a').toggle();
			$('#feedback_box .hidden').removeClass('hidden');
		});
	}
}

function scrollWeek(n) {
	$('#index_scroll').scrollTop(0);
	$('#index_scroll').scrollTop(Math.floor($('#sau_week_' + n).position().top)-42);
}

function shop_selection() {

}

function page_shop() {
	$('.shopped_activities tr').each(function () {
		$(this)(function () {
			var usr = localStorage.getItem('user');
			var ctd = $(this).html().split(/<.+?>/g);
			ctd = $.grep(ctd, function(n) {
				return n.length > 2;
			});
			var mth = { jan:'01', feb:'02', mar:'03', apr:'04', maj:'05', jun:'06', jul:'07', aug:'08', sep:'09', okt:'10', nov:'11', dec:'12' };
			var date = ctd[3].substr(-4)+'-'+mth[ctd[3].substr(-8,3)]+'-'+parseInt(ctd[3])+' '+('000'+ctd[4]).substr(-5)+':00';
			ctd = encodeURIComponent(JSON.stringify(ctd));

			$$.post("http://sau-shoppen.dk/app.php", {quest: 'shopping', t: date, u: usr, c: ctd}, function(data) {
				alert('Timen er gemt i din kurv!');
			});
		});
	});
}

function back_btn_click() {
	$('#shop_box').hide();
	$('#skema_box').show();
	$('#shop_box').html( '<img src="res/logo_shop.png" id="shop_splash"/>' );
}

function sau_shop(input) {
	$('#skema_box').hide();
	$('#shop_box').show();

	$$.post("http://sau-shoppen.dk/js/get_shop_codes.php", {c: input}, function(data) {
		var obj = JSON.parse(data);
		if (obj.length > 0) {
			for (var i = 0; i < obj.length; i++) {
				$$.post("http://sau-shoppen.dk/js/get_shop_activities.php", {c: input, a: obj[i]}, function(data) {
					var classes = JSON.parse(data);
					var txt = "";
					txt += "<h1>" + input + "</h1><br />";
					txt += "<div class='back_btn' onclick='javascript:back_btn_click()'>Tilbage</div>";
					txt += "<div><table class='shopped_activities' cellspacing='0' cellpadding='0'>";
					txt += "<tr><td>Aktivitet</td><td>Beskrivelse</td><td>Type</td><td>Dag</td><td>Dato</td><td>Start</td><td>Slut</td><td>Lokale</td><td>Underviser</td></tr>";
					for (var i = 0; i < classes.length; i++) {
						txt += classes[i];
					}
					txt += "</table></div><br />";
					txt += "<div class='back_btn' onclick='javascript:back_btn_click()'>Tilbage</div>";
					$('#shop_box').html(txt);

					//page_shop();
				});
			}
		}
	});
}

function double_scroll(a, b, ad = true, bd = true) {
	var a_pos = ad ? $('#'+a).scrollTop() : $('#'+a).scrollLeft();
	var a_tot = ad ? document.getElementById(a).scrollHeight-$('#'+a).height() : document.getElementById(a).scrollWidth-$('#'+a).width();
	var a_per = a_pos/a_tot;

	var b_pos = bd ? $('#'+b).scrollTop() : $('#'+b).scrollLeft();
	var b_tot = bd ? document.getElementById(b).scrollHeight-$('#'+b).height() : document.getElementById(b).scrollWidth-$('#'+b).width();
	var b_per = b_pos/b_tot;

	bd ? $('#'+b).scrollTop(b_tot*a_per) : $('#'+b).scrollLeft(b_tot*a_per);
}

function page_index() {
	$$.post("http://sau-shoppen.dk/app.php", {quest: 'selections'}, function(selection) {
		$('#get_manual select').append(selection);
	});

	if (localStorage.getItem('user') == null && getCookie('user').length < 1) {
		$('#splash_box').addClass('hidden');
		$('#login_box').removeClass('hidden');
		$('#skema_box').addClass('hidden');
		$(document).keypress(function (e) {
			if (e.which == 13) {
				ssLogin();
			}
		});
	} else {
		if (getCookie('user').length > 0) {
			$('#login_box input').val(getCookie('user'));
			ssLogin();
		} else {
			$('#login_box input').val(localStorage.getItem('user'));
			ssLogin();
		}
	}

	$('#index_scroll').scroll(function () {
		if (!$('#skema_box').hasClass('hidden')) {
			double_scroll('index_scroll', 'week_list', true, false);
		}
	});
	$('#week_list').scroll(function () {
		if (!$('#skema_box').hasClass('hidden')) {
			double_scroll('week_list', 'index_scroll', false, true);
		}
	});
}

$$(document).on('deviceready', function() { page_index(); });
$$(document).on('pageInit', function (e) {
    var page = e.detail.page;
    if (page.name === 'index') { page_index();
    }
})

var autocompleteStandaloneSimple = app.autocomplete({
    openIn: 'page',
    opener: $$('#man_auto'),
    backOnSelect: true,
    source: function (autocomplete, query, render) {
				var semestre = ['Medicin', 'Tandlæge', 'Jura'];
        var results = [];
        if (query.length === 0) {
            render(results);
            return;
        }
        for (var i = 0; i < semestre.length; i++) {
            if (semestre[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(semestre[i]);
        }
        render(results);
    },
    onChange: function (autocomplete, value) {
        $$('#man_auto').find('.item-after').text(value[0]);
        $$('#man_auto').find('input').val(value[0]);
    }
});

var autocompleteStandaloneSimple = app.autocomplete({
    openIn: 'page',
    opener: $$('#und_auto'),
    backOnSelect: true,
    source: function (autocomplete, query, render) {
				var undervisere = ['Lone', 'Esben', 'Hans'];
        var results = [];
        if (query.length === 0) {
            render(results);
            return;
        }
        for (var i = 0; i < undervisere.length; i++) {
            if (undervisere[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(undervisere[i]);
        }
        render(results);
    },
    onChange: function (autocomplete, value) {
        $$('#und_auto').find('.item-after').text(value[0]);
        $$('#und_auto').find('input').val(value[0]);
    }
});
