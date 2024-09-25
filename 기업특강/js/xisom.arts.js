if (typeof page == "undefined") page = {};
if (typeof page.protoViews == "undefined") page.protoViews = {};

/////////////////////////////////////////////////////////////////////////////////////
// BarArtView
/////////////////////////////////////////////////////////////////////////////////////
(function () {
	function BarArtView(arg) {
		WidgetElement.call(this, arg);

		this.artDirection = arg.direction;
		this.textOption = arg.text;
		this.limitValue = arg.limitValue;
		this.limitTag = arg.limitValueTag;
		this.artItems = arg.items;
	}
	BarArtView.prototype = Object.create(WidgetElement.prototype);
	BarArtView.prototype.constructor = BarArtView;


	BarArtView.prototype.setX = function (value) {
		$("#" + this._id).find("svg").attr("x", value);
		this._x = value;
		this.setAngle(this.getAngle());
	}

	BarArtView.prototype.setY = function (value) {
		$("#" + this._id).find("svg").attr("y", value);
		this._y = value;
		this.setAngle(this.getAngle());
	}

	BarArtView.prototype.setWidth = function (value) {
		$("#" + this._id).find("svg").attr("width", value);
		this._width = value;
		this.setAngle(this.getAngle());
		this.DrawArt();
	}

	BarArtView.prototype.setHeight = function (value, resize) {
		$("#" + this._id).find("svg").attr("height", value);
		this._height = value;
		this.setAngle(this.getAngle());
		this.DrawArt();
	}
	BarArtView.prototype.setBackgroundColor = function (value) {
		if (!value) value = "none";
		$("#rect_" + this._id).css('fill', value);
		this._backgroundColor = value;
	}
	BarArtView.prototype.setOpacity = function (value) {
		// Set opacity for path shape
		var rects = $("#" + this._id).find("svg rect");
		for (var i = 0; i < rects.length; i++) {
			var element = rects[i];
			element.setAttribute('fill-opacity', value);
			element.setAttribute('stroke-opacity', value);
		}
		// Set opacity for text value
		var texts = $("#" + this._id).find("svg text");
		for (var i = 0; i < texts.length; i++) {
			var element = texts[i];
			element.setAttribute('fill-opacity', value);
			element.setAttribute('stroke-opacity', value);
		}
		this._opacity = value;
	}
	BarArtView.prototype.setVisible = function (value) {
		var visibility = value == true ? "visible" : "hidden";
		var pVisible = page.parentNodeVisibility(this._id);
		if (pVisible != null && pVisible != "visible") {
			visibility = pVisible;
		}
		this._visible = value;

		$("#rect_" + this._id).css('visibility', visibility);
		for (var i = 0; i < this.artItems.length; i++) {
			var baritem = this.artItems[i];
			if (baritem.visible)
				$("#rect_" + this._id + "_Item" + i).css('visibility', visibility);

			if (baritem.visible && this.textOption.enable)
				$("#text_" + this._id + "_Item" + i).css('visibility', visibility);
		}
	}
	BarArtView.prototype.setVisibleByGroup = function (value) {
		var visibility = "visible";
		if (value == false) {
			visibility = "hidden";
		} else {
			if (this._visible == true) {
				visibility = "visible";
			} else {
				visibility = "hidden";
			}
		}

		$("#rect_" + this._id).css('visibility', visibility);
		for (var i = 0; i < this.artItems.length; i++) {
			var baritem = this.artItems[i];
			if (baritem.visible)
				$("#rect_" + this._id + "_Item" + i).css('visibility', visibility);

			if (baritem.visible && this.textOption.enable)
				$("#text_" + this._id + "_Item" + i).css('visibility', visibility);
		}
	}
	/// Tag change event handler
	BarArtView.prototype.tagValueChanged = function (e) {
		if (e.status == 0 || !this.nullText) {
			this.DrawArt();
		}
	}

	////////////////////////////////////////////
	/// Re-Draw BarArt
	////////////////////////////////////////////
	BarArtView.prototype.DrawArt = function () {

		// Draw the background shape
		$("#rect_" + this._id).attr("width", this._width);
		$("#rect_" + this._id).attr("height", this._height);

		// Draw the items
		var totalValue = this.limitValue;
		if (this.limitValue == "NaN") {
			totalValue = 0;
			for (var i = 0; i < this.artItems.length; i++) {
				var item = this.artItems[i];
				if (item.tag != "")
					totalValue += item.tag.value;
				else
					totalValue += item.value;
			}
		}
		if (this.limitTag != "") {
			totalValue = this.limitTag.value;
		}

		if (totalValue == 0) {
			for (var i = 0; i < this.artItems.length; i++) {
				var itemID = this.id + "_Item" + i;
				var rectobj = document.getElementById("rect_" + itemID);
				var textobj = document.getElementById("text_" + itemID);
				var spanobj = document.getElementById("tspan_" + itemID);

				// Change Item Rectangle
				rectobj.setAttribute("x", 0);
				rectobj.setAttribute("width", 0);

				// Change Item text
				textobj.setAttribute("x", 0);
				spanobj.setAttribute("x", 0);
				spanobj.innerHTML = "";
			}
			return;
		}

		var accum = 0;
		for (var i = 0; i < this.artItems.length; i++) {
			var item = this.artItems[i];

			var itemID = this.id + "_Item" + i;
			var rectobj = document.getElementById("rect_" + itemID);
			var textobj = document.getElementById("text_" + itemID);
			var spanobj = document.getElementById("tspan_" + itemID);

			var itemValue = item.value;
			if (item.tag != "") {
				itemValue = item.tag.value;
			}
			var itemValueText = page.valueByFormat(this.textOption.textFormat, itemValue);

			if (itemValue > totalValue) itemValue = totalValue;
			else if (itemValue <= 0) {
				rectobj.setAttribute("width", 0);
				rectobj.setAttribute("height", 0);
				spanobj.innerHTML = "";
				continue;
			}

			var itemWidth = itemValue / totalValue * this.width;
			const compStyles = window.getComputedStyle(textobj);
			var fontsize = parseInt(compStyles.getPropertyValue('font-size'));
			var offset = 2;
			var topMargin = 8;

			try {
				if (this.artDirection === "right") {
					var _itemW = itemWidth;
					if ((accum + itemWidth) > this.width) {
						_itemW = this.width - accum
					}

					if (accum > this.width || _itemW <= 0) {
						rectobj.setAttribute("width", 0);
						rectobj.setAttribute("height", 0);
						spanobj.innerHTML = "";
						continue;
					}
					// Change Item Rectangle
					rectobj.setAttribute("x", accum);
					rectobj.setAttribute("width", _itemW);
					rectobj.setAttribute("height", this.height);

					var textX = accum + _itemW / 2;
					if (this.textOption.alignment === "left") {
						textX = accum + 2;
					}
					else if (this.textOption.alignment === "right") {
						textX = accum + _itemW - 2;
					}

					var textY = this.height / 2;
					if (this.textOption.lineAlignment === "top") {
						textY = fontsize + offset;
					}
					else if (this.textOption.lineAlignment === "bottom") {
						textY = this.height - topMargin + offset;
					}
					else if (this.textOption.lineAlignment === "middle") {
						textY = this.height / 2 + fontsize / 2 - topMargin / 2 + offset;
					}

					// Change Item text
					textobj.setAttribute("x", textX);
					textobj.setAttribute("y", textY);

					spanobj.setAttribute("x", textX);
					spanobj.setAttribute("y", textY);

				}
				else if (this.artDirection === "left") {
					var _itemW = itemWidth;
					if ((accum + itemWidth) > this.width) {
						_itemW = this.width - accum
					}
					if (accum > this.width || _itemW <= 0) {
						rectobj.setAttribute("width", 0);
						rectobj.setAttribute("height", 0);
						spanobj.innerHTML = "";
						continue;
					}
					// Change Item Rectangle  
					var rectX = this.width - accum - _itemW;
					rectobj.setAttribute("x", rectX);
					rectobj.setAttribute("width", _itemW);
					rectobj.setAttribute("height", this.height);

					var textX = rectX + _itemW / 2;
					if (this.textOption.alignment === "left") {
						textX = rectX + 2;
					}
					else if (this.textOption.alignment === "right") {
						textX = rectX + _itemW - 2;
					}
					var textY = this.height / 2 + fontsize / 2 - topMargin / 2 + offset;
					if (this.textOption.lineAlignment === "top") {
						textY = fontsize + offset;
					}
					else if (this.textOption.lineAlignment === "bottom") {
						textY = this.height - topMargin + offset;
					}

					// Change Item text
					textobj.setAttribute("x", textX);
					textobj.setAttribute("y", textY);

					spanobj.setAttribute("x", textX);
					spanobj.setAttribute("y", textY);
				}
				else if (this.artDirection === "top") {
					itemWidth = itemValue / totalValue * this.height;

					var _itemW = itemWidth;
					if ((accum + itemWidth) > this.height) {
						_itemW = this.height - accum
					}
					if (accum > this.height || _itemW <= 0) {
						rectobj.setAttribute("width", 0);
						rectobj.setAttribute("height", 0);
						spanobj.innerHTML = "";
						continue;
					}

					// Change Item Rectangle 
					var rectY = this.height - accum - _itemW;
					rectobj.setAttribute("x", 0);
					rectobj.setAttribute("y", rectY);
					rectobj.setAttribute("width", this.width);
					rectobj.setAttribute("height", _itemW);

					var textX = this.width / 2;
					if (this.textOption.alignment === "left") {
						textX = 2;
					}
					else if (this.textOption.alignment === "right") {
						textX = this.width - 2;
					}

					var textY = rectY + _itemW / 2;
					if (this.textOption.lineAlignment === "top") {
						textY = rectY + fontsize + offset;
					}
					else if (this.textOption.lineAlignment === "bottom") {
						textY = rectY + _itemW - topMargin + offset;
					}
					else if (this.textOption.lineAlignment === "middle") {
						textY = rectY + _itemW / 2 + fontsize / 2 - topMargin / 2 + offset;
					}

					// Change Item text 			
					textobj.setAttribute("x", textX);
					textobj.setAttribute("y", textY);

					spanobj.setAttribute("x", textX);
					spanobj.setAttribute("y", textY);
				}
				else if (this.artDirection === "bottom") {
					itemWidth = itemValue / totalValue * this.height;
					var _itemW = itemWidth;
					if ((accum + itemWidth) > this.height) {
						_itemW = this.height - accum
					}
					if (accum > this.height || _itemW <= 0) {
						rectobj.setAttribute("width", 0);
						rectobj.setAttribute("height", 0);
						spanobj.innerHTML = "";
						continue;
					}
					// Change Item Rectangle 
					var rectY = accum;
					rectobj.setAttribute("x", 0);
					rectobj.setAttribute("y", rectY);
					rectobj.setAttribute("width", this.width);
					rectobj.setAttribute("height", _itemW);

					var textX = this.width / 2;
					if (this.textOption.alignment === "left") {
						textX = 2;
					}
					else if (this.textOption.alignment === "right") {
						textX = this.width - 2;
					}

					var textY = rectY + _itemW / 2;
					if (this.textOption.lineAlignment === "top") {
						textY = rectY + fontsize + offset;
					}
					else if (this.textOption.lineAlignment === "bottom") {
						textY = rectY + _itemW - topMargin + offset;
					}
					else if (this.textOption.lineAlignment === "middle") {
						textY = rectY + _itemW / 2 + fontsize / 2 - topMargin / 2 + offset;
					}

					// Change Item text 			
					textobj.setAttribute("x", textX);
					textobj.setAttribute("y", textY);

					spanobj.setAttribute("x", textX);
					spanobj.setAttribute("y", textY);
				}
				spanobj.innerHTML = itemValueText;
			}
			finally {
				accum += itemWidth;
			}
		}
	}

	page.createBarArtShape = function (arg) {
		var view = new BarArtView(arg);

		page.protoViews[arg.id] = view;
		view.setAngle(arg.angle);

		if (arg.limitValueTag != "") {
			var tag = scada.getTagByName(arg.limitValueTag);
			tag.addEventListener("change", function (event) {
				view.tagValueChanged(event);
			});
			view.limitTag = tag;
		}

		for (var i = 0; i < arg.items.length; i++) {
			var item = arg.items[i];

			var artItem = view.artItems[i];
			artItem.id = "barItem" + i;

			if (item.tag != "") {
				var tag = scada.getTagByName(item.tag);
				tag.addEventListener("change", function (event) {
					view.tagValueChanged(event);
				});
				artItem.tag = tag;
			}
		}
		return view;
	}
})();

