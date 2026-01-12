# Strapi Content Types

This directory contains Strapi content-type schemas for the mastering studio website.

## Content Types

### Testimonial
Client testimonials and reviews.

**API Endpoint:** `/api/testimonials`

**Fields:**
- `clientName` (string, required): Name of the client
- `role` (string, localized): Client's role or title
- `content` (text, required, localized): Testimonial content
- `rating` (integer, 1-5): Star rating
- `projectName` (string): Associated project name
- `featured` (boolean): Show on homepage
- `order` (integer): Display order

### FAQ
Frequently Asked Questions.

**API Endpoint:** `/api/faqs`

**Fields:**
- `question` (string, required, localized): The question
- `answer` (text, required, localized): The answer
- `category` (enum): general | technical | pricing | process
- `order` (integer): Display order

### Pricing Block
Pricing tiers and service packages.

**API Endpoint:** `/api/pricing-blocks`

**Fields:**
- `name` (string, required, localized): Package name
- `description` (text, localized): Package description
- `price` (decimal, required): Price amount
- `currency` (string): Currency code (default: EUR)
- `features` (json, localized): Array of features
- `highlighted` (boolean): Highlight this package
- `order` (integer): Display order

## Setup Instructions

1. Install Strapi (Community Edition):
   ```bash
   npx create-strapi-app@latest strapi-backend --quickstart
   ```

2. Copy content-type schemas to your Strapi project:
   ```bash
   cp -r strapi/content-types/* strapi-backend/src/api/
   ```

3. Install i18n plugin in Strapi admin panel

4. Configure locales: en, fr

5. Update environment variables with Strapi API URL

## i18n Configuration

All content types support internationalization (i18n):
- Default locale: French (fr)
- Available locales: French (fr), English (en)
- Localized fields are marked in schema with `"localized": true`
