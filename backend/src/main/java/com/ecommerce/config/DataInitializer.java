package com.ecommerce.config;

import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if database is empty
        if (categoryRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Create Categories
        Category electronics = new Category();
        electronics.setName("Electronics");
        electronics.setDescription("Electronic devices and gadgets");
        electronics = categoryRepository.save(electronics);

        Category clothing = new Category();
        clothing.setName("Clothing");
        clothing.setDescription("Fashion and apparel");
        clothing = categoryRepository.save(clothing);

        Category books = new Category();
        books.setName("Books");
        books.setDescription("Books and literature");
        books = categoryRepository.save(books);

        Category home = new Category();
        home.setName("Home & Kitchen");
        home.setDescription("Home and kitchen essentials");
        home = categoryRepository.save(home);

        Category sports = new Category();
        sports.setName("Sports");
        sports.setDescription("Sports and fitness equipment");
        sports = categoryRepository.save(sports);

        // Create Products - Electronics
        createProduct("Wireless Headphones", "Premium noise-cancelling wireless headphones with 30-hour battery life", 
                new BigDecimal("89.99"), "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", 50, electronics);
        
        createProduct("Smart Watch", "Fitness tracker with heart rate monitor and GPS", 
                new BigDecimal("199.99"), "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", 30, electronics);
        
        createProduct("Laptop Stand", "Ergonomic aluminum laptop stand for better posture", 
                new BigDecimal("45.99"), "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500", 100, electronics);
        
        createProduct("Bluetooth Speaker", "Portable waterproof speaker with amazing sound quality", 
                new BigDecimal("59.99"), "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500", 75, electronics);
        
        createProduct("USB-C Hub", "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader", 
                new BigDecimal("34.99"), "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500", 120, electronics);

        // Clothing
        createProduct("Classic White T-Shirt", "100% cotton comfortable white t-shirt", 
                new BigDecimal("19.99"), "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", 200, clothing);
        
        createProduct("Denim Jeans", "Slim fit blue denim jeans", 
                new BigDecimal("49.99"), "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500", 150, clothing);
        
        createProduct("Leather Jacket", "Genuine leather jacket with modern design", 
                new BigDecimal("149.99"), "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500", 40, clothing);
        
        createProduct("Running Shoes", "Lightweight running shoes with excellent cushioning", 
                new BigDecimal("79.99"), "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", 80, clothing);
        
        createProduct("Winter Coat", "Warm winter coat with hood", 
                new BigDecimal("129.99"), "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500", 60, clothing);

        // Books
        createProduct("The Art of Programming", "Comprehensive guide to software development", 
                new BigDecimal("39.99"), "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500", 90, books);
        
        createProduct("Mystery Novel Collection", "Bestselling mystery novels bundle", 
                new BigDecimal("29.99"), "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500", 70, books);
        
        createProduct("Cooking Masterclass", "Professional cooking techniques and recipes", 
                new BigDecimal("34.99"), "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500", 55, books);
        
        createProduct("Science Fiction Anthology", "Classic sci-fi stories collection", 
                new BigDecimal("24.99"), "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500", 65, books);

        // Home & Kitchen
        createProduct("Coffee Maker", "Programmable coffee maker with thermal carafe", 
                new BigDecimal("79.99"), "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500", 45, home);
        
        createProduct("Blender", "High-speed blender for smoothies and soups", 
                new BigDecimal("69.99"), "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500", 50, home);
        
        createProduct("Cookware Set", "10-piece non-stick cookware set", 
                new BigDecimal("149.99"), "https://images.unsplash.com/photo-1584990347449-39b4aa02d0c6?w=500", 35, home);
        
        createProduct("Air Fryer", "Digital air fryer with 8 preset cooking functions", 
                new BigDecimal("99.99"), "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500", 40, home);
        
        createProduct("Vacuum Cleaner", "Cordless stick vacuum with powerful suction", 
                new BigDecimal("199.99"), "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500", 30, home);

        // Sports
        createProduct("Yoga Mat", "Premium non-slip yoga mat with carrying strap", 
                new BigDecimal("29.99"), "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500", 100, sports);
        
        createProduct("Dumbbells Set", "Adjustable dumbbells 5-50 lbs", 
                new BigDecimal("149.99"), "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500", 25, sports);
        
        createProduct("Resistance Bands", "Set of 5 resistance bands with different strengths", 
                new BigDecimal("24.99"), "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500", 150, sports);
        
        createProduct("Tennis Racket", "Professional tennis racket with carbon fiber frame", 
                new BigDecimal("89.99"), "https://images.unsplash.com/photo-1617083278159-7d1e6c935a6e?w=500", 40, sports);
        
        createProduct("Basketball", "Official size basketball for indoor/outdoor use", 
                new BigDecimal("34.99"), "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500", 80, sports);
    }

    private void createProduct(String name, String description, BigDecimal price, 
                               String imageUrl, Integer stock, Category category) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setImageUrl(imageUrl);
        product.setStock(stock);
        product.setCategory(category);
        productRepository.save(product);
    }
}
