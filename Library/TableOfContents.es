/*
Copyright © 2016–2017, 2019, 2021 eMedia Intellect.

This file is part of eMI TOC Generator.

eMI TOC Generator is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

eMI TOC Generator is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with eMI TOC Generator. If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";

window.addEventListener("load", function()
{
	// Check for a table of contents.

	let tableOfContents = null;

	tableOfContents = window.document.getElementById("TableOfContents");

	if (tableOfContents === null)
	{
		throw new Error("No table of contents on the web page.");
	}

	// Check for the data-display-toggle attribute.

	let hasDisplayToggle = null;

	if (tableOfContents.dataset.displayToggle !== undefined)
	{
		if (tableOfContents.dataset.displayToggle === "true")
		{
			hasDisplayToggle = true;
		}
		else if (tableOfContents.dataset.displayToggle === "false")
		{
			hasDisplayToggle = false;
		}
		else
		{
			throw new Error("The \"displayToggle\" attribute has an invalid value.");
		}
	}

	// Check for the data-float-right attribute.

	let hasFloatRight = null;

	if (tableOfContents.dataset.floatRight !== undefined)
	{
		if (tableOfContents.dataset.floatRight === "true")
		{
			hasFloatRight = true;
		}
		else if (tableOfContents.dataset.floatRight === "false")
		{
			hasFloatRight = false;
		}
		else
		{
			throw new Error("The \"floatRight\" attribute has an invalid value.");
		}
	}

	// Check for the data-language attribute.

	let language = "en";

	let languages =
	{
		en: {	contents: "Contents",		hide: "hide",		show: "show"	},
		es: {	contents: "Índice",			hide: "ocultar",	show: "mostrar"	},
		is: {	contents: "Efnisyfirlit",	hide: "fela",		show: "sýna"	}
	};

	if (tableOfContents.dataset.language !== undefined)
	{
		if (tableOfContents.dataset.language in languages)
		{
			language = tableOfContents.dataset.language;
		}
		else
		{
			throw new Error("The \"language\" attribute has an invalid value.");
		}
	}

	// Check for the data-level-restriction attribute.

	let hasLevelRestriction = 6;

	if (tableOfContents.dataset.levelRestriction !== undefined)
	{
		switch(tableOfContents.dataset.levelRestriction)
		{
			case "2":
				hasLevelRestriction = 2;

				break;
			case "3":
				hasLevelRestriction = 3;

				break;
			case "4":
				hasLevelRestriction = 4;

				break;
			case "5":
				hasLevelRestriction = 5;

				break;
			case "6":
				hasLevelRestriction = 6;

				break;
			default:
				throw new Error("The \"levelRestriction\" attribute has an invalid value.");
		}
	}

	// Check for the data-numbering attribute.

	let hasNumbering = null;

	if (tableOfContents.dataset.numbering !== undefined)
	{
		if (tableOfContents.dataset.numbering === "true")
		{
			hasNumbering = true;
		}
		else if (tableOfContents.dataset.numbering === "false")
		{
			hasNumbering = false;
		}
		else
		{
			throw new Error("The \"numbering\" attribute has an invalid value.");
		}
	}

	// Check for the data-relocation attribute.

	let hasRelocation = false;

	if (tableOfContents.dataset.relocation !== undefined)
	{
		hasRelocation = true;
	}

	// Construct the table of contents.

	let output = "";

	let headings = [];

	let h2Counter = 0;
	let h3Counter = 0;
	let h4Counter = 0;
	let h5Counter = 0;
	let h6Counter = 0;

	let currentHeading = 0;
	let previousHeading = 0;

	let parentNode = tableOfContents.parentNode;

	output += "<div id=\"TableOfContentsList\">";

	Traverse(parentNode);

	for (let i = 1; i < currentHeading; ++i)
	{
		output += "</li>";
		output += "</ol>";
	}

	output += "</div>";

	if (h2Counter + h3Counter + h4Counter + h5Counter + h6Counter === 0)
	{
		throw new Error("No headings on the web page.");
	}

	let displayToggleOutput = "";

	if (hasDisplayToggle)
	{
		displayToggleOutput = " <span id=\"TableOfContentsDisplayToggle\">[<span id=\"TableOfContentsDisplayToggleText\">" + languages[language]["hide"] + "</span>]</span>";
	}

	let heading = "<div id=\"TableOfContentsHeader\">" + languages[language]["contents"] + displayToggleOutput + "</div>";

	output = heading + output;

	if (hasRelocation)
	{
		let location = window.document.getElementById(tableOfContents.dataset.relocation);

		location.innerHTML = output;

		tableOfContents.setAttribute("id", "");

		location.setAttribute("id", "TableOfContents");

		tableOfContents = window.document.getElementById("TableOfContents");
	}
	else
	{
		tableOfContents.innerHTML = output;

		if (hasDisplayToggle)
		{
			let displayToggle = window.document.getElementById("TableOfContentsDisplayToggle");
			let displayToggleState = localStorage.getItem("TableOfContentsDisplayToggleState");
			let displayToggleText = window.document.getElementById("TableOfContentsDisplayToggleText");
			let tableOfContentsList = window.document.getElementById("TableOfContentsList");

			if (displayToggleState === null)
			{
				localStorage.setItem("TableOfContentsDisplayToggleState", "true");

				displayToggleState = localStorage.getItem("TableOfContentsDisplayToggleState");
			}

			if (displayToggleState === "true")
			{
				tableOfContentsList.style.display = "block";

				displayToggleText.textContent = languages[language]["hide"];
			}
			else if (displayToggleState === "false")
			{
				tableOfContentsList.style.display = "none";

				displayToggleText.textContent = languages[language]["show"];
			}

			displayToggle.onclick = function()
			{
				if (displayToggleText.textContent === languages[language]["hide"])
				{
					tableOfContentsList.style.display = "none";

					displayToggleText.textContent = languages[language]["show"];

					localStorage.setItem("TableOfContentsDisplayToggleState", "false");
				}
				else if (displayToggleText.textContent === languages[language]["show"])
				{
					tableOfContentsList.style.display = "block";

					displayToggleText.textContent = languages[language]["hide"];

					localStorage.setItem("TableOfContentsDisplayToggleState", "true");
				}
			};
		}
	}

	if (hasFloatRight)
	{
		tableOfContents.style.clear = "right";

		tableOfContents.style.float = "right";

		tableOfContents.style.margin = "0 0 10px 10px";
	}

	tableOfContents.style.display = "inline-block";

	function Generate(heading, node, counter)
	{
		let headingAffix = "";
		let headingsCounter = 0;

		for (let i = 0; i < headings.length; ++i)
		{
			if (headings[i] == node.childNodes[0].nodeValue)
			{
				++headingsCounter;
			}
		}

		if (headingsCounter > 0)
		{
			++headingsCounter;

			headingAffix = "_" + headingsCounter;
		}

		headings.push(node.childNodes[0].nodeValue);

		node.setAttribute("id", encodeURIComponent(node.childNodes[0].nodeValue + headingAffix));

		let numbering = "";

		if (h2Counter !== 0)
		{
			numbering += h2Counter + ".";
		}

		if (h3Counter !== 0)
		{
			numbering += h3Counter + ".";
		}

		if (h4Counter !== 0)
		{
			numbering += h4Counter + ".";
		}

		if (h5Counter !== 0)
		{
			numbering += h5Counter + ".";
		}

		if (h6Counter !== 0)
		{
			numbering += h6Counter + ".";
		}

		currentHeading = heading;

		if (previousHeading < currentHeading)
		{
			output += "<ol>";

			if (hasNumbering)
			{
				output += "<li><a href=\"" + window.location.href.replace(location.hash, "") + "#" + encodeURIComponent(node.childNodes[0].nodeValue + headingAffix) + "\">" + numbering + " " + node.childNodes[0].nodeValue + "</a>";
			}
			else
			{
				output += "<li><a href=\"" + window.location.href.replace(location.hash, "") + "#" + encodeURIComponent(node.childNodes[0].nodeValue + headingAffix) + "\">" + node.childNodes[0].nodeValue + "</a>";
			}
		}
		else if (previousHeading > currentHeading)
		{
			let headingDifference = previousHeading - currentHeading;

			for (let i = 0; i < headingDifference; ++i)
			{
				output += "</li>";
				output += "</ol>";
			}

			if (hasNumbering)
			{
				output += "<li><a href=\"" + window.location.href.replace(location.hash, "") + "#" + encodeURIComponent(node.childNodes[0].nodeValue + headingAffix) + "\">" + numbering + " " + node.childNodes[0].nodeValue + "</a>";
			}
			else
			{
				output += "<li><a href=\"" + window.location.href.replace(location.hash, "") + "#" + encodeURIComponent(node.childNodes[0].nodeValue + headingAffix) + "\">" + node.childNodes[0].nodeValue + "</a>";
			}
		}
		else
		{
			output += "</li>";

			if (hasNumbering)
			{
				output += "<li><a href=\"" + window.location.href.replace(location.hash, "") + "#" + encodeURIComponent(node.childNodes[0].nodeValue + headingAffix) + "\">" + numbering + " " + node.childNodes[0].nodeValue + "</a>";
			}
			else
			{
				output += "<li><a href=\"" + window.location.href.replace(location.hash, "") + "#" + encodeURIComponent(node.childNodes[0].nodeValue + headingAffix) + "\">" + node.childNodes[0].nodeValue + "</a>";
			}
		}

		previousHeading = currentHeading;

		if (hasNumbering)
		{
			node.childNodes[0].nodeValue = numbering + " " + node.childNodes[0].nodeValue;
		}
		else
		{
			node.childNodes[0].nodeValue = node.childNodes[0].nodeValue;
		}
	}

	function Traverse(node)
	{
		if (node.nodeType === 1)
		{
			switch (node.tagName)
			{
				case "H2":
					if (hasLevelRestriction < 2)
					{
						break;
					}

					++h2Counter;

					h3Counter = 0;
					h4Counter = 0;
					h5Counter = 0;
					h6Counter = 0;

					Generate(2, node, h2Counter);

					break;
				case "H3":
					if (hasLevelRestriction < 3)
					{
						break;
					}

					++h3Counter;

					h4Counter = 0;
					h5Counter = 0;
					h6Counter = 0;

					Generate(3, node, h3Counter);

					break;
				case "H4":
					if (hasLevelRestriction < 4)
					{
						break;
					}

					++h4Counter;

					h5Counter = 0;
					h6Counter = 0;

					Generate(4, node, h4Counter);

					break;
				case "H5":
					if (hasLevelRestriction < 5)
					{
						break;
					}

					++h5Counter;

					h6Counter = 0;

					Generate(5, node, h5Counter);

					break;
				case "H6":
					if (hasLevelRestriction < 6)
					{
						break;
					}

					++h6Counter;

					Generate(6, node, h6Counter);

					break;
			}

			node = node.firstChild;

			while (node)
			{
				Traverse(node);

				node = node.nextSibling;
			}
		}
	}
}, false);