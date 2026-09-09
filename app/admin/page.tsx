"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const MENU_CATEGORIES = [
  "All",
  "Soups",
  "Salads",
  "Bar Bites",
  "Tandoor",
  "Raahi Favourites",
  "Classics & Raahi Classics",
  "Coastal Specials",
  "Chefs Special",
  "Naati Specials",
  "New Specials",
  "Shared Plates",
  "Pasta",
  "Pizza",
  "Continental",
  "Chinese",
  "Indian Curries",
  "Sandwiches & Burgers",
  "Rice & Breads",
  "Desserts",
  "Draught Beer",
  "Bottled Beer",
  "Classic Cocktails",
  "Signature Cocktails",
  "Signature LIIT",
  "Signature Sangrias",
  "Mocktails",
  "Shooters",
  "Vodka",
  "Gin",
  "Rum",
  "Brandy",
  "Tequila",
  "Irish / Bourbon / Tennessee",
  "Blended Scotch",
  "Single Malt Whiskey",
  "Premium Scotch",
  "Wine",
  "Breezer",
  "Beverages"
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

export default function RaahiAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>(MASTER_PUB_MENU);
  const [activeTab, setActiveTab] = useState<"active" | "history" | "menu">("active");
  
  // Admin Menu Filters & Search Suggestions
  const [adminCategory, setAdminCategory] = useState("All");
  const [adminSearch, setAdminSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Checkout Modal State
  const [checkoutTable, setCheckoutTable] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card" | "Cash">("UPI");

  // Editing state for inline menu prices
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "raahi2026") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect passcode! Try 'raahi2026'");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (orderData) setAllOrders(orderData);
      if (orderError) console.error(orderError);
    };

    fetchOrders();

    const orderChannel = supabase
      .channel("admin-realtime-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => fetchOrders())
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
    };
  }, [isAuthenticated]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) {
      setAllOrders(prev =>
        prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order)
      );
    }
  };

  const handleCheckoutTable = async (tableNum: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: `Paid via ${paymentMethod}` })
      .eq("table_num", tableNum)
      .in("status", ["Pending Kitchen", "Preparing", "Served"]);

    if (error) {
      alert("Failed to process checkout. Please try again.");
      console.error(error);
    } else {
      alert(`Table #${tableNum} successfully checked out via ${paymentMethod}!`);
      setCheckoutTable(null);
      setAllOrders(prev =>
        prev.map(order => 
          order.table_num === tableNum && !order.status.startsWith("Paid via")
            ? { ...order, status: `Paid via ${paymentMethod}` }
            : order
        )
      );
    }
  };

  const toggleAvailability = (id: number) => {
    setMenuItems(prev =>
      prev.map(item => item.id === id ? { ...item, is_available: !item.is_available } : item)
    );
  };

  const savePriceEdit = (id: number) => {
    setMenuItems(prev =>
      prev.map(item => item.id === id ? { ...item, price: tempPrice } : item)
    );
    setEditingPriceId(null);
  };

  if (!isAuthenticated) {
    return (
      <main className="bg-[#06080C] text-[#F4F0EA] min-h-screen flex items-center justify-center font-sans p-6">
        <div className="w-full max-w-md bg-[#12100E] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-[#D4AF37] text-2xl">✦</span>
            <h1 className="font-serif text-3xl text-white mt-2">Raahi Manager Login</h1>
            <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Kitchen & Table Admin Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#D4AF37] mb-2">Admin Passcode</label>
              <input
                type="password"
                placeholder="Enter passcode (raahi2026)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#D4AF37]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg"
            >
              Access Dashboard
            </button>
          </form>

          <div className="text-center mt-6">
            <Link href="/" className="text-xs text-gray-500 hover:text-[#D4AF37] transition-colors">
              ← Return to Website Homepage
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const paidOrders = allOrders.filter(o => o.status.startsWith("Paid via"));
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const upiRevenue = paidOrders.filter(o => o.status === "Paid via UPI").reduce((sum, o) => sum + (o.total || 0), 0);
  const cardRevenue = paidOrders.filter(o => o.status === "Paid via Card").reduce((sum, o) => sum + (o.total || 0), 0);
  const cashRevenue = paidOrders.filter(o => o.status === "Paid via Cash").reduce((sum, o) => sum + (o.total || 0), 0);

  const liveKitchenOrders = allOrders.filter(o => ["Pending Kitchen", "Preparing"].includes(o.status));
  const activeTableOrders = allOrders.filter(o => ["Pending Kitchen", "Preparing", "Served"].includes(o.status));
  const historyOrders = allOrders.filter(o => o.status.startsWith("Paid via") || o.status === "Archived");

  const tableCheckoutOrders = checkoutTable ? activeTableOrders.filter(o => o.table_num === checkoutTable) : [];
  const tableCheckoutTotal = tableCheckoutOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const searchSuggestions = adminSearch.trim() === "" ? [] : menuItems.filter(item => 
    item.name.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const filteredAdminMenu = menuItems.filter(item => {
    const matchesCategory = adminCategory === "All" || item.category === adminCategory;
    const matchesSearch = adminSearch.trim() === "" || 
                          item.name.toLowerCase().includes(adminSearch.toLowerCase()) || 
                          item.description.toLowerCase().includes(adminSearch.toLowerCase());
    
    if (adminSearch.trim() !== "") {
      return matchesSearch;
    }
    return matchesCategory;
  });

  return (
    <main className="bg-[#06080C] text-[#F4F0EA] min-h-screen font-sans p-6 md:p-12 relative">
      
      {/* --- ADMIN HEADER --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold">LIVE KITCHEN DISPLAY & POS</span>
          <h1 className="font-serif text-4xl text-white mt-1">Raahi Operations Control</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/kds"
            className="bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:opacity-90 transition-all inline-flex items-center gap-2"
          >
            <span>🖥️ Open KDS Screen</span>
          </Link>

          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-xs uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span> Live Sync Active
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="border border-white/10 text-gray-400 hover:text-white px-5 py-2 rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* --- REVENUE & SALES ANALYTICS SUMMARY BAR --- */}
      <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#12100E] border border-[#D4AF37]/30 rounded-2xl p-5 shadow-xl">
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-1">Total Revenue Collected</span>
          <span className="font-serif text-3xl text-white">₹{totalRevenue}</span>
          <span className="text-[10px] text-gray-500 block mt-2">{paidOrders.length} settled bills</span>
        </div>

        <div className="bg-[#12100E] border border-white/10 rounded-2xl p-5 shadow-xl">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">UPI Payments</span>
          <span className="font-serif text-3xl text-[#D4AF37]">₹{upiRevenue}</span>
          <span className="text-[10px] text-gray-500 block mt-2">Digital instant transfer</span>
        </div>

        <div className="bg-[#12100E] border border-white/10 rounded-2xl p-5 shadow-xl">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Card Payments</span>
          <span className="font-serif text-3xl text-white">₹{cardRevenue}</span>
          <span className="text-[10px] text-gray-500 block mt-2">POS terminal swipe</span>
        </div>

        <div className="bg-[#12100E] border border-white/10 rounded-2xl p-5 shadow-xl">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Cash Payments</span>
          <span className="font-serif text-3xl text-white">₹{cashRevenue}</span>
          <span className="text-[10px] text-gray-500 block mt-2">Physical drawer cash</span>
        </div>
      </div>

      {/* --- TABLE STATUS SUMMARY & CHECKOUT GRID --- */}
      <div className="max-w-7xl mx-auto mb-8">
        <h3 className="text-xs uppercase tracking-widest text-[#D4AF37] mb-3">Table Status & Quick Checkout</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"].map((tbl) => {
            const hasActiveTable = activeTableOrders.some(o => o.table_num === tbl);
            return (
              <div 
                key={tbl} 
                onClick={() => hasActiveTable && setCheckoutTable(tbl)}
                className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border whitespace-nowrap transition-all ${
                  hasActiveTable 
                    ? "bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] animate-pulse cursor-pointer hover:bg-[#D4AF37]/30" 
                    : "bg-white/5 border-white/10 text-gray-500 cursor-default"
                }`}
              >
                Table #{tbl} {hasActiveTable ? "• Checkout Bill ↗" : "• Free"}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- NAVIGATION TABS --- */}
      <div className="max-w-7xl mx-auto flex gap-4 mb-8 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === "active" ? "bg-[#D4AF37] text-black shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
          }`}
        >
          Live Kitchen Queue ({liveKitchenOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === "history" ? "bg-[#D4AF37] text-black shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
          }`}
        >
          Billing History ({historyOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("menu")}
          className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === "menu" ? "bg-[#D4AF37] text-black shadow-lg" : "bg-white/5 text-gray-400 hover:text-white"
          }`}
        >
          Menu & Inventory Control ({menuItems.length})
        </button>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-7xl mx-auto">
        {activeTab === "active" ? (
          <div>
            <h2 className="font-serif text-2xl text-white mb-6">Live Kitchen Queue</h2>
            {liveKitchenOrders.length === 0 ? (
              <div className="bg-[#12100E] border border-white/10 rounded-2xl p-16 text-center text-gray-400 text-sm">
                No active kitchen orders right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveKitchenOrders.map((order) => (
                  <div key={order.id} className="bg-[#12100E] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                        <div>
                          <span className="bg-[#D4AF37] text-black font-bold text-xs px-3 py-1 rounded-full uppercase tracking-widest">
                            Table #{order.table_num}
                          </span>
                          <span className="text-gray-400 text-xs ml-3">ID: {order.id.slice(0, 6)}</span>
                        </div>
                        <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div className="space-y-3 mb-6">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-white"><span className="text-[#D4AF37] font-bold mr-2">{item.qty}x</span> {item.name}</span>
                            <span className="text-gray-400">₹{item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 mt-2">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-gray-400 uppercase tracking-widest">Status: <strong className="text-white">{order.status}</strong></span>
                        <span className="font-serif text-xl text-[#D4AF37]">₹{order.total}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => updateOrderStatus(order.id, "Preparing")}
                          className={`flex-1 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer ${
                            order.status === "Preparing" ? "bg-[#D4AF37] text-black" : "bg-white/5 text-gray-300 hover:bg-white/10"
                          }`}
                        >
                          Preparing
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, "Served")}
                          className="flex-1 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer bg-white/5 text-gray-300 hover:bg-green-600 hover:text-white"
                        >
                          Served / Done
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "history" ? (
          <div>
            <h2 className="font-serif text-2xl text-white mb-6">Settled Billing History</h2>
            {historyOrders.length === 0 ? (
              <div className="bg-[#12100E] border border-white/10 rounded-2xl p-16 text-center text-gray-400 text-sm">
                No settled billing history yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {historyOrders.map((order) => (
                  <div key={order.id} className="bg-[#12100E]/60 border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between opacity-80">
                    <div>
                      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                        <div>
                          <span className="bg-white/10 text-gray-300 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-widest">
                            Table #{order.table_num}
                          </span>
                          <span className="text-gray-500 text-xs ml-3">ID: {order.id.slice(0, 6)}</span>
                        </div>
                        <span className="text-xs text-green-400 font-semibold">{order.status}</span>
                      </div>

                      <div className="space-y-3 mb-6">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm text-gray-400">
                            <span><span className="text-gray-300 font-bold mr-2">{item.qty}x</span> {item.name}</span>
                            <span>₹{item.price * item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="font-serif text-lg text-gray-300">₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          
          /* --- MENU & INVENTORY CONTROL TAB --- */
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="font-serif text-2xl text-white">Menu & Inventory Control</h2>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Search food & drinks, toggle stock, or adjust prices instantly</p>
              </div>

              {/* Search input with suggestions */}
              <div className="w-full lg:w-80 relative">
                <input
                  type="text"
                  placeholder="Type to search food & drinks..."
                  value={adminSearch}
                  onChange={(e) => {
                    setAdminSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-[#12100E] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#D4AF37]"
                />

                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#12100E] border border-white/15 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                    {searchSuggestions.map((sug) => (
                      <div
                        key={sug.id}
                        onClick={() => {
                          setAdminSearch(sug.name);
                          setShowSuggestions(false);
                        }}
                        className="px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-none cursor-pointer flex justify-between items-center text-xs"
                      >
                        <span className="text-white font-medium">{sug.name}</span>
                        <span className="text-[#D4AF37]">₹{sug.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Category Filter Pills (Scrollable) */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setAdminCategory(cat);
                    setAdminSearch("");
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    adminCategory === cat && !adminSearch
                      ? "bg-[#D4AF37] text-black shadow-md"
                      : "bg-[#12100E] text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
              {adminSearch && (
                <button
                  onClick={() => setAdminSearch("")}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 cursor-pointer shrink-0"
                >
                  Clear Search ✕
                </button>
              )}
            </div>

            {filteredAdminMenu.length === 0 ? (
              <div className="bg-[#12100E] border border-white/10 rounded-2xl p-16 text-center text-gray-400 text-sm">
                No matching menu items found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAdminMenu.map((item) => (
                  <div key={item.id} className={`bg-[#12100E] border rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all ${item.is_available ? 'border-white/10' : 'border-red-500/30 opacity-60'}`}>
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-1">{item.category}</span>
                          <h3 className="font-serif text-base text-white">{item.name}</h3>
                        </div>
                        
                        <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest font-bold shrink-0 ${
                          item.is_available ? "bg-green-500/10 text-green-400 border border-green-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}>
                          {item.is_available ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed mb-6">{item.description}</p>
                    </div>

                    <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Price</span>
                        {editingPriceId === item.id ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="number"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(Number(e.target.value))}
                              className="w-20 bg-[#1F1C18] border border-[#D4AF37] rounded-lg px-2 py-1 text-sm text-white outline-none"
                            />
                            <button
                              onClick={() => savePriceEdit(item.id)}
                              className="bg-[#D4AF37] text-black px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-serif text-xl text-[#D4AF37]">₹{item.price}</span>
                            <button
                              onClick={() => { setEditingPriceId(item.id); setTempPrice(item.price); }}
                              className="text-[10px] text-gray-400 hover:text-white uppercase tracking-widest underline cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer ${
                          item.is_available 
                            ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20" 
                            : "bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
                        }`}
                      >
                        {item.is_available ? "Mark Out of Stock" : "Mark In Stock"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- TABLE CHECKOUT & SETTLEMENT MODAL --- */}
      {checkoutTable && (
        <div 
          onClick={() => setCheckoutTable(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#12100E] border border-white/15 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
          >
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/10">
              <div>
                <span className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold">Bill Settlement</span>
                <h2 className="font-serif text-2xl text-white">Table #{checkoutTable} Checkout</h2>
              </div>
              <button 
                onClick={() => setCheckoutTable(null)}
                className="text-gray-400 hover:text-white text-lg font-bold cursor-pointer bg-white/5 p-2 rounded-full w-9 h-9 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-3 pr-2 mb-4">
              {tableCheckoutOrders.map((order, idx) => (
                <div key={order.id} className="bg-[#1F1C18] p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Round #{idx + 1} ({order.status})</span>
                    <span>₹{order.total}</span>
                  </div>
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm text-white py-0.5">
                      <span>{item.qty}x {item.name}</span>
                      <span className="text-gray-400">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="bg-[#1F1C18] p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-gray-300 font-bold">Grand Total Due</span>
                <span className="font-serif text-2xl text-[#D4AF37]">₹{tableCheckoutTotal}</span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["UPI", "Card", "Cash"] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                        paymentMethod === method
                          ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg"
                          : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCheckoutTable(null)}
                  className="flex-1 border border-white/10 text-gray-300 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCheckoutTable(checkoutTable)}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:opacity-90 cursor-pointer shadow-lg"
                >
                  Settle & Free Table Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}