"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

gsap.registerPlugin(ScrollTrigger);

const MENU_CATEGORIES = [
  "All", "Soups", "Salads", "Bar Bites", "Tandoor", "Raahi Favourites",
  "Classics & Raahi Classics", "Coastal Specials", "Chefs Special", "Naati Specials",
  "New Specials", "Shared Plates", "Pasta", "Pizza", "Continental", "Chinese",
  "Indian Curries", "Sandwiches & Burgers", "Rice & Breads", "Desserts",
  "Draught Beer", "Bottled Beer", "Classic Cocktails", "Signature Cocktails",
  "Signature LIIT", "Signature Sangrias", "Mocktails", "Shooters", "Vodka",
  "Gin", "Rum", "Brandy", "Tequila", "Irish / Bourbon / Tennessee",
  "Blended Scotch", "Single Malt Whiskey", "Premium Scotch", "Wine", "Breezer", "Beverages"
];

const MASTER_PUB_MENU = [
  { id: 101, name: "Cream Of Spinach Soup", price: 220, category: "Soups", description: "Rich and creamy classic spinach soup.", is_available: true },
  { id: 102, name: "Cream Of Tomato Soup", price: 220, category: "Soups", description: "Velvety smooth garden tomato soup.", is_available: true },
  { id: 103, name: "Manchow Soup Veg / Chicken", price: 240, category: "Soups", description: "Spicy dark soy broth topped with crispy noodles.", is_available: true },
  { id: 104, name: "Hot And Sour Soup Veg / Chicken", price: 240, category: "Soups", description: "Classic hot and tangy Sichuan style soup.", is_available: true },
  { id: 105, name: "Sweet Corn Soup Veg / Chicken", price: 240, category: "Soups", description: "Comforting sweet corn broth with tender kernels.", is_available: true },
  { id: 110, name: "Green Salad / Cucumber Salad", price: 170, category: "Salads", description: "Fresh crisp garden vegetables and sliced cucumbers.", is_available: true },
  { id: 111, name: "Caesar Salad (Veg / Chicken)", price: 345, category: "Salads", description: "Romaine lettuce, parmesan, croutons, and classic dressing.", is_available: true },
  { id: 112, name: "Grilled Chicken Salad", price: 345, category: "Salads", description: "Juicy sliced grilled chicken over fresh greens.", is_available: true },
  { id: 113, name: "Watermelon Feta Salad", price: 335, category: "Salads", description: "Refreshing cubed watermelon with crumbled feta and mint.", is_available: true },
  { id: 120, name: "Sandige / Papad", price: 130, category: "Bar Bites", description: "Traditional crispy accompaniment.", is_available: true },
  { id: 121, name: "Masala Papad", price: 160, category: "Bar Bites", description: "Crispy papad topped with spicy onion-tomato masala.", is_available: true },
  { id: 122, name: "Peanut Masala", price: 180, category: "Bar Bites", description: "Crunchy peanuts tossed with onions, tomatoes, and spices.", is_available: true },
  { id: 123, name: "Peri Peri Bhutta", price: 180, category: "Bar Bites", description: "Spicy fire-roasted corn seasoned with peri peri.", is_available: true },
  { id: 124, name: "Cashew Fry", price: 220, category: "Bar Bites", description: "Golden fried cashew nuts tossed in spices.", is_available: true },
  { id: 125, name: "French Fries (Plain / Peri Peri / Cheese)", price: 270, category: "Bar Bites", description: "Crispy potato fries with choice of seasoning.", is_available: true },
  { id: 126, name: "Cheese Garlic Bread", price: 250, category: "Bar Bites", description: "Toasted baguette loaded with garlic butter and melted cheese.", is_available: true },
  { id: 127, name: "Cheese Cherry Pineapple", price: 265, category: "Bar Bites", description: "Classic party skewers.", is_available: true },
  { id: 128, name: "Cheesy Jalapeno Poppers", price: 330, category: "Bar Bites", description: "Crispy breaded poppers stuffed with molten cheese and jalapenos.", is_available: true },
  { id: 129, name: "Mexican Veg Nachos", price: 290, category: "Bar Bites", description: "Tortilla chips loaded with salsa, beans, and melted cheese.", is_available: true },
  { id: 130, name: "Mexican Grilled Chicken Nachos", price: 350, category: "Bar Bites", description: "Loaded nachos topped with spiced grilled chicken.", is_available: true },
  { id: 131, name: "Crispy Onion Rings", price: 250, category: "Bar Bites", description: "Golden battered onion rings with dip.", is_available: true },
  { id: 132, name: "Potato Basket", price: 335, category: "Bar Bites", description: "Assorted potato fries and wedges.", is_available: true },
  { id: 140, name: "Veg Seekh Kabab", price: 315, category: "Tandoor", description: "Minced vegetable skewers grilled in clay oven.", is_available: true },
  { id: 141, name: "Tandoori Malai Broccoli", price: 345, category: "Tandoor", description: "Creamy marinated broccoli florets charred to perfection.", is_available: true },
  { id: 142, name: "Malai Paneer Tikka", price: 380, category: "Tandoor", description: "Melt-in-mouth cottage cheese in rich cream marinade.", is_available: true },
  { id: 143, name: "Stuffed Mushroom Tikka", price: 380, category: "Tandoor", description: "Mushrooms stuffed with paneer and spices, tandoor grilled.", is_available: true },
  { id: 144, name: "Stuffed Paneer Tikka", price: 390, category: "Tandoor", description: "Paneer layers filled with mint chutney paste.", is_available: true },
  { id: 145, name: "Murgh Seekh Kabab", price: 400, category: "Tandoor", description: "Spiced minced chicken skewers.", is_available: true },
  { id: 146, name: "Kalmi Kabab (2 pcs)", price: 295, category: "Tandoor", description: "Juicy tandoori chicken drumsticks.", is_available: true },
  { id: 147, name: "Murgh Malai Kabab", price: 400, category: "Tandoor", description: "Creamy cheese and garlic marinated chicken kebabs.", is_available: true },
  { id: 148, name: "Murgh Sholay / Sultani Kabab", price: 400, category: "Tandoor", description: "Chef special spicy charcoal-grilled chicken.", is_available: true },
  { id: 149, name: "Mutton Seekh Kabab", price: 490, category: "Tandoor", description: "Tender spiced minced lamb skewers.", is_available: true },
  { id: 150, name: "Mutton Gilafi Seekh Kabab", price: 490, category: "Tandoor", description: "Mutton seekh coated with colourful bell peppers.", is_available: true },
  { id: 151, name: "Fish Tikka", price: 400, category: "Tandoor", description: "Basa chunks marinated in tandoori spices and smoked.", is_available: true },
  { id: 152, name: "Tandoori Chicken (Half / Full)", price: 800, category: "Tandoor", description: "The ultimate classic bone-in tandoori chicken.", is_available: true },
  { id: 153, name: "Tandoori Prawns", price: 550, category: "Tandoor", description: "Jumbo prawns grilled with tandoori spices.", is_available: true },
  { id: 154, name: "Tandoori Pomfret", price: 750, category: "Tandoor", description: "Whole pomfret marinated and roasted.", is_available: true },
  { id: 160, name: "Cheesy Veg Fingers", price: 295, category: "Raahi Favourites", description: "Crispy breaded fingers packed with molten cheese.", is_available: true },
  { id: 161, name: "Mushroom Kodiyala", price: 355, category: "Raahi Favourites", description: "Signature Mangalorean style spiced mushrooms.", is_available: true },
  { id: 162, name: "Mongolian Paneer", price: 360, category: "Raahi Favourites", description: "Tossed in spicy sweet Mongolian glaze.", is_available: true },
  { id: 163, name: "Raahi Special Chicken", price: 380, category: "Raahi Favourites", description: "Our legendary house special spicy chicken starter.", is_available: true },
  { id: 164, name: "White Horse Special Chicken", price: 380, category: "Raahi Favourites", description: "Pub favorite succulent chicken preparation.", is_available: true },
  { id: 165, name: "Old Style Chilli Chicken", price: 380, category: "Raahi Favourites", description: "Old-school spicy green chili chicken stir-fry.", is_available: true },
  { id: 166, name: "Chicken Kodiyala", price: 450, category: "Raahi Favourites", description: "Coastal style spicy chicken tossed with curry leaves.", is_available: true },
  { id: 167, name: "Crunchy Chicken", price: 390, category: "Raahi Favourites", description: "Super crispy batter-fried chicken bites.", is_available: true },
  { id: 168, name: "Butter Garlic Prawns", price: 550, category: "Raahi Favourites", description: "Juicy prawns tossed in rich garlic butter sauce.", is_available: true },
  { id: 169, name: "Chicken Wings (Plain / Peri Peri / Crispy Fried)", price: 360, category: "Raahi Favourites", description: "Juicy chicken wings with choice of coating.", is_available: true },
  { id: 170, name: "Mutton Fry", price: 490, category: "Raahi Favourites", description: "Tender mutton pieces dry-roasted with coastal spices.", is_available: true },
  { id: 171, name: "Mutton Nalli", price: 660, category: "Raahi Favourites", description: "Slow-cooked succulent mutton bone marrow preparation.", is_available: true },
  { id: 172, name: "Egg Burji Pav", price: 290, category: "Raahi Favourites", description: "Spicy scrambled eggs served with buttered pav.", is_available: true },
  { id: 173, name: "Mutton Keema Pav", price: 410, category: "Raahi Favourites", description: "Rich spiced minced lamb served with toasted pav.", is_available: true },
  { id: 180, name: "Gobi Manchurian", price: 310, category: "Classics & Raahi Classics", description: "Crispy cauliflower florets in tangy soy-garlic sauce.", is_available: true },
  { id: 181, name: "Gobi Chilli", price: 310, category: "Classics & Raahi Classics", description: "Spicy tossed cauliflower with peppers and chilies.", is_available: true },
  { id: 182, name: "Egg Manchurian", price: 310, category: "Classics & Raahi Classics", description: "Crispy fried boiled egg quarters in manchurian sauce.", is_available: true },
  { id: 183, name: "Egg Chilli", price: 310, category: "Classics & Raahi Classics", description: "Spicy stir-fried eggs.", is_available: true },
  { id: 184, name: "Egg Ghee Roast", price: 310, category: "Classics & Raahi Classics", description: "Rich Mangalorean ghee roast masala tossed with eggs.", is_available: true },
  { id: 185, name: "Egg Pepper Dry", price: 310, category: "Classics & Raahi Classics", description: "Crushed black pepper and curry leaf spiced eggs.", is_available: true },
  { id: 186, name: "Mixed Veg Pudina", price: 330, category: "Classics & Raahi Classics", description: "Crispy mixed veggies tossed in mint gravy.", is_available: true },
  { id: 187, name: "Hara Bhara Kabab", price: 330, category: "Classics & Raahi Classics", description: "Spinach and green pea patties.", is_available: true },
  { id: 188, name: "Raahi Special Veg", price: 330, category: "Classics & Raahi Classics", description: "Chef's signature vegetable starter.", is_available: true },
  { id: 189, name: "Mushroom Manchurian", price: 340, category: "Classics & Raahi Classics", description: "Batter-fried button mushrooms in manchurian gravy.", is_available: true },
  { id: 190, name: "Mushroom Pepper Dry", price: 340, category: "Classics & Raahi Classics", description: "Pepper spiced dry mushrooms.", is_available: true },
  { id: 191, name: "Mushroom Chilli", price: 340, category: "Classics & Raahi Classics", description: "Stir-fried mushrooms with bell peppers and green chilies.", is_available: true },
  { id: 192, name: "Baby Corn Pepper Dry", price: 340, category: "Classics & Raahi Classics", description: "Crispy baby corn tossed in black pepper.", is_available: true },
  { id: 193, name: "Baby Corn Chilli", price: 340, category: "Classics & Raahi Classics", description: "Spicy baby corn stir-fry.", is_available: true },
  { id: 194, name: "Baby Corn Manchurian", price: 340, category: "Classics & Raahi Classics", description: "Crispy baby corn in Manchurian sauce.", is_available: true },
  { id: 195, name: "Baby Corn Golden Fried", price: 340, category: "Classics & Raahi Classics", description: "Crispy batter-fried golden baby corn.", is_available: true },
  { id: 196, name: "Tandoori Mushroom", price: 360, category: "Classics & Raahi Classics", description: "Spiced tandoori stuffed mushrooms.", is_available: true },
  { id: 197, name: "Paneer Tikka", price: 360, category: "Classics & Raahi Classics", description: "Classic tandoori paneer cubes.", is_available: true },
  { id: 198, name: "Paneer Chilli", price: 360, category: "Classics & Raahi Classics", description: "Stir-fried paneer in spicy chili sauce.", is_available: true },
  { id: 199, name: "Paneer Manchurian", price: 360, category: "Classics & Raahi Classics", description: "Paneer in savory Manchurian sauce.", is_available: true },
  { id: 200, name: "Paneer Chatpata", price: 360, category: "Classics & Raahi Classics", description: "Tangy and spicy paneer cubes.", is_available: true },
  { id: 201, name: "French Paneer", price: 360, category: "Classics & Raahi Classics", description: "Special french-style spiced paneer preparation.", is_available: true },
  { id: 202, name: "Dragon Paneer", price: 360, category: "Classics & Raahi Classics", description: "Spicy sweet dragon style paneer.", is_available: true },
  { id: 203, name: "French Chicken", price: 360, category: "Classics & Raahi Classics", description: "Crispy fried chicken tossed in French sauce.", is_available: true },
  { id: 204, name: "Popcorn Chicken", price: 360, category: "Classics & Raahi Classics", description: "Bite-sized crispy fried chicken popcorn.", is_available: true },
  { id: 205, name: "Chicken Tikka", price: 380, category: "Classics & Raahi Classics", description: "Classic grilled chicken tikka.", is_available: true },
  { id: 206, name: "Chilli Chicken", price: 380, category: "Classics & Raahi Classics", description: "The quintessential pub spicy chicken chilli.", is_available: true },
  { id: 207, name: "Chicken Ghee Roast", price: 390, category: "Classics & Raahi Classics", description: "Rich Mangalorean spiced ghee roast chicken.", is_available: true },
  { id: 208, name: "Dragon Chicken", price: 380, category: "Classics & Raahi Classics", description: "Crispy chicken in sweet & spicy dragon sauce.", is_available: true },
  { id: 209, name: "Lemon Chicken", price: 380, category: "Classics & Raahi Classics", description: "Tangy lemon-glazed chicken bites.", is_available: true },
  { id: 210, name: "Chicken Pepper Dry", price: 380, category: "Classics & Raahi Classics", description: "Crushed pepper and onion tossed chicken.", is_available: true },
  { id: 211, name: "Oil Fry Kabab", price: 360, category: "Classics & Raahi Classics", description: "Deep-fried local style chicken kababs.", is_available: true },
  { id: 212, name: "Murgh Hari Mirch Kabab", price: 380, category: "Classics & Raahi Classics", description: "Spicy green chili marinated chicken.", is_available: true },
  { id: 213, name: "Chicken 65", price: 380, category: "Classics & Raahi Classics", description: "South Indian style deep-fried spiced chicken.", is_available: true },
  { id: 214, name: "Murgh Lasooni Tikka", price: 380, category: "Classics & Raahi Classics", description: "Garlic-forward tandoori chicken tikka.", is_available: true },
  { id: 215, name: "Chicken Manchurian", price: 380, category: "Classics & Raahi Classics", description: "Classic chicken Manchurian.", is_available: true },
  { id: 216, name: "Murgh Tukda Kabab", price: 450, category: "Classics & Raahi Classics", description: "Crispy chunk chicken fry.", is_available: true },
  { id: 217, name: "Squid Rings", price: 450, category: "Classics & Raahi Classics", description: "Crispy fried calamari rings.", is_available: true },
  { id: 218, name: "Fish Fingers", price: 450, category: "Classics & Raahi Classics", description: "Crispy crumb-fried fish fingers with tartare sauce.", is_available: true },
  { id: 219, name: "Fish Chilli", price: 400, category: "Classics & Raahi Classics", description: "Spicy stir-fried fish cubes.", is_available: true },
  { id: 220, name: "Fish Kabab", price: 400, category: "Classics & Raahi Classics", description: "Classic coastal fish kabab.", is_available: true },
  { id: 221, name: "Prawns Ghee Roast", price: 490, category: "Classics & Raahi Classics", description: "Prawns tossed in rich ghee roast masala.", is_available: true },
  { id: 222, name: "Prawns Koliwada", price: 490, category: "Classics & Raahi Classics", description: "Crispy batter-fried spicy prawns.", is_available: true },
  { id: 223, name: "Golden Fried Prawns", price: 490, category: "Classics & Raahi Classics", description: "Panko-crusted crispy prawns.", is_available: true },
  { id: 224, name: "Mutton Pepper Dry", price: 490, category: "Classics & Raahi Classics", description: "Tender mutton dry roasted with black pepper.", is_available: true },
  { id: 230, name: "Neer Dosa", price: 95, category: "Coastal Specials", description: "Lacey delicate soft rice crepes.", is_available: true },
  { id: 231, name: "Paneer / Mushroom Ghee Roast", price: 345, category: "Coastal Specials", description: "Rich spice and ghee tossed paneer or mushrooms.", is_available: true },
  { id: 232, name: "Egg Masala Fry", price: 310, category: "Coastal Specials", description: "Spiced masala coated fried eggs.", is_available: true },
  { id: 233, name: "Chicken Sukka", price: 380, category: "Coastal Specials", description: "Mangalorean style dry coconut chicken masala.", is_available: true },
  { id: 234, name: "Mangalore Style Chicken Gassi", price: 380, category: "Coastal Specials", description: "Traditional coastal chicken curry with roasted spices.", is_available: true },
  { id: 235, name: "Bangada (Tawa / Rava / Masala Fry)", price: 400, category: "Coastal Specials", description: "Fresh mackerel prepared in coastal style.", is_available: true },
  { id: 236, name: "Prawns (Tawa / Rava / Masala Fry)", price: 450, category: "Coastal Specials", description: "Fresh prawns with coastal seasoning.", is_available: true },
  { id: 237, name: "Anjal (Tawa / Rava / Masala Fry)", price: 550, category: "Coastal Specials", description: "Kingfish steak cooked to perfection.", is_available: true },
  { id: 238, name: "Pomfret (Tawa / Rava / Masala Fry)", price: 650, category: "Coastal Specials", description: "Whole pomfret fried with coastal spices.", is_available: true },
  { id: 240, name: "Curry Leaf Mushroom", price: 345, category: "Chefs Special", description: "Mushrooms tossed in fragrant fresh curry leaf paste.", is_available: true },
  { id: 241, name: "Dragon Baby Corn", price: 345, category: "Chefs Special", description: "Spicy sweet dragon baby corn.", is_available: true },
  { id: 242, name: "Cheese Corn Ball", price: 400, category: "Chefs Special", description: "Crispy cheesy golden corn spheres.", is_available: true },
  { id: 243, name: "Mushroom O'Reilly", price: 370, category: "Chefs Special", description: "Chef special stuffed mushrooms.", is_available: true },
  { id: 244, name: "BBQ Chicken Wings", price: 360, category: "Chefs Special", description: "Smoky barbecue glazed chicken wings.", is_available: true },
  { id: 245, name: "Chicken Hot Pepper Dry", price: 380, category: "Chefs Special", description: "Extremely spicy hot chili pepper chicken.", is_available: true },
  { id: 246, name: "Crispy Spinach Chicken", price: 380, category: "Chefs Special", description: "Chicken tossed with crisp seasoned spinach leaves.", is_available: true },
  { id: 247, name: "Chicken Lollipop", price: 380, category: "Chefs Special", description: "Classic spicy drummettes.", is_available: true },
  { id: 248, name: "Chicken Lollipop Special", price: 390, category: "Chefs Special", description: "Chef special coated chicken lollipops.", is_available: true },
  { id: 250, name: "Tandoori Veg Platter", price: 500, category: "Shared Plates", description: "Assorted tandoori paneer, vegetables, and kebabs.", is_available: true },
  { id: 251, name: "Tandoori Chicken Platter", price: 800, category: "Shared Plates", description: "Assorted tandoori chicken varieties.", is_available: true },
  { id: 252, name: "Mixed Non Veg Platter", price: 1155, category: "Shared Plates", description: "Ultimate platter of chicken, mutton, and fish kebabs.", is_available: true },
  { id: 253, name: "Seafood Platter", price: 1250, category: "Shared Plates", description: "Selection of coastal fish and prawns.", is_available: true },
  { id: 260, name: "Chicken Green Chutney Masala", price: 380, category: "Naati Specials", description: "Country style chicken cooked in green herb paste.", is_available: true },
  { id: 261, name: "Chicken Cashew Pepper", price: 380, category: "Naati Specials", description: "Naati style chicken with roasted cashews and pepper.", is_available: true },
  { id: 262, name: "Naati Style Chicken Donne Biryani", price: 390, category: "Naati Specials", description: "Authentic short-grain fragrant donne biryani with country chicken.", is_available: true },
  { id: 263, name: "Naati Style Mutton Donne Biryani", price: 490, category: "Naati Specials", description: "Traditional flavorful tender mutton donne biryani.", is_available: true },
  { id: 270, name: "Grilled Stuffed Mushrooms", price: 360, category: "New Specials", description: "Char-grilled mushrooms stuffed with herbs and cheese.", is_available: true },
  { id: 271, name: "Beer-Battered Fish Nuggets", price: 390, category: "New Specials", description: "Crisp beer-battered fish bites with dip.", is_available: true },
  { id: 272, name: "Prawn Popcorn", price: 330, category: "New Specials", description: "Bite-sized crispy fried popcorn prawns.", is_available: true },
  { id: 273, name: "Palak Patta Chaat", price: 330, category: "New Specials", description: "Crispy fried spinach leaves topped with yogurt, tamarind, and chutneys.", is_available: true },
  { id: 274, name: "Chilli Crispy Lotus Stem", price: 330, category: "New Specials", description: "Honey chili glazed crispy lotus stems.", is_available: true },
  { id: 275, name: "Thai Green Tikka Bites", price: 380, category: "New Specials", description: "Fusion chicken tikka infused with Thai green curry flavors.", is_available: true },
  { id: 276, name: "Bangalore Fried Chicken", price: 350, category: "New Specials", description: "Local style spicy street-style fried chicken.", is_available: true },
  { id: 280, name: "Alfredo Pasta (Veg / Chicken)", price: 420, category: "Pasta", description: "Rich and creamy parmesan white sauce pasta.", is_available: true },
  { id: 281, name: "Arrabbiata Pasta (Veg / Chicken)", price: 420, category: "Pasta", description: "Spicy garlic tomato herb sauce.", is_available: true },
  { id: 282, name: "Parma Rosa Sauce Pasta (Veg / Chicken)", price: 420, category: "Pasta", description: "Blended creamy tomato and white sauce.", is_available: true },
  { id: 283, name: "Pesto Pasta (Veg / Chicken)", price: 420, category: "Pasta", description: "Fresh basil, garlic, pine nut, and parmesan pesto.", is_available: true },
  { id: 284, name: "Aglio e Olio (Veg / Chicken)", price: 420, category: "Pasta", description: "Olive oil, garlic, chili flakes, and parsley.", is_available: true },
  { id: 290, name: "Classic Margherita Pizza", price: 380, category: "Pizza", description: "Mozzarella, fresh basil, and tomato sauce.", is_available: true },
  { id: 291, name: "Exotic Veg Farmer Pizza", price: 400, category: "Pizza", description: "Loaded with bell peppers, olives, corn, and mushrooms.", is_available: true },
  { id: 292, name: "Paneer Tikka Pizza", price: 400, category: "Pizza", description: "Tandoori paneer chunks, onions, and capsicum.", is_available: true },
  { id: 293, name: "Tex Mex Pizza", price: 400, category: "Pizza", description: "Jalapenos, sweet corn, beans, and spicy salsa.", is_available: true },
  { id: 294, name: "Tandoori Chicken Tikka", price: 450, category: "Pizza", description: "Smoky tandoori chicken chunks and onions.", is_available: true },
  { id: 295, name: "Peri Peri Chicken Pizza", price: 450, category: "Pizza", description: "Spicy peri peri chicken toppings.", is_available: true },
  { id: 296, name: "BBQ Chicken Pizza", price: 450, category: "Pizza", description: "Barbecue chicken, onions, and smoked cheese.", is_available: true },
  { id: 297, name: "Raahi's Loaded Meat Pizza", price: 470, category: "Pizza", description: "Loaded with chicken, mutton chunks, and sausage.", is_available: true },
  { id: 300, name: "Veg Stroganoff", price: 360, category: "Continental", description: "Sautéed vegetables in creamy mushroom paprika sauce with rice.", is_available: true },
  { id: 301, name: "Pasta Ravioli in Pesto Sauce", price: 360, category: "Continental", description: "Filled ravioli pasta tossed in rich basil pesto.", is_available: true },
  { id: 302, name: "Grilled Chicken Steak", price: 400, category: "Continental", description: "Juicy chicken breast served with mash and pepper sauce.", is_available: true },
  { id: 303, name: "Grilled Chicken with Red Wine Mushroom Sauce", price: 400, category: "Continental", description: "Tender grilled chicken in rich red wine mushroom reduction.", is_available: true },
  { id: 310, name: "Nasi Goreng", price: 395, category: "Chinese", description: "Indonesian fried rice served with satay and fried egg.", is_available: true },
  { id: 311, name: "Thai Green Curry (Veg / Chicken / Prawn)", price: 430, category: "Chinese", description: "Fragrant coconut green curry with steamed rice.", is_available: true },
  { id: 312, name: "Thai Red Curry (Veg / Chicken / Prawn)", price: 430, category: "Chinese", description: "Spicy coconut red curry with steamed rice.", is_available: true },
  { id: 313, name: "Masaman Curry (Veg / Chicken)", price: 390, category: "Chinese", description: "Rich southern Thai curry with peanuts and potatoes.", is_available: true },
  { id: 314, name: "Laksa (Veg / Chicken / Prawn)", price: 380, category: "Chinese", description: "Spicy coconut noodle soup.", is_available: true },
  { id: 315, name: "Fried Rice (Veg / Egg / Chicken / Prawn)", price: 345, category: "Chinese", description: "Classic wok-tossed fried rice.", is_available: true },
  { id: 316, name: "Hakka Noodles (Veg / Egg / Chicken / Prawn)", price: 315, category: "Chinese", description: "Wok-tossed noodles with crunchy vegetables.", is_available: true },
  { id: 317, name: "Schezwan Fried Rice (Veg / Egg / Chicken / Prawn)", price: 355, category: "Chinese", description: "Spicy Schezwan wok-tossed rice.", is_available: true },
  { id: 330, name: "Dal Fry", price: 210, category: "Indian Curries", description: "Yellow lentils tempered with garlic and cumin.", is_available: true },
  { id: 331, name: "Dal Makhani", price: 280, category: "Indian Curries", description: "Overnight simmered creamy black lentils.", is_available: true },
  { id: 332, name: "Tomato Kaju Masala", price: 295, category: "Indian Curries", description: "Cashews simmered in rich tomato gravy.", is_available: true },
  { id: 333, name: "Veg Kolhapuri", price: 325, category: "Indian Curries", description: "Spicy Maharashtrian mixed vegetable curry.", is_available: true },
  { id: 334, name: "Veg Hyderabadi", price: 325, category: "Indian Curries", description: "Vegetables in rich spinach and yogurt gravy.", is_available: true },
  { id: 335, name: "Mushroom Masala", price: 345, category: "Indian Curries", description: "Mushrooms in onion tomato masala.", is_available: true },
  { id: 336, name: "Paneer Butter Masala", price: 370, category: "Indian Curries", description: "Cottage cheese in velvety tomato makhani gravy.", is_available: true },
  { id: 337, name: "Paneer Tikka Masala", price: 390, category: "Indian Curries", description: "Tandoori paneer tikka in spiced gravy.", is_available: true },
  { id: 338, name: "Palak Paneer", price: 370, category: "Indian Curries", description: "Cottage cheese cubes in smooth seasoned spinach puree.", is_available: true },
  { id: 339, name: "Diwani Handi", price: 370, category: "Indian Curries", description: "Rich mixed vegetable and dry fruit handi curry.", is_available: true },
  { id: 340, name: "Butter Chicken", price: 390, category: "Indian Curries", description: "Tender tandoori chicken in rich velvety tomato gravy.", is_available: true },
  { id: 341, name: "Chicken Kolhapuri", price: 390, category: "Indian Curries", description: "Fiery spiced Kolhapuri chicken curry.", is_available: true },
  { id: 342, name: "Chicken Hyderabadi", price: 390, category: "Indian Curries", description: "Chicken cooked in vibrant green herb gravy.", is_available: true },
  { id: 343, name: "Chicken Kadai", price: 390, category: "Indian Curries", description: "Wok-cooked chicken with bell peppers and whole spices.", is_available: true },
  { id: 344, name: "Ginger Chicken", price: 390, category: "Indian Curries", description: "Chicken gravy flavored with fresh julienned ginger.", is_available: true },
  { id: 345, name: "Mutton Rogan Josh", price: 520, category: "Indian Curries", description: "Kashmiri slow-braised tender lamb curry.", is_available: true },
  { id: 360, name: "American Cheese Corn Sandwich", price: 310, category: "Sandwiches & Burgers", description: "Loaded with sweet corn and melted cheese.", is_available: true },
  { id: 361, name: "Veg Club Sandwich", price: 320, category: "Sandwiches & Burgers", description: "Triple-decker vegetable and cheese sandwich.", is_available: true },
  { id: 362, name: "Chicken Club Sandwich", price: 370, category: "Sandwiches & Burgers", description: "Triple-decker chicken, egg, and lettuce club.", is_available: true },
  { id: 363, name: "Classic Grilled Chicken Sandwich", price: 340, category: "Sandwiches & Burgers", description: "Juicy grilled chicken breast with lettuce and mayo.", is_available: true },
  { id: 364, name: "Turkish Style Lamb Sliders", price: 490, category: "Sandwiches & Burgers", description: "Spiced minced lamb mini burgers.", is_available: true },
  { id: 365, name: "Farm Cheese Slider", price: 380, category: "Sandwiches & Burgers", description: "Crispy cheese patty sliders.", is_available: true },
  { id: 366, name: "Pulled Chicken Slider", price: 380, category: "Sandwiches & Burgers", description: "Slow-cooked BBQ pulled chicken mini burgers.", is_available: true },
  { id: 380, name: "Phulka", price: 65, category: "Rice & Breads", description: "Soft puffed wheat bread.", is_available: true },
  { id: 381, name: "Roti / Butter Roti", price: 75, category: "Rice & Breads", description: "Whole wheat tandoori roti.", is_available: true },
  { id: 382, name: "Kulcha / Butter Kulcha", price: 95, category: "Rice & Breads", description: "Soft leavened bread.", is_available: true },
  { id: 383, name: "Curd Rice", price: 200, category: "Rice & Breads", description: "South Indian comfort tempered yogurt rice.", is_available: true },
  { id: 384, name: "Ghee Rice", price: 240, category: "Rice & Breads", description: "Aromatic basmati rice tempered in ghee.", is_available: true },
  { id: 385, name: "Jeera Rice", price: 240, category: "Rice & Breads", description: "Cumin tempered basmati rice.", is_available: true },
  { id: 386, name: "Dal Khichdi", price: 265, category: "Rice & Breads", description: "Lentil and rice comfort porridge.", is_available: true },
  { id: 387, name: "Palak Rice", price: 265, category: "Rice & Breads", description: "Spinach seasoned rice.", is_available: true },
  { id: 388, name: "Veg Biryani", price: 300, category: "Rice & Breads", description: "Layered aromatic vegetable biryani.", is_available: true },
  { id: 389, name: "Egg Biryani", price: 325, category: "Rice & Breads", description: "Spiced biryani with boiled eggs.", is_available: true },
  { id: 390, name: "Chicken Biryani", price: 390, category: "Rice & Breads", description: "Slow-cooked dum chicken biryani.", is_available: true },
  { id: 391, name: "Mutton Biryani", price: 490, category: "Rice & Breads", description: "Tender lamb layered aromatic biryani.", is_available: true },
  { id: 392, name: "Naan / Butter Naan / Butter Garlic Naan / Cheese Garlic Naan", price: 115, category: "Rice & Breads", description: "Choice of tandoori naan.", is_available: true },
  { id: 410, name: "Chocolate & Walnut Brownie", price: 145, category: "Desserts", description: "Fudgy brownie packed with crunchy walnuts.", is_available: true },
  { id: 411, name: "New York Baked Cheesecake", price: 260, category: "Desserts", description: "Rich and creamy baked vanilla cheesecake.", is_available: true },
  { id: 412, name: "Chocolate Walnut Brownie With Ice Cream", price: 195, category: "Desserts", description: "Served warm with a scoop of vanilla ice cream.", is_available: true },
  { id: 413, name: "Gulab Jamun With Ice Cream", price: 195, category: "Desserts", description: "Warm dumplings with vanilla ice cream.", is_available: true },
  { id: 414, name: "Blueberry / Strawberry Cheesecake", price: 260, category: "Desserts", description: "Baked cheesecake topped with fruit compote.", is_available: true },
  { id: 415, name: "Gulab Jamun (2 pcs)", price: 145, category: "Desserts", description: "Classic syrupy milk-solid dumplings.", is_available: true },
  { id: 500, name: "Kingfisher Premium (Draught)", price: 830, category: "Draught Beer", description: "Tap / Pint / Pitcher options available.", is_available: true },
  { id: 501, name: "Kingfisher Ultra (Draught)", price: 1010, category: "Draught Beer", description: "Smooth premium draft beer.", is_available: true },
  { id: 502, name: "Budweiser Premium (Draught)", price: 1040, category: "Draught Beer", description: "Crisp American style lager on tap.", is_available: true },
  { id: 503, name: "Budweiser Magnum (Draught)", price: 1105, category: "Draught Beer", description: "Strong premium draft.", is_available: true },
  { id: 504, name: "Hoegaarden (Draught)", price: 1420, category: "Draught Beer", description: "Belgian white wheat beer on tap.", is_available: true },
  { id: 505, name: "Toit Tint-In-Wit (Draught)", price: 1040, category: "Draught Beer", description: "Craft witbier on tap.", is_available: true },
  { id: 506, name: "Toit Hefeweizen (Draught)", price: 1040, category: "Draught Beer", description: "German style wheat craft beer.", is_available: true },
  { id: 510, name: "Kingfisher Premium (Bottle)", price: 230, category: "Bottled Beer", description: "330ml bottle.", is_available: true },
  { id: 511, name: "Kingfisher Ultra (Bottle)", price: 275, category: "Bottled Beer", description: "330ml bottle.", is_available: true },
  { id: 512, name: "Amstel Grande (Bottle)", price: 250, category: "Bottled Beer", description: "330ml bottle.", is_available: true },
  { id: 513, name: "Heineken Silver (Bottle)", price: 295, category: "Bottled Beer", description: "330ml bottle.", is_available: true },
  { id: 514, name: "Carlsberg Smooth (Bottle)", price: 275, category: "Bottled Beer", description: "330ml bottle.", is_available: true },
  { id: 515, name: "Tuborg Strong (Bottle)", price: 265, category: "Bottled Beer", description: "330ml bottle.", is_available: true },
  { id: 516, name: "Budweiser Premium (Bottle)", price: 305, category: "Bottled Beer", description: "330ml bottle.", is_available: true },
  { id: 517, name: "Budweiser Magnum (Bottle)", price: 325, category: "Bottled Beer", description: "330ml bottle.", is_available: true },
  { id: 518, name: "Hoegaarden (Bottle)", price: 330, category: "Bottled Beer", description: "330ml bottle.", is_available: true },
  { id: 519, name: "Hoegaarden Rosee (Bottle)", price: 330, category: "Bottled Beer", description: "330ml bottle.", is_available: true },
  { id: 520, name: "Hoegaarden Nectarine (Bottle)", price: 330, category: "Bottled Beer", description: "330ml bottle.", is_available: true },
  { id: 521, name: "Corona (Bottle)", price: 390, category: "Bottled Beer", description: "330ml bottle with lime.", is_available: true },
  { id: 530, name: "Picante de la Casa", price: 685, category: "Classic Cocktails", description: "Tequila, Coriander, Red Chilli, Sweet & Sour Mix.", is_available: true },
  { id: 531, name: "Paloma", price: 685, category: "Classic Cocktails", description: "Tequila, Grapefruit, Sea salt, Sweet & Sour Mix.", is_available: true },
  { id: 532, name: "Cosmopolitan", price: 620, category: "Classic Cocktails", description: "Vodka, Cranberry Juice, Lime Juice, Triple Sec.", is_available: true },
  { id: 533, name: "Espresso Martini", price: 620, category: "Classic Cocktails", description: "Vodka, Espresso, Sweet & Sour Mix.", is_available: true },
  { id: 534, name: "Screwdriver", price: 620, category: "Classic Cocktails", description: "Vodka, Lime, Orange Juice.", is_available: true },
  { id: 535, name: "Martini", price: 515, category: "Classic Cocktails", description: "Gin, Martini Bianco.", is_available: true },
  { id: 536, name: "Gimlet", price: 515, category: "Classic Cocktails", description: "Gin, Lime Cordial, Sour Mix.", is_available: true },
  { id: 537, name: "Piña Colada", price: 515, category: "Classic Cocktails", description: "White Rum, Pineapple, Coconut, Fresh Cream.", is_available: true },
  { id: 538, name: "Bloody Mary", price: 620, category: "Classic Cocktails", description: "Vodka, Tomato Juice, Lime Juice, Worcestershire Sauce & Tabasco.", is_available: true },
  { id: 539, name: "Hot Toddy", price: 370, category: "Classic Cocktails", description: "Brandy, Indian Spices, Honey, Hot water.", is_available: true },
  { id: 540, name: "Margarita", price: 620, category: "Classic Cocktails", description: "Tequila, Lime Juice, Triplesec.", is_available: true },
  { id: 541, name: "Whisky Sour", price: 620, category: "Classic Cocktails", description: "Whisky, Egg White, Sweet and Sour Mix.", is_available: true },
  { id: 542, name: "Mojito", price: 515, category: "Classic Cocktails", description: "White Rum, Mint, Sweet & Sour Mix, Club Soda.", is_available: true },
  { id: 543, name: "Daiquiri", price: 515, category: "Classic Cocktails", description: "White Rum, Sweet & Sour Mix.", is_available: true },
  { id: 544, name: "Red / White Sangria", price: 410, category: "Classic Cocktails", description: "Wine based fruit pitcher.", is_available: true },
  { id: 545, name: "Long Island Ice Tea", price: 630, category: "Classic Cocktails", description: "Classic multi-spirit powerhouse cocktail.", is_available: true },
  { id: 550, name: "Raahi G&T", price: 620, category: "Signature Cocktails", description: "Gin, Star Anise, Cloves, Cinnamon, Cardamom, Fresh Cucumber, Elderflower Syrup, Lime Juice, Tonic Water.", is_available: true },
  { id: 551, name: "Citrus Dream", price: 620, category: "Signature Cocktails", description: "Gin, Triple Sec, Sweet & Sour, Fresh Grapefruit Juice.", is_available: true },
  { id: 552, name: "Berry Basil Smash", price: 580, category: "Signature Cocktails", description: "Scotch, Sour Mix, Mixed Berry Syrup, Basil Leaves, Vegan Foam.", is_available: true },
  { id: 553, name: "This is our Picante", price: 620, category: "Signature Cocktails", description: "Tequila, Triple Sec, Fresh Pineapple Juice, Sour Mix, Jalapeno Brine & Chunks, Cilantro.", is_available: true },
  { id: 554, name: "Watermelon & Jalapeno G&T", price: 580, category: "Signature Cocktails", description: "Gin, Jalapeno, Watermelon, Mint & Tonic Water.", is_available: true },
  { id: 555, name: "Tropical Fizz", price: 515, category: "Signature Cocktails", description: "White Rum, Coconut Syrup, Passion Fruit Syrup, Fresh Pineapple Juice, Orange Juice, Sparkling Water.", is_available: true },
  { id: 556, name: "Lavender Spritz", price: 515, category: "Signature Cocktails", description: "London Dry Gin, Citric, Lavender Syrup, Sparkling Water.", is_available: true },
  { id: 557, name: "Passionate Collins", price: 620, category: "Signature Cocktails", description: "Vodka, Passion Fruit Puree, Lychee Juice, Sour Mix, Sage Leaves, Sparkling Water.", is_available: true },
  { id: 558, name: "Cucumber Mint Cooler", price: 515, category: "Signature Cocktails", description: "London Dry Gin, Fresh Cucumber Juice, Fresh Mint Leaves, Sweet & Sour Mix.", is_available: true },
  { id: 559, name: "Booze in a Shell", price: 830, category: "Signature Cocktails", description: "Vodka, Elderflower Syrup, Coconut Water, Coconut Syrup, Sour Mix, Kingfisher Premium.", is_available: true },
  { id: 560, name: "Brass Monkey", price: 470, category: "Signature Cocktails", description: "Dark Rum, Fresh Pineapple & Indian spice syrup, Coconut Water.", is_available: true },
  { id: 561, name: "Pineapple Rummy", price: 490, category: "Signature Cocktails", description: "White Rum, Fresh Pineapple, Curry Leaves, Lime Juice, Spiced Pineapple Cubes.", is_available: true },
  { id: 562, name: "Velvet Sunset", price: 580, category: "Signature Cocktails", description: "Gin, Red Wine Reduction, Fresh Watermelon, Sour Mix.", is_available: true },
  { id: 563, name: "Scarlet Bloom", price: 620, category: "Signature Cocktails", description: "Tequila, Cranberry Rosemary Reduction, Sour Mix.", is_available: true },
  { id: 570, name: "Bokka Vishesha!", price: 729, category: "Signature LIIT", description: "Vodka, Gin, White Rum, Tequila, Kokum Syrup, Coconut Water.", is_available: true },
  { id: 571, name: "Smashed & How", price: 729, category: "Signature LIIT", description: "Vodka, Gin, White Rum, Tequila, Raspberry, Basil, Soda.", is_available: true },
  { id: 572, name: "With Love, Raahi!", price: 729, category: "Signature LIIT", description: "Vodka, Gin, White Rum, Tequila, Butterfly Pea Tea, Sprite.", is_available: true },
  { id: 573, name: "High! How Are You?", price: 729, category: "Signature LIIT", description: "Vodka, Gin, White Rum, Tequila, Chamomile, Sprite.", is_available: true },
  { id: 580, name: "Candied Apple Sangria", price: 419, category: "Signature Sangrias", description: "White Wine, Green Apple, Caramel, Vodka, Soda.", is_available: true },
  { id: 581, name: "Peachy Pom Sangria", price: 419, category: "Signature Sangrias", description: "White Wine, Peach, Lime, Apple, Vodka, Soda.", is_available: true },
  { id: 582, name: "Citrus Wave Sangria", price: 419, category: "Signature Sangrias", description: "White Wine, Triple Sec, Orange, Lime, Orange, Vodka, Soda.", is_available: true },
  { id: 583, name: "Berry Breeze Sangria", price: 419, category: "Signature Sangrias", description: "White Wine, Strawberry, Lime, Vodka, Soda.", is_available: true },
  { id: 584, name: "Crimson Spice Sangria", price: 419, category: "Signature Sangrias", description: "Red Wine, Passion Fruit, Apple, Orange, Lime, Brandy, Indian Spices, Soda.", is_available: true },
  { id: 585, name: "Rustic Plum Sangria", price: 419, category: "Signature Sangrias", description: "Red Wine, Plum, Thyme, Lime, Brandy.", is_available: true },
  { id: 590, name: "Peach Bull", price: 250, category: "Mocktails", description: "Peach & Strawberry Syrup, Lemonade, Red Bull.", is_available: true },
  { id: 591, name: "Paris Summer", price: 250, category: "Mocktails", description: "Grape Juice, Lavender Cordial, Berry & Tea Soda.", is_available: true },
  { id: 592, name: "Cream Scotch Soda", price: 250, category: "Mocktails", description: "Butterscotch Cream, topped with soda.", is_available: true },
  { id: 593, name: "Mango Boom", price: 250, category: "Mocktails", description: "Mango Crush, Mango Juice, Fresh Cream.", is_available: true },
  { id: 594, name: "Ice Tea", price: 250, category: "Mocktails", description: "Peach / Passion Fruit / Lemon / Strawberry / Mango.", is_available: true },
  { id: 595, name: "Reviver", price: 250, category: "Mocktails", description: "Fresh Watermelon, Mint Leaves, Orange Juice, Apple Juice.", is_available: true },
  { id: 596, name: "Blue Sky", price: 250, category: "Mocktails", description: "Ginger Ale, Lime Juice, Blue Curacao.", is_available: true },
  { id: 597, name: "Oreo Shake", price: 250, category: "Mocktails", description: "Rich blended Oreo milkshake.", is_available: true },
  { id: 598, name: "Virgin Mojito", price: 250, category: "Mocktails", description: "Mint, Lime, Sugar, Sprite.", is_available: true },
  { id: 599, name: "Virgin Piña Colada", price: 250, category: "Mocktails", description: "Pineapple, Coconut, Fresh Cream.", is_available: true },
  { id: 600, name: "Virgin Guava Mary", price: 250, category: "Mocktails", description: "Spiced guava juice blend.", is_available: true },
  { id: 610, name: "Jägermeister Ice Cold", price: 475, category: "Shooters", description: "Chilled herbal shot.", is_available: true },
  { id: 611, name: "Bailey's Irish Cream", price: 420, category: "Shooters", description: "Smooth creamy liqueur shot.", is_available: true },
  { id: 612, name: "Xenta Absenta", price: 650, category: "Shooters", description: "Strong absinthe shot.", is_available: true },
  { id: 613, name: "Sambuca", price: 300, category: "Shooters", description: "Anise-flavored liqueur shot.", is_available: true },
  { id: 614, name: "Amarula", price: 580, category: "Shooters", description: "Marula fruit cream liqueur.", is_available: true },
  { id: 615, name: "Kahlua", price: 400, category: "Shooters", description: "Coffee liqueur shot.", is_available: true },
  { id: 616, name: "Fireball", price: 225, category: "Shooters", description: "Cinnamon whisky shot.", is_available: true },
  { id: 617, name: "Kamikaze", price: 290, category: "Shooters", description: "Vodka, triple sec, lime juice.", is_available: true },
  { id: 618, name: "Brain Hemorrhage", price: 425, category: "Shooters", description: "Layered schnapps and Irish cream.", is_available: true },
  { id: 619, name: "B-52", price: 495, category: "Shooters", description: "Kahlua, Bailey's, Grand Marnier layered shot.", is_available: true },
  { id: 620, name: "Jäger Beer Boom", price: 580, category: "Shooters", description: "Jager drop in beer.", is_available: true },
  { id: 621, name: "Jäger Energy", price: 580, category: "Shooters", description: "Jägermeister with Red Bull.", is_available: true },
  { id: 622, name: "Flaming Lamborghini Tower", price: 1299, category: "Shooters", description: "Multi-tiered flaming shot tower.", is_available: true },
  { id: 630, name: "Smirnoff", price: 195, category: "Vodka", description: "Classic clean vodka shot.", is_available: true },
  { id: 631, name: "Smirnoff Minty Jamun / Mango Mirchi / Zesty Lime", price: 195, category: "Vodka", description: "Flavored Smirnoff variants.", is_available: true },
  { id: 632, name: "Ketel One", price: 275, category: "Vodka", description: "Dutch crafted premium vodka.", is_available: true },
  { id: 633, name: "Absolut & Flavours", price: 295, category: "Vodka", description: "Swedish premium vodka.", is_available: true },
  { id: 634, name: "Ciroc", price: 400, category: "Vodka", description: "French grape-distilled luxury vodka.", is_available: true },
  { id: 635, name: "Grey Goose", price: 430, category: "Vodka", description: "Ultra-premium French wheat vodka.", is_available: true },
  { id: 640, name: "Greater Than Gin", price: 170, category: "Gin", description: "Indian craft gin.", is_available: true },
  { id: 641, name: "Bombay Sapphire", price: 275, category: "Gin", description: "London dry premium gin.", is_available: true },
  { id: 642, name: "Tanqueray Gin", price: 295, category: "Gin", description: "Classic London dry.", is_available: true },
  { id: 643, name: "Hapusa", price: 295, category: "Gin", description: "Himalayan dry craft gin.", is_available: true },
  { id: 644, name: "Beefeater", price: 295, category: "Gin", description: "London dry gin.", is_available: true },
  { id: 645, name: "Hendrick's", price: 460, category: "Gin", description: "Infused with cucumber and rose petal.", is_available: true },
  { id: 646, name: "Roku", price: 515, category: "Gin", description: "Japanese botanical craft gin.", is_available: true },
  { id: 647, name: "Tanqueray No. 10", price: 525, category: "Gin", description: "Small-batch ultra premium gin.", is_available: true },
  { id: 648, name: "Monkey 47", price: 620, category: "Gin", description: "Black Forest German dry gin.", is_available: true },
  { id: 650, name: "Old Monk", price: 125, category: "Rum", description: "Legendary Indian dark rum.", is_available: true },
  { id: 651, name: "Bacardi White", price: 195, category: "Rum", description: "Light Puerto Rican rum.", is_available: true },
  { id: 652, name: "Bacardi Flavours", price: 195, category: "Rum", description: "Flavored white rum.", is_available: true },
  { id: 653, name: "Amrut Two Indies", price: 195, category: "Rum", description: "Craft rum from Amrut.", is_available: true },
  { id: 660, name: "Mansion House", price: 150, category: "Brandy", description: "Classic French-style brandy.", is_available: true },
  { id: 661, name: "Morpheus", price: 220, category: "Brandy", description: "Premium blended brandy.", is_available: true },
  { id: 662, name: "Hennessy VS", price: 590, category: "Brandy", description: "Cognac Very Special.", is_available: true },
  { id: 663, name: "Hennessy VSOP", price: 895, category: "Brandy", description: "Cognac Very Superior Old Pale.", is_available: true },
  { id: 670, name: "Don Angel Silver", price: 305, category: "Tequila", description: "Classic tequila shot.", is_available: true },
  { id: 671, name: "Camino Gold / Silver", price: 305, category: "Tequila", description: "Traditional Mexican tequila.", is_available: true },
  { id: 672, name: "Maya Pistola Joven", price: 305, category: "Tequila", description: "Indian craft agave spirit.", is_available: true },
  { id: 673, name: "Jose Cuervo Silver", price: 335, category: "Tequila", description: "World-renowned tequila.", is_available: true },
  { id: 674, name: "Don Julio Blanco", price: 495, category: "Tequila", description: "100% blue agave tequila.", is_available: true },
  { id: 675, name: "Maya Pistola Reposado", price: 515, category: "Tequila", description: "Aged Indian agave spirit.", is_available: true },
  { id: 676, name: "Patron Silver", price: 620, category: "Tequila", description: "Ultra-premium tequila.", is_available: true },
  { id: 677, name: "Patron Reposado", price: 685, category: "Tequila", description: "Aged ultra-premium tequila.", is_available: true },
  { id: 678, name: "Don Julio Reposado", price: 695, category: "Tequila", description: "Aged blue agave luxury tequila.", is_available: true },
  { id: 690, name: "Jim Beam", price: 265, category: "Irish / Bourbon / Tennessee", description: "Kentucky straight bourbon.", is_available: true },
  { id: 691, name: "Jameson Irish", price: 305, category: "Irish / Bourbon / Tennessee", description: "Smooth triple-distilled Irish whiskey.", is_available: true },
  { id: 692, name: "Jack Daniel's", price: 370, category: "Irish / Bourbon / Tennessee", description: "Tennessee whiskey.", is_available: true },
  { id: 693, name: "Jack Daniel's (Fire/Apple/Honey)", price: 370, category: "Irish / Bourbon / Tennessee", description: "Flavored Tennessee whiskey.", is_available: true },
  { id: 694, name: "Jim Beam Black", price: 355, category: "Irish / Bourbon / Tennessee", description: "Extra-aged bourbon.", is_available: true },
  { id: 695, name: "Maker's Mark", price: 475, category: "Irish / Bourbon / Tennessee", description: "Handcrafted bourbon whisky.", is_available: true },
  { id: 696, name: "Woodford Reserve", price: 515, category: "Irish / Bourbon / Tennessee", description: "Kentucky straight bourbon.", is_available: true },
  { id: 697, name: "Jack Daniel's Single Barrel", price: 620, category: "Irish / Bourbon / Tennessee", description: "Single barrel select Tennessee whiskey.", is_available: true },
  { id: 700, name: "Johnnie Walker Blonde", price: 225, category: "Blended Scotch", description: "Light and fruity scotch blend.", is_available: true },
  { id: 701, name: "Royal Ranthambore", price: 225, category: "Blended Scotch", description: "Royal Indian blended whisky.", is_available: true },
  { id: 702, name: "Dewar's White Label", price: 225, category: "Blended Scotch", description: "Double-aged blended Scotch.", is_available: true },
  { id: 703, name: "100 Pipers", price: 225, category: "Blended Scotch", description: "Smooth blended Scotch.", is_available: true },
  { id: 704, name: "Black & White", price: 225, category: "Blended Scotch", description: "Classic blended Scotch whisky.", is_available: true },
  { id: 705, name: "Black Dog Centenary", price: 225, category: "Blended Scotch", description: "Rich blended Scotch.", is_available: true },
  { id: 706, name: "Teacher's Highland Cream", price: 225, category: "Blended Scotch", description: "Highland malt blend.", is_available: true },
  { id: 707, name: "VAT 69", price: 225, category: "Blended Scotch", description: "Classic blended Scotch.", is_available: true },
  { id: 708, name: "Johnnie Walker Red Label", price: 295, category: "Blended Scotch", description: "Pioneer blend.", is_available: true },
  { id: 709, name: "100 Pipers 12 yrs", price: 295, category: "Blended Scotch", description: "Aged blended Scotch.", is_available: true },
  { id: 710, name: "Teachers 50", price: 295, category: "Blended Scotch", description: "Special blended Scotch whisky.", is_available: true },
  { id: 711, name: "Black Dog Triple Gold", price: 295, category: "Blended Scotch", description: "Triple matured blend.", is_available: true },
  { id: 712, name: "Ballantine's Finest", price: 295, category: "Blended Scotch", description: "Complex blended Scotch.", is_available: true },
  { id: 713, name: "Teachers Highland Cream Reserve", price: 340, category: "Blended Scotch", description: "Aged reserve blend.", is_available: true },
  { id: 714, name: "Ballantine's 7 yrs", price: 345, category: "Blended Scotch", description: "Bourbon barrel finish scotch.", is_available: true },
  { id: 715, name: "Dewar's 12 yrs", price: 390, category: "Blended Scotch", description: "Aged 12 years double aged.", is_available: true },
  { id: 716, name: "Dewar's 15 yrs", price: 410, category: "Blended Scotch", description: "Aged 15 years.", is_available: true },
  { id: 717, name: "Ballantine's 12 yrs", price: 410, category: "Blended Scotch", description: "Aged 12 years.", is_available: true },
  { id: 718, name: "Monkey Shoulder", price: 475, category: "Blended Scotch", description: "100% malt whisky blend.", is_available: true },
  { id: 719, name: "Dewar's 18 yrs", price: 685, category: "Blended Scotch", description: "Ultra-aged blended Scotch.", is_available: true },
  { id: 730, name: "Amrut Fusion", price: 305, category: "Single Malt Whiskey", description: "Award-winning Indian single malt.", is_available: true },
  { id: 731, name: "The Glenlivet Caribbean Reserve", price: 410, category: "Single Malt Whiskey", description: "Rum barrel finish single malt.", is_available: true },
  { id: 732, name: "Godawan 01 Rich & Round", price: 410, category: "Single Malt Whiskey", description: "Artisanal Rajasthani single malt.", is_available: true },
  { id: 733, name: "Godawan 02 Fruit & Spice", price: 410, category: "Single Malt Whiskey", description: "Artisanal Rajasthani single malt.", is_available: true },
  { id: 734, name: "Talisker 10 yrs", price: 495, category: "Single Malt Whiskey", description: "Smoky maritime single malt from Isle of Skye.", is_available: true },
  { id: 735, name: "Glenfiddich 12 yrs", price: 495, category: "Single Malt Whiskey", description: "Speyside single malt.", is_available: true },
  { id: 736, name: "The Glenlivet 12 yrs", price: 495, category: "Single Malt Whiskey", description: "Classic Speyside single malt.", is_available: true },
  { id: 737, name: "Singleton 12 yrs", price: 495, category: "Single Malt Whiskey", description: "Rich and smooth single malt.", is_available: true },
  { id: 738, name: "Ardmore 12 yrs", price: 495, category: "Single Malt Whiskey", description: "Peated Highland single malt.", is_available: true },
  { id: 739, name: "Laphroaig Single 10 yrs", price: 495, category: "Single Malt Whiskey", description: "Heavily peated Islay single malt.", is_available: true },
  { id: 740, name: "Glenmorangie 10 yrs", price: 515, category: "Single Malt Whiskey", description: "Highland single malt.", is_available: true },
  { id: 741, name: "Toki Suntory", price: 515, category: "Single Malt Whiskey", description: "Japanese blended whisky.", is_available: true },
  { id: 742, name: "Aberfeldy 12 yrs", price: 515, category: "Single Malt Whiskey", description: "Highland single malt.", is_available: true },
  { id: 743, name: "Bowmore 12 yrs Islay Single Malt", price: 545, category: "Single Malt Whiskey", description: "Islands peated single malt.", is_available: true },
  { id: 744, name: "Oban", price: 625, category: "Single Malt Whiskey", description: "West Highland single malt.", is_available: true },
  { id: 745, name: "The Glenlivet 15 yrs", price: 685, category: "Single Malt Whiskey", description: "French oak reserve single malt.", is_available: true },
  { id: 746, name: "Glenfiddich 15 yrs", price: 725, category: "Single Malt Whiskey", description: "Solera vatting single malt.", is_available: true },
  { id: 747, name: "Lagavulin 16 yrs", price: 790, category: "Single Malt Whiskey", description: "Intense smoky Islay single malt.", is_available: true },
  { id: 748, name: "Hibiki", price: 990, category: "Single Malt Whiskey", description: "Legendary Japanese harmony whisky.", is_available: true },
  { id: 749, name: "Yamazaki", price: 990, category: "Single Malt Whiskey", description: "Japanese single malt whisky.", is_available: true },
  { id: 760, name: "Chivas Regal 12 yrs", price: 395, category: "Premium Scotch", description: "Blended Scotch whisky.", is_available: true },
  { id: 761, name: "Johnnie Walker Black Label", price: 420, category: "Premium Scotch", description: "Iconic aged blended Scotch.", is_available: true },
  { id: 762, name: "Johnnie Walker Double Black", price: 475, category: "Premium Scotch", description: "Intense smoky blend.", is_available: true },
  { id: 763, name: "Johnnie Walker Gold Label", price: 515, category: "Premium Scotch", description: "Luxurious creamy blend.", is_available: true },
  { id: 764, name: "Chivas Regal 15 yrs", price: 580, category: "Premium Scotch", description: "Selective cask finish scotch.", is_available: true },
  { id: 765, name: "Chivas Regal 18 yrs", price: 660, category: "Premium Scotch", description: "Exceptionally rich aged scotch.", is_available: true },
  { id: 766, name: "Royal Salute 21 yrs", price: 1165, category: "Premium Scotch", description: "Aged luxury blended Scotch.", is_available: true },
  { id: 767, name: "Johnnie Walker Blue Label", price: 1210, category: "Premium Scotch", description: "Rareest blend masterpiece.", is_available: true },
  { id: 800, name: "Fratelli Classic Shiraz (Red Wine)", price: 1199, category: "Wine", description: "Bottle (1199).", is_available: true },
  { id: 801, name: "Sula Zinfandel (Red Wine)", price: 1750, category: "Wine", description: "Bottle (1750).", is_available: true },
  { id: 802, name: "Sula Cabernet Shiraz (Red Wine)", price: 1750, category: "Wine", description: "Bottle (1750).", is_available: true },
  { id: 803, name: "Fratelli Classic Chenin (White Wine)", price: 1199, category: "Wine", description: "Bottle (1199).", is_available: true },
  { id: 804, name: "Sula Chenin Blanc (White Wine)", price: 1750, category: "Wine", description: "Bottle (1750).", is_available: true },
  { id: 805, name: "Sula Sauvignon Blanc (White Wine)", price: 1750, category: "Wine", description: "Bottle (1750).", is_available: true },
  { id: 806, name: "Bush Ballad Shiraz (Australia)", price: 2350, category: "Wine", description: "Bottle (2350).", is_available: true },
  { id: 807, name: "Monte Pacifico Merlot (Chile)", price: 2350, category: "Wine", description: "Bottle (2350).", is_available: true },
  { id: 808, name: "Mateus Rose (Portugal)", price: 2700, category: "Wine", description: "Bottle (2700).", is_available: true },
  { id: 809, name: "Two Oceans Shiraz (South African)", price: 2700, category: "Wine", description: "Bottle (2700).", is_available: true },
  { id: 810, name: "Two Oceans Chardonnay (South African)", price: 2700, category: "Wine", description: "Bottle (2700).", is_available: true },
  { id: 811, name: "Two Oceans Sauvignon Blanc (South African)", price: 2700, category: "Wine", description: "Bottle (2700).", is_available: true },
  { id: 812, name: "Sula Brut (Bottle)", price: 3045, category: "Wine", description: "Indian sparkling wine bottle.", is_available: true },
  { id: 813, name: "Moët & Chandon (Bottle)", price: 13500, category: "Wine", description: "Luxury French champagne.", is_available: true },
  { id: 814, name: "Martini Asti / Rose / Prosecco (Bottle)", price: 3800, category: "Wine", description: "Italian sparkling wine bottle.", is_available: true },
  { id: 830, name: "Cranberry / Blackberry Breezer", price: 265, category: "Breezer", description: "Alcopop refresher.", is_available: true },
  { id: 831, name: "Blueberry / Mango Peach Breezer", price: 265, category: "Breezer", description: "Alcopop refresher.", is_available: true },
  { id: 832, name: "Jamaican Passion Breezer", price: 265, category: "Breezer", description: "Alcopop refresher.", is_available: true },
  { id: 840, name: "Mineral Water", price: 50, category: "Beverages", description: "Bottled water.", is_available: true },
  { id: 841, name: "Soda", price: 45, category: "Beverages", description: "Club soda.", is_available: true },
  { id: 842, name: "Lime Water / Soda", price: 100, category: "Beverages", description: "Fresh lime cooler.", is_available: true },
  { id: 843, name: "Aerated Drinks", price: 65, category: "Beverages", description: "Cola / Sprite / Fanta.", is_available: true },
  { id: 844, name: "Diet Coke", price: 95, category: "Beverages", description: "Zero sugar cola.", is_available: true },
  { id: 845, name: "Ginger Ale", price: 105, category: "Beverages", description: "Crisp ginger beverage.", is_available: true },
  { id: 846, name: "Tonic Water", price: 115, category: "Beverages", description: "Schweppes tonic.", is_available: true },
  { id: 847, name: "Canned Juice", price: 115, category: "Beverages", description: "Cranberry / Orange / Pineapple.", is_available: true },
  { id: 848, name: "Red Bull", price: 200, category: "Beverages", description: "Energy drink.", is_available: true }
];

