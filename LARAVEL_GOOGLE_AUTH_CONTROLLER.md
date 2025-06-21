# Updated Laravel GoogleAuthController

Here's an updated version of your GoogleAuthController that works better with the Vue.js frontend:

```php

```

## Routes

Make sure your routes are configured in `routes/api.php`:

```php

```

## User Model Updates

Make sure your User model has the `google_id` field:

```php
// In your User model
protected $fillable = [
    'name',
    'email',
    'password',
    'google_id',
    // other fields...
];
```

## Database Migration

If you haven't already, create a migration to add the `google_id` field:

```php
php artisan make:migration add_google_id_to_users_table

// In the migration file:
public function up()
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('google_id')->nullable()->unique();
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('google_id');
    });
}
```

## Environment Variables

In your Laravel `.env` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

## CORS Configuration

Make sure your Laravel backend allows requests from your Vue.js frontend:

```php
// In config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:8080'], // Your Vue.js dev server
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
``` 