# Database Commands Quick Reference

## Prerequisites

First, install MikroORM CLI globally (required for database commands):

```bash
npm install -g @mikro-orm/cli@5.9.8
```

**OR** use npx (if global install doesn't work):

```bash
# Replace any "pnpm migration:*" with "npx mikro-orm migration:*"
# Replace any "pnpm schema:*" with "npx mikro-orm schema:*"
# Replace any "pnpm seeder:*" with "npx mikro-orm seeder:*"
```

## Workspace Level Commands (from project root)

```bash
# Quick database setup
pnpm db:fresh              # Drop, create schema, and seed database

# Migration commands  
pnpm db:migrate            # Run pending migrations
pnpm db:create-migration   # Create new migration
pnpm db:check              # Check migration status

# Seeding
pnpm db:seed               # Run all seeders
```

## Backend Level Commands (from backend/ directory)

### Migrations
```bash
pnpm migration:create      # Create new migration
pnpm migration:up          # Run pending migrations
pnpm migration:down        # Rollback last migration
pnpm migration:list        # List all migrations
pnpm migration:check       # Check migration status
pnpm migration:pending     # List pending migrations
```

### Schema Management
```bash
pnpm schema:create         # Create database schema
pnpm schema:drop           # Drop database schema  
pnpm schema:update         # Update schema to match entities
```

### Seeding
```bash
pnpm seeder:run           # Run all seeders
pnpm seeder:create <name> # Create new seeder
```

### Combined Operations
```bash
pnpm db:fresh             # Drop + Create + Seed (complete reset)
```

## Development Workflow

### Initial Setup
```bash
# 1. Create PostgreSQL database
createdb smart_therapy_dev

# 2. Fresh setup (from project root)
pnpm db:fresh
```

### Daily Development
```bash
# Create migration after entity changes
pnpm db:create-migration

# Apply pending migrations
pnpm db:migrate

# Check what migrations are pending
pnpm db:check
```

### Testing/Reset
```bash
# Complete database reset
pnpm db:fresh
```

## Default Admin User

After running seeders, you can login with:
- **Email**: `admin@smarttherapy.id`
- **Password**: `Admin123!`

## Database Configuration

Environment variables in `backend/.env`:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=smart_therapy_dev
```

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check database exists: `createdb smart_therapy_dev`
3. Verify credentials in `.env` file
4. Test connection: `psql -h localhost -U postgres smart_therapy_dev`

### Migration Issues
- **"No migrations found"**: Run `pnpm migration:create` first
- **"Connection refused"**: Check PostgreSQL service is running
- **"Database doesn't exist"**: Create database first
- **"Migration already exists"**: Check migration files in `src/database/migrations/`

### Seeding Issues
- **"User already exists"**: Seeder checks for existing admin user
- **"Table doesn't exist"**: Run migrations first with `pnpm migration:up`