/////////////////////////////////////////////////////////////////////////////////////
// PyramidArtView
/////////////////////////////////////////////////////////////////////////////////////
(function () {
	function PyramidArtView(arg) {
		WidgetElement.call(this, arg);

		this.radius = arg.radius;
		this.artDirection = arg.direction;
		this.textOption = arg.text;
		this.limitValue = arg.limitValue;
		this.limitTag = arg.limitValueTag;
		this.artItems = arg.items;
	}
	PyramidArtView.prototype = Object.create(WidgetElement.prototype);
	PyramidArtView.prototype.constructor = PyramidArtView;

	PyramidArtView.prototype.setX = function (value) {
		$("#" + this._id).find("svg").attr("x", value);
		this._x = value;
		this.setAngle(this.getAngle());
	}
	PyramidArtView.prototype.setY = function (value) {
		$("#" + this._id).find("svg").attr("y", value);
		this._y = value;
		this.setAngle(this.getAngle());
	}
	PyramidArtView.prototype.setWidth = function (value) {
		$("#" + this._id).find("svg").attr("width", value);
		this._width = value;
		this.setAngle(this.getAngle());
		this.DrawArt();
	}
	PyramidArtView.prototype.setHeight = function (value, resize) {
		$("#" + this._id).find("svg").attr("height", value);
		this._height = value;
		this.setAngle(this.getAngle());
		this.DrawArt();
	}
	PyramidArtView.prototype.setBackgroundColor = function (value) {
		if (!value) value = "none";
		$("#pol_" + this._id).css('fill', value);
		this._backgroundColor = value;
	}
	PyramidArtView.prototype.setOpacity = function (value) {
		$("#pol_" + this._id).css('fill-opacity', value);
		for (var i = 0; i < this.artItems.length; i++) {
			$("#pol_" + this._id + "_Item" + i).css('fill-opacity', value);
			$("#text_" + this._id + "_Item" + i).css('fill-opacity', value);
		}

		// Set opacity for path shape
		var polygons = $("#" + this._id).find("svg polygon");
		for (var i = 0; i < polygons.length; i++) {
			var element = polygons[i];
			element.setAttribute('fill-opacity', value);
			element.setAttribute('stroke-opacity', value);
		}
		// Set opacity for text value
		var texts = $("#" + this._id).find("svg text");
		for (var i = 0; i < texts.length; i++) {
			var element = texts[i];
			element.setAttribute('fill-opacity', value);
			element.setAttribute('stroke-opacity', value);
		}

		this._opacity = value;
	}
	PyramidArtView.prototype.setVisible = function (value) {
		var visibility = value == true ? "visible" : "hidden";
		var pVisible = page.parentNodeVisibility(this._id);
		if (pVisible != null && pVisible != "visible") {
			visibility = pVisible;
		}
		this._visible = value;

		$("#pol_" + this._id).css('visibility', visibility);
		for (var i = 0; i < this.artItems.length; i++) {
			var pyramiditem = this.artItems[i];
			if (pyramiditem.visible)
				$("#pol_" + this._id + "_Item" + i).css('visibility', visibility);

			if (pyramiditem.visible && this.textOption.enable)
				$("#text_" + this._id + "_Item" + i).css('visibility', visibility);
		}
	}
	PyramidArtView.prototype.setVisibleByGroup = function (value) {
		var visibility = "visible";
		if (value == false) {
			$("#" + this._id).css('visibility', "hidden");
			visibility = "hidden";
		} else {
			if (this._visible == true) {
				visibility = "visible";
			} else {
				visibility = "hidden";
			}
		}

		$("#path_" + this._id).css('visibility', visibility);
		for (var i = 0; i < this.artItems.length; i++) {
			var pyramiditem = this.artItems[i];
			if (pyramiditem.visible)
				$("#path_" + this._id + "_Item" + i).css('visibility', visibility);

			if (pyramiditem.visible && this.textOption.enable)
				$("#text_" + this._id + "_Item" + i).css('visibility', visibility);
		}
	}
	/// Tag change event handler
	PyramidArtView.prototype.tagValueChanged = function (e) {
		if (e.status == 0 || !this.nullText) {
			this.DrawArt();
		}
	}

	////////////////////////////////////////////
	/// Re-Draw PyramidArt
	////////////////////////////////////////////
	PyramidArtView.prototype.DrawArt = function () {
		// Draw the backgroud shape and fill background color
		this.DrawArtBackground();

		// Draw the items
		this.DrawArtItems();
	}
	////////////////////////////////////////////
	/// Draw the background shape
	////////////////////////////////////////////
	PyramidArtView.prototype.DrawArtBackground = function () {
		// Draw the backgroud shape
		var w = this._width;
		var h = this._height;
		var bgpoints = "";
		if (this.artDirection === "right") {
			// point 1
			bgpoints += String.Format("{0},{1} ", 0, 0);
			// point 2                              
			bgpoints += String.Format("{0},{1} ", w, this.radius * h);
			// point 3                              
			bgpoints += String.Format("{0},{1} ", w, h - this.radius * h);
			// point 4                             
			bgpoints += String.Format("{0},{1} ", 0, h);

		} else if (this.artDirection === "left") {
			// point 1
			bgpoints += String.Format("{0},{1} ", w, 0);
			// point 2                             
			bgpoints += String.Format("{0},{1} ", 0, this.radius * h);
			// point 3                             
			poinbgpointsts += String.Format("{0},{1} ", 0, h - this.radius * h);
			// point 4                             
			bgpoints += String.Format("{0},{1} ", w, h);

		} else if (this.artDirection === "top") {
			// point 1
			bgpoints += String.Format("{0},{1} ", 0, h);
			// point 2                          
			bgpoints += String.Format("{0},{1} ", this.radius * w, 0);
			// point 3                          
			bgpoints += String.Format("{0},{1} ", w - this.radius * w, 0);
			// point 4                          
			bgpoints += String.Format("{0},{1} ", w, h);

		} else if (this.artDirection === "bottom") {
			// point 1
			bgpoints += String.Format("{0},{1} ", 0, 0);
			// point 2                          
			bgpoints += String.Format("{0},{1} ", this.radius * w, h);
			// point 3                          
			bgpoints += String.Format("{0},{1} ", w - this.radius * w, h);
			// point 4                          
			bgpoints += String.Format("{0},{1} ", w, 0);
		}
		document.getElementById("pol_" + this._id).setAttribute("points", bgpoints);
	}

	////////////////////////////////////////////
	/// Draw the items shape
	////////////////////////////////////////////
	PyramidArtView.prototype.DrawArtItems = function () {
		var totalValue = this.limitValue;
		if (this.limitValue == "NaN") {
			totalValue = 0;
			for (var i = 0; i < this.artItems.length; i++) {
				var item = this.artItems[i];
				if (item.tag != "")
					totalValue += item.tag.value;
				else
					totalValue += item.value;
			}
		}
		if (this.limitTag != "") {
			totalValue = this.limitTag.value;
		}

		if (totalValue == 0) {
			for (var i = 0; i < this.artItems.length; i++) {
				var itemID = this.id + "_Item" + i;
				var rectobj = document.getElementById("pol_" + itemID);
				var textobj = document.getElementById("text_" + itemID);
				var spanobj = document.getElementById("tspan_" + itemID);

				// Change Item Rectangle
				rectobj.setAttribute("points", "");

				// Change Item text
				spanobj.innerHTML = "";
			}
			return;
		}

		var itemAccumValue = 0;
		for (var i = 0; i < this.artItems.length; i++) {
			var item = this.artItems[i];
			var itemID = this.id + "_Item" + i;
			var rectobj = document.getElementById("pol_" + itemID);
			var textobj = document.getElementById("text_" + itemID);
			var spanobj = document.getElementById("tspan_" + itemID);

			var itemValue = item.value;

			if (item.tag != "") {
				itemValue = item.tag.value;
			}
			var itemValueText = page.valueByFormat(this.textOption.textFormat, itemValue);
			if (itemValue < 0) itemValueText = "";

			if (itemValue > totalValue) itemValue = totalValue;
			else if (itemValue <= 0) {
				rectobj.setAttribute("points", "");
				spanobj.innerHTML = "";
				continue;
			}

			const compStyles = window.getComputedStyle(textobj);
			var fontsize = parseInt(compStyles.getPropertyValue('font-size'));
			var offset = 2;
			var topMargin = 8;
			var textX = 0.0;
			var textY = 0.0;
			var textAnchor = "middle";

			var points = "";
			if (this.artDirection === "right") {
				var itemHL = itemAccumValue / totalValue * this.width;
				var itemHH = (itemAccumValue + itemValue) / totalValue * this.width;
				if (itemAccumValue >= totalValue) { itemHL = this.width; itemValueText = ""; }
				if (itemAccumValue + itemValue > totalValue) itemHH = this.width;
				var itemWL = this.radius * this.height / this.width * itemHL;
				var itemWH = this.radius * this.height / this.width * itemHH;

				// point 1
				points = String.Format("{0},{1} ", itemHL, itemWL);
				// point 2
				points += String.Format("{0},{1} ", itemHH, itemWH);
				// point 3
				points += String.Format("{0},{1} ", itemHH, this.height - itemWH);
				// point 4
				points += String.Format("{0},{1} ", itemHL, this.height - itemWL);

				textX = (itemHL + itemHH) / 2;
				if (this.textOption.alignment === "left") {
					textX = itemHL + 2;
					textAnchor = "start";
				}
				else if (this.textOption.alignment === "right") {
					textX = itemHH - 2;
					textAnchor = "end";
				}

				textY = this.height / 2 + fontsize / 2 - topMargin / 2 + offset;
				if (this.textOption.lineAlignment === "top") {
					textX = (itemHL + itemHH) / 2;
					textAnchor = "middle";

					textY = itemWL; // + fontsize + offset;
				}
				else if (this.textOption.lineAlignment === "bottom") {
					textX = (itemHL + itemHH) / 2;
					textAnchor = "middle";

					textY = this.height - itemWL + fontsize;
				}
			}
			else if (this.artDirection === "left") {
				var itemHL = itemAccumValue / totalValue * this.width;
				var itemHH = (itemAccumValue + itemValue) / totalValue * this.width;
				if (itemAccumValue >= totalValue) { itemHL = this.width; itemValueText = ""; }
				if (itemAccumValue + itemValue > totalValue) itemHH = this.width;
				var itemWL = this.radius * this.height / this.width * itemHL;
				var itemWH = this.radius * this.height / this.width * itemHH;

				// point 1
				points = String.Format("{0},{1} ", this.width - itemHL, itemWL);
				// point 2
				points += String.Format("{0},{1} ", this.width - itemHH, itemWH);
				// point 3
				points += String.Format("{0},{1} ", this.width - itemHH, this.height - itemWH);
				// point 4
				points += String.Format("{0},{1} ", this.width - itemHL, this.height - itemWL);

				textX = this.width - (itemHL + itemHH) / 2;
				if (this.textOption.alignment === "left") {
					textX = this.width - itemHH + 2;
					textAnchor = "start";
				}
				else if (this.textOption.alignment === "right") {
					textX = this.width - itemHL - 2;
					textAnchor = "end";
				}

				textY = this.height / 2 + fontsize / 2 - topMargin / 2 + offset;
				if (this.textOption.lineAlignment === "top") {
					textX = this.width - (itemHL + itemHH) / 2;
					textAnchor = "middle";

					textY = itemWL;
				}
				else if (this.textOption.lineAlignment === "bottom") {
					textX = this.width - (itemHL + itemHH) / 2;
					textAnchor = "middle";

					textY = this.height - itemWL + fontsize;
				}

			}
			else if (this.artDirection === "top") {

				var itemHL = itemAccumValue / totalValue * this.height;
				var itemHH = (itemAccumValue + itemValue) / totalValue * this.height;
				if (itemAccumValue >= totalValue) { itemHL = this.height; itemValueText = ""; }
				if (itemAccumValue + itemValue > totalValue) itemHH = this.height;
				var itemWL = this.radius * this.width / this.height * itemHL;
				var itemWH = this.radius * this.width / this.height * itemHH;

				// point 1
				points = String.Format("{0},{1} ", itemWL, this.height - itemHL);
				// point 2
				points += String.Format("{0},{1} ", itemWH, this.height - itemHH);
				// point 3
				points += String.Format("{0},{1} ", this.width - itemWH, this.height - itemHH);
				// point 4
				points += String.Format("{0},{1} ", this.width - itemWL, this.height - itemHL);


				textY = this.height - (itemHL + itemHH) / 2 + fontsize / 2 - topMargin / 2 + offset;
				if (this.textOption.lineAlignment === "top") {
					textY = this.height - itemHH + fontsize + offset;
				}
				else if (this.textOption.lineAlignment === "bottom") {
					textY = this.height - itemHL - topMargin + offset;
				}

				textX = this.width / 2;
				if (this.textOption.alignment === "left") {
					textX = (itemWL + itemWH) / 2 - topMargin;
					textAnchor = "end";

					textY = this.height - (itemHL + itemHH) / 2 + fontsize / 2 - topMargin / 2 + offset;
				}
				else if (this.textOption.alignment === "right") {
					textX = this.width - (itemWL + itemWH) / 2 + topMargin;
					textAnchor = "start";

					textY = this.height - (itemHL + itemHH) / 2 + fontsize / 2 - topMargin / 2 + offset;
				}
			}
			else if (this.artDirection === "bottom") {
				var itemHL = itemAccumValue / totalValue * this.height;
				var itemHH = (itemAccumValue + itemValue) / totalValue * this.height;
				if (itemAccumValue >= totalValue) { itemHL = this.height; itemValueText = ""; }
				if (itemAccumValue + itemValue > totalValue) itemHH = this.height;
				var itemWL = this.radius * this.width / this.height * itemHL;
				var itemWH = this.radius * this.width / this.height * itemHH;

				// point 1
				points = String.Format("{0},{1} ", itemWL, itemHL);
				// point 2
				points += String.Format("{0},{1} ", itemWH, itemHH);
				// point 3
				points += String.Format("{0},{1} ", this.width - itemWH, itemHH);
				// point 4
				points += String.Format("{0},{1} ", this.width - itemWL, itemHL);

				textY = (itemHL + itemHH) / 2 + fontsize / 2 - topMargin / 2 + offset;
				if (this.textOption.lineAlignment === "top") {
					textY = itemHL + fontsize + offset;
				}
				else if (this.textOption.lineAlignment === "bottom") {
					textY = itemHH - topMargin + offset;
				}

				textX = this.width / 2;
				if (this.textOption.alignment === "left") {
					textX = (itemWL + itemWH) / 2 - topMargin;
					textAnchor = "end";

					textY = (itemHL + itemHH) / 2 + fontsize / 2 - topMargin / 2 + offset;
				}
				else if (this.textOption.alignment === "right") {
					textX = this.width - (itemWL + itemWH) / 2 + topMargin;
					textAnchor = "start";

					textY = (itemHL + itemHH) / 2 + fontsize / 2 - topMargin / 2 + offset;
				}
			}

			// Change Item Rectangle
			rectobj.setAttribute("points", points);

			// Change Item text
			textobj.setAttribute("x", textX);
			textobj.setAttribute("text-anchor", textAnchor);

			spanobj.setAttribute("x", textX);
			spanobj.setAttribute("y", textY);
			spanobj.innerHTML = itemValueText;

			itemAccumValue += itemValue;
		}
	}

	page.createPyramidArtShape = function (arg) {
		var view = new PyramidArtView(arg);

		page.protoViews[arg.id] = view;
		view.setAngle(arg.angle);

		if (arg.limitValueTag != "") {
			var tag = scada.getTagByName(arg.limitValueTag);
			tag.addEventListener("change", function (event) {
				view.tagValueChanged(event);
			});
			view.limitTag = tag;
		}

		for (var i = 0; i < arg.items.length; i++) {
			var item = arg.items[i];

			var artItem = view.artItems[i];
			artItem.id = "pyramidItem" + i;

			if (item.tag != "") {
				var tag = scada.getTagByName(item.tag);
				tag.addEventListener("change", function (event) {
					view.tagValueChanged(event);
				});
				artItem.tag = tag;
			}
		}
		return view;
	}
})();


