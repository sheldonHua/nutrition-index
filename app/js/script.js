var app = {};

app.key = 'a6bb05d3c2ee035be37486ffa23ee061';
app.id = '49ee0fd8';
app.nutri = {
	calories: [],
	fat: [],
	cholesterol: [],
	sugars: [],
	sodium: []
};

app.ajaxCall = function(searchTerm){
	var nutritionApi = $.ajax({
		url: `https://api.nutritionix.com/v1_1/search/${searchTerm}?results=0:50&fields=brand_name,nf_calories,nf_total_fat,nf_cholesterol,nf_sugars,nf_sodium,item_name,brand_id`,
		type: 'GET',
		dataType: 'json',
		data:{
			appKey: app.key,
			appId: app.id,
			format: 'json',
		},
		success: function(data){
			app.displayData(data.hits);
		}
	});	
}

app.displayData = function(foods){
	var foodList = foods.map(function(food){
			var foodHTML = `
				<div class="food">
					<div class="inner">
						<p class="food-name">${food.fields.item_name}</p>
						<p class="food-brand">${food.fields.brand_name}</p>
						<p>Calories: <span class="calories">${food.fields.nf_calories}</span></p>
						<p>Fat: <span class="fat">${food.fields.nf_total_fat}</span></p>
						<p>Cholesterol: <span class="cholesterol">${food.fields.nf_cholesterol}</span></p>
						<p>Sugars: <span class="sugars">${food.fields.nf_sugars}</span></p>
						<p>Sodium: <span class="sodium">${food.fields.nf_sodium}</span></p>
					</div>
				</div>
			`;
			return foodHTML;
		}).join(' ');


	$('.food-container .foodCall').html(foodList);
}

app.totalNutrients = function(nutri, selector){
	var sumOfNutrients = nutri
	.reduce(function(total, nutrient){
		return total + nutrient;
	}, 0);

	$(selector).html(sumOfNutrients);

}

app.parseData = function(dataSelected, nutriType){
	var data = dataSelected;

	if (data === 'null'){
		data = 0;
		return Math.round((parseFloat(data)* 10) / 10);
	}
	else{
		return Math.round((parseFloat(data)* 10) / 10);
	}

}

app.init = function(){
	$('form').on('submit', function(event){
		event.preventDefault();
		var value = $(this).children('[name=search]').val();
		app.ajaxCall(value);	
	});

	$('.foodCall').on('click', '.food', function(){
		var $this = $(this);

		app.nutri.calories.push(app.parseData($this.find('.calories').text()));
		app.nutri.fat.push(app.parseData($this.find('.fat').text()));
		app.nutri.cholesterol.push(app.parseData($this.find('.cholesterol').text()));
		app.nutri.sugars.push(app.parseData($this.find('.sugars').text()));
		app.nutri.sodium.push(app.parseData($this.find('.sodium ').text()));

		app.totalNutrients(app.nutri.calories, '.calories h1');
		app.totalNutrients(app.nutri.fat, '.fat h1');
		app.totalNutrients(app.nutri.cholesterol, '.cholesterol h1');
		app.totalNutrients(app.nutri.sugars, '.sugars h1');
		app.totalNutrients(app.nutri.sodium, '.sodium h1');

		$(this).children('.inner').addClass('selected').delay(200).queue(function(next){
			$(this).removeClass('selected');
			next();
		});

	});

	$('.reset').on('click', function(){
		app.nutri.calories = 0;
		app.nutri.fat = 0;
		app.nutri.cholesterol = 0;
		app.nutri.sugars = 0;
		app.nutri.sodium = 0;

		$('.nutri h1').html("0");

	});
}

$(function(){
	app.init();
});