export default function RaahiQissaHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isStaffKdsOpen, setIsStaffKdsOpen] = useState(false); // Staff KDS Modal State
  const [tableNum, setTableNum] = useState("01");
  const [activeHoverIndex, setActiveHoverIndex] = useState<number>(0);

  // Staff KDS state inside modal
  const [staffOrders, setStaffOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>(MASTER_PUB_MENU);
  const [staffTab, setStaffTab] = useState<"kds" | "inventory">("kds");
  const [kdsFilter, setKdsFilter] = useState("All");
  const [staffCategory, setStaffCategory] = useState("All");
  const [staffSearch, setStaffSearch] = useState("");

  const heroRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(titleRef.current, { opacity: 0, scale: 0.95, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 1.4 });

    gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Fetch orders for Staff KDS Modal
  useEffect(() => {
    const fetchStaffOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", ["Pending Kitchen", "Preparing", "Served"])
        .order("created_at", { ascending: false });

      if (data) setStaffOrders(data);
      if (error) console.error(error);
    };

    fetchStaffOrders();

    const channel = supabase
      .channel("home-staff-kds-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            if (["Pending Kitchen", "Preparing", "Served"].includes(payload.new.status)) {
              setStaffOrders((prev) => [payload.new, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            if (payload.new.status.startsWith("Paid via")) {
              setStaffOrders((prev) => prev.filter((ord) => ord.id !== payload.new.id));
            } else {
              setStaffOrders((prev) =>
                prev.map((ord) => (ord.id === payload.new.id ? payload.new : ord))
              );
            }
          } else if (payload.eventType === "DELETE") {
            setStaffOrders((prev) => prev.filter((ord) => ord.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) {
      setStaffOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
      );
    }
  };

  const toggleAvailability = (id: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_available: !item.is_available } : item))
    );
  };

  const filteredStaffOrders = staffOrders.filter((order) => {
    if (kdsFilter === "All") return true;
    return order.status === kdsFilter;
  });

  const filteredStaffMenu = menuItems.filter((item) => {
    const matchesCat = staffCategory === "All" || item.category === staffCategory;
    const matchesSearch = staffSearch.trim() === "" || item.name.toLowerCase().includes(staffSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <main className="bg-[#080706] text-[#F4F0EA] min-h-screen selection:bg-[#D4AF37] selection:text-black font-sans overflow-x-hidden">
      
      <style jsx global>{`
        html { scroll-behavior: auto; }
        body { background: #080706; margin: 0; }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes autoSlide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-auto-slide {
          display: flex;
          width: max-content;
          animation: autoSlide 25s linear infinite;
        }
        .animate-auto-slide:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* --- RESPONSIVE TOP NAV --- */}
      <nav className="absolute top-0 left-0 w-full z-50 px-4 sm:px-6 md:px-12 py-5 flex justify-between items-center backdrop-blur-sm bg-black/30 border-b border-white/5">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D4AF37] hover:text-white transition-colors font-medium cursor-pointer p-2"
        >
          <span className="text-base">☰</span> MENU
        </button>

        <div></div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setIsStaffKdsOpen(true)}
            className="border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3.5 sm:px-4 py-2 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all font-semibold cursor-pointer"
          >
            👨‍🍳 Staff KDS
          </button>
          <button 
            onClick={() => setIsQrModalOpen(true)}
            className="inline-flex items-center gap-1.5 border border-[#D4AF37]/40 px-3.5 sm:px-5 py-2 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all font-semibold cursor-pointer"
          >
            <span>TABLE QR</span>
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </button>
          <button 
            onClick={() => setIsReservationOpen(true)}
            className="bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black px-4 sm:px-6 py-2 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold shadow-lg hover:opacity-90 transition-all cursor-pointer"
          >
            RESERVE
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section ref={heroRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=95"
            alt="Raahi Luxury Interior Atmosphere"
            className="w-full h-full object-cover filter brightness-[0.35] contrast-[1.1] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-[#080706]/60 to-black/70"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>

        <div className="relative z-10 text-center max-w-3xl px-4 mt-12">
          <div className="flex flex-col items-center mb-3">
            <div className="w-9 h-9 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-black/40 backdrop-blur-md mb-2 shadow-xl">
              <span className="text-[#D4AF37] text-xs animate-pulse">✦</span>
            </div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold">
              JP Nagar • Bengaluru
            </span>
          </div>

          <h1 ref={titleRef} className="font-serif text-6xl sm:text-8xl md:text-9xl tracking-tight text-white mb-4 drop-shadow-2xl">
            Raahi
          </h1>

          <p className="text-[#D3CEC5] text-xs sm:text-sm md:text-base font-light tracking-wide leading-relaxed mb-8 max-w-md sm:max-w-lg mx-auto">
            Artisanal dining meets a vibrant craft cocktail pub. Celebrating diverse culinary traditions, course by course.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-none mx-auto">
            <button 
              onClick={() => setIsQrModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black px-7 py-3.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-2xl hover:opacity-90 transition-all cursor-pointer"
            >
              <span>Open Table QR Menu</span>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </button>
            <Link 
              href="/admin"
              className="w-full sm:w-auto border border-white/20 bg-black/30 backdrop-blur-md text-white px-7 py-3.5 rounded-full text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all font-semibold text-center"
            >
              Manager Portal 🔒
            </Link>
          </div>
        </div>
      </section>

      {/* --- STORY SECTION --- */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="reveal relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[350px] sm:h-[450px]">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85" 
              alt="Raahi luxurious booth seating and atmosphere" 
              className="w-full h-full object-cover filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          <div className="reveal space-y-5">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold">
              — THE STORY —
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-white leading-tight">
              A word that means <span className="italic font-light text-[#D4AF37]">a tale.</span>
            </h2>
            <p className="text-[#D3CEC5] font-light leading-relaxed text-xs sm:text-sm md:text-base">
              Food is all about its story — the origin, the spices, the texture and the taste of every dish. It is the cornerstone of daily life, of culture, of history.
            </p>
            <p className="text-[#B5B0A6] font-light leading-relaxed text-xs sm:text-sm">
              'Raahi' tells the extraordinary stories behind the foods we eat: the finest artisanal cuisine and legendary pub drinks, served with careful attention to every detail of ambience and service.
            </p>
            
            <div className="pt-4 border-t border-white/10">
              <p className="font-serif text-base sm:text-lg text-white italic mb-2">
                "Raahi is a place of gathering, of celebrations, of business, and of pleasure. Let the story begin..."
              </p>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-mono">
                — THE RAAHI PROMISE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- LOCATION & FOOTER --- */}
      <footer id="location" className="bg-[#050403] border-t border-white/10 pt-20 pb-10 px-6 md:px-12 text-center">
        <div className="max-w-4xl mx-auto space-y-6 mb-12">
          <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 flex items-center justify-center bg-black/40 backdrop-blur-md mx-auto shadow-xl">
            <span className="text-[#D4AF37] text-xs animate-pulse">✦</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-white">Join us at Raahi</h2>
          <p className="text-[#D3CEC5] text-xs sm:text-sm font-light leading-relaxed">
            Outer Ring Rd, JP Nagar, Bengaluru, Karnataka<br />
            Open Daily: 12:00 PM – 11:30 PM
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setIsReservationOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black px-7 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg hover:opacity-90 transition-all cursor-pointer"
            >
              <span>Reserve a Table</span>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs text-gray-500 font-mono gap-3">
          <span>© 2026 RAAHI BENGALURU. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4 sm:gap-6">
            <button onClick={() => setIsStaffKdsOpen(true)} className="hover:text-[#D4AF37] transition-colors cursor-pointer bg-transparent border-none">Staff KDS</button>
            <button onClick={() => setIsQrModalOpen(true)} className="hover:text-[#D4AF37] transition-colors cursor-pointer bg-transparent border-none">Table QR Menu</button>
            <a href="/admin" className="hover:text-[#D4AF37] transition-colors">Owner Portal 🔒</a>
          </div>
        </div>
      </footer>

      {/* --- STAFF KDS MODAL (BUILT RIGHT ON HOMEPAGE) --- */}
      {isStaffKdsOpen && (
        <div onClick={() => setIsStaffKdsOpen(false)} className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
          <div onClick={(e) => e.stopPropagation()} className="bg-[#12100E] border border-white/15 rounded-3xl max-w-6xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">Password-Free Staff Portal</span>
                <h2 className="font-serif text-3xl text-white">Raahi Kitchen & Stock Station</h2>
              </div>
              <button 
                onClick={() => setIsStaffKdsOpen(false)}
                className="text-gray-400 hover:text-white text-lg font-bold bg-white/5 p-2 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* STAFF TABS */}
            <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
              <button
                onClick={() => setStaffTab("kds")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  staffTab === "kds" ? "bg-[#D4AF37] text-black shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                Live Kitchen Queue ({staffOrders.length})
              </button>
              <button
                onClick={() => setStaffTab("inventory")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  staffTab === "inventory" ? "bg-[#D4AF37] text-black shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                Menu Stock Control (In/Out of Stock)
              </button>
            </div>

            {staffTab === "kds" ? (
              <div>
                <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
                  {["All", "Pending Kitchen", "Preparing", "Served"].map((tab) => {
                    const count = tab === "All" ? staffOrders.length : staffOrders.filter(o => o.status === tab).length;
                    return (
                      <button
                        key={tab}
                        onClick={() => setKdsFilter(tab)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                          kdsFilter === tab
                            ? "bg-[#D4AF37] text-black shadow-lg"
                            : "bg-[#1F1C18] text-gray-400 border border-white/10 hover:text-white"
                        }`}
                      >
                        <span>{tab}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${kdsFilter === tab ? "bg-black/20 text-black" : "bg-white/10 text-white"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {filteredStaffOrders.length === 0 ? (
                  <div className="bg-[#1F1C18] border border-white/10 rounded-2xl p-16 text-center text-gray-400 text-sm">
                    No active orders found in this queue. Everything is caught up! 🥂
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredStaffOrders.map((order) => {
                      const isPending = order.status === "Pending Kitchen";
                      const isPreparing = order.status === "Preparing";

                      return (
                        <div
                          key={order.id}
                          className={`bg-[#1F1C18] border rounded-2xl p-5 shadow-xl flex flex-col justify-between ${
                            isPending ? "border-amber-500/50" : isPreparing ? "border-blue-500/50" : "border-white/10 opacity-75"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                              <span className="text-lg font-serif text-[#D4AF37] font-bold">
                                Table #{order.table_num}
                              </span>
                              <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold ${
                                isPending ? "bg-amber-500/20 text-amber-300" : isPreparing ? "bg-blue-500/20 text-blue-300" : "bg-green-500/20 text-green-300"
                              }`}>
                                {order.status}
                              </span>
                            </div>

                            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                              {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-xs bg-white/5 px-3 py-2 rounded-xl">
                                  <span className="text-white font-medium"><strong className="text-[#D4AF37] mr-1.5">{item.qty}x</strong> {item.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                            {order.status !== "Preparing" && (
                              <button
                                onClick={() => updateOrderStatus(order.id, "Preparing")}
                                className="bg-blue-500/20 hover:bg-blue-500/35 text-blue-300 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all"
                              >
                                Preparing
                              </button>
                            )}
                            {order.status !== "Served" && (
                              <button
                                onClick={() => updateOrderStatus(order.id, "Served")}
                                className={`${order.status === "Preparing" ? "col-span-2" : ""} bg-green-500/20 hover:bg-green-500/35 text-green-300 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all`}
                              >
                                Mark Served ✓
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* --- STAFF INVENTORY CONTROL TAB --- */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    className="w-full sm:w-72 bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
                  />
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {MENU_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setStaffCategory(cat)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap cursor-pointer shrink-0 ${
                          staffCategory === cat ? "bg-[#D4AF37] text-black" : "bg-[#1F1C18] text-gray-400 border border-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
                  {filteredStaffMenu.map((item) => (
                    <div key={item.id} className={`bg-[#1F1C18] border rounded-2xl p-4 flex flex-col justify-between ${item.is_available ? 'border-white/10' : 'border-red-500/40 opacity-60'}`}>
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="font-serif text-sm text-white">{item.name}</h3>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${item.is_available ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                            {item.is_available ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                        <p className="text-gray-400 text-[11px] mb-4">₹{item.price} — {item.category}</p>
                      </div>

                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={`w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                          item.is_available 
                            ? "bg-red-500/20 text-red-300 hover:bg-red-500/30" 
                            : "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                        }`}
                      >
                        {item.is_available ? "Mark Out of Stock ✕" : "Mark In Stock ✓"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- FULL SCREEN MENU DRAWER --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#080706]/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
          <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <span className="text-[#D4AF37]">✦</span>
              <span className="font-serif text-lg tracking-[0.3em] text-white">RAAHI</span>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white font-semibold cursor-pointer">
              CLOSE [ ✕ ]
            </button>
          </div>

          <div className="text-center space-y-6 my-auto py-10">
            <div>
              <button onClick={() => { setIsMenuOpen(false); setIsStaffKdsOpen(true); }} className="font-serif italic text-2xl sm:text-4xl text-[#D4AF37] hover:text-white transition-all duration-300 cursor-pointer bg-transparent border-none">
                Staff KDS Station 👨‍🍳
              </button>
            </div>
            <div>
              <button onClick={() => { setIsMenuOpen(false); setIsQrModalOpen(true); }} className="font-serif italic text-2xl sm:text-4xl text-white hover:text-[#D4AF37] transition-all duration-300 cursor-pointer bg-transparent border-none">
                Table QR Menu ↗
              </button>
            </div>
            <div>
              <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="font-serif italic text-2xl sm:text-4xl text-white hover:text-[#D4AF37] transition-all duration-300 inline-block">
                Owner Executive Portal 🔒
              </Link>
            </div>
            <div>
              <a href="#location" onClick={() => setIsMenuOpen(false)} className="font-serif italic text-2xl sm:text-4xl text-white hover:text-[#D4AF37] transition-all duration-300 inline-block">
                Location & Hours
              </a>
            </div>
          </div>

          <div className="text-center text-[10px] uppercase tracking-[0.3em] text-gray-500 font-mono">
            JP Nagar, Bengaluru
          </div>
        </div>
      )}

      {/* --- TABLE QR MODAL --- */}
      {isQrModalOpen && (
        <div onClick={() => setIsQrModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-[#12100E] border border-white/15 rounded-3xl max-w-sm sm:max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center">
            <button onClick={() => setIsQrModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white text-sm font-bold bg-white/5 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">✕</button>

            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-1 font-semibold">Table QR Simulation</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2">Select Your Table</h2>
            <p className="text-gray-400 text-xs mb-6">Choose your table number to launch the interactive dining and bar menu.</p>

            <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-6">
              {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"].map((tbl) => (
                <button
                  key={tbl}
                  onClick={() => setTableNum(tbl)}
                  className={`py-2.5 sm:py-3 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                    tableNum === tbl ? "bg-[#D4AF37] text-black shadow-lg scale-105" : "bg-[#1F1C18] border border-white/10 text-gray-300 hover:border-[#D4AF37]"
                  }`}
                >
                  #{tbl}
                </button>
              ))}
            </div>

            <Link
              href={`/order?table=${tableNum}`}
              className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg text-center"
            >
              <span>Launch Table #{tableNum} Menu</span>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* --- RESERVATION MODAL --- */}
      {isReservationOpen && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm sm:max-w-md bg-[#141210] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 relative shadow-2xl">
            <button onClick={() => setIsReservationOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white text-xs cursor-pointer">✕</button>
            <h3 className="font-serif text-2xl text-white mb-2">Reserve a Table</h3>
            <p className="text-[#B5B0A6] text-xs mb-6">Experience an unforgettable evening at Raahi.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Table reserved successfully!"); setIsReservationOpen(false); }} className="space-y-3.5">
              <input required type="text" placeholder="Your Full Name" className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]" />
              <input required type="tel" placeholder="Phone Number" className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="date" className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]" />
                <input required type="time" className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all mt-3 cursor-pointer">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}