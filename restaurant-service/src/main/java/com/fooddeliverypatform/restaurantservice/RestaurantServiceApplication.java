package com.fooddeliverypatform.restaurantservice;

import com.fooddeliverypatform.restaurantservice.model.Menu;
import com.fooddeliverypatform.restaurantservice.model.MenuItem;
import com.fooddeliverypatform.restaurantservice.model.Restaurant;
import com.fooddeliverypatform.restaurantservice.repository.MenuItemRepository;
import com.fooddeliverypatform.restaurantservice.repository.MenuRepository;
import com.fooddeliverypatform.restaurantservice.repository.RestaurantRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class RestaurantServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestaurantServiceApplication.class, args);
	}
	@Bean
	CommandLineRunner run(RestaurantRepository restaurantRepo,
						  MenuRepository menuRepo,
						  MenuItemRepository menuItemRepo) {
		return args -> {

			// ----- Create Restaurant -----
			Restaurant restaurant = new Restaurant();
			restaurant.setName("Pizza Planet");
			restaurant.setAddress("123 Main Street");
			restaurant.setPhoneNumber("0600000000");
			restaurant.setEmail("planet@pizza.com");
			restaurant.setDescription("Best pizza in town");

			// ----- Create Menu -----
			Menu pizzaMenu = new Menu();
			pizzaMenu.setName("Pizza Menu");
			pizzaMenu.setDescription("All our pizzas");
			pizzaMenu.setRestaurant(restaurant);

			restaurant.getMenus().add(pizzaMenu);

			// ----- Create Menu Items -----
			MenuItem item1 = new MenuItem();
			item1.setName("Margherita");
			item1.setDescription("Tomato, mozzarella, basil");
			item1.setPrice(50);
			item1.setMenu(pizzaMenu);

			MenuItem item2 = new MenuItem();
			item2.setName("Pepperoni");
			item2.setDescription("Pepperoni, cheese");
			item2.setPrice(60);
			item2.setMenu(pizzaMenu);

			pizzaMenu.getMenuItems().add(item1);
			pizzaMenu.getMenuItems().add(item2);

			// ----- Save everything -----
			restaurantRepo.save(restaurant);

			System.out.println("Sample restaurant, menu and items added!");

		};
	}
}

