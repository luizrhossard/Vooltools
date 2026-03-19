CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    description VARCHAR(1000),
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    image_url VARCHAR(255),
    category_id INTEGER NOT NULL,
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories (id)
);
