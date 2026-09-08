"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  { id: 101, name: "Cream Of Spinach Soup", price: 220, category: "Soups", description: "Rich and creamy classic spinach soup." },
  { id: 102, name: "Cream Of Tomato Soup", price: 220, category: "Soups", description: "Velvety smooth garden tomato soup." },
  { id: 103, name: "Manchow Soup Veg / Chicken", price: 240, category: "Soups", description: "Spicy dark soy broth topped with crispy noodles." },
  { id: 104, name: "Hot And Sour Soup Veg / Chicken", price: 240, category: "Soups", description: "Classic hot and tangy Sichuan style soup." },
  { id: 105, name: "Sweet Corn Soup Veg / Chicken", price: 240, category: "Soups", description: "Comforting sweet corn broth with tender kernels." },
  { id: 110, name: "Green Salad / Cucumber Salad", price: 170, category: "Salads", description: "Fresh crisp garden vegetables and sliced cucumbers." },
  { id: 111, name: "Caesar Salad (Veg / Chicken)", price: 345, category: "Salads", description: "Romaine lettuce, parmesan, croutons, and classic dressing." },
  { id: 112, name: "Grilled Chicken Salad", price: 345, category: "Salads", description: "Juicy sliced grilled chicken over fresh greens." },
  { id: 113, name: "Watermelon Feta Salad", price: 335, category: "Salads", description: "Refreshing cubed watermelon with crumbled feta and mint." },
  { id: 120, name: "Sandige / Papad", price: 130, category: "Bar Bites", description: "Traditional crispy accompaniment." },
  { id: 121, name: "Masala Papad", price: 160, category: "Bar Bites", description: "Crispy papad topped with spicy onion-tomato masala." },
  { id: 122, name: "Peanut Masala", price: 180, category: "Bar Bites", description: "Crunchy peanuts tossed with onions, tomatoes, and spices." },
  { id: 123, name: "Peri Peri Bhutta", price: 180, category: "Bar Bites", description: "Spicy fire-roasted corn seasoned with peri peri." },
  { id: 124, name: "Cashew Fry", price: 220, category: "Bar Bites", description: "Golden fried cashew nuts tossed in spices." },
  { id: 125, name: "French Fries (Plain / Peri Peri / Cheese)", price: 270, category: "Bar Bites", description: "Crispy potato fries with choice of seasoning." },
  { id: 126, name: "Cheese Garlic Bread", price: 250, category: "Bar Bites", description: "Toasted baguette loaded with garlic butter and melted cheese." },
  { id: 127, name: "Cheese Cherry Pineapple", price: 265, category: "Bar Bites", description: "Classic party skewers." },
  { id: 128, name: "Cheesy Jalapeno Poppers", price: 330, category: "Bar Bites", description: "Crispy breaded poppers stuffed with molten cheese and jalapenos." },
  { id: 129, name: "Mexican Veg Nachos", price: 290, category: "Bar Bites", description: "Tortilla chips loaded with salsa, beans, and melted cheese." },
  { id: 130, name: "Mexican Grilled Chicken Nachos", price: 350, category: "Bar Bites", description: "Loaded nachos topped with spiced grilled chicken." },
  { id: 131, name: "Crispy Onion Rings", price: 250, category: "Bar Bites", description: "Golden battered onion rings with dip." },
  { id: 132, name: "Potato Basket", price: 335, category: "Bar Bites", description: "Assorted potato fries and wedges." },
  { id: 140, name: "Veg Seekh Kabab", price: 315, category: "Tandoor", description: "Minced vegetable skewers grilled in clay oven." },
  { id: 141, name: "Tandoori Malai Broccoli", price: 345, category: "Tandoor", description: "Creamy marinated broccoli florets charred to perfection." },
  { id: 142, name: "Malai Paneer Tikka", price: 380, category: "Tandoor", description: "Melt-in-mouth cottage cheese in rich cream marinade." },
  { id: 143, name: "Stuffed Mushroom Tikka", price: 380, category: "Tandoor", description: "Mushrooms stuffed with paneer and spices, tandoor grilled." },
  { id: 144, name: "Stuffed Paneer Tikka", price: 390, category: "Tandoor", description: "Paneer layers filled with mint chutney paste." },
  { id: 145, name: "Murgh Seekh Kabab", price: 400, category: "Tandoor", description: "Spiced minced chicken skewers." },
  { id: 146, name: "Kalmi Kabab (2 pcs)", price: 295, category: "Tandoor", description: "Juicy tandoori chicken drumsticks." },
  { id: 147, name: "Murgh Malai Kabab", price: 400, category: "Tandoor", description: "Creamy cheese and garlic marinated chicken kebabs." },
  { id: 148, name: "Murgh Sholay / Sultani Kabab", price: 400, category: "Tandoor", description: "Chef special spicy charcoal-grilled chicken." },
  { id: 149, name: "Mutton Seekh Kabab", price: 490, category: "Tandoor", description: "Tender spiced minced lamb skewers." },
  { id: 150, name: "Mutton Gilafi Seekh Kabab", price: 490, category: "Tandoor", description: "Mutton seekh coated with colourful bell peppers." },
  { id: 151, name: "Fish Tikka", price: 400, category: "Tandoor", description: "Basa chunks marinated in tandoori spices and smoked." },
  { id: 152, name: "Tandoori Chicken (Half / Full)", price: 800, category: "Tandoor", description: "The ultimate classic bone-in tandoori chicken." },
  { id: 153, name: "Tandoori Prawns", price: 550, category: "Tandoor", description: "Jumbo prawns grilled with tandoori spices." },
  { id: 154, name: "Tandoori Pomfret", price: 750, category: "Tandoor", description: "Whole pomfret marinated and roasted." },
  { id: 160, name: "Cheesy Veg Fingers", price: 295, category: "Raahi Favourites", description: "Crispy breaded fingers packed with molten cheese." },
  { id: 161, name: "Mushroom Kodiyala", price: 355, category: "Raahi Favourites", description: "Signature Mangalorean style spiced mushrooms." },
  { id: 162, name: "Mongolian Paneer", price: 360, category: "Raahi Favourites", description: "Tossed in spicy sweet Mongolian glaze." },
  { id: 163, name: "Raahi Special Chicken", price: 380, category: "Raahi Favourites", description: "Our legendary house special spicy chicken starter." },
  { id: 164, name: "White Horse Special Chicken", price: 380, category: "Raahi Favourites", description: "Pub favorite succulent chicken preparation." },
  { id: 165, name: "Old Style Chilli Chicken", price: 380, category: "Raahi Favourites", description: "Old-school spicy green chili chicken stir-fry." },
  { id: 166, name: "Chicken Kodiyala", price: 450, category: "Raahi Favourites", description: "Coastal style spicy chicken tossed with curry leaves." },
  { id: 167, name: "Crunchy Chicken", price: 390, category: "Raahi Favourites", description: "Super crispy batter-fried chicken bites." },
  { id: 168, name: "Butter Garlic Prawns", price: 550, category: "Raahi Favourites", description: "Juicy prawns tossed in rich garlic butter sauce." },
  { id: 169, name: "Chicken Wings (Plain / Peri Peri / Crispy Fried)", price: 360, category: "Raahi Favourites", description: "Juicy chicken wings with choice of coating." },
  { id: 170, name: "Mutton Fry", price: 490, category: "Raahi Favourites", description: "Tender mutton pieces dry-roasted with coastal spices." },
  { id: 171, name: "Mutton Nalli", price: 660, category: "Raahi Favourites", description: "Slow-cooked succulent mutton bone marrow preparation." },
  { id: 172, name: "Egg Burji Pav", price: 290, category: "Raahi Favourites", description: "Spicy scrambled eggs served with buttered pav." },
  { id: 173, name: "Mutton Keema Pav", price: 410, category: "Raahi Favourites", description: "Rich spiced minced lamb served with toasted pav." },
  { id: 180, name: "Gobi Manchurian", price: 310, category: "Classics & Raahi Classics", description: "Crispy cauliflower florets in tangy soy-garlic sauce." },
  { id: 181, name: "Gobi Chilli", price: 310, category: "Classics & Raahi Classics", description: "Spicy tossed cauliflower with peppers and chilies." },
  { id: 182, name: "Egg Manchurian", price: 310, category: "Classics & Raahi Classics", description: "Crispy fried boiled egg quarters in manchurian sauce." },
  { id: 183, name: "Egg Chilli", price: 310, category: "Classics & Raahi Classics", description: "Spicy stir-fried eggs." },
  { id: 184, name: "Egg Ghee Roast", price: 310, category: "Classics & Raahi Classics", description: "Rich Mangalorean ghee roast masala tossed with eggs." },
  { id: 185, name: "Egg Pepper Dry", price: 310, category: "Classics & Raahi Classics", description: "Crushed black pepper and curry leaf spiced eggs." },
  { id: 186, name: "Mixed Veg Pudina", price: 330, category: "Classics & Raahi Classics", description: "Crispy mixed veggies tossed in mint gravy." },
  { id: 187, name: "Hara Bhara Kabab", price: 330, category: "Classics & Raahi Classics", description: "Spinach and green pea patties." },
  { id: 188, name: "Raahi Special Veg", price: 330, category: "Classics & Raahi Classics", description: "Chef's signature vegetable starter." },
  { id: 189, name: "Mushroom Manchurian", price: 340, category: "Classics & Raahi Classics", description: "Batter-fried button mushrooms in manchurian gravy." },
  { id: 190, name: "Mushroom Pepper Dry", price: 340, category: "Classics & Raahi Classics", description: "Pepper spiced dry mushrooms." },
  { id: 191, name: "Mushroom Chilli", price: 340, category: "Classics & Raahi Classics", description: "Stir-fried mushrooms with bell peppers and green chilies." },
  { id: 192, name: "Baby Corn Pepper Dry", price: 340, category: "Classics & Raahi Classics", description: "Crispy baby corn tossed in black pepper." },
  { id: 193, name: "Baby Corn Chilli", price: 340, category: "Classics & Raahi Classics", description: "Spicy baby corn stir-fry." },
  { id: 194, name: "Baby Corn Manchurian", price: 340, category: "Classics & Raahi Classics", description: "Crispy baby corn in Manchurian sauce." },
  { id: 195, name: "Baby Corn Golden Fried", price: 340, category: "Classics & Raahi Classics", description: "Crispy batter-fried golden baby corn." },
  { id: 196, name: "Tandoori Mushroom", price: 360, category: "Classics & Raahi Classics", description: "Spiced tandoori stuffed mushrooms." },
  { id: 197, name: "Paneer Tikka", price: 360, category: "Classics & Raahi Classics", description: "Classic tandoori paneer cubes." },
  { id: 198, name: "Paneer Chilli", price: 360, category: "Classics & Raahi Classics", description: "Stir-fried paneer in spicy chili sauce." },
  { id: 199, name: "Paneer Manchurian", price: 360, category: "Classics & Raahi Classics", description: "Paneer in savory Manchurian sauce." },
  { id: 200, name: "Paneer Chatpata", price: 360, category: "Classics & Raahi Classics", description: "Tangy and spicy paneer cubes." },
  { id: 201, name: "French Paneer", price: 360, category: "Classics & Raahi Classics", description: "Special french-style spiced paneer preparation." },
  { id: 202, name: "Dragon Paneer", price: 360, category: "Classics & Raahi Classics", description: "Spicy sweet dragon style paneer." },
  { id: 203, name: "French Chicken", price: 360, category: "Classics & Raahi Classics", description: "Crispy fried chicken tossed in French sauce." },
  { id: 204, name: "Popcorn Chicken", price: 360, category: "Classics & Raahi Classics", description: "Bite-sized crispy fried chicken popcorn." },
  { id: 205, name: "Chicken Tikka", price: 380, category: "Classics & Raahi Classics", description: "Classic grilled chicken tikka." },
  { id: 206, name: "Chilli Chicken", price: 380, category: "Classics & Raahi Classics", description: "The quintessential pub spicy chicken chilli." },
  { id: 207, name: "Chicken Ghee Roast", price: 390, category: "Classics & Raahi Classics", description: "Rich Mangalorean spiced ghee roast chicken." },
  { id: 208, name: "Dragon Chicken", price: 380, category: "Classics & Raahi Classics", description: "Crispy chicken in sweet & spicy dragon sauce." },
  { id: 209, name: "Lemon Chicken", price: 380, category: "Classics & Raahi Classics", description: "Tangy lemon-glazed chicken bites." },
  { id: 210, name: "Chicken Pepper Dry", price: 380, category: "Classics & Raahi Classics", description: "Crushed pepper and onion tossed chicken." },
  { id: 211, name: "Oil Fry Kabab", price: 360, category: "Classics & Raahi Classics", description: "Deep-fried local style chicken kababs." },
  { id: 212, name: "Murgh Hari Mirch Kabab", price: 380, category: "Classics & Raahi Classics", description: "Spicy green chili marinated chicken." },
  { id: 213, name: "Chicken 65", price: 380, category: "Classics & Raahi Classics", description: "South Indian style deep-fried spiced chicken." },
  { id: 214, name: "Murgh Lasooni Tikka", price: 380, category: "Classics & Raahi Classics", description: "Garlic-forward tandoori chicken tikka." },
  { id: 215, name: "Chicken Manchurian", price: 380, category: "Classics & Raahi Classics", description: "Classic chicken Manchurian." },
  { id: 216, name: "Murgh Tukda Kabab", price: 450, category: "Classics & Raahi Classics", description: "Crispy chunk chicken fry." },
  { id: 217, name: "Squid Rings", price: 450, category: "Classics & Raahi Classics", description: "Crispy fried calamari rings." },
  { id: 218, name: "Fish Fingers", price: 450, category: "Classics & Raahi Classics", description: "Crispy crumb-fried fish fingers with tartare sauce." },
  { id: 219, name: "Fish Chilli", price: 400, category: "Classics & Raahi Classics", description: "Spicy stir-fried fish cubes." },
  { id: 220, name: "Fish Kabab", price: 400, category: "Classics & Raahi Classics", description: "Classic coastal fish kabab." },
  { id: 221, name: "Prawns Ghee Roast", price: 490, category: "Classics & Raahi Classics", description: "Prawns tossed in rich ghee roast masala." },
  { id: 222, name: "Prawns Koliwada", price: 490, category: "Classics & Raahi Classics", description: "Crispy batter-fried spicy prawns." },
  { id: 223, name: "Golden Fried Prawns", price: 490, category: "Classics & Raahi Classics", description: "Panko-crusted crispy prawns." },
  { id: 224, name: "Mutton Pepper Dry", price: 490, category: "Classics & Raahi Classics", description: "Tender mutton dry roasted with black pepper." },
  { id: 230, name: "Neer Dosa", price: 95, category: "Coastal Specials", description: "Lacey delicate soft rice crepes." },
  { id: 231, name: "Paneer / Mushroom Ghee Roast", price: 345, category: "Coastal Specials", description: "Rich spice and ghee tossed paneer or mushrooms." },
  { id: 232, name: "Egg Masala Fry", price: 310, category: "Coastal Specials", description: "Spiced masala coated fried eggs." },
  { id: 233, name: "Chicken Sukka", price: 380, category: "Coastal Specials", description: "Mangalorean style dry coconut chicken masala." },
  { id: 234, name: "Mangalore Style Chicken Gassi", price: 380, category: "Coastal Specials", description: "Traditional coastal chicken curry with roasted spices." },
  { id: 235, name: "Bangada (Tawa / Rava / Masala Fry)", price: 400, category: "Coastal Specials", description: "Fresh mackerel prepared in coastal style." },
  { id: 236, name: "Prawns (Tawa / Rava / Masala Fry)", price: 450, category: "Coastal Specials", description: "Fresh prawns with coastal seasoning." },
  { id: 237, name: "Anjal (Tawa / Rava / Masala Fry)", price: 550, category: "Coastal Specials", description: "Kingfish steak cooked to perfection." },
  { id: 238, name: "Pomfret (Tawa / Rava / Masala Fry)", price: 650, category: "Coastal Specials", description: "Whole pomfret fried with coastal spices." },
  { id: 240, name: "Curry Leaf Mushroom", price: 345, category: "Chefs Special", description: "Mushrooms tossed in fragrant fresh curry leaf paste." },
  { id: 241, name: "Dragon Baby Corn", price: 345, category: "Chefs Special", description: "Spicy sweet dragon baby corn." },
  { id: 242, name: "Cheese Corn Ball", price: 400, category: "Chefs Special", description: "Crispy cheesy golden corn spheres." },
  { id: 243, name: "Mushroom O'Reilly", price: 370, category: "Chefs Special", description: "Chef special stuffed mushrooms." },
  { id: 244, name: "BBQ Chicken Wings", price: 360, category: "Chefs Special", description: "Smoky barbecue glazed chicken wings." },
  { id: 245, name: "Chicken Hot Pepper Dry", price: 380, category: "Chefs Special", description: "Extremely spicy hot chili pepper chicken." },
  { id: 246, name: "Crispy Spinach Chicken", price: 380, category: "Chefs Special", description: "Chicken tossed with crisp seasoned spinach leaves." },
  { id: 247, name: "Chicken Lollipop", price: 380, category: "Chefs Special", description: "Classic spicy drummettes." },
  { id: 248, name: "Chicken Lollipop Special", price: 390, category: "Chefs Special", description: "Chef special coated chicken lollipops." },
  { id: 250, name: "Tandoori Veg Platter", price: 500, category: "Shared Plates", description: "Assorted tandoori paneer, vegetables, and kebabs." },
  { id: 251, name: "Tandoori Chicken Platter", price: 800, category: "Shared Plates", description: "Assorted tandoori chicken varieties." },
  { id: 252, name: "Mixed Non Veg Platter", price: 1155, category: "Shared Plates", description: "Ultimate platter of chicken, mutton, and fish kebabs." },
  { id: 253, name: "Seafood Platter", price: 1250, category: "Shared Plates", description: "Selection of coastal fish and prawns." },
  { id: 260, name: "Chicken Green Chutney Masala", price: 380, category: "Naati Specials", description: "Country style chicken cooked in green herb paste." },
  { id: 261, name: "Chicken Cashew Pepper", price: 380, category: "Naati Specials", description: "Naati style chicken with roasted cashews and pepper." },
  { id: 262, name: "Naati Style Chicken Donne Biryani", price: 390, category: "Naati Specials", description: "Authentic short-grain fragrant donne biryani with country chicken." },
  { id: 263, name: "Naati Style Mutton Donne Biryani", price: 490, category: "Naati Specials", description: "Traditional flavorful tender mutton donne biryani." },
  { id: 270, name: "Grilled Stuffed Mushrooms", price: 360, category: "New Specials", description: "Char-grilled mushrooms stuffed with herbs and cheese." },
  { id: 271, name: "Beer-Battered Fish Nuggets", price: 390, category: "New Specials", description: "Crisp beer-battered fish bites with dip." },
  { id: 272, name: "Prawn Popcorn", price: 330, category: "New Specials", description: "Bite-sized crispy fried popcorn prawns." },
  { id: 273, name: "Palak Patta Chaat", price: 330, category: "New Specials", description: "Crispy fried spinach leaves topped with yogurt, tamarind, and chutneys." },
  { id: 274, name: "Chilli Crispy Lotus Stem", price: 330, category: "New Specials", description: "Honey chili glazed crispy lotus stems." },
  { id: 275, name: "Thai Green Tikka Bites", price: 380, category: "New Specials", description: "Fusion chicken tikka infused with Thai green curry flavors." },
  { id: 276, name: "Bangalore Fried Chicken", price: 350, category: "New Specials", description: "Local style spicy street-style fried chicken." },
  { id: 280, name: "Alfredo Pasta (Veg / Chicken)", price: 420, category: "Pasta", description: "Rich and creamy parmesan white sauce pasta." },
  { id: 281, name: "Arrabbiata Pasta (Veg / Chicken)", price: 420, category: "Pasta", description: "Spicy garlic tomato herb sauce." },
  { id: 282, name: "Parma Rosa Sauce Pasta (Veg / Chicken)", price: 420, category: "Pasta", description: "Blended creamy tomato and white sauce." },
  { id: 283, name: "Pesto Pasta (Veg / Chicken)", price: 420, category: "Pasta", description: "Fresh basil, garlic, pine nut, and parmesan pesto." },
  { id: 284, name: "Aglio e Olio (Veg / Chicken)", price: 420, category: "Pasta", description: "Olive oil, garlic, chili flakes, and parsley." },
  { id: 290, name: "Classic Margherita Pizza", price: 380, category: "Pizza", description: "Mozzarella, fresh basil, and tomato sauce." },
  { id: 291, name: "Exotic Veg Farmer Pizza", price: 400, category: "Pizza", description: "Loaded with bell peppers, olives, corn, and mushrooms." },
  { id: 292, name: "Paneer Tikka Pizza", price: 400, category: "Pizza", description: "Tandoori paneer chunks, onions, and capsicum." },
  { id: 293, name: "Tex Mex Pizza", price: 400, category: "Pizza", description: "Jalapenos, sweet corn, beans, and spicy salsa." },
  { id: 294, name: "Tandoori Chicken Tikka", price: 450, category: "Pizza", description: "Smoky tandoori chicken chunks and onions." },
  { id: 295, name: "Peri Peri Chicken Pizza", price: 450, category: "Pizza", description: "Spicy peri peri chicken toppings." },
  { id: 296, name: "BBQ Chicken Pizza", price: 450, category: "Pizza", description: "Barbecue chicken, onions, and smoked cheese." },
  { id: 297, name: "Raahi's Loaded Meat Pizza", price: 470, category: "Pizza", description: "Loaded with chicken, mutton chunks, and sausage." },
  { id: 300, name: "Veg Stroganoff", price: 360, category: "Continental", description: "Sautéed vegetables in creamy mushroom paprika sauce with rice." },
  { id: 301, name: "Pasta Ravioli in Pesto Sauce", price: 360, category: "Continental", description: "Filled ravioli pasta tossed in rich basil pesto." },
  { id: 302, name: "Grilled Chicken Steak", price: 400, category: "Continental", description: "Juicy chicken breast served with mash and pepper sauce." },
  { id: 303, name: "Grilled Chicken with Red Wine Mushroom Sauce", price: 400, category: "Continental", description: "Tender grilled chicken in rich red wine mushroom reduction." },
  { id: 310, name: "Nasi Goreng", price: 395, category: "Chinese", description: "Indonesian fried rice served with satay and fried egg." },
  { id: 311, name: "Thai Green Curry (Veg / Chicken / Prawn)", price: 430, category: "Chinese", description: "Fragrant coconut green curry with steamed rice." },
  { id: 312, name: "Thai Red Curry (Veg / Chicken / Prawn)", price: 430, category: "Chinese", description: "Spicy coconut red curry with steamed rice." },
  { id: 313, name: "Masaman Curry (Veg / Chicken)", price: 390, category: "Chinese", description: "Rich southern Thai curry with peanuts and potatoes." },
  { id: 314, name: "Laksa (Veg / Chicken / Prawn)", price: 380, category: "Chinese", description: "Spicy coconut noodle soup." },
  { id: 315, name: "Fried Rice (Veg / Egg / Chicken / Prawn)", price: 345, category: "Chinese", description: "Classic wok-tossed fried rice." },
  { id: 316, name: "Hakka Noodles (Veg / Egg / Chicken / Prawn)", price: 315, category: "Chinese", description: "Wok-tossed noodles with crunchy vegetables." },
  { id: 317, name: "Schezwan Fried Rice (Veg / Egg / Chicken / Prawn)", price: 355, category: "Chinese", description: "Spicy Schezwan wok-tossed rice." },
  { id: 330, name: "Dal Fry", price: 210, category: "Indian Curries", description: "Yellow lentils tempered with garlic and cumin." },
  { id: 331, name: "Dal Makhani", price: 280, category: "Indian Curries", description: "Overnight simmered creamy black lentils." },
  { id: 332, name: "Tomato Kaju Masala", price: 295, category: "Indian Curries", description: "Cashews simmered in rich tomato gravy." },
  { id: 333, name: "Veg Kolhapuri", price: 325, category: "Indian Curries", description: "Spicy Maharashtrian mixed vegetable curry." },
  { id: 334, name: "Veg Hyderabadi", price: 325, category: "Indian Curries", description: "Vegetables in rich spinach and yogurt gravy." },
  { id: 335, name: "Mushroom Masala", price: 345, category: "Indian Curries", description: "Mushrooms in onion tomato masala." },
  { id: 336, name: "Paneer Butter Masala", price: 370, category: "Indian Curries", description: "Cottage cheese in velvety tomato makhani gravy." },
  { id: 337, name: "Paneer Tikka Masala", price: 390, category: "Indian Curries", description: "Tandoori paneer tikka in spiced gravy." },
  { id: 338, name: "Palak Paneer", price: 370, category: "Indian Curries", description: "Cottage cheese cubes in smooth seasoned spinach puree." },
  { id: 339, name: "Diwani Handi", price: 370, category: "Indian Curries", description: "Rich mixed vegetable and dry fruit handi curry." },
  { id: 340, name: "Butter Chicken", price: 390, category: "Indian Curries", description: "Tender tandoori chicken in rich velvety tomato gravy." },
  { id: 341, name: "Chicken Kolhapuri", price: 390, category: "Indian Curries", description: "Fiery spiced Kolhapuri chicken curry." },
  { id: 342, name: "Chicken Hyderabadi", price: 390, category: "Indian Curries", description: "Chicken cooked in vibrant green herb gravy." },
  { id: 343, name: "Chicken Kadai", price: 390, category: "Indian Curries", description: "Wok-cooked chicken with bell peppers and whole spices." },
  { id: 344, name: "Ginger Chicken", price: 390, category: "Indian Curries", description: "Chicken gravy flavored with fresh julienned ginger." },
  { id: 345, name: "Mutton Rogan Josh", price: 520, category: "Indian Curries", description: "Kashmiri slow-braised tender lamb curry." },
  { id: 360, name: "American Cheese Corn Sandwich", price: 310, category: "Sandwiches & Burgers", description: "Loaded with sweet corn and melted cheese." },
  { id: 361, name: "Veg Club Sandwich", price: 320, category: "Sandwiches & Burgers", description: "Triple-decker vegetable and cheese sandwich." },
  { id: 362, name: "Chicken Club Sandwich", price: 370, category: "Sandwiches & Burgers", description: "Triple-decker chicken, egg, and lettuce club." },
  { id: 363, name: "Classic Grilled Chicken Sandwich", price: 340, category: "Sandwiches & Burgers", description: "Juicy grilled chicken breast with lettuce and mayo." },
  { id: 364, name: "Turkish Style Lamb Sliders", price: 490, category: "Sandwiches & Burgers", description: "Spiced minced lamb mini burgers." },
  { id: 365, name: "Farm Cheese Slider", price: 380, category: "Sandwiches & Burgers", description: "Crispy cheese patty sliders." },
  { id: 366, name: "Pulled Chicken Slider", price: 380, category: "Sandwiches & Burgers", description: "Slow-cooked BBQ pulled chicken mini burgers." },
  { id: 380, name: "Phulka", price: 65, category: "Rice & Breads", description: "Soft puffed wheat bread." },
  { id: 381, name: "Roti / Butter Roti", price: 75, category: "Rice & Breads", description: "Whole wheat tandoori roti." },
  { id: 382, name: "Kulcha / Butter Kulcha", price: 95, category: "Rice & Breads", description: "Soft leavened bread." },
  { id: 383, name: "Curd Rice", price: 200, category: "Rice & Breads", description: "South Indian comfort tempered yogurt rice." },
  { id: 384, name: "Ghee Rice", price: 240, category: "Rice & Breads", description: "Aromatic basmati rice tempered in ghee." },
  { id: 385, name: "Jeera Rice", price: 240, category: "Rice & Breads", description: "Cumin tempered basmati rice." },
  { id: 386, name: "Dal Khichdi", price: 265, category: "Rice & Breads", description: "Lentil and rice comfort porridge." },
  { id: 387, name: "Palak Rice", price: 265, category: "Rice & Breads", description: "Spinach seasoned rice." },
  { id: 388, name: "Veg Biryani", price: 300, category: "Rice & Breads", description: "Layered aromatic vegetable biryani." },
  { id: 389, name: "Egg Biryani", price: 325, category: "Rice & Breads", description: "Spiced biryani with boiled eggs." },
  { id: 390, name: "Chicken Biryani", price: 390, category: "Rice & Breads", description: "Slow-cooked dum chicken biryani." },
  { id: 391, name: "Mutton Biryani", price: 490, category: "Rice & Breads", description: "Tender lamb layered aromatic biryani." },
  { id: 392, name: "Naan / Butter Naan / Butter Garlic Naan / Cheese Garlic Naan", price: 115, category: "Rice & Breads", description: "Choice of tandoori naan." },
  { id: 410, name: "Chocolate & Walnut Brownie", price: 145, category: "Desserts", description: "Fudgy brownie packed with crunchy walnuts." },
  { id: 411, name: "New York Baked Cheesecake", price: 260, category: "Desserts", description: "Rich and creamy baked vanilla cheesecake." },
  { id: 412, name: "Chocolate Walnut Brownie With Ice Cream", price: 195, category: "Desserts", description: "Served warm with a scoop of vanilla ice cream." },
  { id: 413, name: "Gulab Jamun With Ice Cream", price: 195, category: "Desserts", description: "Warm dumplings with vanilla ice cream." },
  { id: 414, name: "Blueberry / Strawberry Cheesecake", price: 260, category: "Desserts", description: "Baked cheesecake topped with fruit compote." },
  { id: 415, name: "Gulab Jamun (2 pcs)", price: 145, category: "Desserts", description: "Classic syrupy milk-solid dumplings." },
  { id: 500, name: "Kingfisher Premium (Draught)", price: 830, category: "Draught Beer", description: "Tap / Pint / Pitcher options available." },
  { id: 501, name: "Kingfisher Ultra (Draught)", price: 1010, category: "Draught Beer", description: "Smooth premium draft beer." },
  { id: 502, name: "Budweiser Premium (Draught)", price: 1040, category: "Draught Beer", description: "Crisp American style lager on tap." },
  { id: 503, name: "Budweiser Magnum (Draught)", price: 1105, category: "Draught Beer", description: "Strong premium draft." },
  { id: 504, name: "Hoegaarden (Draught)", price: 1420, category: "Draught Beer", description: "Belgian white wheat beer on tap." },
  { id: 505, name: "Toit Tint-In-Wit (Draught)", price: 1040, category: "Draught Beer", description: "Craft witbier on tap." },
  { id: 506, name: "Toit Hefeweizen (Draught)", price: 1040, category: "Draught Beer", description: "German style wheat craft beer." },
  { id: 510, name: "Kingfisher Premium (Bottle)", price: 230, category: "Bottled Beer", description: "330ml bottle." },
  { id: 511, name: "Kingfisher Ultra (Bottle)", price: 275, category: "Bottled Beer", description: "330ml bottle." },
  { id: 512, name: "Amstel Grande (Bottle)", price: 250, category: "Bottled Beer", description: "330ml bottle." },
  { id: 513, name: "Heineken Silver (Bottle)", price: 295, category: "Bottled Beer", description: "330ml bottle." },
  { id: 514, name: "Carlsberg Smooth (Bottle)", price: 275, category: "Bottled Beer", description: "330ml bottle." },
  { id: 515, name: "Tuborg Strong (Bottle)", price: 265, category: "Bottled Beer", description: "330ml bottle." },
  { id: 516, name: "Budweiser Premium (Bottle)", price: 305, category: "Bottled Beer", description: "330ml bottle." },
  { id: 517, name: "Budweiser Magnum (Bottle)", price: 325, category: "Bottled Beer", description: "330ml bottle." },
  { id: 518, name: "Hoegaarden (Bottle)", price: 330, category: "Bottled Beer", description: "330ml bottle." },
  { id: 519, name: "Hoegaarden Rosee (Bottle)", price: 330, category: "Bottled Beer", description: "330ml bottle." },
  { id: 520, name: "Hoegaarden Nectarine (Bottle)", price: 330, category: "Bottled Beer", description: "330ml bottle." },
  { id: 521, name: "Corona (Bottle)", price: 390, category: "Bottled Beer", description: "330ml bottle with lime." },
  { id: 530, name: "Picante de la Casa", price: 685, category: "Classic Cocktails", description: "Tequila, Coriander, Red Chilli, Sweet & Sour Mix." },
  { id: 531, name: "Paloma", price: 685, category: "Classic Cocktails", description: "Tequila, Grapefruit, Sea salt, Sweet & Sour Mix." },
  { id: 532, name: "Cosmopolitan", price: 620, category: "Classic Cocktails", description: "Vodka, Cranberry Juice, Lime Juice, Triple Sec." },
  { id: 533, name: "Espresso Martini", price: 620, category: "Classic Cocktails", description: "Vodka, Espresso, Sweet & Sour Mix." },
  { id: 534, name: "Screwdriver", price: 620, category: "Classic Cocktails", description: "Vodka, Lime, Orange Juice." },
  { id: 535, name: "Martini", price: 515, category: "Classic Cocktails", description: "Gin, Martini Bianco." },
  { id: 536, name: "Gimlet", price: 515, category: "Classic Cocktails", description: "Gin, Lime Cordial, Sour Mix." },
  { id: 537, name: "Piña Colada", price: 515, category: "Classic Cocktails", description: "White Rum, Pineapple, Coconut, Fresh Cream." },
  { id: 538, name: "Bloody Mary", price: 620, category: "Classic Cocktails", description: "Vodka, Tomato Juice, Lime Juice, Worcestershire Sauce & Tabasco." },
  { id: 539, name: "Hot Toddy", price: 370, category: "Classic Cocktails", description: "Brandy, Indian Spices, Honey, Hot water." },
  { id: 540, name: "Margarita", price: 620, category: "Classic Cocktails", description: "Tequila, Lime Juice, Triplesec." },
  { id: 541, name: "Whisky Sour", price: 620, category: "Classic Cocktails", description: "Whisky, Egg White, Sweet and Sour Mix." },
  { id: 542, name: "Mojito", price: 515, category: "Classic Cocktails", description: "White Rum, Mint, Sweet & Sour Mix, Club Soda." },
  { id: 543, name: "Daiquiri", price: 515, category: "Classic Cocktails", description: "White Rum, Sweet & Sour Mix." },
  { id: 544, name: "Red / White Sangria", price: 410, category: "Classic Cocktails", description: "Wine based fruit pitcher." },
  { id: 545, name: "Long Island Ice Tea", price: 630, category: "Classic Cocktails", description: "Classic multi-spirit powerhouse cocktail." },
  { id: 550, name: "Raahi G&T", price: 620, category: "Signature Cocktails", description: "Gin, Star Anise, Cloves, Cinnamon, Cardamom, Fresh Cucumber, Elderflower Syrup, Lime Juice, Tonic Water." },
  { id: 551, name: "Citrus Dream", price: 620, category: "Signature Cocktails", description: "Gin, Triple Sec, Sweet & Sour, Fresh Grapefruit Juice." },
  { id: 552, name: "Berry Basil Smash", price: 580, category: "Signature Cocktails", description: "Scotch, Sour Mix, Mixed Berry Syrup, Basil Leaves, Vegan Foam." },
  { id: 553, name: "This is our Picante", price: 620, category: "Signature Cocktails", description: "Tequila, Triple Sec, Fresh Pineapple Juice, Sour Mix, Jalapeno Brine & Chunks, Cilantro." },
  { id: 554, name: "Watermelon & Jalapeno G&T", price: 580, category: "Signature Cocktails", description: "Gin, Jalapeno, Watermelon, Mint & Tonic Water." },
  { id: 555, name: "Tropical Fizz", price: 515, category: "Signature Cocktails", description: "White Rum, Coconut Syrup, Passion Fruit Syrup, Fresh Pineapple Juice, Orange Juice, Sparkling Water." },
  { id: 556, name: "Lavender Spritz", price: 515, category: "Signature Cocktails", description: "London Dry Gin, Citric, Lavender Syrup, Sparkling Water." },
  { id: 557, name: "Passionate Collins", price: 620, category: "Signature Cocktails", description: "Vodka, Passion Fruit Puree, Lychee Juice, Sour Mix, Sage Leaves, Sparkling Water." },
  { id: 558, name: "Cucumber Mint Cooler", price: 515, category: "Signature Cocktails", description: "London Dry Gin, Fresh Cucumber Juice, Fresh Mint Leaves, Sweet & Sour Mix." },
  { id: 559, name: "Booze in a Shell", price: 830, category: "Signature Cocktails", description: "Vodka, Elderflower Syrup, Coconut Water, Coconut Syrup, Sour Mix, Kingfisher Premium." },
  { id: 560, name: "Brass Monkey", price: 470, category: "Signature Cocktails", description: "Dark Rum, Fresh Pineapple & Indian spice syrup, Coconut Water." },
  { id: 561, name: "Pineapple Rummy", price: 490, category: "Signature Cocktails", description: "White Rum, Fresh Pineapple, Curry Leaves, Lime Juice, Spiced Pineapple Cubes." },
  { id: 562, name: "Velvet Sunset", price: 580, category: "Signature Cocktails", description: "Gin, Red Wine Reduction, Fresh Watermelon, Sour Mix." },
  { id: 563, name: "Scarlet Bloom", price: 620, category: "Signature Cocktails", description: "Tequila, Cranberry Rosemary Reduction, Sour Mix." },
  { id: 570, name: "Bokka Vishesha!", price: 729, category: "Signature LIIT", description: "Vodka, Gin, White Rum, Tequila, Kokum Syrup, Coconut Water." },
  { id: 571, name: "Smashed & How", price: 729, category: "Signature LIIT", description: "Vodka, Gin, White Rum, Tequila, Raspberry, Basil, Soda." },
  { id: 572, name: "With Love, Raahi!", price: 729, category: "Signature LIIT", description: "Vodka, Gin, White Rum, Tequila, Butterfly Pea Tea, Sprite." },
  { id: 573, name: "High! How Are You?", price: 729, category: "Signature LIIT", description: "Vodka, Gin, White Rum, Tequila, Chamomile, Sprite." },
  { id: 580, name: "Candied Apple Sangria", price: 419, category: "Signature Sangrias", description: "White Wine, Green Apple, Caramel, Vodka, Soda." },
  { id: 581, name: "Peachy Pom Sangria", price: 419, category: "Signature Sangrias", description: "White Wine, Peach, Lime, Apple, Vodka, Soda." },
  { id: 582, name: "Citrus Wave Sangria", price: 419, category: "Signature Sangrias", description: "White Wine, Triple Sec, Orange, Lime, Orange, Vodka, Soda." },
  { id: 583, name: "Berry Breeze Sangria", price: 419, category: "Signature Sangrias", description: "White Wine, Strawberry, Lime, Vodka, Soda." },
  { id: 584, name: "Crimson Spice Sangria", price: 419, category: "Signature Sangrias", description: "Red Wine, Passion Fruit, Apple, Orange, Lime, Brandy, Indian Spices, Soda." },
  { id: 585, name: "Rustic Plum Sangria", price: 419, category: "Signature Sangrias", description: "Red Wine, Plum, Thyme, Lime, Brandy." },
  { id: 590, name: "Peach Bull", price: 250, category: "Mocktails", description: "Peach & Strawberry Syrup, Lemonade, Red Bull." },
  { id: 591, name: "Paris Summer", price: 250, category: "Mocktails", description: "Grape Juice, Lavender Cordial, Berry & Tea Soda." },
  { id: 592, name: "Cream Scotch Soda", price: 250, category: "Mocktails", description: "Butterscotch Cream, topped with soda." },
  { id: 593, name: "Mango Boom", price: 250, category: "Mocktails", description: "Mango Crush, Mango Juice, Fresh Cream." },
  { id: 594, name: "Ice Tea", price: 250, category: "Mocktails", description: "Peach / Passion Fruit / Lemon / Strawberry / Mango." },
  { id: 595, name: "Reviver", price: 250, category: "Mocktails", description: "Fresh Watermelon, Mint Leaves, Orange Juice, Apple Juice." },
  { id: 596, name: "Blue Sky", price: 250, category: "Mocktails", description: "Ginger Ale, Lime Juice, Blue Curacao." },
  { id: 597, name: "Oreo Shake", price: 250, category: "Mocktails", description: "Rich blended Oreo milkshake." },
  { id: 598, name: "Virgin Mojito", price: 250, category: "Mocktails", description: "Mint, Lime, Sugar, Sprite." },
  { id: 599, name: "Virgin Piña Colada", price: 250, category: "Mocktails", description: "Pineapple, Coconut, Fresh Cream." },
  { id: 600, name: "Virgin Guava Mary", price: 250, category: "Mocktails", description: "Spiced guava juice blend." },
  { id: 610, name: "Jägermeister Ice Cold", price: 475, category: "Shooters", description: "Chilled herbal shot." },
  { id: 611, name: "Bailey's Irish Cream", price: 420, category: "Shooters", description: "Smooth creamy liqueur shot." },
  { id: 612, name: "Xenta Absenta", price: 650, category: "Shooters", description: "Strong absinthe shot." },
  { id: 613, name: "Sambuca", price: 300, category: "Shooters", description: "Anise-flavored liqueur shot." },
  { id: 614, name: "Amarula", price: 580, category: "Shooters", description: "Marula fruit cream liqueur." },
  { id: 615, name: "Kahlua", price: 400, category: "Shooters", description: "Coffee liqueur shot." },
  { id: 616, name: "Fireball", price: 225, category: "Shooters", description: "Cinnamon whisky shot." },
  { id: 617, name: "Kamikaze", price: 290, category: "Shooters", description: "Vodka, triple sec, lime juice." },
  { id: 618, name: "Brain Hemorrhage", price: 425, category: "Shooters", description: "Layered schnapps and Irish cream." },
  { id: 619, name: "B-52", price: 495, category: "Shooters", description: "Kahlua, Bailey's, Grand Marnier layered shot." },
  { id: 620, name: "Jäger Beer Boom", price: 580, category: "Shooters", description: "Jager drop in beer." },
  { id: 621, name: "Jäger Energy", price: 580, category: "Shooters", description: "Jägermeister with Red Bull." },
  { id: 622, name: "Flaming Lamborghini Tower", price: 1299, category: "Shooters", description: "Multi-tiered flaming shot tower." },
  { id: 630, name: "Smirnoff", price: 195, category: "Vodka", description: "Classic clean vodka shot." },
  { id: 631, name: "Smirnoff Minty Jamun / Mango Mirchi / Zesty Lime", price: 195, category: "Vodka", description: "Flavored Smirnoff variants." },
  { id: 632, name: "Ketel One", price: 275, category: "Vodka", description: "Dutch crafted premium vodka." },
  { id: 633, name: "Absolut & Flavours", price: 295, category: "Vodka", description: "Swedish premium vodka." },
  { id: 634, name: "Ciroc", price: 400, category: "Vodka", description: "French grape-distilled luxury vodka." },
  { id: 635, name: "Grey Goose", price: 430, category: "Vodka", description: "Ultra-premium French wheat vodka." },
  { id: 640, name: "Greater Than Gin", price: 170, category: "Gin", description: "Indian craft gin." },
  { id: 641, name: "Bombay Sapphire", price: 275, category: "Gin", description: "London dry premium gin." },
  { id: 642, name: "Tanqueray Gin", price: 295, category: "Gin", description: "Classic London dry." },
  { id: 643, name: "Hapusa", price: 295, category: "Gin", description: "Himalayan dry craft gin." },
  { id: 644, name: "Beefeater", price: 295, category: "Gin", description: "London dry gin." },
  { id: 645, name: "Hendrick's", price: 460, category: "Gin", description: "Infused with cucumber and rose petal." },
  { id: 646, name: "Roku", price: 515, category: "Gin", description: "Japanese botanical craft gin." },
  { id: 647, name: "Tanqueray No. 10", price: 525, category: "Gin", description: "Small-batch ultra premium gin." },
  { id: 648, name: "Monkey 47", price: 620, category: "Gin", description: "Black Forest German dry gin." },
  { id: 650, name: "Old Monk", price: 125, category: "Rum", description: "Legendary Indian dark rum." },
  { id: 651, name: "Bacardi White", price: 195, category: "Rum", description: "Light Puerto Rican rum." },
  { id: 652, name: "Bacardi Flavours", price: 195, category: "Rum", description: "Flavored white rum." },
  { id: 653, name: "Amrut Two Indies", price: 195, category: "Rum", description: "Craft rum from Amrut." },
  { id: 660, name: "Mansion House", price: 150, category: "Brandy", description: "Classic French-style brandy." },
  { id: 661, name: "Morpheus", price: 220, category: "Brandy", description: "Premium blended brandy." },
  { id: 662, name: "Hennessy VS", price: 590, category: "Brandy", description: "Cognac Very Special." },
  { id: 663, name: "Hennessy VSOP", price: 895, category: "Brandy", description: "Cognac Very Superior Old Pale." },
  { id: 670, name: "Don Angel Silver", price: 305, category: "Tequila", description: "Classic tequila shot." },
  { id: 671, name: "Camino Gold / Silver", price: 305, category: "Tequila", description: "Traditional Mexican tequila." },
  { id: 672, name: "Maya Pistola Joven", price: 305, category: "Tequila", description: "Indian craft agave spirit." },
  { id: 673, name: "Jose Cuervo Silver", price: 335, category: "Tequila", description: "World-renowned tequila." },
  { id: 674, name: "Don Julio Blanco", price: 495, category: "Tequila", description: "100% blue agave tequila." },
  { id: 675, name: "Maya Pistola Reposado", price: 515, category: "Tequila", description: "Aged Indian agave spirit." },
  { id: 676, name: "Patron Silver", price: 620, category: "Tequila", description: "Ultra-premium tequila." },
  { id: 677, name: "Patron Reposado", price: 685, category: "Tequila", description: "Aged ultra-premium tequila." },
  { id: 678, name: "Don Julio Reposado", price: 695, category: "Tequila", description: "Aged blue agave luxury tequila." },
  { id: 690, name: "Jim Beam", price: 265, category: "Irish / Bourbon / Tennessee", description: "Kentucky straight bourbon." },
  { id: 691, name: "Jameson Irish", price: 305, category: "Irish / Bourbon / Tennessee", description: "Smooth triple-distilled Irish whiskey." },
  { id: 692, name: "Jack Daniel's", price: 370, category: "Irish / Bourbon / Tennessee", description: "Tennessee whiskey." },
  { id: 693, name: "Jack Daniel's (Fire/Apple/Honey)", price: 370, category: "Irish / Bourbon / Tennessee", description: "Flavored Tennessee whiskey." },
  { id: 694, name: "Jim Beam Black", price: 355, category: "Irish / Bourbon / Tennessee", description: "Extra-aged bourbon." },
  { id: 695, name: "Maker's Mark", price: 475, category: "Irish / Bourbon / Tennessee", description: "Handcrafted bourbon whisky." },
  { id: 696, name: "Woodford Reserve", price: 515, category: "Irish / Bourbon / Tennessee", description: "Kentucky straight bourbon." },
  { id: 697, name: "Jack Daniel's Single Barrel", price: 620, category: "Irish / Bourbon / Tennessee", description: "Single barrel select Tennessee whiskey." },
  { id: 700, name: "Johnnie Walker Blonde", price: 225, category: "Blended Scotch", description: "Light and fruity scotch blend." },
  { id: 701, name: "Royal Ranthambore", price: 225, category: "Blended Scotch", description: "Royal Indian blended whisky." },
  { id: 702, name: "Dewar's White Label", price: 225, category: "Blended Scotch", description: "Double-aged blended Scotch." },
  { id: 703, name: "100 Pipers", price: 225, category: "Blended Scotch", description: "Smooth blended Scotch." },
  { id: 704, name: "Black & White", price: 225, category: "Blended Scotch", description: "Classic blended Scotch whisky." },
  { id: 705, name: "Black Dog Centenary", price: 225, category: "Blended Scotch", description: "Rich blended Scotch." },
  { id: 706, name: "Teacher's Highland Cream", price: 225, category: "Blended Scotch", description: "Highland malt blend." },
  { id: 707, name: "VAT 69", price: 225, category: "Blended Scotch", description: "Classic blended Scotch." },
  { id: 708, name: "Johnnie Walker Red Label", price: 295, category: "Blended Scotch", description: "Pioneer blend." },
  { id: 709, name: "100 Pipers 12 yrs", price: 295, category: "Blended Scotch", description: "Aged blended Scotch." },
  { id: 710, name: "Teachers 50", price: 295, category: "Blended Scotch", description: "Special blended Scotch whisky." },
  { id: 711, name: "Black Dog Triple Gold", price: 295, category: "Blended Scotch", description: "Triple matured blend." },
  { id: 712, name: "Ballantine's Finest", price: 295, category: "Blended Scotch", description: "Complex blended Scotch." },
  { id: 713, name: "Teachers Highland Cream Reserve", price: 340, category: "Blended Scotch", description: "Aged reserve blend." },
  { id: 714, name: "Ballantine's 7 yrs", price: 345, category: "Blended Scotch", description: "Bourbon barrel finish scotch." },
  { id: 715, name: "Dewar's 12 yrs", price: 390, category: "Blended Scotch", description: "Aged 12 years double aged." },
  { id: 716, name: "Dewar's 15 yrs", price: 410, category: "Blended Scotch", description: "Aged 15 years." },
  { id: 717, name: "Ballantine's 12 yrs", price: 410, category: "Blended Scotch", description: "Aged 12 years." },
  { id: 718, name: "Monkey Shoulder", price: 475, category: "Blended Scotch", description: "100% malt whisky blend." },
  { id: 719, name: "Dewar's 18 yrs", price: 685, category: "Blended Scotch", description: "Ultra-aged blended Scotch." },
  { id: 730, name: "Amrut Fusion", price: 305, category: "Single Malt Whiskey", description: "Award-winning Indian single malt." },
  { id: 731, name: "The Glenlivet Caribbean Reserve", price: 410, category: "Single Malt Whiskey", description: "Rum barrel finish single malt." },
  { id: 732, name: "Godawan 01 Rich & Round", price: 410, category: "Single Malt Whiskey", description: "Artisanal Rajasthani single malt." },
  { id: 733, name: "Godawan 02 Fruit & Spice", price: 410, category: "Single Malt Whiskey", description: "Artisanal Rajasthani single malt." },
  { id: 734, name: "Talisker 10 yrs", price: 495, category: "Single Malt Whiskey", description: "Smoky maritime single malt from Isle of Skye." },
  { id: 735, name: "Glenfiddich 12 yrs", price: 495, category: "Single Malt Whiskey", description: "Speyside single malt." },
  { id: 736, name: "The Glenlivet 12 yrs", price: 495, category: "Single Malt Whiskey", description: "Classic Speyside single malt." },
  { id: 737, name: "Singleton 12 yrs", price: 495, category: "Single Malt Whiskey", description: "Rich and smooth single malt." },
  { id: 738, name: "Ardmore 12 yrs", price: 495, category: "Single Malt Whiskey", description: "Peated Highland single malt." },
  { id: 739, name: "Laphroaig Single 10 yrs", price: 495, category: "Single Malt Whiskey", description: "Heavily peated Islay single malt." },
  { id: 740, name: "Glenmorangie 10 yrs", price: 515, category: "Single Malt Whiskey", description: "Highland single malt." },
  { id: 741, name: "Toki Suntory", price: 515, category: "Single Malt Whiskey", description: "Japanese blended whisky." },
  { id: 742, name: "Aberfeldy 12 yrs", price: 515, category: "Single Malt Whiskey", description: "Highland single malt." },
  { id: 743, name: "Bowmore 12 yrs Islay Single Malt", price: 545, category: "Single Malt Whiskey", description: "Islands peated single malt." },
  { id: 744, name: "Oban", price: 625, category: "Single Malt Whiskey", description: "West Highland single malt." },
  { id: 745, name: "The Glenlivet 15 yrs", price: 685, category: "Single Malt Whiskey", description: "French oak reserve single malt." },
  { id: 746, name: "Glenfiddich 15 yrs", price: 725, category: "Single Malt Whiskey", description: "Solera vatting single malt." },
  { id: 747, name: "Lagavulin 16 yrs", price: 790, category: "Single Malt Whiskey", description: "Intense smoky Islay single malt." },
  { id: 748, name: "Hibiki", price: 990, category: "Single Malt Whiskey", description: "Legendary Japanese harmony whisky." },
  { id: 749, name: "Yamazaki", price: 990, category: "Single Malt Whiskey", description: "Japanese single malt whisky." },
  { id: 760, name: "Chivas Regal 12 yrs", price: 395, category: "Premium Scotch", description: "Blended Scotch whisky." },
  { id: 761, name: "Johnnie Walker Black Label", price: 420, category: "Premium Scotch", description: "Iconic aged blended Scotch." },
  { id: 762, name: "Johnnie Walker Double Black", price: 475, category: "Premium Scotch", description: "Intense smoky blend." },
  { id: 763, name: "Johnnie Walker Gold Label", price: 515, category: "Premium Scotch", description: "Luxurious creamy blend." },
  { id: 764, name: "Chivas Regal 15 yrs", price: 580, category: "Premium Scotch", description: "Selective cask finish scotch." },
  { id: 765, name: "Chivas Regal 18 yrs", price: 660, category: "Premium Scotch", description: "Exceptionally rich aged scotch." },
  { id: 766, name: "Royal Salute 21 yrs", price: 1165, category: "Premium Scotch", description: "Aged luxury blended Scotch." },
  { id: 767, name: "Johnnie Walker Blue Label", price: 1210, category: "Premium Scotch", description: "Rareest blend masterpiece." },
  { id: 800, name: "Fratelli Classic Shiraz (Red Wine)", price: 1199, category: "Wine", description: "Bottle (1199)." },
  { id: 801, name: "Sula Zinfandel (Red Wine)", price: 1750, category: "Wine", description: "Bottle (1750)." },
  { id: 802, name: "Sula Cabernet Shiraz (Red Wine)", price: 1750, category: "Wine", description: "Bottle (1750)." },
  { id: 803, name: "Fratelli Classic Chenin (White Wine)", price: 1199, category: "Wine", description: "Bottle (1199)." },
  { id: 804, name: "Sula Chenin Blanc (White Wine)", price: 1750, category: "Wine", description: "Bottle (1750)." },
  { id: 805, name: "Sula Sauvignon Blanc (White Wine)", price: 1750, category: "Wine", description: "Bottle (1750)." },
  { id: 806, name: "Bush Ballad Shiraz (Australia)", price: 2350, category: "Wine", description: "Bottle (2350)." },
  { id: 807, name: "Monte Pacifico Merlot (Chile)", price: 2350, category: "Wine", description: "Bottle (2350)." },
  { id: 808, name: "Mateus Rose (Portugal)", price: 2700, category: "Wine", description: "Bottle (2700)." },
  { id: 809, name: "Two Oceans Shiraz (South African)", price: 2700, category: "Wine", description: "Bottle (2700)." },
  { id: 810, name: "Two Oceans Chardonnay (South African)", price: 2700, category: "Wine", description: "Bottle (2700)." },
  { id: 811, name: "Two Oceans Sauvignon Blanc (South African)", price: 2700, category: "Wine", description: "Bottle (2700)." },
  { id: 812, name: "Sula Brut (Bottle)", price: 3045, category: "Wine", description: "Indian sparkling wine bottle." },
  { id: 813, name: "Moët & Chandon (Bottle)", price: 13500, category: "Wine", description: "Luxury French champagne." },
  { id: 814, name: "Martini Asti / Rose / Prosecco (Bottle)", price: 3800, category: "Wine", description: "Italian sparkling wine bottle." },
  { id: 830, name: "Cranberry / Blackberry Breezer", price: 265, category: "Breezer", description: "Alcopop refresher." },
  { id: 831, name: "Blueberry / Mango Peach Breezer", price: 265, category: "Breezer", description: "Alcopop refresher." },
  { id: 832, name: "Jamaican Passion Breezer", price: 265, category: "Breezer", description: "Alcopop refresher." },
  { id: 840, name: "Mineral Water", price: 50, category: "Beverages", description: "Bottled water." },
  { id: 841, name: "Soda", price: 45, category: "Beverages", description: "Club soda." },
  { id: 842, name: "Lime Water / Soda", price: 100, category: "Beverages", description: "Fresh lime cooler." },
  { id: 843, name: "Aerated Drinks", price: 65, category: "Beverages", description: "Cola / Sprite / Fanta." },
  { id: 844, name: "Diet Coke", price: 95, category: "Beverages", description: "Zero sugar cola." },
  { id: 845, name: "Ginger Ale", price: 105, category: "Beverages", description: "Crisp ginger beverage." },
  { id: 846, name: "Tonic Water", price: 115, category: "Beverages", description: "Schweppes tonic." },
  { id: 847, name: "Canned Juice", price: 115, category: "Beverages", description: "Cranberry / Orange / Pineapple." },
  { id: 848, name: "Red Bull", price: 200, category: "Beverages", description: "Energy drink." }
];