/////////////////////////////////////////////////////////////////////////////////////
// PieArtView
/////////////////////////////////////////////////////////////////////////////////////
(function () {
	function PieArtView(arg) {
		WidgetElement.call(this, arg);

		this._radius = arg.radius;
		this._radiusTag = arg.radiusTag;
		this._startAngle = arg.startAngle
		this._startAngleTag = arg.startAngleTag;
		this._endAngle = arg.endAngle;
		this._endAngleTag = arg.endAngleTag;
		this._sweepAngle = 0;

		this.artDirection = arg.direction;
		this.textOption = arg.text;
		this.limitValue = arg.limitValue;
		this.limitTag = arg.limitValueTag;
		this.artItems = arg.items;
	}
	PieArtView.prototype = Object.create(WidgetElement.prototype);
	PieArtView.prototype.constructor = PieArtView;

	PieArtView.prototype.setX = function (value) {
		$("#" + this._id).find("svg").attr("x", value);
		this._x = value;
		this.setAngle(this.getAngle());
	}

	PieArtView.prototype.setY = function (value) {
		$("#" + this._id).find("svg").attr("y", value);
		this._y = value;
		this.setAngle(this.getAngle());
	}

	PieArtView.prototype.setWidth = function (value) {
		$("#" + this._id).find("svg").attr("width", value);
		this._width = value;
		this.setAngle(this.getAngle());
		this.DrawArt();
	}
	PieArtView.prototype.setHeight = function (value, resize) {
		$("#" + this._id).find("svg").attr("height", value);
		this._height = value;
		this.setAngle(this.getAngle());
		this.DrawArt();
	}
	PieArtView.prototype.setBackgroundColor = function (value) {
		if (!value) value = "none";
		$("#path_" + this._id).css('fill', value);
		this._backgroundColor = value;
	}
	PieArtView.prototype.setOpacity = function (value) {
		// Set opacity for path shape
		var paths = $("#" + this._id).find("svg path");
		for (var i = 0; i < paths.length; i++) {
			var element = paths[i];
			element.setAttribute('fill-opacity', value);
			element.setAttribute('stroke-opacity', value);
		}
		// Set opacity for text value
		var texts = $("#" + this._id).find("svg text");
		for (var i = 0; i < texts.length; i++) {
			var element = texts[i];
			element.setAttribute('fill-opacity', value);
			element.setAttribute('stroke-opacity', value);
		}
		this._opacity = value;
	}
	PieArtView.prototype.setVisible = function (value) {
		var visibility = value == true ? "visible" : "hidden";
		var pVisible = page.parentNodeVisibility(this._id);
		if (pVisible != null && pVisible != "visible") {
			visibility = pVisible;
		}
		this._visible = value;

		$("#path_" + this._id).css('visibility', visibility);
		for (var i = 0; i < this.artItems.length; i++) {
			var pieitem = this.artItems[i];
			if (pieitem.visible)
				$("#path_" + this._id + "_Item" + i).css('visibility', visibility);

			if (pieitem.visible && this.textOption.enable)
				$("#text_" + this._id + "_Item" + i).css('visibility', visibility);
		}
	}
	PieArtView.prototype.setVisibleByGroup = function (value) {
		var visibility = "visible";
		if (value == false) {
			$("#" + this._id).css('visibility', "hidden");
			visibility = "hidden";
		} else {
			if (this._visible == true) {
				visibility = "visible";
			} else {
				visibility = "hidden";
			}
		}

		$("#path_" + this._id).css('visibility', visibility);
		for (var i = 0; i < this.artItems.length; i++) {
			var pieitem = this.artItems[i];
			if (pieitem.visible)
				$("#path_" + this._id + "_Item" + i).css('visibility', visibility);

			if (pieitem.visible && this.textOption.enable)
				$("#text_" + this._id + "_Item" + i).css('visibility', visibility);
		}
	}

	/// Tag change event handler
	PieArtView.prototype.tagValueChanged = function (e) {
		if (e.status == 0 || !this.nullText) {
			this.DrawArt();
		}
	}

	////////////////////////////////
	/// Get central point of ellipse
	////////////////////////////////
	PieArtView.prototype.getCentralPoint = function () {
		return {
			x: this._width / 2,
			y: this._height / 2
		};
	}

	////////////////////////////////
	/// Get big rectangle outside
	////////////////////////////////
	PieArtView.prototype.getBigRectangleRadius = function () {
		return {
			rx: this._width / 2,
			ry: this._height / 2
		}
	}

	////////////////////////////////
	/// Get small rectangle inside of ellipse
	////////////////////////////////
	PieArtView.prototype.getSmallRectangleRadius = function (percent) {
		if (percent == 100) {
			return {
				rx: 0,
				ry: 0
			};
		}

		var thickness = this._height * percent / 100;
		if (this._width < this._height) {
			thickness = this._width * percent / 100;
		}

		//console.log("Percent: " + percent + " Thickness: " + thickness);

		var smallrect = {
			rx: (this._width - thickness) / 2,
			ry: (this._height - thickness) / 2
		};

		return smallrect;

	}
	PieArtView.prototype.getRadius = function () {
		return this._radius;
	}
	PieArtView.prototype.setRadius = function (value) {
		this._radius = value;
		this.DrawArt();
	}
	PieArtView.prototype.getRadiusTag = function () {
		return this._radiusTag;
	}

	PieArtView.prototype.getStartAngle = function () {
		return parseFloat(this._startAngle);
	}

	PieArtView.prototype.setStartAngle = function (value) {
		var processval = parseFloat(value) % 360;
		if (processval < 0) {
			processval += 360;
		}
		this._startAngle = processval;
		this.updateSweepAngle();
		this.DrawArt();
	}

	PieArtView.prototype.getStartAngleTag = function () {
		return this._startAngleTag;
	}

	PieArtView.prototype.getSweepAngle = function () {
		return parseFloat(this._sweepAngle);
	}

	PieArtView.prototype.setSweepAngle = function (value) {
		this._sweepAngle = value;
	}

	PieArtView.prototype.updateSweepAngle = function () {
		var start = this.getStartAngle();
		var end = this.getEndAngle();

		var sweep = end - start;
		if (sweep < 0) {
			sweep += 360;
		}
		this.setSweepAngle(sweep);
	}

	PieArtView.prototype.getEndAngle = function () {
		return parseFloat(this._endAngle);
	}

	PieArtView.prototype.setEndAngle = function (value) {
		var processval = parseFloat(value) % 360;
		if (processval < 0) {
			processval += 360;
		}
		this._endAngle = processval;
		this.updateSweepAngle();
		this.DrawArt();
	}

	PieArtView.prototype.getEndAngleTag = function () {
		return this._endAngleTag;
	}

	////////////////////////////////////////////
	/// Re-Draw PieArtView
	////////////////////////////////////////////
	PieArtView.prototype.DrawArt = function () {
		var view = this;

		var radi = this.getRadius();
		//  console.log("radi: " , radi);

		var central = this.getCentralPoint();
		// console.log("central: " , central);

		var bigrect = this.getBigRectangleRadius();
		// console.log("rectangleRadius: ", bigrect);

		var smallrect = this.getSmallRectangleRadius(radi);
		// console.log("SmallRectangleRadius: ", smallrect);

		var startangle = this.getStartAngle();
		//  console.log("startangle: " + startangle);

		var sweepangle = this.getSweepAngle();
		//  console.log("sweepangle: " + sweepangle);

		var endangle = this.getEndAngle();
		//  console.log("endangle: " + endangle);
		if (endangle <= startangle) endangle += 360;
		sweepangle = endangle - startangle;

		// Draw the background
		view.DrawArc("path_" + this._id, radi, central, bigrect, smallrect, startangle, sweepangle);

		var totalValue = this.limitValue;
		if (this.limitValue == "NaN") {
			totalValue = 0;
			for (var i = 0; i < this.artItems.length; i++) {
				var item = this.artItems[i];
				if (item.tag != "")
					totalValue += item.tag.value;
				else
					totalValue += item.value;
			}
		}
		if (this.limitTag != "") {
			totalValue = this.limitTag.value;
		}

		if (totalValue <= 0) {
			for (var i = 0; i < this.artItems.length; i++) {
				var item = this.artItems[i];
				var itemID = this._id + "_Item" + i;
				document.getElementById("path_" + itemID).setAttribute("d", "");
				document.getElementById("tspan_" + itemID).innerHTML = "";
			}
			return;
		}

		var accumValue = 0;
		var accumAngle = 0;
		for (var i = 0; i < this.artItems.length; i++) {
			var item = this.artItems[i];
			var itemID = this._id + "_Item" + i;
			var pathID = "path_" + this._id + "_Item" + i;

			var itemValue = item.value;
			if (item.tag != "") itemValue = item.tag.value;
			if (itemValue > totalValue) itemValue = totalValue;
			else if (itemValue <= 0) {
				document.getElementById(pathID).setAttribute("d", "");
				view.DrawArcText(itemID, radi, central, bigrect, smallrect, itemStartAngle, itemDrawSweep, endangle, "");
				continue;
			}

			var itemSweepAngle = itemValue / totalValue * sweepangle;
			var itemStartAngle = startangle + accumAngle;

			try {
				var itemDrawSweep = itemSweepAngle;
				if (accumAngle >= endangle) {
					document.getElementById(pathID).setAttribute("d", "");
					view.DrawArcText(itemID, radi, central, bigrect, smallrect, itemStartAngle, itemDrawSweep, endangle, "");
					continue;
				}

				if (itemStartAngle >= endangle) {
					document.getElementById(pathID).setAttribute("d", "");
					view.DrawArcText(itemID, radi, central, bigrect, smallrect, itemStartAngle, itemDrawSweep, endangle, "");
					continue;
				}
				if (itemStartAngle + itemSweepAngle > endangle)
					itemDrawSweep = endangle - itemStartAngle;

				// Draw item shape
				view.DrawArc(pathID, radi, central, bigrect, smallrect, itemStartAngle, itemDrawSweep);

				// Draw text 
				var formatedText = page.valueByFormat(this.textOption.textFormat, itemValue);
				view.DrawArcText(itemID, radi, central, bigrect, smallrect, itemStartAngle, itemDrawSweep, endangle, formatedText);
			}
			finally {
				accumValue += itemValue;
				accumAngle += itemSweepAngle;
			}
		}
	}

	////////////////////////////////////////////
	/// Re-Draw PieArtView
	////////////////////////////////////////////
	PieArtView.prototype.DrawArc = function (arcID, radi, central, bigrect, smallrect, startangle, sweepangle) {
		var view = this;

		// console.log("========>  Re-Draw PieArtView");

		var points = view.PointsCalculation(bigrect, smallrect, central, startangle, sweepangle);
		// console.log("points: " , points);

		var data = "";
		if (radi == 0) {
			// console.log("RADIUS === 0");
			data = "M " + points.point1.x + "," + points.point1.y + " \n";
		} else if (radi == 100) {
			//console.log("RADIUS === 100");
			if (sweepangle == 0 || sweepangle == 360) {

				var point = this.getPointFromAngle(bigrect, startangle + 180);
				var bigx = central.x + point.x;
				var bigy = central.y - point.y;

				data = "M " + points.point1.x + "," + points.point1.y + " \n";
				data += "A " + bigrect.rx + "," + bigrect.ry + " 0 1 0 " + bigx + "," + bigy + " \n";
				data += "A " + bigrect.rx + "," + bigrect.ry + " 0 0 0 " + points.point1.x + "," + points.point1.y + " \n";
			} else {
				data = "M " + points.point1.x + "," + points.point1.y + " \n";
				if (sweepangle > 180) {
					data += "A " + bigrect.rx + "," + bigrect.ry + " 0 1 1 " + points.point2.x + " " + points.point2.y + " \n";
				} else {
					data += "A " + bigrect.rx + "," + bigrect.ry + " 0 0 1 " + points.point2.x + " " + points.point2.y + " \n";
				}
				data += "L " + points.point3.x + " " + points.point3.y + " \n";
				data += "L " + points.point4.x + " " + points.point4.y + " \n";
				data += "L " + points.point1.x + " " + points.point1.y + " \n";
			}


		} else if (bigrect.rx == 0 || bigrect.ry == 0 || smallrect.rx == 0 || smallrect.ry == 0) {
			//console.log("RECTANGLE == 0");
			data = "M " + points.point1.x + "," + points.point1.y + " \n";
		} else {
			if (sweepangle == 0 || sweepangle == 360) {
				data = "M " + points.point1.x + "," + points.point1.y + " \n";

				// Draw to middle Point 2
				var point = this.getPointFromAngle(bigrect, startangle + 180);
				var bigx = central.x + point.x;
				var bigy = central.y - point.y;
				data += "A " + bigrect.rx + "," + bigrect.ry + " 0 0 1 " + bigx + " " + bigy + " \n";

				// Draw to point 2
				data += "A " + bigrect.rx + "," + bigrect.ry + " 0 0 1 " + points.point2.x + " " + points.point2.y + " \n";

				// Draw to middle Point 3
				data += "M " + points.point3.x + "," + points.point3.y + " \n";
				var point = this.getPointFromAngle(smallrect, startangle + 180);
				var smallx = central.x + point.x;
				var smally = central.y - point.y;
				data += "A " + smallrect.rx + "," + smallrect.ry + " 0 0 0 " + smallx + " " + smally + " \n";

				// Draw to Point 3
				data += "A " + smallrect.rx + "," + smallrect.ry + " 0 0 0 " + points.point4.x + " " + points.point4.y + " \n";

			} else {
				// Start at Point 1
				data = "M " + points.point1.x + "," + points.point1.y + " \n";

				//console.log("points: ", points);
				//Draw Big BlockArc
				if (sweepangle > 180) {
					// If sweep angle larger than 180 => Draw from start angle to 180
					data += "A " + bigrect.rx + "," + bigrect.ry + " 0 1 1 " + points.point2.x + " " + points.point2.y + " \n";
				} else {
					// Draw to point 2
					data += "A " + bigrect.rx + "," + bigrect.ry + " 0 0 1 " + points.point2.x + " " + points.point2.y + " \n";
				}
				data += "L " + points.point3.x + " " + points.point3.y + " \n";

				// Draw Small BlockArc
				// back to Point 4
				if (sweepangle > 180) {
					// If sweep angle larger than 180 => Draw from start angle to 180
					data += "A " + smallrect.rx + "," + smallrect.ry + " 0 1 0 " + points.point4.x + " " + points.point4.y + " \n";
				} else {

					// Draw to Point 3
					data += "A " + smallrect.rx + "," + smallrect.ry + " 0 0 0 " + points.point4.x + " " + points.point4.y + " \n";
				}

				data += "L " + points.point1.x + " " + points.point1.y + " \n";
			}
		}
		data += "z";

		// console.log("d=" + data) 
		document.getElementById(arcID).setAttribute("d", data);
	}

	////////////////////////////////////////////
	/// Re-Draw Text PieArtView
	////////////////////////////////////////////
	PieArtView.prototype.DrawArcText = function (itemID, radi, central, bigrect, smallrect, startangle, sweepangle, endangle, textValue) {

		var textobj = document.getElementById("text_" + itemID);
		var spanobj = document.getElementById("tspan_" + itemID);
		var midRect = {
			rx: 0,
			ry: 0
		}

		var halftheta = startangle + sweepangle / 2;
		if (halftheta > endangle) halftheta = startangle + (endangle - startangle) / 2;

		const compStyles = window.getComputedStyle(textobj);
		var fontsize = parseInt(compStyles.getPropertyValue('font-size'));
		if (radi == 0) {
			spanobj.innerHTML = "";
		} else if (radi == 100) {
			midRect.rx = bigrect.rx / 2;
			midRect.ry = bigrect.ry / 2;
			var midPoint = this.getPointFromAngle(midRect, 360 - halftheta);
			textobj.setAttribute("x", central.x + midPoint.x);
			spanobj.setAttribute("x", central.x + midPoint.x);
			spanobj.setAttribute("y", central.y + midPoint.y + fontsize / 2);
			spanobj.innerHTML = textValue;
		} else {
			midRect.rx = (bigrect.rx + smallrect.rx) / 2;
			midRect.ry = (bigrect.ry + smallrect.ry) / 2;
			var midPoint = this.getPointFromAngle(midRect, 360 - halftheta);
			textobj.setAttribute("x", central.x + midPoint.x);
			spanobj.setAttribute("x", central.x + midPoint.x);
			spanobj.setAttribute("y", central.y + midPoint.y + fontsize / 2);
			spanobj.innerHTML = textValue;
		}
	}

	////////////////////////////////
	/// get a point on ellipse when input a angle and rectangle of ellipse
	////////////////////////////////
	PieArtView.prototype.getPointFromAngle = function (rect, originangle) {
		originangle = originangle >= 0 ? originangle % 360 : 360 + originangle % 360;
		var angle = 360 - originangle % 360;
		var angleRadian = angle * Math.PI / 180.0;
		// Alternative method by using polar coordinate formular
		// var radi = rect.rx * rect.ry / Math.sqrt( (rect.ry * Math.cos(angleRadian)) * (rect.ry * Math.cos(angleRadian))  + (rect.rx * Math.sin(angleRadian)) * (rect.rx * Math.sin(angleRadian)));
		// console.log("radi: " + radi);
		// var tmpx = radi * Math.cos(angleRadian);
		// var tmpy = radi * Math.sin(angleRadian);
		// console.log("tmpx: " + tmpx + " tmpy: " + tmpy);

		var num = Math.sqrt(rect.rx * rect.rx * Math.tan(angleRadian) * Math.tan(angleRadian) + rect.ry * rect.ry);
		var x = num == 0 ? 0 : (rect.rx * rect.ry) / num;
		var y = num == 0 ? 0 : (rect.rx * rect.ry * Math.tan(angleRadian)) / num;

		if (isNaN(x)) {
			x = 0;
		}
		if (isNaN(y)) {
			y = 0;
		}

		if (90 == angle) {
			return {
				x: 0,
				y: y
			};
		} else if (angle == 270) {
			return {
				x: 0,
				y: -y
			};
		} else if (90 < angle && angle < 270) {
			return {
				x: -x,
				y: -y
			};
		} else {
			return {
				x: x,
				y: y
			};
		}
	}
	////////////////////////////////
	/// Calculate 4 point of block ar which given by big rectangle outside and small rectangle inside
	////////////////////////////////
	PieArtView.prototype.PointsCalculation = function (bigrect, smallrect, central, startangle, sweepangle) {
		// console.log("PointsCalculation");
		// var central = this.getCentralPoint();
		// console.log("central: ", central);

		// var startangle = this.getStartAngle();
		// console.log("startangle: " + startangle);

		// var sweepangle = this.getSweepAngle();
		// console.log("sweepangle: " + sweepangle);

		var endangle = parseFloat((startangle + sweepangle) % 360);

		var p1 = this.getPointFromAngle(bigrect, startangle);
		var point1 = {
			x: central.x + p1.x,
			y: central.y - p1.y
		}

		var p2 = this.getPointFromAngle(bigrect, endangle);
		var point2 = {

			x: central.x + p2.x,
			y: central.y - p2.y
		}

		var p3 = this.getPointFromAngle(smallrect, endangle);
		var point3 = {
			x: central.x + p3.x,
			y: central.y - p3.y
		}

		var p4 = this.getPointFromAngle(smallrect, startangle);
		var point4 = {
			x: central.x + p4.x,
			y: central.y - p4.y
		}
		return {
			point1: point1,
			point2: point2,
			point3: point3,
			point4: point4
		};
	}
	////////////////////////////////
	/// Create PieArt shape
	////////////////////////////////
	page.createPieArtShape = function (arg) {
		var view = new PieArtView(arg);
		view.updateSweepAngle();

		page.protoViews[arg.id] = view;
		view.setAngle(arg.angle);

		if (arg.limitValueTag != "") {
			var tag = scada.getTagByName(arg.limitValueTag);
			tag.addEventListener("change", function (event) {
				view.tagValueChanged(event);
			});
			view.limitTag = tag;
		}

		for (var i = 0; i < arg.items.length; i++) {
			var item = arg.items[i];

			var artItem = view.artItems[i];
			artItem.id = "pieItem" + i;

			if (item.tag != "") {
				var tag = scada.getTagByName(item.tag);
				tag.addEventListener("change", function (event) {
					view.tagValueChanged(event);
				});
				artItem.tag = tag;
			}
		}
		view.DrawArt();
		return view;
	}
})();