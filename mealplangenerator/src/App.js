import React from "react";
import "./App.css";

import axios from "axios";

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			time: "day",
			calories: 2000,
			diet: null,
			exclude: null,
			submitted: false,
			day: {
				nutrients: {},
				meals: {}
			},
			week: {
				monday: {
					nutrients: {},
					meals: {}
				},
				tuesday: {
					nutrients: {},
					meals: {}
				},
				wednesday: {
					nutrients: {},
					meals: {}
				},
				thursday: {
					nutrients: {},
					meals: {}
				},
				friday: {
					nutrients: {},
					meals: {}
				},
				saturday: {
					nutrients: {},
					meals: {}
				},
				sunday: {
					nutrients: {},
					meals: {}
				}
			}
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		this.setState({ submitted: true });

		axios
			.get(
				`https://api.spoonacular.com/mealplanner/generate?apiKey=${process.env.REACT_APP_API_KEY}`,
				{
					params: {
						timeFrame: this.state.time,
						targetCalories: this.state.calories,
						diet: this.state.diet,
						exclude: this.state.exclude
					}
				}
			)
			.then((res) => {
				if (this.state.time === "day") {
					this.setState({
						day: res.data
					});
				} else {
					this.setState({ week: res.data.week });
				}
				document
					.getElementById("plan")
					.scrollIntoView({ behavior: "smooth" });
			})
			.catch((err) => {
				console.log("ERROR ==>", err);
			});
	}

	dayMeal() {
		try {
			let meal = Object.values(this.state.day)[0];
			return meal.map((child) => {
				return (
					<div>
						<a href={child.sourceUrl}>
							<h2>{child.title}</h2>
							<p>Ready in {child.readyInMinutes} minutes</p>
							<p>Serves {child.servings} people</p>
						</a>
					</div>
				);
			});
		} catch (err) {}
	}

	dayNut() {
		try {
			let nut = Object.values(this.state.day)[1];
			if (Object.values(this.state.day)[0].length !== undefined) {
				return (
					<div>
						<p>{nut.calories} Calories</p>
						<p>{nut.carbohydrates} Carbohydrates</p>
						<p>{nut.fat} Fat</p>
						<p>{nut.protein} Protein</p>
					</div>
				);
			}
		} catch (err) {}
	}

	weekMeal() {
		try {
			let days = Object.values(this.state.week);
			return days.map((day) => {
				return day.meals.map((child) => {
					return (
						<div>
							<a href={child.sourceUrl}>
								<h2>{child.title}</h2>
								<p>Ready in {child.readyInMinutes} minutes</p>
								<p>Serves {child.servings} people</p>
								<p>{day.nutrients.calories} Calories</p>
								<p>
									{day.nutrients.carbohydrates} Carbohydrates
								</p>
								<p>{day.nutrients.fat} Fat</p>
								<p>{day.nutrients.protein} Protein</p>
							</a>
						</div>
					);
				});
			});
		} catch (err) {}
	}

	render() {

		// console.log("STATE ==>", this.state.week);
		// console.log("DSS", Object.values(this.state.week));

		// console.log("STSATe", Object.values(this.state.day)[0]);
		// console.log("wrk", Object.keys(this.state.day.nutrients).length)

		return (
			<div className="App">
				<div className="circleApp">
					<div className="styleDropdown">
						<span className="dropdown">
							<form onSubmit={this.handleSubmit}>
								<div className="time" id="time">
									<select
										value={this.state.time}
										onChange={(event) =>
											this.setState({
												time: event.target.value
											})
										}
									>
										<option value="day">1 Day</option>
										<option value="week">
											1 Full Week
										</option>
									</select>
								</div>
								<div className="cal">
									<input
										type="number"
										id="calories"
										onChange={(event) =>
											this.setState({
												calories: event.target.value
											})
										}
										placeholder="Calories"
									/>
								</div>
								<div className="diet">
									<select
										placeholder="Diet Restrictions"
										onChange={(event) =>
											this.setState({
												diet: event.target.value
											})
										}
									>
										<option value="null">
											No Diet Restrictions
										</option>
										<option value="gluten free">
											Gluten Free
										</option>
										<option value="ketogenic">
											Ketogenic
										</option>
										<option value="vegetarian">
											Vegetarian
										</option>
										<option value="lacto-vegetarian">
											Lacto-Vegetarian
										</option>
										<option value="ovo-vegetarian">
											Ovo-Vegetarian
										</option>
										<option value="vegan">Vegan</option>
										<option value="pescetarian">
											Pescetarian
										</option>
										<option value="primal">Primal</option>
										<option value="whole30">Whole30</option>
									</select>
								</div>
								<div className="exclude">
									<input
										type="string"
										id="exclude"
										onChange={(event) =>
											this.setState({
												exclude: event.target.value
											})
										}
										placeholder="Exclude"
									/>
								</div>
								<button type="submit">Generate Meal</button>
							</form>
						</span>
					</div>
				</div>
				<div className="planContainer" id="plan">
					<div className="plan">
						{Object.values(this.state.week.monday)[0].length !==
						undefined ? (
							<div className="week">
								<div>
									{this.weekMeal()}
								</div>
							</div>
						) : (
							<div className="day">
								{this.dayMeal()}
								{this.dayNut()}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default App;
