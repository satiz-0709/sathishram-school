# Supabase account setup

1. Create a Supabase project and open its SQL Editor.
2. Run [`schema.sql`](./schema.sql).
3. In **Authentication → URL Configuration**, set the production site URL and add the site's `/account.html` URL to the allowed redirect URLs.
4. Copy the project URL and public anon/publishable key into `assets/supabase-config.js`. Never put a service-role key in frontend code.
5. In **Authentication → Providers**, enable email/password sign-in and configure email confirmation. Set up production SMTP so account confirmation and password-reset emails can be delivered.
6. In **Authentication → Notifications**, enable the password-changed notification if users should receive an email after changing their password. Keep email-change confirmation enabled so Supabase sends confirmation messages to the affected addresses.
7. Test account creation, email confirmation, sign-in (including blank and incorrect credentials), password recovery, profile edits, email-change confirmation, password-change notifications, global sign-out, and TOTP enrollment with a test account.

The account screen is intentionally disabled until the project URL and public key are configured.

The sign-in username is the registered email address. “Forgot username?” explains this; “Forgot password?” sends Supabase's password-reset email. Personal profile details are stored in the protected `profiles` table and account email/password are managed by Supabase Auth. Never write raw passwords to a project file or send them by email; Supabase stores password hashes. Email confirmations and password-change notifications require the project email/notification settings above.

The client-side course gate permits signed-out visitors to read the first four lessons in every course. Selecting lesson five or later, or opening course study resources, sends them to the account screen. Signing in returns them to the requested lesson. This is a navigation/UX gate only, not secure content protection.

When lesson data is migrated into `lesson_content`, set `is_sample` to `true` only for the first four lessons of each course. The anonymous RLS policy permits those marked rows; authenticated users can read all course rows.

## Important content-protection status

Signed-in users can read all rows. Existing lesson pages and data scripts are still shipped as public GitHub Pages assets, and the current lesson renderers still read those local files. Therefore, the schema and sign-in screen do **not** yet make existing full-course content private. Do not treat the current deployment as an access-control boundary. A separate content migration and renderer change must move member-only lesson data out of the public `tutorial/` and `assets/` files and load it from the RLS-protected table before protected access can be enabled.
