// ==UserScript==
// @name         DisplayApp
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Application display in status VK
// @author       usik
// @match        *://vk.com/*
// @grant        none
// ==/UserScript==

function DisplayApp () {
	function setStatus (aid, view) {
		ajax.plainpost ("apps", {
			act: "show_settings",
			aid: aid,
			al: 1
		}, function (data) {
			var regexp = /apps.savesettings\(.*'([a-z0-9]+)'/i;
			var hash = regexp.test(data) ? data.match (regexp)[1] : false;

			if (!hash) throw new Error ("Invalid Hash!");

			ajax.plainpost("apps", {
				act: "save_settings",
				aid: aid,
				hash: hash,
				from: "appview",
				app_settings_2097152: view ? view : 0,
				cur_aid: aid
			});
		})
	}

	function handler () {
		var a = prompt ("Введите id приложения: ", 2721929) || null;

		if (!a) return topError("Вы не указали ID приложения!", { dt: 3 });

		setStatus (a);
		setStatus (a, 1);
		Page.infoSave();
		topMsg("Значок приложение добавлен в ваш статус!", 3);
	}

	function editor (data) {
		if (cur.module !== "profile") return;
		if (vk.id !== cur.oid) return;

		var editor = geByClass1 ("editor");
		if (editor.querySelector ("#button-game")) return false;

		var element = ce ("button", {
			id: "button-game",
			className: "flat_button button_small secondary",
			innerText: "Отображать приложение.",
			style: "margin-top: 5px !important"
		});
		element.onclick = function () {
			return handler ();
		}
		editor.appendChild (element);
	}

	var observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			if (mutation.target.nodeType !== 1) return;
			editor (mutation.target);
		});
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
}

var script = document.createElement('script');
script.appendChild(document.createTextNode('(' + DisplayApp + ')();'));
(document.body || document.head || document.documentElement).appendChild(script);
