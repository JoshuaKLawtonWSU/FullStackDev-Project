# FullStack Development Project

This is a monorepo-based full-stack e-commerce application built with Next.js, Prisma, and TypeScript.

## Project Structure

```
apps/
  ├── admin/     # Admin dashboard for managing the store
  └── web/       # Customer-facing e-commerce website
packages/
  ├── db/        # Prisma database client and schema
  ├── ui/        # Shared UI components
  ├── utils/     # Shared utility functions
  └── eslint-config/ # Shared ESLint configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd FullStackDev-Project
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create `.env` file within packages/db with link to your Database URL.

4. Generate Prisma client:
   ```bash
   cd packages/db
   pnpm prisma generate
   pnpm prisma db push
   ```

### Development

Start all applications in development mode:

```bash
turbo dev
```

The admin dashboard will be available at [http://localhost:3011](http://localhost:3011).
The web store will be available at [http://localhost:3010](http://localhost:3010).

## API Reference

### Admin APIs

#### Categories API

**Endpoint**: `/api/categories`

- `GET /api/categories`
  - Returns all categories
  - Response: Array of category objects

- `POST /api/categories`
  - Creates a new category
  - Request body:
    ```json
    {
      "name": "Category Name",
      "slug": "category-slug",
      "description": "Optional description"
    }
    ```
  - Validation:
    - Name must be at least 2 characters
    - Slug must be at least 2 characters and contain only lowercase letters, numbers, and hyphens
  - Response: Created category object

#### Products API

**Endpoint**: `/api/products`

- `GET /api/products`
  - Returns all products with related category information
  - Products are ordered by name (ascending)
  - Response: Array of product objects with category details

- `POST /api/products`
  - Creates a new product
  - Request body:
    ```json
    {
      "name": "Product Name",
      "slug": "product-slug",
      "description": "Product description",
      "price": 99.99,
      "inventory": 100,
      "categoryId": "category-uuid"
    }
    ```
  - Validation:
    - Required fields: name, slug, description, price, inventory, categoryId
    - Price must be a positive number
    - Inventory must be a positive integer
    - Category must exist
    - Slug must be unique
  - Response: Created product object with category details

- `DELETE /api/products`
  - Deletes a product
  - Request must include product ID or slug

**Endpoint**: `/api/products/edit/[slug]`

- `GET /api/products/edit/[slug]`
  - Returns a specific product by slug
  - Response: Product object with images

- `POST /api/products/edit/[slug]`
  - Updates an existing product
  - Request body:
    ```json
    {
      "name": "Updated Product Name",
      "description": "Updated description",
      "price": 129.99,
      "inventory": 50,
      "categoryId": "category-uuid",
      "isActive": true,
      "newSlug": "new-product-slug" // Optional
    }
    ```
  - Required fields: name, price
  - Response: Updated product object with category details

#### Users API

**Endpoint**: `/api/users`

- `GET /api/users`
  - Returns all users
  - Response: Array of user objects

**Endpoint**: `/api/users/edit/[id]`

- `GET /api/users/edit/[id]`
  - Returns a specific user by ID
  - Response: User object

- `POST /api/users/edit/[id]`
  - Updates an existing user
  - Response: Updated user object

### Web Store APIs

#### Authentication API

**Endpoint**: `/api/auth/login`

- `POST /api/auth/login`
  - Authenticates a user
  - Response: User session data

**Endpoint**: `/api/auth/register`

- `POST /api/auth/register`
  - Registers a new user
  - Response: Created user object

#### Products API (Frontend)

**Endpoint**: `/api/products`

- `GET /api/products`
  - Returns all active products
  - Products are ordered by creation date (newest first)
  - Response: Array of product objects

#### Categories API (Frontend)

**Endpoint**: `/api/categories`

- `GET /api/categories`
  - Returns all active categories
  - Response: Array of category objects

### Database Schema

Key models include:

- `User`: Customer accounts
- `Category`: Product categories with hierarchical structure
- `Product`: Store products with inventory tracking
- `Order`: Customer orders with items and payment information

## Architecture Decisions

### Monorepo Structure

This project uses a Turborepo monorepo structure to:
- Share code between applications
- Maintain consistent tooling
- Enable parallel and incremental builds
- Simplify dependency management

### Technology Choices

- **Next.js**: Provides server-side rendering, API routes, and optimized builds
- **Prisma**: Type-safe database access with migrations and schema management
- **TypeScript**: Adds static typing for improved developer experience and code quality
- **pnpm**: Efficient package management with workspace support

### Database Design

The database is designed with:
- Normalized structure to minimize data duplication
- Proper relationship modeling (one-to-many, many-to-many)
- Support for hierarchical categories
- Soft deletion for important entities

## Deployment

The application is configured for deployment on Vercel:

1. Connect your Vercel account to your repository
2. Set up the necessary environment variables
3. Deploy both apps individually or use Vercel's monorepo support

## License

MIT