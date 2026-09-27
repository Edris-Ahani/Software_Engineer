# Zero-Downtime Database Migrations

## The Problem
You have a table `users` with columns `first_name` and `last_name`. You want to combine them into a single column `full_name` and drop the old ones. 
If you just run `ALTER TABLE users DROP COLUMN first_name`, your live application (which is still using `first_name` in its SQL queries) will instantly crash! You cannot update the App and the Database at the exact same millisecond. 

## The Solution: Expand and Contract Pattern
To migrate a database safely without downtime, you must follow a multi-step process over several deployments, giving both the old app version (V1) and new app version (V2) time to coexist.

### Step 1: Expand (Database Phase)
- **Action**: Add the new column `full_name` to the database. Allow it to be `NULL`.
- **App state**: The app is still V1. It doesn't know about `full_name` yet, so it ignores it. No crashes.

### Step 2: Dual Write (App Phase)
- **Action**: Deploy V2 of your app. This new version reads from `first_name`/`last_name`, but when a user updates their profile, it writes to **both** the old columns AND the new `full_name` column.
- **Result**: New data is safely being populated in both places.

### Step 3: Backfill (Data Phase)
- **Action**: Write a background script to iterate through the millions of old rows and calculate `full_name` = `first_name + last_name` where `full_name` is NULL.

### Step 4: Switch Reads (App Phase)
- **Action**: Deploy V3 of your app. This version completely stops reading from `first_name`/`last_name` and only relies on `full_name` for both reading and writing.

### Step 5: Contract (Database Phase)
- **Action**: Weeks later, once you are 100% sure V3 is stable and no rollbacks are needed, you run `ALTER TABLE users DROP COLUMN first_name, DROP COLUMN last_name;`. The migration is safely completed!