export default function OrderPage() {
  const searchParams = useSearchParams();
  const tableNum = searchParams.get("table") || "01";

  const [activeTab, setActiveTab] = useState<"menu" | "status">("menu");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [tableOrders, setTableOrders] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchTableOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("table_num", tableNum)
        .order("created_at", { ascending: false });

      if (data) setTableOrders(data);
      if (error) console.error(error);
    };

    fetchTableOrders();

    const channel = supabase
      .channel(`table-${tableNum}-realtime`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `table_num=eq.${tableNum}` },
        () => {
          fetchTableOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableNum]);

  const updateQuantity = (itemId: number, delta: number) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      const updated = current + delta;
      if (updated <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: updated };
    });
  };

  const calculateCartTotal = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = MASTER_PUB_MENU.find((m) => m.id === Number(id));
      return sum + (item ? item.price * qty : 0);
    }, 0);
  };

  const handlePlaceOrder = async () => {
    const itemsArray = Object.entries(cart).map(([id, qty]) => {
      const item = MASTER_PUB_MENU.find((m) => m.id === Number(id));
      return {
        id: item?.id,
        name: item?.name,
        price: item?.price,
        qty: qty
      };
    });

    if (itemsArray.length === 0) return;

    setIsSubmitting(true);
    const totalAmount = calculateCartTotal();

    const { error } = await supabase.from("orders").insert([
      {
        table_num: tableNum,
        items: itemsArray,
        total: totalAmount,
        status: "Pending Kitchen"
      }
    ]);

    setIsSubmitting(false);

    if (error) {
      alert("Failed to place order. Please try again.");
      console.error(error);
    } else {
      setCart({});
      setOrderSuccess(true);
      setActiveTab("status");
      setTimeout(() => setOrderSuccess(false), 4000);
    }
  };

  const searchSuggestions = searchQuery.trim() === "" ? [] : MASTER_PUB_MENU.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredItems = MASTER_PUB_MENU.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === "" || 
                          item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchQuery.trim() !== "") {
      return matchesSearch;
    }
    return matchesCategory;
  });

  const cumulativeBill = tableOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <main className="bg-[#06080C] text-[#F4F0EA] min-h-screen font-sans pb-24">
      
      {/* RESPONSIVE HEADER */}
      <nav className="sticky top-0 z-50 bg-[#06080C]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <Link href="/" className="text-xs uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] transition-colors">
              ← Back
            </Link>
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block text-center sm:text-left">Table #{tableNum}</span>
              <h1 className="font-serif text-xl sm:text-2xl text-white">Raahi Pub & Dining Menu</h1>
            </div>
          </div>

          <div className="flex bg-[#12100E] border border-white/10 rounded-full p-1 w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTab("menu")}
              className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all cursor-pointer text-center ${
                activeTab === "menu" ? "bg-[#D4AF37] text-black shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              Menu & Cart
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all relative cursor-pointer text-center ${
                activeTab === "status" ? "bg-[#D4AF37] text-black shadow-md" : "text-gray-400 hover:text-white"
              }`}
            >
              My Table Bill
              {tableOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {tableOrders.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* CATEGORIES & SEARCH BAR */}
      {activeTab === "menu" && (
        <div className="bg-[#12100E]/80 border-b border-white/10 py-3 px-4 sm:px-6 sticky top-[133px] sm:top-[73px] z-40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-3">
            
            <div className="flex gap-2 overflow-x-auto pb-1 w-full lg:w-auto scrollbar-thin scrollbar-thumb-white/20">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSearchQuery("");
                  }}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    selectedCategory === cat && !searchQuery
                      ? "bg-[#D4AF37] text-black shadow-lg" 
                      : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 cursor-pointer shrink-0"
                >
                  Clear ✕
                </button>
              )}
            </div>

            <div className="w-full lg:w-72 shrink-0 relative">
              <input
                type="text"
                placeholder="Search food & drinks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-[#1F1C18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
              />

              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#12100E] border border-white/15 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                  {searchSuggestions.map((sug) => (
                    <div
                      key={sug.id}
                      onClick={() => {
                        setSearchQuery(sug.name);
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
        </div>
      )}

      {orderSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-2xl text-xs uppercase tracking-widest text-center animate-pulse">
            ✓ Order placed successfully! Check "My Table Bill" tab for live status.
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
        {activeTab === "menu" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-serif text-2xl sm:text-3xl text-white border-b border-white/10 pb-4">
                {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory === "All" ? "Full Pub Menu & Bar" : `${selectedCategory}`}
              </h2>
              
              {filteredItems.length === 0 ? (
                <div className="bg-[#12100E] border border-white/10 rounded-2xl p-12 text-center text-gray-400 text-xs sm:text-sm">
                  No items match your search or category. Try searching for something else!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="bg-[#12100E] border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="font-serif text-base text-white">{item.name}</h3>
                          <span className="text-[#D4AF37] font-semibold text-sm shrink-0">₹{item.price}</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed mb-4">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500">{item.category}</span>
                        {cart[item.id] ? (
                          <div className="flex items-center gap-3 bg-[#1F1C18] border border-white/10 px-3 py-1 rounded-xl">
                            <button onClick={() => updateQuantity(item.id, -1)} className="text-[#D4AF37] font-bold cursor-pointer">-</button>
                            <span className="text-white text-xs font-bold">{cart[item.id]}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="text-[#D4AF37] font-bold cursor-pointer">+</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer"
                          >
                            Add +
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-36">
              <div className="bg-[#12100E] border border-white/10 rounded-2xl p-6 shadow-2xl">
                <h3 className="font-serif text-xl text-white mb-4 border-b border-white/10 pb-3">Current Cart</h3>

                {Object.keys(cart).length === 0 ? (
                  <p className="text-gray-500 text-xs py-8 text-center">Your cart is empty. Select food or drinks from the menu.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                      {Object.entries(cart).map(([id, qty]) => {
                        const item = MASTER_PUB_MENU.find((m) => m.id === Number(id));
                        return (
                          <div key={id} className="flex justify-between items-center text-sm">
                            <div>
                              <span className="text-white block font-medium">{item?.name}</span>
                              <span className="text-xs text-gray-500">Qty: {qty}</span>
                            </div>
                            <span className="text-[#D4AF37] font-semibold">₹{(item?.price || 0) * Number(qty)}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-white/10 pt-4 flex justify-between items-center text-base font-bold">
                      <span className="text-gray-300">Total</span>
                      <span className="text-[#D4AF37]">₹{calculateCartTotal()}</span>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E6C567] to-[#AA7C11] text-black py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer shadow-lg mt-2 disabled:opacity-50"
                    >
                      {isSubmitting ? "Placing Order..." : "Place Order to Kitchen / Bar"}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#12100E] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">Table #{tableNum} Ledger</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white mt-1">Live Bill & Status</h2>
              </div>
              <div className="bg-[#1F1C18] border border-white/10 px-6 py-4 rounded-2xl w-full sm:w-auto text-left sm:text-right">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 block">Cumulative Table Total</span>
                <span className="font-serif text-2xl text-[#D4AF37]">₹{cumulativeBill}</span>
              </div>
            </div>

            {tableOrders.length === 0 ? (
              <div className="bg-[#12100E] border border-white/10 rounded-2xl p-16 text-center text-gray-400 text-sm">
                No orders placed for this table yet. Go back to the Menu tab to order food & drinks!
              </div>
            ) : (
              <div className="space-y-4">
                {tableOrders.map((order, index) => (
                  <div key={order.id} className="bg-[#12100E] border border-white/10 rounded-2xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                      <div>
                        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                          Round #{tableOrders.length - index}
                        </span>
                        <span className="text-gray-500 text-xs ml-3">ID: {order.id.slice(0, 6)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1 rounded-full uppercase tracking-widest font-bold ${
                          order.status === "Served" 
                            ? "bg-green-500/10 text-green-400 border border-green-500/30" 
                            : "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30"
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-white"><strong className="text-[#D4AF37] mr-2">{item.qty}x</strong> {item.name}</span>
                          <span className="text-gray-400">₹{item.price * item.qty}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500 uppercase tracking-widest">Round Total</span>
                      <span className="font-serif text-lg text-[#D4AF37]">₹{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        )}
      </div>
    </main>
  );
}